import { pgTable, text, serial, integer, boolean, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  profilePicture: text("profile_picture"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  companyNameEn: text("company_name_en"),
  companyNameAr: text("company_name_ar"),
  country: text("country").default("saudi-arabia"),
  contractRole: text("contract_role"), // 'buyer' or 'vendor'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  company: text("company").default(""),
  jobTitle: text("job_title").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  partyName: text("party_name").notNull(),
  type: text("type").notNull(), // 'service', 'nda', 'employment', 'lease', 'sale', 'partnership'
  status: text("status").notNull().default("draft"), // 'draft', 'active', 'under_review', 'signed', 'expired'
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  riskLevel: text("risk_level"), // 'low', 'medium', 'high'
  fileUrl: text("file_path"),
  analysisResult: jsonb("analysis_result"), // Full Gemini analysis result with 4 categories
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  last_viewed_at: timestamp("last_viewed_at"),
});

export const contractChats = pgTable("contract_chats", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull().references(() => contracts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  tokenCount: integer("token_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export const contractDetails = pgTable("contract_details", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull().references(() => contracts.id),
  executedStatus: boolean("executed_status").default(false),
  language: text("language"),
  internalParties: text("internal_parties").array(),
  counterparties: text("counterparties").array(),
  governingLaw: text("governing_law"),
  paymentTerm: text("payment_term"),
  breachNotice: text("breach_notice"),
  terminationNotice: text("termination_notice"),
  extractedText: text("extracted_text"), // Full extracted text from the contract
  extractionMetadata: text("extraction_metadata"), // JSON string for additional metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
