import { 
  users, 
  waitlistEntries, 
  contactMessages, 
  contracts,
  contractChats,
  savedPrompts,
  contractDetails,
  type User, 
  type InsertUser, 
  type WaitlistEntry, 
  type InsertWaitlistEntry, 
  type ContactMessage, 
  type InsertContactMessage,
  type Contract,
  type InsertContract,
  type ContractChat,
  type InsertContractChat,
  type SavedPrompt,
  type InsertSavedPrompt,
  type ContractDetails,
  type InsertContractDetails
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, or, like, sql, inArray } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerification(email: string, verificationToken: string): Promise<User | undefined>;
  verifyUserEmail(token: string): Promise<User | undefined>;
  verifyUserEmailByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  updateUserProfilePicture(id: number, profilePicture: string): Promise<User | undefined>;
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistCount(): Promise<number>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateUserOnboarding(id: number, data: { companyNameEn: string; companyNameAr?: string; country: string; contractRole: string }): Promise<User | undefined>;
  
  // Contract methods
  createContract(contract: InsertContract & { userId: number }): Promise<Contract>;
  getContract(id: number): Promise<Contract | undefined>;
  getUserContracts(userId: number, filters?: { status?: string; type?: string; search?: string }): Promise<Contract[]>;
  getRecentContracts(userId: number, limit?: number): Promise<Contract[]>;
  getAllContracts(userId: number): Promise<Contract[]>;
  updateContract(id: number, updates: Partial<Contract>): Promise<Contract | undefined>;
  deleteContract(id: number): Promise<boolean>;
  touchContract(userId: number, contractId: number): Promise<void>;
  
  // Contract chat methods
  createContractChat(chat: InsertContractChat): Promise<ContractChat>;
  getContractChats(contractId: number): Promise<ContractChat[]>;
  searchContractChats(userId: number, searchTerm: string): Promise<{ contract: Contract; chats: ContractChat[] }[]>;
  
  // Saved prompts methods
  createSavedPrompt(prompt: InsertSavedPrompt): Promise<SavedPrompt>;
  getUserPrompts(userId: number): Promise<SavedPrompt[]>;
  getSystemPrompts(): Promise<SavedPrompt[]>;
  updatePromptUsage(id: number): Promise<void>;
  deleteSavedPrompt(id: number, userId: number): Promise<boolean>;
  
  // Contract details methods
  createContractDetails(details: InsertContractDetails): Promise<ContractDetails>;
  getContractDetails(contractId: number): Promise<ContractDetails | undefined>;
  updateContractDetails(contractId: number, updates: Partial<ContractDetails>): Promise<ContractDetails | undefined>;
  getAllContractDetails(userId: number): Promise<ContractDetails[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserVerification(email: string, verificationToken: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ verificationToken })
      .where(eq(users.email, email))
      .returning();
    return user || undefined;
  }

  async verifyUserEmail(token: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ emailVerified: true, verificationToken: null })
      .where(eq(users.verificationToken, token))
      .returning();
    return user || undefined;
  }

  async verifyUserEmailByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ emailVerified: true, verificationToken: null })
      .where(eq(users.email, email))
      .returning();
    return user || undefined;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user || undefined;
  }

  async updateUserProfilePicture(id: number, profilePicture: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ profilePicture })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    // Check if email already exists
    const [existingEntry] = await db
      .select()
      .from(waitlistEntries)
      .where(eq(waitlistEntries.email, insertEntry.email));
    
    if (existingEntry) {
      throw new Error("Email already registered in waitlist");
    }

    const [entry] = await db
      .insert(waitlistEntries)
      .values({
        fullName: insertEntry.fullName,
        email: insertEntry.email,
        phoneNumber: insertEntry.phoneNumber,
        company: insertEntry.company || "",
        jobTitle: insertEntry.jobTitle || "",
      })
      .returning();
    return entry;
  }

  async getWaitlistCount(): Promise<number> {
    try {
      console.log("Executing waitlist count query...");
      const result = await db
        .select({ count: waitlistEntries.id })
        .from(waitlistEntries);
      console.log("Query result:", result);
      return result.length;
    } catch (error) {
      console.error("Database error in getWaitlistCount:", error);
      throw error;
    }
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return await db
      .select()
      .from(waitlistEntries)
      .orderBy(waitlistEntries.createdAt);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values({
        name: insertMessage.name,
        email: insertMessage.email,
        subject: insertMessage.subject,
        message: insertMessage.message,
      })
      .returning();
    return message;
  }

  async updateUserOnboarding(id: number, data: { companyNameEn: string; companyNameAr?: string; country: string; contractRole: string }): Promise<User | undefined> {
    try {
      console.log('Updating user onboarding for ID:', id, 'with data:', data);
      
      const [user] = await db
        .update(users)
        .set({
          companyNameEn: data.companyNameEn,
          companyNameAr: data.companyNameAr || null,
          country: data.country,
          contractRole: data.contractRole,
          onboardingCompleted: true
        })
        .where(eq(users.id, id))
        .returning();
      
      console.log('Updated user:', user);
      return user || undefined;
    } catch (error) {
      console.error('Error updating user onboarding:', error);
      throw error;
    }
  }

  // Contract methods implementation
  async createContract(insertContract: InsertContract & { userId: number }): Promise<Contract> {
    // Map schema fields to actual database columns
    const dbValues = {
      user_id: insertContract.userId,
      name: insertContract.title, // database uses 'name' column
      title: insertContract.title,
      parties: insertContract.partyName, // database uses 'parties' column
      party_name: insertContract.partyName,
      type: insertContract.type,
      status: insertContract.status || 'draft',
      risk_level: insertContract.riskLevel || null,
      start_date: new Date(insertContract.startDate), // database uses 'start_date' column
      file_path: insertContract.fileUrl || null
    };

    const result = await db.execute(sql`
      INSERT INTO contracts (user_id, name, title, parties, party_name, type, status, risk_level, start_date, file_path)
      VALUES (${dbValues.user_id}, ${dbValues.name}, ${dbValues.title}, ${dbValues.parties}, ${dbValues.party_name}, 
              ${dbValues.type}, ${dbValues.status}, ${dbValues.risk_level}, ${dbValues.start_date}, ${dbValues.file_path})
      RETURNING *
    `);

    const createdContract = result.rows[0] as any;
    
    // Map database columns back to schema fields
    return {
      id: createdContract.id,
      userId: createdContract.user_id,
      title: createdContract.title || createdContract.name,
      partyName: createdContract.party_name || createdContract.parties,
      startDate: createdContract.start_date,
      endDate: createdContract.end_date,
      type: createdContract.type,
      status: createdContract.status,
      riskLevel: createdContract.risk_level,
      fileUrl: createdContract.file_path,
      createdAt: createdContract.created_at,
      updatedAt: createdContract.updated_at
    } as Contract;
  }

  async getContract(id: number): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract || undefined;
  }

  async getUserContracts(userId: number, filters?: { status?: string; type?: string; search?: string }): Promise<Contract[]> {
    try {
      // Build WHERE conditions
      let whereClause = `WHERE user_id = ${userId}`;
      
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          whereClause += ` AND status = '${filters.status}'`;
        }
        
        if (filters.type && filters.type !== 'all') {
          whereClause += ` AND type = '${filters.type}'`;
        }
        
        if (filters.search) {
          whereClause += ` AND (name ILIKE '%${filters.search}%' OR parties ILIKE '%${filters.search}%')`;
        }
      }
      
      // Use raw SQL to work with actual database column names
      const result = await db.execute(sql`
        SELECT 
          id,
          user_id as "userId",
          name as title,
          parties as "partyName",
          type,
          status,
          start_date as date,
          risk_level as "riskLevel",
          file_path as "fileUrl",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM contracts
        ${sql.raw(whereClause)}
        ORDER BY created_at DESC
      `);
      
      return result.rows || [];
    } catch (error) {
      console.error('Error in getUserContracts:', error);
      return [];
    }
  }

  async getRecentContracts(userId: number, limit: number = 5): Promise<any[]> {
    try {
      // Use raw SQL to work with actual database column names
      const result = await db.execute(sql`
        SELECT 
          id,
          user_id as "userId",
          name as title,
          parties as "partyName",
          type,
          status,
          start_date as date,
          risk_level as "riskLevel",
          file_path as "fileUrl",
          created_at as "createdAt",
          updated_at as "updatedAt",
          last_viewed_at as "lastViewedAt"
        FROM contracts
        WHERE user_id = ${userId}
        ORDER BY last_viewed_at DESC
        LIMIT ${limit}
      `);
      
      return result.rows || [];
    } catch (error) {
      console.error('Error in getRecentContracts:', error);
      // Return empty array on error to avoid breaking the UI
      return [];
    }
  }

  async getAllContracts(userId: number): Promise<any[]> {
    try {
      // Use raw SQL to work with actual database column names
      const result = await db.execute(sql`
        SELECT 
          id,
          user_id as "userId",
          name as title,
          parties as "partyName",
          type,
          status,
          start_date as date,
          risk_level as "riskLevel",
          file_path as "fileUrl",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM contracts
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `);
      
      return result.rows || [];
    } catch (error) {
      console.error('Error in getAllContracts:', error);
      // Return empty array on error to avoid breaking the UI
      return [];
    }
  }

  async touchContract(userId: number, contractId: number): Promise<void> {
    try {
      await db.execute(sql`
        UPDATE contracts 
        SET last_viewed_at = CURRENT_TIMESTAMP 
        WHERE id = ${contractId} AND user_id = ${userId}
      `);
    } catch (error) {
      console.error('Error in touchContract:', error);
      throw error;
    }
  }

  async updateContract(id: number, updates: Partial<Contract>): Promise<Contract | undefined> {
    try {
      console.log('Updating contract:', id, updates);
      
      // Map schema fields to database columns
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      if (updates.title !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        values.push(updates.title);
      }
      if (updates.partyName !== undefined) {
        updateFields.push(`parties = $${paramIndex++}`);
        updateFields.push(`party_name = $${paramIndex++}`);
        values.push(updates.partyName);
        values.push(updates.partyName);
      }
      if (updates.date !== undefined) {
        updateFields.push(`start_date = $${paramIndex++}`);
        values.push(new Date(updates.date));
      }
      if (updates.type !== undefined) {
        updateFields.push(`type = $${paramIndex++}`);
        values.push(updates.type);
      }
      if (updates.status !== undefined) {
        updateFields.push(`status = $${paramIndex++}`);
        values.push(updates.status);
      }
      if (updates.riskLevel !== undefined) {
        updateFields.push(`risk_level = $${paramIndex++}`);
        values.push(updates.riskLevel);
      }
      if (updates.fileUrl !== undefined) {
        updateFields.push(`file_path = $${paramIndex++}`);
        values.push(updates.fileUrl);
      }
      
      // Always update updated_at
      updateFields.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());
      
      // Add id to values
      values.push(id);
      
      if (updateFields.length === 1) {
        // Only updated_at, no actual updates
        const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
        return contract || undefined;
      }
      
      const query = sql.raw(`
        UPDATE contracts
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING 
          id,
          user_id as "userId",
          name as title,
          parties as "partyName",
          type,
          status,
          start_date as date,
          risk_level as "riskLevel",
          file_path as "fileUrl",
          created_at as "createdAt",
          updated_at as "updatedAt"
      `, values);
      
      const result = await db.execute(query);
      
      return result.rows[0] || undefined;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  }

  async deleteContract(id: number): Promise<boolean> {
    const result = await db.delete(contracts).where(eq(contracts.id, id));
    return result.rowCount > 0;
  }

  // Contract chat methods implementation
  async createContractChat(insertChat: InsertContractChat): Promise<ContractChat> {
    const [chat] = await db
      .insert(contractChats)
      .values(insertChat)
      .returning();
    return chat;
  }

  async getContractChats(contractId: number): Promise<ContractChat[]> {
    return db
      .select()
      .from(contractChats)
      .where(eq(contractChats.contractId, contractId))
      .orderBy(asc(contractChats.createdAt));
  }

  async searchContractChats(userId: number, searchTerm: string): Promise<{ contract: Contract; chats: ContractChat[] }[]> {
    // First, find all contracts for the user
    const userContracts = await db
      .select()
      .from(contracts)
      .where(eq(contracts.userId, userId));
    
    // Then, search for chats that match the search term
    const results = [];
    for (const contract of userContracts) {
      const matchingChats = await db
        .select()
        .from(contractChats)
        .where(
          and(
            eq(contractChats.contractId, contract.id),
            like(contractChats.message, `%${searchTerm}%`)
          )!
        )
        .orderBy(desc(contractChats.createdAt));
      
      if (matchingChats.length > 0) {
        results.push({ contract, chats: matchingChats });
      }
    }
    
    return results;
  }

  // Saved prompts methods implementation
  async createSavedPrompt(insertPrompt: InsertSavedPrompt): Promise<SavedPrompt> {
    const [prompt] = await db
      .insert(savedPrompts)
      .values(insertPrompt)
      .returning();
    return prompt;
  }

  async getUserPrompts(userId: number): Promise<SavedPrompt[]> {
    return db
      .select()
      .from(savedPrompts)
      .where(eq(savedPrompts.userId, userId))
      .orderBy(desc(savedPrompts.usageCount));
  }

  async getSystemPrompts(): Promise<SavedPrompt[]> {
    return db
      .select()
      .from(savedPrompts)
      .where(eq(savedPrompts.isSystem, true))
      .orderBy(asc(savedPrompts.id));
  }

  async updatePromptUsage(id: number): Promise<void> {
    await db
      .update(savedPrompts)
      .set({ 
        usageCount: sql`${savedPrompts.usageCount} + 1` 
      })
      .where(eq(savedPrompts.id, id));
  }

  async deleteSavedPrompt(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(savedPrompts)
      .where(
        and(
          eq(savedPrompts.id, id),
          eq(savedPrompts.userId, userId)
        )!
      );
    return result.rowCount > 0;
  }

  // Contract details methods implementation
  async createContractDetails(details: InsertContractDetails): Promise<ContractDetails> {
    const [contractDetail] = await db
      .insert(contractDetails)
      .values(details)
      .returning();
    return contractDetail;
  }

  async getContractDetails(contractId: number): Promise<ContractDetails | undefined> {
    const [detail] = await db
      .select()
      .from(contractDetails)
      .where(eq(contractDetails.contractId, contractId));
    return detail || undefined;
  }

  async updateContractDetails(contractId: number, updates: Partial<ContractDetails>): Promise<ContractDetails | undefined> {
    const [updated] = await db
      .update(contractDetails)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(contractDetails.contractId, contractId))
      .returning();
    return updated || undefined;
  }

  async getAllContractDetails(userId: number): Promise<ContractDetails[]> {
    const userContracts = await db
      .select()
      .from(contracts)
      .where(eq(contracts.userId, userId));
    
    const contractIds = userContracts.map(c => c.id);
    
    if (contractIds.length === 0) return [];
    
    return db
      .select()
      .from(contractDetails)
      .where(inArray(contractDetails.contractId, contractIds));
  }
  
  async getContractsWithMissingPartyData(userId: number): Promise<Contract[]> {
    try {
      // Get all user contracts
      const userContracts = await this.getUserContracts(userId);
      
      // Get contract details for these contracts
      const contractIds = userContracts.map(c => c.id);
      if (contractIds.length === 0) return [];
      
      const details = await db
        .select()
        .from(contractDetails)
        .where(inArray(contractDetails.contractId, contractIds));
      
      // Find contracts with missing or empty party data
      const contractsWithMissingData = userContracts.filter(contract => {
        const detail = details.find(d => d.contractId === contract.id);
        
        // If no details exist, needs processing
        if (!detail) return true;
        
        // If party arrays are empty or null, needs processing
        if (!detail.internalParties || detail.internalParties.length === 0 ||
            !detail.counterparties || detail.counterparties.length === 0) {
          return true;
        }
        
        return false;
      });
      
      return contractsWithMissingData;
    } catch (error) {
      console.error('Error getting contracts with missing party data:', error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();
