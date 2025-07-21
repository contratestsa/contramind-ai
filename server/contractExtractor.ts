import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './storage';
import { InsertContractDetails } from '@shared/schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface ExtractedData {
  contractType: string | null;
  executedStatus: boolean;
  language: string | null;
  internalParties: string[];
  counterparties: string[];
  governingLaw: string | null;
  paymentTerm: string | null;
  breachNotice: string | null;
  terminationNotice: string | null;
  extractedText: string;
}

export class ContractExtractor {
  // Extract text from PDF using existing Python script
  private async extractPdfText(pdfPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const pythonScript = path.join(__dirname, 'python', 'extract_text.py');
      const py = spawn('python3', [pythonScript, pdfPath]);
      
      let output = '';
      let error = '';
      
      py.stdout.on('data', (chunk) => {
        output += chunk.toString();
      });
      
      py.stderr.on('data', (chunk) => {
        error += chunk.toString();
      });
      
      py.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${error}`));
        } else {
          resolve(output);
        }
      });
    });
  }

  // Extract text from DOCX files using Python
  private async extractDocxText(docxPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const py = spawn('python3', ['-c', `
from docx import Document
doc = Document('${docxPath}')
text = []
for paragraph in doc.paragraphs:
    if paragraph.text.strip():
        text.append(paragraph.text)
print('\\n'.join(text))
`]);
      
      let output = '';
      let error = '';
      
      py.stdout.on('data', (chunk) => {
        output += chunk.toString();
      });
      
      py.stderr.on('data', (chunk) => {
        error += chunk.toString();
      });
      
      py.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`DOCX extraction failed: ${error}`));
        } else {
          resolve(output);
        }
      });
    });
  }

  // Extract information from contract text using patterns and keywords
  private extractInformation(text: string): ExtractedData {
    const textLower = text.toLowerCase();
    
    // Extract contract type
    const contractType = this.extractContractType(textLower);
    
    // Detect if contract is executed (signed)
    const executedStatus = this.detectExecutedStatus(textLower);
    
    // Detect language
    const language = this.detectLanguage(text);
    
    // Extract parties
    const { internalParties, counterparties } = this.extractParties(text);
    
    // Extract governing law
    const governingLaw = this.extractGoverningLaw(text);
    
    // Extract payment terms
    const paymentTerm = this.extractPaymentTerms(text);
    
    // Extract breach notice
    const breachNotice = this.extractBreachNotice(text);
    
    // Extract termination notice
    const terminationNotice = this.extractTerminationNotice(text);
    
    return {
      contractType,
      executedStatus,
      language,
      internalParties,
      counterparties,
      governingLaw,
      paymentTerm,
      breachNotice,
      terminationNotice,
      extractedText: text
    };
  }

  private extractContractType(text: string): string {
    const typePatterns = {
      'service': /service\s*agreement|services\s*contract|professional\s*services/i,
      'nda': /non[\s-]?disclosure|confidentiality\s*agreement|nda/i,
      'employment': /employment\s*agreement|employment\s*contract|employee\s*agreement/i,
      'sales': /sales\s*agreement|purchase\s*agreement|sale\s*contract/i,
      'other': /.*/
    };
    
    for (const [type, pattern] of Object.entries(typePatterns)) {
      if (pattern.test(text)) {
        return type;
      }
    }
    
    return 'other';
  }

  private detectExecutedStatus(text: string): boolean {
    const executedPatterns = [
      /executed\s*on|executed\s*this|executed\s*as\s*of/i,
      /signed\s*on|signed\s*this|signed\s*by/i,
      /witness\s*whereof.*executed/i,
      /\[signed\]/i,
      /signature.*date/i
    ];
    
    return executedPatterns.some(pattern => pattern.test(text));
  }

  private detectLanguage(text: string): string {
    // Simple language detection based on character sets and common words
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    if (arabicPattern.test(text)) {
      return 'Arabic';
    }
    return 'English';
  }

  private extractParties(text: string): { internalParties: string[]; counterparties: string[] } {
    const partyPatterns = [
      /between\s+([^,]+),?\s*(?:\([^)]+\))?\s*and\s+([^,]+),?\s*(?:\([^)]+\))?/gi,
      /party\s*of\s*the\s*first\s*part[:\s]+([^,\n]+)/gi,
      /party\s*of\s*the\s*second\s*part[:\s]+([^,\n]+)/gi,
      /"([^"]+)"\s*(?:a|an)\s*[^,]+\s*company/gi
    ];
    
    const internalParties: string[] = [];
    const counterparties: string[] = [];
    
    for (const pattern of partyPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) internalParties.push(match[1].trim());
        if (match[2]) counterparties.push(match[2].trim());
      }
    }
    
    // Remove duplicates
    return {
      internalParties: [...new Set(internalParties)],
      counterparties: [...new Set(counterparties)]
    };
  }

  private extractGoverningLaw(text: string): string | null {
    const lawPatterns = [
      /governed\s*by.*laws?\s*of\s*(?:the\s*)?([^,\.\n]+)/i,
      /under\s*the\s*laws?\s*of\s*(?:the\s*)?([^,\.\n]+)/i,
      /jurisdiction.*?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
      /applicable\s*law.*?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
    ];
    
    for (const pattern of lawPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  }

  private extractPaymentTerms(text: string): string | null {
    const paymentPatterns = [
      /payment\s*terms?[:\s]+([^.\n]+)/i,
      /payment.*due\s*(?:within\s*)?(\d+\s*days?)/i,
      /net\s*(\d+)/i,
      /payment.*(?:shall|will|must)\s*be\s*(?:made|paid)\s*([^.\n]+)/i
    ];
    
    for (const pattern of paymentPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  }

  private extractBreachNotice(text: string): string | null {
    const breachPatterns = [
      /breach.*notice\s*(?:of\s*)?(\d+\s*days?)/i,
      /material\s*breach.*(\d+\s*days?)\s*notice/i,
      /cure\s*period.*(\d+\s*days?)/i,
      /breach.*cure.*(\d+\s*days?)/i
    ];
    
    for (const pattern of breachPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  }

  private extractTerminationNotice(text: string): string | null {
    const terminationPatterns = [
      /termination.*notice\s*(?:of\s*)?(\d+\s*days?)/i,
      /terminate.*(?:with|upon)\s*(\d+\s*days?)\s*notice/i,
      /termination.*convenience.*(\d+\s*days?)/i,
      /either\s*party\s*may\s*terminate.*(\d+\s*days?)/i
    ];
    
    for (const pattern of terminationPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  }

  // Main method to process a contract file
  async processContract(contractId: number, filePath: string): Promise<void> {
    try {
      // Detect file type and extract text
      let text = '';
      
      // Check if file has extension
      let fileExtension = path.extname(filePath).toLowerCase();
      
      if (!fileExtension) {
        // Detect file type by checking file signature
        const buffer = await fs.promises.readFile(filePath, { length: 4 });
        const header = buffer.toString('hex', 0, 4);
        
        if (header === '504b0304') {
          // PK.. signature for ZIP/DOCX files
          text = await this.extractDocxText(filePath);
        } else if (header === '25504446') {
          // %PDF signature
          text = await this.extractPdfText(filePath);
        } else {
          // Try both methods as fallback
          try {
            text = await this.extractDocxText(filePath);
          } catch {
            text = await this.extractPdfText(filePath);
          }
        }
      } else if (fileExtension === '.pdf') {
        text = await this.extractPdfText(filePath);
      } else if (fileExtension === '.docx') {
        text = await this.extractDocxText(filePath);
      } else {
        throw new Error(`Unsupported file type: ${fileExtension}`);
      }
      
      // Extract information
      const extractedData = this.extractInformation(text);
      
      // Prepare contract details for database
      const contractDetails: InsertContractDetails = {
        contractId,
        executedStatus: extractedData.executedStatus,
        language: extractedData.language,
        internalParties: extractedData.internalParties,
        counterparties: extractedData.counterparties,
        governingLaw: extractedData.governingLaw,
        paymentTerm: extractedData.paymentTerm,
        breachNotice: extractedData.breachNotice,
        terminationNotice: extractedData.terminationNotice,
        extractedText: extractedData.extractedText,
        extractionMetadata: JSON.stringify({
          extractedAt: new Date().toISOString(),
          contractType: extractedData.contractType
        })
      };
      
      // Check if details already exist
      const existingDetails = await storage.getContractDetails(contractId);
      
      if (existingDetails) {
        // Update existing details
        await storage.updateContractDetails(contractId, contractDetails);
      } else {
        // Create new details
        await storage.createContractDetails(contractDetails);
      }
      
      // Update contract type in main contracts table if extracted
      if (extractedData.contractType && extractedData.contractType !== 'other') {
        await storage.updateContract(contractId, { 
          type: extractedData.contractType as any 
        });
      }
      
    } catch (error) {
      console.error('Error processing contract:', error);
      throw error;
    }
  }
}

export const contractExtractor = new ContractExtractor();