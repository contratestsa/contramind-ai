import { 
  users, 
  waitlistEntries, 
  contactMessages, 
  contracts,
  contractChats,
  savedPrompts,
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
  type InsertSavedPrompt
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, or, like, sql } from "drizzle-orm";

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
  createContract(contract: InsertContract): Promise<Contract>;
  getContract(id: number): Promise<Contract | undefined>;
  getUserContracts(userId: number, filters?: { status?: string; type?: string; search?: string }): Promise<Contract[]>;
  getRecentContracts(userId: number, limit?: number): Promise<Contract[]>;
  updateContract(id: number, updates: Partial<Contract>): Promise<Contract | undefined>;
  deleteContract(id: number): Promise<boolean>;
  
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
  async createContract(insertContract: InsertContract): Promise<Contract> {
    const [contract] = await db
      .insert(contracts)
      .values({
        ...insertContract,
        date: new Date(insertContract.date),
      })
      .returning();
    return contract;
  }

  async getContract(id: number): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract || undefined;
  }

  async getUserContracts(userId: number, filters?: { status?: string; type?: string; search?: string }): Promise<Contract[]> {
    let query = db.select().from(contracts).where(eq(contracts.userId, userId));
    
    if (filters) {
      const conditions = [eq(contracts.userId, userId)];
      
      if (filters.status && filters.status !== 'all') {
        conditions.push(eq(contracts.status, filters.status));
      }
      
      if (filters.type && filters.type !== 'all') {
        conditions.push(eq(contracts.type, filters.type));
      }
      
      if (filters.search) {
        conditions.push(
          or(
            like(contracts.title, `%${filters.search}%`),
            like(contracts.partyName, `%${filters.search}%`)
          )!
        );
      }
      
      query = db.select().from(contracts).where(and(...conditions)!);
    }
    
    return query.orderBy(desc(contracts.createdAt));
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
          updated_at as "updatedAt"
        FROM contracts
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `);
      
      return result.rows || [];
    } catch (error) {
      console.error('Error in getRecentContracts:', error);
      // Return empty array on error to avoid breaking the UI
      return [];
    }
  }

  async updateContract(id: number, updates: Partial<Contract>): Promise<Contract | undefined> {
    const { id: _, createdAt, ...updateData } = updates;
    const [contract] = await db
      .update(contracts)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, id))
      .returning();
    return contract || undefined;
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
}

export const storage = new DatabaseStorage();
