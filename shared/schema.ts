import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
