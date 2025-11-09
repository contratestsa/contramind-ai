import { makeGemini } from "../analysis/geminiClient";

// PRD-compliant analysis categories with comprehensive structure
export interface CategoryAnalysis {
  risks: string[];
  recommendations: string[];
  compliance: string[];
  severity?: 'critical' | 'high' | 'medium' | 'low';
  actionItems?: string[];
}

export interface ContractAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskSummary: string;
  
  // PRD-required four categories
  legalAnalysis: CategoryAnalysis;
  businessAnalysis: CategoryAnalysis;
  technicalAnalysis: CategoryAnalysis;
  shariahAnalysis: CategoryAnalysis;
  
  // Contract metadata
  contractType: string;
  parties: string[];
  dates: {
    startDate?: string;
    endDate?: string;
    signingDate?: string;
  };
  paymentTerms?: string;
  governingLaw?: string;
  
  // Analysis metadata
  analysisText: string;
  partyPerspective?: 'first' | 'second' | 'neutral';
  jurisdiction?: string;
  language?: 'arabic' | 'english' | 'bilingual';
  
  // KSA-specific compliance
  ksaCompliance?: {
    vision2030Alignment?: string[];
    localRegulations?: string[];
    businessPractices?: string[];
  };
  
  // Key findings for backward compatibility
  keyFindings?: {
    highRisks: string[];
    mediumRisks: string[];
    lowRisks: string[];
  };
}

export type PartyPerspective = 'first' | 'second' | 'neutral';
export type ContractLanguage = 'arabic' | 'english' | 'bilingual';

export class ContractAnalysisService {
  private geminiClient: any;

  constructor() {
    try {
      this.geminiClient = makeGemini();
      console.log("Contract Analysis Service initialized with Gemini");
    } catch (error) {
      console.error("Failed to initialize Gemini client:", error);
    }
  }

  /**
   * Analyze contract with PRD-compliant four categories and party perspective
   * @param extractedText - The contract text to analyze
   * @param language - Contract language (arabic, english, or bilingual)
   * @param partyPerspective - Party perspective for analysis bias
   * @param jurisdiction - Jurisdiction for compliance (default: KSA)
   */
  async analyzeContract(
    extractedText: string, 
    language: ContractLanguage = 'english',
    partyPerspective: PartyPerspective = 'neutral',
    jurisdiction: string = 'KSA'
  ): Promise<ContractAnalysisResult> {
    if (!this.geminiClient) {
      console.error("Gemini client not initialized");
      return this.getDefaultAnalysis(partyPerspective, language);
    }

    if (!extractedText || extractedText.trim().length < 50) {
      console.log("Insufficient text for analysis");
      return this.getDefaultAnalysis(partyPerspective, language);
    }

    try {
      console.log(`Starting AI analysis for ${language} contract from ${partyPerspective} party perspective...`);
      console.log(`Text length: ${extractedText.length} characters`);
      console.log(`Jurisdiction: ${jurisdiction}`);

      // Detect if contract is bilingual
      const actualLanguage = this.detectContractLanguage(extractedText);
      console.log(`Detected language: ${actualLanguage}`);

      // Create comprehensive prompt with four categories
      const prompt = this.createAnalysisPrompt(
        extractedText, 
        actualLanguage, 
        partyPerspective,
        jurisdiction
      );
      
      // Call Gemini API 
      const response = await this.geminiClient.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
      });

      console.log("Gemini API response received");
      
      const analysisText = response.text || '';
      console.log("Analysis text length:", analysisText.length);

      // Parse the comprehensive analysis result
      const analysis = this.parseAnalysisResult(analysisText, partyPerspective, actualLanguage);
      analysis.analysisText = analysisText;
      analysis.partyPerspective = partyPerspective;
      analysis.language = actualLanguage;
      analysis.jurisdiction = jurisdiction;

      console.log("Analysis completed:", {
        riskLevel: analysis.riskLevel,
        legalRisks: analysis.legalAnalysis.risks.length,
        businessRisks: analysis.businessAnalysis.risks.length,
        technicalRisks: analysis.technicalAnalysis.risks.length,
        shariahRisks: analysis.shariahAnalysis.risks.length,
        perspective: partyPerspective
      });

      return analysis;
    } catch (error) {
      console.error("Error during Gemini analysis:", error);
      return this.getDefaultAnalysis(partyPerspective, language);
    }
  }

  /**
   * Detect if contract is Arabic, English, or bilingual
   */
  private detectContractLanguage(text: string): ContractLanguage {
    const arabicPattern = /[\u0600-\u06FF]/;
    const englishPattern = /[a-zA-Z]/;
    
    const hasArabic = arabicPattern.test(text);
    const hasEnglish = englishPattern.test(text);
    
    if (hasArabic && hasEnglish) {
      // Check proportion for bilingual contracts
      const arabicCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
      const englishCount = (text.match(/[a-zA-Z]/g) || []).length;
      const total = arabicCount + englishCount;
      
      if (arabicCount > total * 0.2 && englishCount > total * 0.2) {
        return 'bilingual';
      }
    }
    
    if (hasArabic) return 'arabic';
    if (hasEnglish) return 'english';
    return 'english'; // default
  }

  /**
   * Create comprehensive analysis prompt with four categories and party perspective
   */
  private createAnalysisPrompt(
    text: string, 
    language: ContractLanguage,
    perspective: PartyPerspective,
    jurisdiction: string
  ): string {
    // Define perspective-specific instructions
    const perspectiveInstructions = {
      first: `Analyze from the FIRST PARTY (provider/seller) perspective:
- Focus on minimizing liability and protecting intellectual property
- Identify terms that expose the provider to unnecessary risk
- Recommend protective clauses for the provider
- Highlight payment security and collection terms
- Emphasize termination rights favorable to the provider`,
      
      second: `Analyze from the SECOND PARTY (buyer/client) perspective:
- Focus on protecting buyer interests and ensuring delivery
- Identify terms that disadvantage the buyer
- Recommend quality assurance and performance guarantees
- Highlight refund and dispute resolution mechanisms
- Emphasize service level agreements and penalties`,
      
      neutral: `Analyze from a NEUTRAL perspective:
- Provide balanced assessment for both parties
- Identify risks and opportunities for each party
- Recommend fair and equitable terms
- Highlight potential areas of dispute
- Suggest win-win solutions where possible`
    };

    // KSA-specific compliance instructions
    const ksaCompliance = jurisdiction === 'KSA' ? `
Special attention to KSA requirements:
- Saudi Arabian law compliance under the Saudi legal system
- Vision 2030 alignment (digital transformation, sustainability, local content)
- SAMA regulations for financial aspects
- Ministry of Commerce regulations
- Labor law compliance for employment terms
- Shariah compliance for Islamic finance principles
- Zakat and tax implications
- Saudization requirements where applicable` : '';

    // Language-specific instructions
    const languageNote = language === 'bilingual' ? 
      `This is a BILINGUAL contract (Arabic/English). Ensure you:
- Identify any discrepancies between Arabic and English versions
- Note which language takes precedence in case of conflict
- Analyze terms in both languages for completeness` :
      language === 'arabic' ?
      `This is an ARABIC contract. Analyze the Arabic text accurately and provide English analysis.` :
      `This is an ENGLISH contract. Provide comprehensive analysis.`;

    const prompt = `You are an expert contract analyst specializing in Middle East contracts, particularly Saudi Arabian law and Shariah compliance.

${languageNote}

${perspectiveInstructions[perspective]}

${ksaCompliance}

Contract Text:
${text}

Provide a COMPREHENSIVE analysis in the following JSON format. Be specific, detailed, and actionable in your findings:

{
  "riskLevel": "high/medium/low",
  "riskSummary": "Executive summary of overall risk from the ${perspective} party perspective",
  "contractType": "Specific type of contract",
  "parties": ["First Party Name/Role", "Second Party Name/Role"],
  
  "legalAnalysis": {
    "risks": [
      "Specific legal risk 1 with clause reference",
      "Specific legal risk 2 with potential impact"
    ],
    "recommendations": [
      "Add specific clause for...",
      "Modify section X to include..."
    ],
    "compliance": [
      "Complies with Saudi law article...",
      "Missing required clause under regulation..."
    ],
    "severity": "critical/high/medium/low",
    "actionItems": [
      "Immediate action: Review clause X",
      "Required: Add arbitration clause"
    ]
  },
  
  "businessAnalysis": {
    "risks": [
      "Payment terms risk: Net 90 days is excessive",
      "No penalty clauses for late delivery"
    ],
    "recommendations": [
      "Negotiate payment terms to Net 30",
      "Add 2% monthly penalty for delays"
    ],
    "compliance": [
      "Payment terms align with industry standards",
      "Missing performance bonds"
    ],
    "severity": "critical/high/medium/low",
    "actionItems": [
      "Negotiate better payment terms",
      "Require performance guarantee"
    ]
  },
  
  "technicalAnalysis": {
    "risks": [
      "Vague technical specifications in section...",
      "No clear acceptance criteria defined"
    ],
    "recommendations": [
      "Define specific deliverables with metrics",
      "Add detailed technical requirements"
    ],
    "compliance": [
      "Technical standards referenced correctly",
      "Missing data protection requirements"
    ],
    "severity": "critical/high/medium/low",
    "actionItems": [
      "Create detailed technical annex",
      "Define SLA metrics"
    ]
  },
  
  "shariahAnalysis": {
    "risks": [
      "Interest-based penalties violate Islamic finance",
      "Gharar (excessive uncertainty) in pricing"
    ],
    "recommendations": [
      "Replace interest with fixed penalties",
      "Clarify pricing structure"
    ],
    "compliance": [
      "Contract structure is Shariah-compliant",
      "Need to specify halal requirements"
    ],
    "severity": "critical/high/medium/low",
    "actionItems": [
      "Obtain Shariah board approval",
      "Restructure penalty clauses"
    ]
  },
  
  "dates": {
    "startDate": "YYYY-MM-DD if found",
    "endDate": "YYYY-MM-DD if found",
    "signingDate": "YYYY-MM-DD if found"
  },
  
  "paymentTerms": "Detailed payment terms and schedule",
  "governingLaw": "Jurisdiction and applicable law",
  
  "ksaCompliance": {
    "vision2030Alignment": [
      "Supports digital transformation goals",
      "Includes local content requirements"
    ],
    "localRegulations": [
      "Complies with SAMA regulation X",
      "Missing Ministry of Commerce requirement Y"
    ],
    "businessPractices": [
      "Follows standard Saudi contracting practices",
      "Consider adding Saudization clause"
    ]
  },
  
  "keyFindings": {
    "highRisks": ["Top critical risk 1", "Top critical risk 2"],
    "mediumRisks": ["Moderate risk 1", "Moderate risk 2"],
    "lowRisks": ["Minor issue 1", "Minor issue 2"]
  }
}

CRITICAL INSTRUCTIONS:
1. Provide SPECIFIC, ACTIONABLE findings - no generic statements
2. Reference actual clause numbers or sections when possible
3. Consider ${perspective} party interests primarily
4. Include KSA-specific legal and Shariah considerations
5. Identify real risks based on the contract text, not hypothetical ones
6. For bilingual contracts, note any translation discrepancies
7. Provide practical recommendations that can be implemented
8. Use professional legal terminology while remaining clear

Remember: This analysis will be used for real business decisions. Be thorough, accurate, and practical.`;

    return prompt;
  }

  /**
   * Parse the comprehensive analysis result with four categories
   */
  private parseAnalysisResult(
    analysisText: string,
    perspective: PartyPerspective,
    language: ContractLanguage
  ): ContractAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Build comprehensive result with four categories
        const result: ContractAnalysisResult = {
          riskLevel: parsed.riskLevel || 'medium',
          riskSummary: parsed.riskSummary || 'Contract analysis completed',
          
          // Four PRD-required categories
          legalAnalysis: this.parseCategoryAnalysis(parsed.legalAnalysis),
          businessAnalysis: this.parseCategoryAnalysis(parsed.businessAnalysis),
          technicalAnalysis: this.parseCategoryAnalysis(parsed.technicalAnalysis),
          shariahAnalysis: this.parseCategoryAnalysis(parsed.shariahAnalysis),
          
          // Contract metadata
          contractType: parsed.contractType || 'General Contract',
          parties: Array.isArray(parsed.parties) ? parsed.parties : [],
          dates: parsed.dates || {},
          paymentTerms: parsed.paymentTerms,
          governingLaw: parsed.governingLaw,
          
          // Analysis metadata
          analysisText: '',
          partyPerspective: perspective,
          language: language,
          
          // KSA compliance if present
          ksaCompliance: parsed.ksaCompliance,
          
          // Backward compatibility
          keyFindings: parsed.keyFindings || {
            highRisks: [],
            mediumRisks: [],
            lowRisks: []
          }
        };
        
        // Ensure keyFindings is populated for backward compatibility
        if (!result.keyFindings || 
            (result.keyFindings.highRisks.length === 0 && 
             result.keyFindings.mediumRisks.length === 0)) {
          result.keyFindings = this.extractKeyFindings(result);
        }
        
        return result;
      }
    } catch (error) {
      console.error("Error parsing analysis JSON:", error);
    }

    // Fallback: Return minimal analysis with empty categories
    return this.getDefaultAnalysis(perspective, language);
  }

  /**
   * Parse individual category analysis with validation
   */
  private parseCategoryAnalysis(category: any): CategoryAnalysis {
    if (!category) {
      return {
        risks: [],
        recommendations: [],
        compliance: [],
        severity: 'medium'
      };
    }

    return {
      risks: Array.isArray(category.risks) ? category.risks : [],
      recommendations: Array.isArray(category.recommendations) ? category.recommendations : [],
      compliance: Array.isArray(category.compliance) ? category.compliance : [],
      severity: category.severity || 'medium',
      actionItems: Array.isArray(category.actionItems) ? category.actionItems : []
    };
  }

  /**
   * Extract key findings from four categories for backward compatibility
   */
  private extractKeyFindings(analysis: ContractAnalysisResult): any {
    const highRisks: string[] = [];
    const mediumRisks: string[] = [];
    const lowRisks: string[] = [];

    // Collect risks from all categories based on severity
    const categories = [
      analysis.legalAnalysis,
      analysis.businessAnalysis,
      analysis.technicalAnalysis,
      analysis.shariahAnalysis
    ];

    categories.forEach(category => {
      if (category.severity === 'critical' || category.severity === 'high') {
        highRisks.push(...category.risks.slice(0, 2));
      } else if (category.severity === 'medium') {
        mediumRisks.push(...category.risks.slice(0, 2));
      } else {
        lowRisks.push(...category.risks.slice(0, 1));
      }
    });

    return {
      highRisks: highRisks.slice(0, 5),
      mediumRisks: mediumRisks.slice(0, 5),
      lowRisks: lowRisks.slice(0, 3)
    };
  }

  /**
   * Get default analysis structure with empty real categories
   */
  private getDefaultAnalysis(
    perspective: PartyPerspective = 'neutral',
    language: ContractLanguage = 'english'
  ): ContractAnalysisResult {
    return {
      riskLevel: 'medium',
      riskSummary: 'Unable to perform AI analysis. Please check the contract text and try again.',
      
      // Empty but structured categories
      legalAnalysis: {
        risks: [],
        recommendations: [],
        compliance: [],
        severity: 'medium'
      },
      businessAnalysis: {
        risks: [],
        recommendations: [],
        compliance: [],
        severity: 'medium'
      },
      technicalAnalysis: {
        risks: [],
        recommendations: [],
        compliance: [],
        severity: 'medium'
      },
      shariahAnalysis: {
        risks: [],
        recommendations: [],
        compliance: [],
        severity: 'medium'
      },
      
      contractType: 'Unknown',
      parties: [],
      dates: {},
      analysisText: 'Analysis could not be completed.',
      partyPerspective: perspective,
      language: language,
      
      // Empty key findings
      keyFindings: {
        highRisks: [],
        mediumRisks: [],
        lowRisks: []
      }
    };
  }
}

// Export singleton instance
export const contractAnalysisService = new ContractAnalysisService();