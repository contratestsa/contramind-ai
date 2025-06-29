import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertWaitlistSchema, insertContactSchema, insertUserSchema, loginSchema } from "@shared/schema";
import { sendWelcomeEmail, sendContactEmail } from "./emailService";
import passport from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Waitlist endpoints
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistSchema.parse(req.body);
      const entry = await storage.createWaitlistEntry(validatedData);
      
      // Get current waitlist count for position
      const waitlistCount = await storage.getWaitlistCount();
      
      // Send welcome email
      const emailResult = await sendWelcomeEmail({
        email: entry.email,
        fullName: entry.fullName,
        waitlistPosition: waitlistCount
      });
      
      if (!emailResult.success) {
        console.error('Failed to send welcome email:', emailResult.error);
        // Continue even if email fails - don't block registration
      }
      
      res.json({ 
        success: true, 
        entry: { 
          id: entry.id, 
          createdAt: entry.createdAt,
          waitlistPosition: waitlistCount
        },
        emailSent: emailResult.success
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      } else if (error instanceof Error && error.message.includes("Email already registered")) {
        res.status(409).json({ 
          message: "Email already registered in waitlist" 
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });

  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  app.get("/api/waitlist", async (req, res) => {
    try {
      const entries = await storage.getWaitlistEntries();
      // Don't expose sensitive information
      const publicEntries = entries.map(entry => ({
        id: entry.id,
        fullName: entry.fullName,
        company: entry.company,
        jobTitle: entry.jobTitle,
        createdAt: entry.createdAt,
      }));
      res.json({ entries: publicEntries });
    } catch (error) {
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      
      // Save message to database
      const message = await storage.createContactMessage(validatedData);
      
      // Send emails
      const emailResult = await sendContactEmail({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      });
      
      res.json({ 
        success: true, 
        message: "Message sent successfully",
        id: message.id 
      });
    } catch (error) {
      console.error("Contact form error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to send message" 
        });
      }
    }
  });

  // Authentication endpoints
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ 
          message: "User with this email already exists" 
        });
      }

      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ 
          message: "Username already taken" 
        });
      }

      // Create user (in production, hash the password)
      const user = await storage.createUser(validatedData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        message: "Account created successfully",
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to create account" 
        });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ 
          message: "Invalid email or password" 
        });
      }

      // Check password (in production, compare hashed passwords)
      if (user.password !== validatedData.password) {
        return res.status(401).json({ 
          message: "Invalid email or password" 
        });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json({ 
        message: "Login successful",
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Login failed" 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
