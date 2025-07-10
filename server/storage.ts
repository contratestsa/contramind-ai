import { users, waitlistEntries, contactMessages, type User, type InsertUser, type WaitlistEntry, type InsertWaitlistEntry, type ContactMessage, type InsertContactMessage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
    const result = await db
      .select({ count: waitlistEntries.id })
      .from(waitlistEntries);
    return result.length;
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
    return user || undefined;
  }
}

export const storage = new DatabaseStorage();
