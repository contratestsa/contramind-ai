import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

interface UserData {
  user_id: string;
  email: string;
  full_name: string;
  profile_picture_url: string;
  company_role: string;
  onboarding_completed: string;
  created_date: string;
  last_login: string;
}

interface TokenBalanceData {
  user_id: string;
  total_tokens: string;
  used_tokens: string;
  remaining_tokens: string;
  last_reset_date: string;
}

interface ContractData {
  contract_id: string;
  user_id: string;
  file_name: string;
  upload_date: string;
  contract_type: string;
  status: string;
  risk_score: string;
  analysis_results: string;
}

interface TokenUsageLogData {
  transaction_id: string;
  user_id: string;
  action_type: string;
  tokens_used: string;
  timestamp: string;
}

export class GoogleSheetsService {
  private doc: GoogleSpreadsheet | null = null;
  private serviceAccountAuth: JWT | null = null;
  private initialized = false;

  constructor() {
    // We'll initialize with credentials when provided
  }

  async initialize(credentials?: any): Promise<void> {
    try {
      // If no credentials provided, check environment variable
      const creds = credentials || (process.env.GOOGLE_SHEETS_CREDENTIALS ? 
        JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS) : null);

      if (!creds) {
        console.log('Google Sheets credentials not provided');
        return;
      }

      const spreadsheetId = process.env.GOOGLE_SHEETS_ID || creds.spreadsheet_id;
      if (!spreadsheetId) {
        console.error('Spreadsheet ID not found');
        return;
      }

      // Create auth using service account
      this.serviceAccountAuth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.doc = new GoogleSpreadsheet(spreadsheetId, this.serviceAccountAuth);
      await this.doc.loadInfo();
      
      // Ensure all required sheets exist
      await this.ensureSheets();
      
      this.initialized = true;
      console.log('Google Sheets service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Sheets:', error);
      throw error;
    }
  }

  private async ensureSheets(): Promise<void> {
    if (!this.doc) return;

    const requiredSheets = ['Users', 'TokenBalance', 'Contracts', 'TokenUsageLog'];
    const existingSheets = this.doc.sheetsByTitle;

    for (const sheetName of requiredSheets) {
      if (!existingSheets[sheetName]) {
        const sheet = await this.doc.addSheet({ 
          title: sheetName,
          headerValues: this.getHeadersForSheet(sheetName)
        });
        console.log(`Created sheet: ${sheetName}`);
      }
    }
  }

  private getHeadersForSheet(sheetName: string): string[] {
    switch (sheetName) {
      case 'Users':
        return ['user_id', 'email', 'full_name', 'profile_picture_url', 'company_role', 'onboarding_completed', 'created_date', 'last_login'];
      case 'TokenBalance':
        return ['user_id', 'total_tokens', 'used_tokens', 'remaining_tokens', 'last_reset_date'];
      case 'Contracts':
        return ['contract_id', 'user_id', 'file_name', 'upload_date', 'contract_type', 'status', 'risk_score', 'analysis_results'];
      case 'TokenUsageLog':
        return ['transaction_id', 'user_id', 'action_type', 'tokens_used', 'timestamp'];
      default:
        return [];
    }
  }

  async checkUserExists(userId: string): Promise<boolean> {
    if (!this.initialized || !this.doc) {
      console.error('Google Sheets not initialized');
      return false;
    }

    try {
      const sheet = this.doc.sheetsByTitle['Users'];
      const rows = await sheet.getRows();
      return rows.some(row => row.get('user_id') === userId);
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }

  async createUser(userData: Partial<UserData>): Promise<void> {
    if (!this.initialized || !this.doc) {
      console.error('Google Sheets not initialized');
      return;
    }

    try {
      const usersSheet = this.doc.sheetsByTitle['Users'];
      const tokenSheet = this.doc.sheetsByTitle['TokenBalance'];

      const now = new Date().toISOString();

      // Add user to Users sheet
      await usersSheet.addRow({
        user_id: userData.user_id || '',
        email: userData.email || '',
        full_name: userData.full_name || '',
        profile_picture_url: userData.profile_picture_url || '',
        company_role: userData.company_role || '',
        onboarding_completed: 'FALSE',
        created_date: now,
        last_login: now
      });

      // Add initial token balance
      await tokenSheet.addRow({
        user_id: userData.user_id || '',
        total_tokens: '1000',
        used_tokens: '0',
        remaining_tokens: '1000',
        last_reset_date: now
      });

      console.log(`Created new user: ${userData.email}`);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserData(userId: string): Promise<UserData | null> {
    if (!this.initialized || !this.doc) {
      console.error('Google Sheets not initialized');
      return null;
    }

    try {
      const sheet = this.doc.sheetsByTitle['Users'];
      const rows = await sheet.getRows();
      const userRow = rows.find(row => row.get('user_id') === userId);

      if (!userRow) return null;

      return {
        user_id: userRow.get('user_id'),
        email: userRow.get('email'),
        full_name: userRow.get('full_name'),
        profile_picture_url: userRow.get('profile_picture_url'),
        company_role: userRow.get('company_role'),
        onboarding_completed: userRow.get('onboarding_completed'),
        created_date: userRow.get('created_date'),
        last_login: userRow.get('last_login')
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    if (!this.initialized || !this.doc) return;

    try {
      const sheet = this.doc.sheetsByTitle['Users'];
      const rows = await sheet.getRows();
      const userRow = rows.find(row => row.get('user_id') === userId);

      if (userRow) {
        userRow.set('last_login', new Date().toISOString());
        await userRow.save();
      }
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  async getTokenBalance(userId: string): Promise<TokenBalanceData | null> {
    if (!this.initialized || !this.doc) {
      console.error('Google Sheets not initialized');
      return null;
    }

    try {
      const sheet = this.doc.sheetsByTitle['TokenBalance'];
      const rows = await sheet.getRows();
      const tokenRow = rows.find(row => row.get('user_id') === userId);

      if (!tokenRow) return null;

      return {
        user_id: tokenRow.get('user_id'),
        total_tokens: tokenRow.get('total_tokens'),
        used_tokens: tokenRow.get('used_tokens'),
        remaining_tokens: tokenRow.get('remaining_tokens'),
        last_reset_date: tokenRow.get('last_reset_date')
      };
    } catch (error) {
      console.error('Error getting token balance:', error);
      return null;
    }
  }

  async updateTokenUsage(userId: string, tokensUsed: number, actionType: string): Promise<void> {
    if (!this.initialized || !this.doc) return;

    try {
      // Update token balance
      const balanceSheet = this.doc.sheetsByTitle['TokenBalance'];
      const balanceRows = await balanceSheet.getRows();
      const tokenRow = balanceRows.find(row => row.get('user_id') === userId);

      if (tokenRow) {
        const currentUsed = parseInt(tokenRow.get('used_tokens')) || 0;
        const totalTokens = parseInt(tokenRow.get('total_tokens')) || 1000;
        const newUsed = currentUsed + tokensUsed;
        const remaining = totalTokens - newUsed;

        tokenRow.set('used_tokens', newUsed.toString());
        tokenRow.set('remaining_tokens', remaining.toString());
        await tokenRow.save();
      }

      // Log the transaction
      const logSheet = this.doc.sheetsByTitle['TokenUsageLog'];
      await logSheet.addRow({
        transaction_id: `txn_${Date.now()}`,
        user_id: userId,
        action_type: actionType,
        tokens_used: tokensUsed.toString(),
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error updating token usage:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();