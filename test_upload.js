const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Simple test to verify contract upload works with a sample PDF
async function testContractUpload() {
  console.log('Testing contract upload functionality...');
  
  // Create a simple test PDF content (minimal valid PDF)
  const minimalPDF = Buffer.from([
    0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, // %PDF-1.4
    0x0A, 0x31, 0x20, 0x30, 0x20, 0x6F, 0x62, 0x6A, // \n1 0 obj
    0x0A, 0x3C, 0x3C, 0x2F, 0x54, 0x79, 0x70, 0x65, // \n<</Type
    0x2F, 0x43, 0x61, 0x74, 0x61, 0x6C, 0x6F, 0x67, // /Catalog
    0x3E, 0x3E, 0x0A, 0x65, 0x6E, 0x64, 0x6F, 0x62, // >>\nendob
    0x6A, 0x0A, 0x78, 0x72, 0x65, 0x66, 0x0A, 0x30, // j\nxref\n0
    0x20, 0x32, 0x0A, 0x30, 0x30, 0x30, 0x30, 0x30, //  2\n00000
    0x30, 0x30, 0x30, 0x30, 0x30, 0x20, 0x36, 0x35, // 00000 65
    0x35, 0x33, 0x35, 0x20, 0x66, 0x0A, 0x30, 0x30, // 535 f\n00
    0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x31, 0x30, // 00000010
    0x20, 0x30, 0x30, 0x30, 0x30, 0x30, 0x20, 0x6E, //  00000 n
    0x0A, 0x74, 0x72, 0x61, 0x69, 0x6C, 0x65, 0x72, // \ntrailer
    0x0A, 0x3C, 0x3C, 0x2F, 0x53, 0x69, 0x7A, 0x65, // \n<</Size
    0x20, 0x32, 0x2F, 0x52, 0x6F, 0x6F, 0x74, 0x20, //  2/Root 
    0x31, 0x20, 0x30, 0x20, 0x52, 0x3E, 0x3E, 0x0A, // 1 0 R>>\n
    0x73, 0x74, 0x61, 0x72, 0x74, 0x78, 0x72, 0x65, // startxre
    0x66, 0x0A, 0x31, 0x31, 0x36, 0x0A, 0x25, 0x25, // f\n116\n%%
    0x45, 0x4F, 0x46                                // EOF
  ]);
  
  // Save test PDF
  const testPdfPath = path.join(__dirname, 'test_contract.pdf');
  fs.writeFileSync(testPdfPath, minimalPDF);
  console.log('Created test PDF file:', testPdfPath);
  
  // First, we need to login to get auth token
  console.log('Step 1: Logging in to get auth token...');
  
  try {
    // Try to login with a test user (adjust these credentials as needed)
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    let accessToken;
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      accessToken = loginData.accessToken;
      console.log('Login successful, got access token');
    } else {
      console.log('Test user does not exist, creating one...');
      
      // Create test user
      const signupResponse = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123',
          fullName: 'Test User',
          username: 'testuser' + Date.now()
        })
      });
      
      if (signupResponse.ok) {
        const signupData = await signupResponse.json();
        accessToken = signupData.accessToken;
        console.log('Test user created and logged in');
      } else {
        const error = await signupResponse.text();
        console.error('Failed to create test user:', error);
        return;
      }
    }
    
    // Step 2: Test file upload
    console.log('\nStep 2: Testing contract upload with PDF file...');
    
    const form = new FormData();
    form.append('file', fs.createReadStream(testPdfPath), {
      filename: 'test_contract.pdf',
      contentType: 'application/pdf'
    });
    form.append('title', 'Test Contract');
    form.append('partyName', 'Test Party');
    form.append('type', 'service');
    form.append('status', 'draft');
    
    const uploadResponse = await fetch('http://localhost:5000/api/contracts/upload', {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${accessToken}`
      },
      body: form
    });
    
    const uploadResult = await uploadResponse.json();
    
    if (uploadResponse.ok) {
      console.log('\n✅ SUCCESS! Contract uploaded successfully');
      console.log('Contract ID:', uploadResult.contract?.id);
      console.log('Message:', uploadResult.message);
      
      if (uploadResult.analysisResult) {
        console.log('\n📊 AI Analysis Results:');
        console.log('  Risk Level:', uploadResult.analysisResult.riskLevel);
        console.log('  Risk Summary:', uploadResult.analysisResult.riskSummary);
        console.log('  Contract Type:', uploadResult.analysisResult.contractType);
        console.log('  Key Findings:');
        if (uploadResult.analysisResult.keyFindings) {
          console.log('    High Risks:', uploadResult.analysisResult.keyFindings.highRisks?.length || 0);
          console.log('    Medium Risks:', uploadResult.analysisResult.keyFindings.mediumRisks?.length || 0);
          console.log('    Low Risks:', uploadResult.analysisResult.keyFindings.lowRisks?.length || 0);
        }
      } else {
        console.log('\n⚠️ WARNING: No AI analysis results returned (analysis may have failed)');
      }
      
      console.log('\n✅ All bugs appear to be fixed!');
    } else {
      console.error('\n❌ FAILED! Upload failed with status:', uploadResponse.status);
      console.error('Error:', uploadResult);
      
      if (uploadResult.message && uploadResult.message.includes('Unsupported file type')) {
        console.error('\n🐛 BUG 1 STILL EXISTS: File extension detection is still failing');
      }
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    if (error.message.includes('analysisResult is not defined')) {
      console.error('\n🐛 BUG 2 STILL EXISTS: analysisResult reference error');
    }
  } finally {
    // Clean up test file
    if (fs.existsSync(testPdfPath)) {
      fs.unlinkSync(testPdfPath);
      console.log('\nCleaned up test file');
    }
  }
}

// Check if required modules are installed
try {
  require.resolve('form-data');
  require.resolve('node-fetch');
  testContractUpload();
} catch (e) {
  console.log('Installing required packages for testing...');
  require('child_process').execSync('npm install form-data@4 node-fetch@2', { stdio: 'inherit' });
  console.log('Packages installed, please run the test again: node test_upload.js');
}