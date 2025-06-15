import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { sendEmail, createWaitlistConfirmationEmail } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Waitlist endpoints
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistSchema.parse(req.body);
      const entry = await storage.createWaitlistEntry(validatedData);
      
      // Send confirmation email
      const emailContent = createWaitlistConfirmationEmail(
        entry.fullName, 
        entry.email,
        'en' // Default to English, can be enhanced to detect language from request
      );
      
      // Send email asynchronously - don't block the response
      sendEmail({
        to: entry.email,
        from: 'noreply@contramind.ai', // You can change this to your verified sender
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html
      }).catch(error => {
        console.error('Failed to send confirmation email:', error);
      });
      
      res.json({ success: true, entry: { id: entry.id, createdAt: entry.createdAt } });
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

  const httpServer = createServer(app);
  return httpServer;
}
