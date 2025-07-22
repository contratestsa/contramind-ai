import { InsertParty, Party } from "@shared/schema";
import { storage } from "./storage";

interface ExtractedParty {
  name: string;
  nameAr?: string;
  type: 'vendor' | 'client' | 'partner' | 'contractor';
  registrationNumber?: string;
  registrationType?: 'cr' | 'vat' | 'national_id';
  email?: string;
  phone?: string;
  address?: string;
  addressAr?: string;
}

export class PartyExtractor {
  // Common Arabic party type indicators
  private static readonly ARABIC_PARTY_INDICATORS = {
    vendor: ['البائع', 'المورد', 'الطرف الأول', 'المقاول'],
    client: ['المشتري', 'العميل', 'الطرف الثاني', 'صاحب العمل'],
    partner: ['الشريك', 'المساهم'],
    contractor: ['المقاول', 'المتعهد']
  };

  // Common English party type indicators
  private static readonly ENGLISH_PARTY_INDICATORS = {
    vendor: ['vendor', 'seller', 'supplier', 'first party', 'contractor', 'service provider'],
    client: ['client', 'buyer', 'customer', 'second party', 'employer', 'company'],
    partner: ['partner', 'shareholder'],
    contractor: ['contractor', 'subcontractor']
  };

  // Registration number patterns
  private static readonly REGISTRATION_PATTERNS = {
    cr: /(?:CR|Commercial Registration|السجل التجاري|س\.ت)\s*[:.]?\s*(\d{10})/gi,
    vat: /(?:VAT|Tax ID|الرقم الضريبي|ض\.ق)\s*[:.]?\s*(\d{15})/gi,
    national_id: /(?:National ID|ID Number|رقم الهوية|هوية)\s*[:.]?\s*(\d{10})/gi
  };

  // Email pattern
  private static readonly EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  // Phone pattern (Saudi Arabia focus)
  private static readonly PHONE_PATTERN = /(?:\+966|966|05|5)\s*\d{8}|\(\d{3}\)\s*\d{3}-\d{4}/g;

  /**
   * Extract parties from contract text
   */
  static async extractPartiesFromText(
    contractId: number,
    userId: number,
    text: string
  ): Promise<Party[]> {
    const extractedParties: ExtractedParty[] = [];
    
    // Split text into paragraphs for better context
    const paragraphs = text.split(/\n{2,}/);
    
    // Look for party sections
    const partySection = this.findPartySection(paragraphs);
    if (partySection) {
      const parties = this.extractPartiesFromSection(partySection);
      extractedParties.push(...parties);
    }

    // If no structured party section found, use NLP approach
    if (extractedParties.length === 0) {
      const parties = this.extractPartiesUsingPatterns(text);
      extractedParties.push(...parties);
    }

    // Extract additional party information
    for (const party of extractedParties) {
      // Extract registration numbers
      const registrationInfo = this.extractRegistrationNumbers(text, party.name);
      if (registrationInfo) {
        party.registrationNumber = registrationInfo.number;
        party.registrationType = registrationInfo.type;
      }

      // Extract contact information
      const contactInfo = this.extractContactInfo(text, party.name);
      if (contactInfo.email) party.email = contactInfo.email;
      if (contactInfo.phone) party.phone = contactInfo.phone;
      if (contactInfo.address) party.address = contactInfo.address;
    }

    // Save parties to database
    const savedParties: Party[] = [];
    for (const extractedParty of extractedParties) {
      const insertParty: InsertParty = {
        userId,
        name: extractedParty.name,
        nameAr: extractedParty.nameAr,
        type: extractedParty.type,
        registrationNumber: extractedParty.registrationNumber,
        registrationType: extractedParty.registrationType,
        email: extractedParty.email,
        phone: extractedParty.phone,
        address: extractedParty.address,
        addressAr: extractedParty.addressAr,
        sourceContractId: contractId,
        isHighlighted: true
      };

      try {
        const savedParty = await storage.createParty(insertParty);
        savedParties.push(savedParty);
      } catch (error) {
        console.error('Error saving party:', error);
      }
    }

    return savedParties;
  }

  /**
   * Find party section in contract
   */
  private static findPartySection(paragraphs: string[]): string | null {
    const partyIndicators = [
      'parties', 'الأطراف', 'party identification', 'تعريف الأطراف',
      'between', 'بين', 'contracting parties', 'الأطراف المتعاقدة'
    ];

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].toLowerCase();
      if (partyIndicators.some(indicator => paragraph.includes(indicator))) {
        // Return this paragraph and the next 2-3 paragraphs
        return paragraphs.slice(i, i + 4).join('\n');
      }
    }

    return null;
  }

  /**
   * Extract parties from a specific section
   */
  private static extractPartiesFromSection(section: string): ExtractedParty[] {
    const parties: ExtractedParty[] = [];
    const lines = section.split('\n');

    for (const line of lines) {
      // Look for party definitions
      const partyMatch = line.match(/(?:First Party|الطرف الأول|Party A)[:\s]+(.+?)(?:\(|،|,|$)/i) ||
                         line.match(/(?:Second Party|الطرف الثاني|Party B)[:\s]+(.+?)(?:\(|،|,|$)/i);
      
      if (partyMatch) {
        const name = partyMatch[1].trim();
        const type = this.determinePartyType(line);
        
        // Check if it's Arabic
        const isArabic = /[\u0600-\u06FF]/.test(name);
        
        parties.push({
          name: isArabic ? this.cleanArabicName(name) : this.cleanEnglishName(name),
          type
        });
      }
    }

    return parties;
  }

  /**
   * Extract parties using pattern matching
   */
  private static extractPartiesUsingPatterns(text: string): ExtractedParty[] {
    const parties: ExtractedParty[] = [];
    const seenNames = new Set<string>();

    // Look for company patterns
    const companyPatterns = [
      /(?:company|شركة)\s+[:\s]*([A-Za-z\u0600-\u06FF\s&]+?)(?:\s*(?:Ltd|LLC|Inc|المحدودة|ذ\.م\.م))/gi,
      /([A-Za-z\s&]+?)\s+(?:Corporation|Corp|Company|Co\.)/gi,
      /شركة\s+([^\s]+(?:\s+[^\s]+)*?)\s+(?:المحدودة|للتجارة|للمقاولات)/gi
    ];

    for (const pattern of companyPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const name = match[1].trim();
        if (!seenNames.has(name) && name.length > 3) {
          seenNames.add(name);
          const type = this.determinePartyTypeFromContext(text, name);
          parties.push({ name, type });
        }
      }
    }

    return parties;
  }

  /**
   * Determine party type from context
   */
  private static determinePartyType(context: string): ExtractedParty['type'] {
    const lowerContext = context.toLowerCase();

    // Check Arabic indicators
    for (const [type, indicators] of Object.entries(this.ARABIC_PARTY_INDICATORS)) {
      if (indicators.some(indicator => context.includes(indicator))) {
        return type as ExtractedParty['type'];
      }
    }

    // Check English indicators
    for (const [type, indicators] of Object.entries(this.ENGLISH_PARTY_INDICATORS)) {
      if (indicators.some(indicator => lowerContext.includes(indicator))) {
        return type as ExtractedParty['type'];
      }
    }

    // Default based on position
    if (lowerContext.includes('first') || context.includes('الأول')) {
      return 'vendor';
    } else if (lowerContext.includes('second') || context.includes('الثاني')) {
      return 'client';
    }

    return 'vendor'; // Default
  }

  /**
   * Determine party type from broader context
   */
  private static determinePartyTypeFromContext(text: string, partyName: string): ExtractedParty['type'] {
    // Find sentences containing the party name
    const sentences = text.split(/[.!?]/);
    const partySentences = sentences.filter(s => s.includes(partyName));

    for (const sentence of partySentences) {
      const type = this.determinePartyType(sentence);
      if (type) return type;
    }

    return 'vendor'; // Default
  }

  /**
   * Extract registration numbers
   */
  private static extractRegistrationNumbers(
    text: string, 
    partyName: string
  ): { number: string; type: 'cr' | 'vat' | 'national_id' } | null {
    // Find context around party name
    const nameIndex = text.indexOf(partyName);
    if (nameIndex === -1) return null;

    // Extract surrounding context (500 chars before and after)
    const contextStart = Math.max(0, nameIndex - 500);
    const contextEnd = Math.min(text.length, nameIndex + partyName.length + 500);
    const context = text.substring(contextStart, contextEnd);

    // Check each registration pattern
    for (const [type, pattern] of Object.entries(this.REGISTRATION_PATTERNS)) {
      const match = context.match(pattern);
      if (match && match[1]) {
        return {
          number: match[1],
          type: type as 'cr' | 'vat' | 'national_id'
        };
      }
    }

    return null;
  }

  /**
   * Extract contact information
   */
  private static extractContactInfo(
    text: string, 
    partyName: string
  ): { email?: string; phone?: string; address?: string } {
    const result: { email?: string; phone?: string; address?: string } = {};

    // Find context around party name
    const nameIndex = text.indexOf(partyName);
    if (nameIndex === -1) return result;

    const contextStart = Math.max(0, nameIndex - 500);
    const contextEnd = Math.min(text.length, nameIndex + partyName.length + 500);
    const context = text.substring(contextStart, contextEnd);

    // Extract email
    const emailMatch = context.match(this.EMAIL_PATTERN);
    if (emailMatch) {
      result.email = emailMatch[0];
    }

    // Extract phone
    const phoneMatch = context.match(this.PHONE_PATTERN);
    if (phoneMatch) {
      result.phone = phoneMatch[0].replace(/\s+/g, '');
    }

    // Extract address (simplified approach)
    const addressPatterns = [
      /(?:address|العنوان)[:\s]+([^\n]+)/i,
      /(?:located at|الكائن في)[:\s]+([^\n]+)/i,
      /(?:P\.O\. Box|ص\.ب)[:\s]+(\d+[^\n]*)/i
    ];

    for (const pattern of addressPatterns) {
      const match = context.match(pattern);
      if (match && match[1]) {
        result.address = match[1].trim();
        break;
      }
    }

    return result;
  }

  /**
   * Clean Arabic company names
   */
  private static cleanArabicName(name: string): string {
    return name
      .replace(/^\s*شركة\s+/, '') // Remove leading "شركة"
      .replace(/\s+(?:المحدودة|ذ\.م\.م|م\.م\.ح)\s*$/, '') // Remove trailing company types
      .trim();
  }

  /**
   * Clean English company names
   */
  private static cleanEnglishName(name: string): string {
    return name
      .replace(/^\s*(?:The\s+)?Company\s+/i, '') // Remove leading "Company"
      .replace(/\s+(?:Ltd\.?|LLC|Inc\.?|Corp\.?|Co\.?)\s*$/i, '') // Remove trailing company types
      .trim();
  }
}