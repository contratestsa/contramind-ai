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
    const internalParties: string[] = [];
    const counterparties: string[] = [];
    
    // Pattern 1: "between X and Y" format
    const betweenPattern = /between\s+([^,\(]+?)(?:\s*\([^)]+\))?\s*(?:,.*?)?\s+and\s+([^,\(]+?)(?:\s*\([^)]+\))?(?:\s*,|\s*\(|$)/gi;
    let matches = text.matchAll(betweenPattern);
    for (const match of matches) {
      if (match[1]) {
        const party1 = match[1].trim().replace(/\s+/g, ' ');
        if (party1.length > 2 && party1.length < 100) {
          internalParties.push(party1);
        }
      }
      if (match[2]) {
        const party2 = match[2].trim().replace(/\s+/g, ' ');
        if (party2.length > 2 && party2.length < 100) {
          counterparties.push(party2);
        }
      }
    }
    
    // Pattern 2: "Party" definitions
    const partyDefPattern = /(?:the\s+)?"([^"]+)"\s*(?:\([^)]+\))?\s*(?:,\s*)?(?:a|an|the)\s+(?:[^,]+\s+)?(?:company|corporation|llc|inc|ltd|limited|partnership|party)/gi;
    matches = text.matchAll(partyDefPattern);
    for (const match of matches) {
      if (match[1]) {
        const party = match[1].trim();
        if (party.length > 2 && party.length < 100) {
          // First occurrence goes to internal, subsequent to counter
          if (internalParties.length === 0) {
            internalParties.push(party);
          } else {
            counterparties.push(party);
          }
        }
      }
    }
    
    // Pattern 3: Common contract party indicators
    const partyIndicators = [
      /(?:Client|Customer|Buyer):\s*([^\n,]+)/gi,
      /(?:Vendor|Supplier|Seller|Service Provider):\s*([^\n,]+)/gi,
      /(?:First Party|Party A|Disclosing Party):\s*([^\n,]+)/gi,
      /(?:Second Party|Party B|Receiving Party):\s*([^\n,]+)/gi
    ];
    
    partyIndicators.forEach((pattern, index) => {
      const indicatorMatches = text.matchAll(pattern);
      for (const match of indicatorMatches) {
        if (match[1]) {
          const party = match[1].trim();
          if (party.length > 2 && party.length < 100) {
            // Even indices (0,2) are internal, odd (1,3) are counter
            if (index % 2 === 0) {
              internalParties.push(party);
            } else {
              counterparties.push(party);
            }
          }
        }
      }
    });
    
    // Pattern 4: Agreement header format
    const headerPattern = /(?:agreement|contract)\s+(?:between|by and between)\s+([^,\n]+?)(?:\s*\([^)]+\))?\s+(?:and|&)\s+([^,\n]+?)(?:\s*\([^)]+\))?/gi;
    matches = text.matchAll(headerPattern);
    for (const match of matches) {
      if (match[1]) {
        const party1 = match[1].trim();
        if (party1.length > 2 && party1.length < 100) {
          internalParties.push(party1);
        }
      }
      if (match[2]) {
        const party2 = match[2].trim();
        if (party2.length > 2 && party2.length < 100) {
          counterparties.push(party2);
        }
      }
    }
    
    // Clean up extracted parties
    const cleanParty = (party: string): string => {
      return party
        .replace(/^\s*(?:and|the|by)\s+/i, '')
        .replace(/\s*(?:hereinafter|hereafter|referred to as|called).*$/i, '')
        .replace(/\s+/g, ' ')
        .trim();
    };
    
    // Remove duplicates and clean
    const cleanedInternal = [...new Set(internalParties.map(cleanParty))].filter(p => p.length > 2);
    const cleanedCounter = [...new Set(counterparties.map(cleanParty))].filter(p => p.length > 2);
    
    // If no parties found, return empty arrays (not fallback data)
    return {
      internalParties: cleanedInternal,
      counterparties: cleanedCounter
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
    console.log(`[${new Date().toISOString()}] Extracting payment terms...`);
    
    // Split text into sentences for better context extraction
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const paymentContexts: string[] = [];
    
    // Enhanced patterns with context extraction
    const paymentPatterns = [
      // Standard payment terms patterns
      /payment\s*(?:terms?|shall be made|is due|must be made)[:\s]+([^.\n]{10,150})/gi,
      /(?:invoice|payment).*?(?:due|payable)\s*(?:within|in|on)?\s*(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,50}/gi,
      /net\s*(\d+)(?:\s*days?)?\s*(?:from|after|of)?[^.\n]{0,50}/gi,
      /payment.*?(?:shall|will|must)\s*be\s*(?:made|paid|remitted)\s*([^.\n]{10,150})/gi,
      // Monthly/periodic payment patterns
      /(?:monthly|quarterly|annual|yearly)\s*(?:payment|fee|amount)\s*(?:of|is)?\s*(?:\$|USD|EUR|GBP)?\s*[\d,]+(?:\.\d{2})?[^.\n]{0,50}/gi,
      // Milestone payment patterns
      /(?:milestone|deliverable|phase)\s*payment[^.\n]{10,150}/gi,
      // Due date patterns
      /(?:payment|invoice|amount)\s*(?:is\s*)?due\s*(?:on|by)\s*(?:the\s*)?\d{1,2}(?:st|nd|rd|th)?\s*(?:day\s*)?(?:of\s*(?:each|every)\s*month)?[^.\n]{0,50}/gi,
      // Percentage patterns
      /\d{1,3}%\s*(?:of|upon)\s*(?:contract|total|amount)[^.\n]{10,100}/gi
    ];
    
    // Extract payment-related sentences
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (lowerSentence.includes('payment') || 
          lowerSentence.includes('invoice') || 
          lowerSentence.includes('fee') ||
          lowerSentence.includes('net ') ||
          lowerSentence.includes('due') ||
          lowerSentence.includes('milestone') ||
          lowerSentence.includes('remittance')) {
        
        // Apply patterns to this sentence
        for (const pattern of paymentPatterns) {
          const matches = sentence.matchAll(pattern);
          for (const match of matches) {
            if (match[0]) {
              paymentContexts.push(match[0].trim());
            }
          }
        }
      }
    }
    
    // Look for specific payment schedule tables or lists
    const schedulePattern = /payment\s*schedule[:\s]*([^]{50,500}?)(?=\n\n|\.\s*[A-Z]|$)/gi;
    const scheduleMatches = text.matchAll(schedulePattern);
    for (const match of scheduleMatches) {
      if (match[1]) {
        paymentContexts.push(`Payment Schedule: ${match[1].trim()}`);
      }
    }
    
    // Deduplicate and combine contexts
    const uniqueContexts = [...new Set(paymentContexts)];
    
    if (uniqueContexts.length > 0) {
      // Normalize and combine the extracted payment terms
      const normalized = this.normalizePaymentTerms(uniqueContexts);
      console.log(`[${new Date().toISOString()}] Extracted payment terms: ${normalized}`);
      return normalized;
    }
    
    console.log(`[${new Date().toISOString()}] No payment terms found`);
    return null;
  }

  private extractBreachNotice(text: string): string | null {
    console.log(`[${new Date().toISOString()}] Extracting breach notice...`);
    
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const breachContexts: string[] = [];
    
    // Enhanced breach notice patterns
    const breachPatterns = [
      // Standard breach notice patterns
      /(?:event\s*of\s*)?(?:a\s*)?(?:material\s*)?breach[^.\n]{0,50}(?:written\s*)?notice\s*(?:of\s*)?(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,100}/gi,
      /(?:material\s*)?breach[^.\n]{0,100}(\d+\s*(?:days?|months?|weeks?))\s*(?:written\s*)?notice[^.\n]{0,50}/gi,
      // Cure period patterns
      /cure\s*(?:period|time)\s*(?:of\s*)?(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,100}/gi,
      /(\d+\s*(?:days?|months?|weeks?))\s*(?:to\s*)?cure\s*(?:such\s*)?(?:breach|default)[^.\n]{0,50}/gi,
      // Opportunity to cure patterns
      /opportunity\s*to\s*cure[^.\n]{0,50}(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,50}/gi,
      // Notice and cure patterns
      /notice\s*(?:and\s*)?(?:opportunity\s*to\s*)?cure[^.\n]{0,50}(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,50}/gi,
      // Default provisions
      /(?:event\s*of\s*)?default[^.\n]{0,100}notice\s*(?:of\s*)?(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,50}/gi,
      // Failure to perform patterns
      /failure\s*to\s*(?:perform|comply)[^.\n]{0,100}(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,50}/gi
    ];
    
    // Extract breach-related sentences
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (lowerSentence.includes('breach') || 
          lowerSentence.includes('cure') || 
          lowerSentence.includes('default') ||
          lowerSentence.includes('failure to perform') ||
          lowerSentence.includes('failure to comply') ||
          lowerSentence.includes('material violation')) {
        
        // Apply patterns to this sentence
        for (const pattern of breachPatterns) {
          const matches = sentence.matchAll(pattern);
          for (const match of matches) {
            if (match[0]) {
              breachContexts.push(match[0].trim());
            }
          }
        }
      }
    }
    
    // Look for specific breach provisions sections
    const breachSectionPattern = /(?:breach|default)\s*(?:and\s*)?(?:cure|remedy)[:\s]*([^]{50,500}?)(?=\n\n|\.\s*[A-Z]|$)/gi;
    const sectionMatches = text.matchAll(breachSectionPattern);
    for (const match of sectionMatches) {
      if (match[1]) {
        breachContexts.push(`Breach Provisions: ${match[1].trim()}`);
      }
    }
    
    // Deduplicate and combine contexts
    const uniqueContexts = [...new Set(breachContexts)];
    
    if (uniqueContexts.length > 0) {
      const normalized = this.normalizeBreachNotice(uniqueContexts);
      console.log(`[${new Date().toISOString()}] Extracted breach notice: ${normalized}`);
      return normalized;
    }
    
    console.log(`[${new Date().toISOString()}] No breach notice found`);
    return null;
  }

  private extractTerminationNotice(text: string): string | null {
    console.log(`[${new Date().toISOString()}] Extracting termination notice...`);
    
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const terminationContexts: string[] = [];
    
    // Enhanced termination notice patterns
    const terminationPatterns = [
      // Standard termination notice patterns
      /terminat(?:e|ion)[^.\n]{0,100}(?:written\s*)?notice\s*(?:of\s*)?(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,100}/gi,
      /terminat(?:e|ion)[^.\n]{0,50}(?:with|upon|by\s*giving)\s*(\d+\s*(?:days?|months?|weeks?))\s*(?:written\s*)?notice[^.\n]{0,50}/gi,
      // Convenience termination patterns
      /terminat(?:e|ion)\s*(?:for\s*)?convenience[^.\n]{0,100}(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,50}/gi,
      /terminat(?:e|ion)\s*without\s*cause[^.\n]{0,100}(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,50}/gi,
      // Either party termination patterns
      /either\s*party\s*(?:may|can)\s*terminat(?:e|ion)[^.\n]{0,100}(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,50}/gi,
      /(?:each|any)\s*party\s*(?:may|shall\s*have\s*the\s*right\s*to)\s*terminat(?:e|ion)[^.\n]{0,100}(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,50}/gi,
      // Prior notice patterns
      /(\d+\s*(?:days?|months?|weeks?))\s*prior\s*(?:written\s*)?notice\s*(?:of\s*)?terminat(?:e|ion)[^.\n]{0,50}/gi,
      // End/expiry patterns
      /(?:end|expir(?:y|ation)|cessation)[^.\n]{0,100}(\d+\s*(?:days?|months?|weeks?))\s*notice[^.\n]{0,50}/gi,
      // Immediate termination patterns
      /immediate(?:ly)?\s*terminat(?:e|ion)[^.\n]{0,150}/gi,
      // Notice period patterns
      /notice\s*period\s*(?:for\s*terminat(?:e|ion))?\s*(?:of\s*)?(\d+\s*(?:days?|months?|weeks?))[^.\n]{0,50}/gi
    ];
    
    // Extract termination-related sentences
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (lowerSentence.includes('terminat') || 
          lowerSentence.includes('end of') || 
          lowerSentence.includes('expir') ||
          lowerSentence.includes('notice period') ||
          lowerSentence.includes('cancel') ||
          lowerSentence.includes('cessation')) {
        
        // Apply patterns to this sentence
        for (const pattern of terminationPatterns) {
          const matches = sentence.matchAll(pattern);
          for (const match of matches) {
            if (match[0]) {
              terminationContexts.push(match[0].trim());
            }
          }
        }
      }
    }
    
    // Look for specific termination sections
    const terminationSectionPattern = /terminat(?:e|ion)\s*(?:clause|provision|terms?)[:\s]*([^]{50,500}?)(?=\n\n|\.\s*[A-Z]|$)/gi;
    const sectionMatches = text.matchAll(terminationSectionPattern);
    for (const match of sectionMatches) {
      if (match[1]) {
        terminationContexts.push(`Termination Provisions: ${match[1].trim()}`);
      }
    }
    
    // Deduplicate and combine contexts
    const uniqueContexts = [...new Set(terminationContexts)];
    
    if (uniqueContexts.length > 0) {
      const normalized = this.normalizeTerminationNotice(uniqueContexts);
      console.log(`[${new Date().toISOString()}] Extracted termination notice: ${normalized}`);
      return normalized;
    }
    
    console.log(`[${new Date().toISOString()}] No termination notice found`);
    return null;
  }

  // Normalization methods
  private normalizePaymentTerms(contexts: string[]): string {
    const timeframes: string[] = [];
    let primaryTimeframe = '';
    
    for (const context of contexts) {
      // Extract and normalize time periods
      const timeMatches = context.matchAll(/(\d+)\s*(days?|months?|weeks?)/gi);
      for (const match of timeMatches) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const standardized = this.standardizeTimePeriod(value, unit);
        if (standardized && !timeframes.includes(standardized)) {
          timeframes.push(standardized);
        }
      }
      
      // Check for common payment terms
      const lowerContext = context.toLowerCase();
      if (lowerContext.includes('net 30') || lowerContext.includes('30 days')) {
        primaryTimeframe = 'Net 30 days';
      } else if (lowerContext.includes('net 60') || lowerContext.includes('60 days')) {
        primaryTimeframe = 'Net 60 days';
      } else if (lowerContext.includes('net 90') || lowerContext.includes('90 days')) {
        primaryTimeframe = 'Net 90 days';
      } else if (lowerContext.includes('immediate') || lowerContext.includes('upon receipt')) {
        primaryTimeframe = 'Due upon receipt';
      } else if (lowerContext.includes('monthly')) {
        primaryTimeframe = 'Monthly payment';
      } else if (lowerContext.includes('quarterly')) {
        primaryTimeframe = 'Quarterly payment';
      } else if (lowerContext.includes('milestone')) {
        primaryTimeframe = 'Milestone-based';
      }
    }
    
    // Return the most specific aggregatable value
    if (primaryTimeframe) {
      return primaryTimeframe;
    } else if (timeframes.length > 0) {
      // Return the first standardized timeframe as the primary term
      return `Net ${timeframes[0]}`;
    }
    
    return 'Custom payment terms';
  }

  private normalizeBreachNotice(contexts: string[]): string {
    const curePeriods: string[] = [];
    let primaryCurePeriod = '';
    let hasImmediateTermination = false;
    
    for (const context of contexts) {
      // Extract cure periods
      const cureMatches = context.matchAll(/cure.*?(\d+)\s*(days?|months?|weeks?)/gi);
      const noticeMatches = context.matchAll(/notice\s*(?:of\s*)?(\d+)\s*(days?|months?|weeks?)/gi);
      
      for (const match of [...Array.from(cureMatches), ...Array.from(noticeMatches)]) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const standardized = this.standardizeTimePeriod(value, unit);
        if (standardized && !curePeriods.includes(standardized)) {
          curePeriods.push(standardized);
        }
      }
      
      // Check for immediate termination
      const lowerContext = context.toLowerCase();
      if (lowerContext.includes('immediate')) {
        hasImmediateTermination = true;
      }
      
      // Check for common cure periods
      if (lowerContext.includes('30 day') || lowerContext.includes('thirty day')) {
        primaryCurePeriod = '30 days cure period';
      } else if (lowerContext.includes('15 day') || lowerContext.includes('fifteen day')) {
        primaryCurePeriod = '15 days cure period';
      } else if (lowerContext.includes('60 day') || lowerContext.includes('sixty day')) {
        primaryCurePeriod = '60 days cure period';
      } else if (lowerContext.includes('10 day') || lowerContext.includes('ten day')) {
        primaryCurePeriod = '10 days cure period';
      } else if (lowerContext.includes('5 day') || lowerContext.includes('five day')) {
        primaryCurePeriod = '5 days cure period';
      }
    }
    
    // Return the most specific aggregatable value
    if (hasImmediateTermination && !primaryCurePeriod) {
      return 'Immediate termination';
    } else if (primaryCurePeriod) {
      return primaryCurePeriod;
    } else if (curePeriods.length > 0) {
      // Return the first cure period as the primary term
      return `${curePeriods[0]} cure period`;
    }
    
    return 'Standard breach provisions';
  }

  private normalizeTerminationNotice(contexts: string[]): string {
    const noticePeriods: string[] = [];
    let primaryNoticePeriod = '';
    let hasImmediateTermination = false;
    let terminationType = '';
    
    for (const context of contexts) {
      // Extract notice periods
      const noticeMatches = context.matchAll(/(\d+)\s*(days?|months?|weeks?)/gi);
      for (const match of noticeMatches) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const standardized = this.standardizeTimePeriod(value, unit);
        if (standardized && !noticePeriods.includes(standardized)) {
          noticePeriods.push(standardized);
        }
      }
      
      const lowerContext = context.toLowerCase();
      
      // Check for common notice periods
      if (lowerContext.includes('30 day') || lowerContext.includes('thirty day')) {
        primaryNoticePeriod = '30 days notice';
      } else if (lowerContext.includes('60 day') || lowerContext.includes('sixty day')) {
        primaryNoticePeriod = '60 days notice';
      } else if (lowerContext.includes('90 day') || lowerContext.includes('ninety day')) {
        primaryNoticePeriod = '90 days notice';
      } else if (lowerContext.includes('15 day') || lowerContext.includes('fifteen day')) {
        primaryNoticePeriod = '15 days notice';
      } else if (lowerContext.includes('immediate')) {
        hasImmediateTermination = true;
      }
      
      // Identify termination type (prioritize the first match)
      if (!terminationType) {
        if (lowerContext.includes('convenience') || lowerContext.includes('without cause')) {
          terminationType = 'For convenience';
        } else if (lowerContext.includes('breach') || lowerContext.includes('cause')) {
          terminationType = 'For cause';
        } else if (lowerContext.includes('mutual')) {
          terminationType = 'Mutual agreement';
        }
      }
    }
    
    // Return the most specific aggregatable value
    if (hasImmediateTermination) {
      return 'Immediate termination';
    } else if (primaryNoticePeriod && terminationType) {
      return `${primaryNoticePeriod} (${terminationType})`;
    } else if (primaryNoticePeriod) {
      return primaryNoticePeriod;
    } else if (noticePeriods.length > 0) {
      // Return the first notice period as the primary term
      return `${noticePeriods[0]} notice`;
    } else if (terminationType) {
      return terminationType;
    }
    
    return 'Standard termination';
  }

  private standardizeTimePeriod(value: number, unit: string): string {
    // Convert all time periods to days for comparison, then format appropriately
    const lowerUnit = unit.toLowerCase();
    let days = value;
    
    if (lowerUnit.startsWith('week')) {
      days = value * 7;
    } else if (lowerUnit.startsWith('month')) {
      days = value * 30; // Approximate
    }
    
    // Format based on standard periods
    if (days === 1) return '1 day';
    if (days <= 7) return `${days} days`;
    if (days === 14) return '14 days';
    if (days === 21) return '21 days';
    if (days === 30) return '30 days';
    if (days === 45) return '45 days';
    if (days === 60) return '60 days';
    if (days === 90) return '90 days';
    if (days === 180) return '6 months';
    if (days === 365) return '1 year';
    
    // For non-standard periods
    if (days < 30) return `${days} days`;
    if (days < 365) {
      const months = Math.round(days / 30);
      return months === 1 ? '1 month' : `${months} months`;
    }
    
    const years = Math.round(days / 365);
    return years === 1 ? '1 year' : `${years} years`;
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
      
      // Log the extracted data
      console.log(`[${new Date().toISOString()}] Extracted data for contract ${contractId}:`, {
        executedStatus: extractedData.executedStatus,
        language: extractedData.language,
        parties: extractedData.parties?.length || 0,
        governingLaw: extractedData.governingLaw,
        paymentTerm: extractedData.paymentTerm,
        breachNotice: extractedData.breachNotice,
        terminationNotice: extractedData.terminationNotice,
        contractType: extractedData.contractType
      });
      
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