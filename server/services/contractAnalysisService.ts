import { makeGemini } from "../analysis/geminiClient";

export interface ContractAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskSummary: string;
  keyFindings: {
    highRisks: string[];
    mediumRisks: string[];
    lowRisks: string[];
  };
  contractType: string;
  parties: string[];
  dates: {
    startDate?: string;
    endDate?: string;
  };
  paymentTerms?: string;
  governingLaw?: string;
  analysisText: string;
}

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

  async analyzeContract(extractedText: string, language: 'ar' | 'en' = 'en'): Promise<ContractAnalysisResult> {
    if (!this.geminiClient) {
      console.error("Gemini client not initialized");
      return this.getDefaultAnalysis();
    }

    if (!extractedText || extractedText.trim().length < 50) {
      console.log("Insufficient text for analysis");
      return this.getDefaultAnalysis();
    }

    try {
      console.log(`Starting AI analysis for ${language} contract...`);
      console.log(`Text length: ${extractedText.length} characters`);

      // Create model
      const model = this.geminiClient.models.generate({
        model: 'gemini-2.0-flash-exp',
      });

      // Prepare the prompt based on language
      const prompt = this.createAnalysisPrompt(extractedText, language);
      
      // Call Gemini API
      const response = await model.generateContent({
        contents: prompt,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      });

      console.log("Gemini API response received");
      
      const analysisText = response.text || '';
      console.log("Analysis text length:", analysisText.length);

      // Parse the analysis result
      const analysis = this.parseAnalysisResult(analysisText);
      analysis.analysisText = analysisText;

      console.log("Analysis completed:", {
        riskLevel: analysis.riskLevel,
        highRisks: analysis.keyFindings.highRisks.length,
        mediumRisks: analysis.keyFindings.mediumRisks.length,
      });

      return analysis;
    } catch (error) {
      console.error("Error during Gemini analysis:", error);
      return this.getDefaultAnalysis();
    }
  }

  private createAnalysisPrompt(text: string, language: 'ar' | 'en'): string {
    if (language === 'ar') {
      return `You are a professional legal contract analyst specialized in Arabic contracts. Analyze the following Arabic contract text and provide a structured analysis.

Contract Text:
${text}

Please provide your analysis in the following JSON format:
{
  "riskLevel": "high/medium/low",
  "riskSummary": "Brief summary of overall risk assessment in English",
  "contractType": "Type of contract (e.g., Service Agreement, Sales Contract, etc.)",
  "parties": ["Party 1 name", "Party 2 name"],
  "highRisks": ["Risk 1", "Risk 2"],
  "mediumRisks": ["Risk 1", "Risk 2"],
  "lowRisks": ["Risk 1", "Risk 2"],
  "dates": {
    "startDate": "YYYY-MM-DD if found",
    "endDate": "YYYY-MM-DD if found"
  },
  "paymentTerms": "Payment terms if found",
  "governingLaw": "Governing law jurisdiction if found"
}

Focus on identifying:
1. Missing critical clauses
2. Unfavorable terms
3. Legal compliance issues
4. Financial risks
5. Ambiguous language that could lead to disputes

Provide the response in English but analyze the Arabic text accurately.`;
    } else {
      return `You are a professional legal contract analyst. Analyze the following contract text and provide a structured risk analysis.

Contract Text:
${text}

Please provide your analysis in the following JSON format:
{
  "riskLevel": "high/medium/low",
  "riskSummary": "Brief summary of overall risk assessment",
  "contractType": "Type of contract",
  "parties": ["Party 1", "Party 2"],
  "highRisks": ["Risk 1", "Risk 2"],
  "mediumRisks": ["Risk 1", "Risk 2"],
  "lowRisks": ["Risk 1", "Risk 2"],
  "dates": {
    "startDate": "YYYY-MM-DD if found",
    "endDate": "YYYY-MM-DD if found"
  },
  "paymentTerms": "Payment terms if found",
  "governingLaw": "Governing law if found"
}

Focus on identifying:
1. Missing critical clauses
2. Unfavorable terms
3. Legal compliance issues
4. Financial risks
5. Ambiguous language`;
    }
  }

  private parseAnalysisResult(analysisText: string): ContractAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          riskLevel: parsed.riskLevel || 'medium',
          riskSummary: parsed.riskSummary || 'Contract analysis completed',
          keyFindings: {
            highRisks: parsed.highRisks || [],
            mediumRisks: parsed.mediumRisks || [],
            lowRisks: parsed.lowRisks || [],
          },
          contractType: parsed.contractType || 'General Contract',
          parties: parsed.parties || [],
          dates: parsed.dates || {},
          paymentTerms: parsed.paymentTerms,
          governingLaw: parsed.governingLaw,
          analysisText: '',
        };
      }
    } catch (error) {
      console.error("Error parsing analysis JSON:", error);
    }

    // Fallback: Extract key information from plain text
    const highRisks = this.extractRisks(analysisText, 'high');
    const mediumRisks = this.extractRisks(analysisText, 'medium');
    const lowRisks = this.extractRisks(analysisText, 'low');

    const riskLevel = highRisks.length > 2 ? 'high' : 
                      mediumRisks.length > 3 ? 'medium' : 'low';

    return {
      riskLevel,
      riskSummary: `Found ${highRisks.length} high risks and ${mediumRisks.length} medium risks`,
      keyFindings: {
        highRisks,
        mediumRisks,
        lowRisks,
      },
      contractType: 'Contract',
      parties: [],
      dates: {},
      analysisText: '',
    };
  }

  private extractRisks(text: string, level: string): string[] {
    const risks: string[] = [];
    const patterns = [
      new RegExp(`${level}\\s*risk[s]?:([^\\n]+)`, 'gi'),
      new RegExp(`\\b${level}\\b.*?risk[s]?.*?:([^\\n]+)`, 'gi'),
    ];

    patterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          risks.push(match[1].trim());
        }
      }
    });

    return risks.slice(0, 5); // Limit to 5 risks per level
  }

  private getDefaultAnalysis(): ContractAnalysisResult {
    return {
      riskLevel: 'medium',
      riskSummary: 'Unable to perform AI analysis. Please check the contract text.',
      keyFindings: {
        highRisks: [],
        mediumRisks: [],
        lowRisks: [],
      },
      contractType: 'Unknown',
      parties: [],
      dates: {},
      analysisText: 'Analysis could not be completed.',
    };
  }
}

// Export singleton instance
export const contractAnalysisService = new ContractAnalysisService();