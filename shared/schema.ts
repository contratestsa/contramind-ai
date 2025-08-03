/**
 * Database schema definitions for ContraMind using Drizzle ORM
 * All tables use PostgreSQL with type-safe schema definitions
 */

import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Users table - Stores all registered user accounts
 * Includes authentication data, profile information, and preferences
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),                              // Auto-incrementing primary key
  username: text("username").notNull().unique(),              // Unique username for login
  email: text("email").notNull().unique(),                    // Unique email address
  password: text("password").notNull(),                       // Hashed password (bcrypt)
  fullName: text("full_name").notNull(),                     // User's display name
  profilePicture: text("profile_picture"),                    // URL to profile image
  emailVerified: boolean("email_verified").default(false).notNull(), // Email verification status
  verificationToken: text("verification_token"),              // Token for email verification
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(), // Onboarding status
  companyNameEn: text("company_name_en"),                     // Company name in English
  companyNameAr: text("company_name_ar"),                     // Company name in Arabic
  country: text("country").default("saudi-arabia"),          // User's country (default: KSA)
  contractRole: text("contract_role"),                        // Default role: 'buyer' or 'vendor'
  createdAt: timestamp("created_at").defaultNow().notNull(), // Account creation timestamp
});

/**
 * Waitlist entries table - Stores early access registrations
 * Captures lead information for platform launch
 */
export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),                              // Auto-incrementing ID
  fullName: text("full_name").notNull(),                     // Registrant's full name
  email: text("email").notNull().unique(),                   // Unique email address
  phoneNumber: text("phone_number").notNull(),               // Contact phone number
  company: text("company").default(""),                       // Optional company name
  jobTitle: text("job_title").default(""),                   // Optional job title
  createdAt: timestamp("created_at").defaultNow().notNull(), // Registration timestamp
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Contracts table - Core contract management entity
 * Stores contract metadata and analysis results
 */
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),                                      // Unique contract ID
  userId: integer("user_id").notNull().references(() => users.id),   // Owner user reference
  title: text("title").notNull(),                                    // Contract title/filename
  partyName: text("party_name").notNull(),                          // Primary party name
  type: text("type").notNull(),                                      // Contract type: 'service', 'nda', 'employment', 'lease', 'sale', 'partnership'
  status: text("status").notNull().default("draft"),                // Status: 'draft', 'active', 'under_review', 'signed', 'expired'
  startDate: date("start_date").notNull(),                          // Contract effective date
  endDate: date("end_date"),                                         // Contract end date (optional)
  riskLevel: text("risk_level"),                                    // Risk assessment: 'low', 'medium', 'high'
  fileUrl: text("file_path"),                                        // Path to stored contract file
  createdAt: timestamp("created_at").defaultNow().notNull(),        // Creation timestamp
  updatedAt: timestamp("updated_at").defaultNow().notNull(),        // Last update timestamp
  last_viewed_at: timestamp("last_viewed_at"),                      // Last access timestamp
});

/**
 * Contract chats table - Stores conversation history for contracts
 * Tracks all user and AI interactions with token usage
 */
export const contractChats = pgTable("contract_chats", {
  id: serial("id").primaryKey(),                                      // Message ID
  contractId: integer("contract_id").notNull().references(() => contracts.id), // Associated contract
  userId: integer("user_id").notNull().references(() => users.id),   // Message author
  message: text("message").notNull(),                                // Message content
  role: text("role").notNull(),                                      // Sender role: 'user' or 'assistant'
  tokenCount: integer("token_count").default(0),                     // Tokens consumed by this message
  createdAt: timestamp("created_at").defaultNow().notNull(),        // Message timestamp
});

export const savedPrompts = pgTable("saved_prompts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // null for system prompts
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  category: text("category"), // 'review', 'analysis', 'compliance', 'negotiation', etc.
  isSystem: boolean("is_system").default(false).notNull(), // true for ContraMind built-in prompts
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Contract details table - Stores extracted contract information
 * Contains parsed data from contract analysis including parties, terms, and metadata
 */
export const contractDetails = pgTable("contract_details", {
  id: serial("id").primaryKey(),                                      // Detail record ID
  contractId: integer("contract_id").notNull().references(() => contracts.id), // Parent contract reference
  executedStatus: boolean("executed_status").default(false),          // Whether contract is executed
  language: text("language"),                                         // Contract language (en/ar)
  internalParties: text("internal_parties").array(),                 // Array of internal party names
  counterparties: text("counterparties").array(),                    // Array of counterparty names
  governingLaw: text("governing_law"),                               // Applicable law jurisdiction
  paymentTerm: text("payment_term"),                                 // Payment terms description
  breachNotice: text("breach_notice"),                               // Breach notification period
  terminationNotice: text("termination_notice"),                     // Termination notice requirements
  extractedText: text("extracted_text"),                             // Full extracted text from the contract
  extractionMetadata: text("extraction_metadata"),                   // JSON string for additional metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),        // Creation timestamp
  updatedAt: timestamp("updated_at").defaultNow().notNull(),        // Last update timestamp
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  fullName: true,
  profilePicture: true,
  emailVerified: true,
}).partial({
  emailVerified: true,
  profilePicture: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export const insertWaitlistSchema = createInsertSchema(waitlistEntries).pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  company: true,
  jobTitle: true,
});

export const insertContactSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  userId: true, // Server will add this from authenticated user
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  partyName: z.string().min(2, "Party name must be at least 2 characters"),
  type: z.enum(["service", "nda", "employment", "lease", "sale", "partnership"]),
  status: z.enum(["draft", "active", "under_review", "signed", "expired"]).optional(),
  riskLevel: z.enum(["low", "medium", "high"]).optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export const insertContractChatSchema = createInsertSchema(contractChats).omit({
  id: true,
  createdAt: true,
}).extend({
  message: z.string().min(1, "Message cannot be empty"),
  role: z.enum(["user", "assistant"]),
});

export const insertSavedPromptSchema = createInsertSchema(savedPrompts).omit({
  id: true,
  createdAt: true,
  usageCount: true,
}).extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  category: z.enum(["review", "analysis", "compliance", "negotiation", "general"]).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;
export type InsertContractChat = z.infer<typeof insertContractChatSchema>;
export type ContractChat = typeof contractChats.$inferSelect;
export type InsertSavedPrompt = z.infer<typeof insertSavedPromptSchema>;
export type SavedPrompt = typeof savedPrompts.$inferSelect;

export const insertContractDetailsSchema = createInsertSchema(contractDetails).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertContractDetails = z.infer<typeof insertContractDetailsSchema>;
export type ContractDetails = typeof contractDetails.$inferSelect;
