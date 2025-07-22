import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as mammoth from 'mammoth';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure PDF.js worker for Node.js - use fake worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';

interface ExtractedData {
  rawText: string;
  parties: Array<{ name: string; role: string; company?: string }>;
  contractType: string;
  effectiveDate: string | null;
  termDuration: string | null;
  riskPhrases: string[];
  riskLevel: 'low' | 'medium' | 'high';
  paymentDetails: {
    amount?: string;
    currency?: string;
    terms?: string;
    schedule?: string;
  };
}

export class ContractExtractorJS {
  /**
   * Extract text from PDF using pdf.js
   */
  private async extractPDFText(filePath: string): Promise<string> {
    try {
      const buffer = await fs.readFile(filePath);
      const data = new Uint8Array(buffer);
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      let fullText = '';

      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Extract text from DOCX using mammoth
   */
  private async extractDOCXText(filePath: string): Promise<string> {
    try {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      
      if (result.messages.length > 0) {
        console.warn('Mammoth warnings:', result.messages);
      }
      
      return result.value.trim();
    } catch (error) {
      console.error('Error extracting DOCX text:', error);
      throw new Error(`Failed to extract DOCX text: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Extract parties from contract text using RegEx and keyword matching
   */
  private extractParties(text: string): Array<{ name: string; role: string; company?: string }> {
    const parties: Array<{ name: string; role: string; company?: string }> = [];
    
    // Common party patterns
    const partyPatterns = [
      // "between X and Y" pattern
      /between\s+([A-Z][^,\n]+?)(?:\s*\(.*?\))?\s+(?:and|&)\s+([A-Z][^,\n]+?)(?:\s*\(.*?\))?/gi,
      // "Party A/B" pattern
      /(?:First Party|Party A|Buyer|Purchaser|Client|Customer):\s*([A-Z][^,\n]+)/gi,
      /(?:Second Party|Party B|Seller|Vendor|Supplier|Service Provider):\s*([A-Z][^,\n]+)/gi,
      // "WHEREAS X" pattern
      /WHEREAS,?\s+([A-Z][^,\n]+?)(?:\s*\(.*?\))?\s+(?:is|wishes|desires|requires)/gi,
      // Company identification patterns
      /([A-Z][^,\n]+?)\s+(?:LLC|Inc\.|Corporation|Corp\.|Limited|Ltd\.|Company|Co\.)/gi
    ];

    // Extract parties using patterns
    partyPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1]) {
          const party1 = match[1].trim();
          if (party1.length > 3 && party1.length < 100) {
            parties.push({
              name: party1,
              role: pattern.source.includes('First|Buyer|Client') ? 'First Party' : 'Party',
              company: this.extractCompanyType(party1)
            });
          }
        }
        if (match[2]) {
          const party2 = match[2].trim();
          if (party2.length > 3 && party2.length < 100) {
            parties.push({
              name: party2,
              role: pattern.source.includes('Second|Seller|Vendor') ? 'Second Party' : 'Party',
              company: this.extractCompanyType(party2)
            });
          }
        }
      }
    });

    // Remove duplicates
    const uniqueParties = parties.reduce((acc, party) => {
      const exists = acc.find(p => p.name.toLowerCase() === party.name.toLowerCase());
      if (!exists) acc.push(party);
      return acc;
    }, [] as typeof parties);

    return uniqueParties.slice(0, 5); // Return top 5 parties
  }

  /**
   * Extract company type from party name
   */
  private extractCompanyType(name: string): string | undefined {
    const companyTypes = ['LLC', 'Inc.', 'Corporation', 'Corp.', 'Limited', 'Ltd.', 'Company', 'Co.'];
    for (const type of companyTypes) {
      if (name.includes(type)) return type;
    }
    return undefined;
  }

  /**
   * Detect contract type from text
   */
  private detectContractType(text: string): string {
    const typeKeywords = {
      'service': ['service agreement', 'services agreement', 'service contract', 'consulting agreement'],
      'nda': ['non-disclosure agreement', 'nda', 'confidentiality agreement', 'confidential'],
      'employment': ['employment agreement', 'employment contract', 'job offer', 'employment terms'],
      'sales': ['sales agreement', 'purchase agreement', 'sale contract', 'buy and sell'],
      'other': ['lease agreement', 'rental agreement', 'tenancy agreement', 'rent',
                'partnership agreement', 'joint venture', 'collaboration agreement',
                'license agreement', 'licensing agreement', 'software license',
                'loan agreement', 'credit agreement', 'lending agreement',
                'construction contract', 'building contract', 'construction agreement']
    };

    const lowerText = text.toLowerCase();
    
    for (const [type, keywords] of Object.entries(typeKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return type;
        }
      }
    }

    return 'other';
  }

  /**
   * Extract dates from contract text
   */
  private extractDates(text: string): { effectiveDate: string | null; termDuration: string | null } {
    let effectiveDate: string | null = null;
    let termDuration: string | null = null;

    // Date patterns
    const datePatterns = [
      /(?:effective date|dated|as of|commencing on)\s*:?\s*([A-Za-z]+ \d{1,2},? \d{4})/gi,
      /(?:effective date|dated|as of|commencing on)\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/gi,
      /(?:dated this)\s+(\d{1,2}(?:st|nd|rd|th)? day of [A-Za-z]+,? \d{4})/gi
    ];

    // Extract effective date
    for (const pattern of datePatterns) {
      const match = pattern.exec(text);
      if (match && match[1]) {
        effectiveDate = match[1].trim();
        break;
      }
    }

    // Term duration patterns
    const termPatterns = [
      /(?:term|duration|period)\s*(?:of|is)?\s*:?\s*(\d+)\s*(years?|months?|days?)/gi,
      /(?:for a period of)\s*(\d+)\s*(years?|months?|days?)/gi,
      /(?:shall remain in effect for)\s*(\d+)\s*(years?|months?|days?)/gi
    ];

    // Extract term duration
    for (const pattern of termPatterns) {
      const match = pattern.exec(text);
      if (match && match[1] && match[2]) {
        termDuration = `${match[1]} ${match[2]}`;
        break;
      }
    }

    return { effectiveDate, termDuration };
  }

  /**
   * Extract risk phrases and calculate risk level
   */
  private extractRiskInfo(text: string): { riskPhrases: string[]; riskLevel: 'low' | 'medium' | 'high' } {
    const riskPhrases: string[] = [];
    
    // High risk keywords
    const highRiskKeywords = [
      'unlimited liability', 'personal guarantee', 'indemnification', 'liquidated damages',
      'penalty', 'termination for convenience', 'non-compete', 'exclusive', 'perpetual',
      'irrevocable', 'waiver of rights', 'binding arbitration', 'class action waiver'
    ];

    // Medium risk keywords
    const mediumRiskKeywords = [
      'limitation of liability', 'confidentiality', 'intellectual property',
      'warranty', 'default', 'breach', 'dispute resolution', 'governing law',
      'force majeure', 'assignment', 'severability'
    ];

    const lowerText = text.toLowerCase();
    
    // Check for high risk phrases
    highRiskKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const index = lowerText.indexOf(keyword);
        const context = text.substring(Math.max(0, index - 50), Math.min(text.length, index + keyword.length + 50));
        riskPhrases.push(`High Risk: "${context.trim()}"`);
      }
    });

    // Check for medium risk phrases
    mediumRiskKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const index = lowerText.indexOf(keyword);
        const context = text.substring(Math.max(0, index - 50), Math.min(text.length, index + keyword.length + 50));
        riskPhrases.push(`Medium Risk: "${context.trim()}"`);
      }
    });

    // Calculate risk level
    const highRiskCount = riskPhrases.filter(p => p.startsWith('High Risk')).length;
    const mediumRiskCount = riskPhrases.filter(p => p.startsWith('Medium Risk')).length;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (highRiskCount >= 3 || (highRiskCount >= 1 && mediumRiskCount >= 3)) {
      riskLevel = 'high';
    } else if (highRiskCount >= 1 || mediumRiskCount >= 2) {
      riskLevel = 'medium';
    }

    return { riskPhrases: riskPhrases.slice(0, 10), riskLevel }; // Return top 10 risk phrases
  }

  /**
   * Extract payment details from contract text
   */
  private extractPaymentDetails(text: string): ExtractedData['paymentDetails'] {
    const paymentDetails: ExtractedData['paymentDetails'] = {};

    // Amount patterns
    const amountPatterns = [
      /(?:amount|fee|price|cost|payment)\s*(?:of|is)?\s*:?\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/gi,
      /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|dollars?)?/gi,
      /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|dollars?|euros?|EUR|pounds?|GBP)/gi
    ];

    // Extract amount
    for (const pattern of amountPatterns) {
      const match = pattern.exec(text);
      if (match && match[1]) {
        paymentDetails.amount = match[1];
        // Check for currency
        const currencyMatch = text.substring(match.index, match.index + 50).match(/(USD|EUR|GBP|dollars?|euros?|pounds?)/i);
        if (currencyMatch) {
          paymentDetails.currency = currencyMatch[1].toUpperCase().replace(/S$/, '');
        }
        break;
      }
    }

    // Payment terms patterns
    const termsPatterns = [
      /(?:payment terms|payment|payable)\s*:?\s*([^.]+(?:net \d+|upon|within|days?|months?)[^.]*)/gi,
      /(?:net \d+|payment due|due within)\s*(\d+\s*days?)/gi
    ];

    // Extract payment terms
    for (const pattern of termsPatterns) {
      const match = pattern.exec(text);
      if (match && match[1]) {
        paymentDetails.terms = match[1].trim().substring(0, 100);
        break;
      }
    }

    // Payment schedule patterns
    const schedulePatterns = [
      /(?:payment schedule|installments?|monthly|quarterly|annually)\s*:?\s*([^.]+)/gi,
      /(?:paid|payable)\s*(?:in)?\s*(\d+)\s*(?:equal)?\s*(?:installments?|payments?)/gi
    ];

    // Extract payment schedule
    for (const pattern of schedulePatterns) {
      const match = pattern.exec(text);
      if (match && match[1]) {
        paymentDetails.schedule = match[1].trim().substring(0, 100);
        break;
      }
    }

    return paymentDetails;
  }

  /**
   * Main extraction method
   */
  async extractContract(filePath: string): Promise<ExtractedData> {
    const fileExt = path.extname(filePath).toLowerCase();
    let rawText = '';

    // Extract text based on file type
    if (fileExt === '.pdf') {
      rawText = await this.extractPDFText(filePath);
    } else if (fileExt === '.docx') {
      rawText = await this.extractDOCXText(filePath);
    } else {
      throw new Error(`Unsupported file type: ${fileExt}. Only PDF and DOCX files are supported.`);
    }

    // Extract structured data from text
    const parties = this.extractParties(rawText);
    const contractType = this.detectContractType(rawText);
    const { effectiveDate, termDuration } = this.extractDates(rawText);
    const { riskPhrases, riskLevel } = this.extractRiskInfo(rawText);
    const paymentDetails = this.extractPaymentDetails(rawText);

    console.log('EXTRACTION ENGINE READY');
    
    return {
      rawText,
      parties,
      contractType,
      effectiveDate,
      termDuration,
      riskPhrases,
      riskLevel,
      paymentDetails
    };
  }
}

// Export singleton instance
export const contractExtractorJS = new ContractExtractorJS();