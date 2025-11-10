#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create a simple test contract
const testContract = `
SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on November 10, 2025, between:

Company ABC ("Provider"), a corporation organized under the laws of Saudi Arabia, and
Client XYZ ("Client"), a limited liability company organized under the laws of Saudi Arabia.

SERVICES:
The Provider agrees to provide software development services as detailed in Schedule A.

PAYMENT TERMS:
Client shall pay Provider a total of SAR 100,000 (One Hundred Thousand Saudi Riyals) 
within 30 days of invoice receipt.

TERM:
This Agreement shall commence on November 10, 2025 and continue for a period of 6 months.

LIABILITY:
Provider's liability shall be limited to the total amount paid under this Agreement.
Provider shall not be liable for indirect, consequential, or punitive damages.

TERMINATION:
Either party may terminate this Agreement with 30 days written notice.

GOVERNING LAW:
This Agreement shall be governed by the laws of the Kingdom of Saudi Arabia.

SIGNATURES:
[Provider Signature]
[Client Signature]
`;

// Save test contract to a temporary file
const testFile = path.join(__dirname, 'test_contract.txt');
fs.writeFileSync(testFile, testContract);

console.log('Test contract created: test_contract.txt');
console.log('');
console.log('To test the complete flow:');
console.log('1. Login to the application');
console.log('2. Go to Dashboard');
console.log('3. Click "Upload Contract"');
console.log('4. Upload the test_contract.txt file');
console.log('5. Check the browser console for [DASHBOARD] logs');
console.log('6. Check server console for [UPLOAD RESPONSE] and [GET ANALYSIS] logs');
console.log('7. Verify that all 4 analysis categories are displayed with actual findings');
console.log('');
console.log('Expected to see in the chat:');
console.log('- Legal Analysis with specific risks and recommendations');
console.log('- Business Analysis with payment term risks');
console.log('- Technical Analysis findings');
console.log('- Shariah Analysis compliance notes');