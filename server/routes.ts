import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { randomBytes } from "crypto";
import passport from "./passport";
import { storage } from "./storage";
import { 
  insertWaitlistSchema, 
  insertContactSchema, 
  insertUserSchema, 
  loginSchema,
  insertContractSchema,
  insertContractChatSchema,
  insertSavedPromptSchema 
} from "@shared/schema";
import { sendWelcomeEmail, sendContactEmail, sendVerificationEmail, sendLoginConfirmationEmail } from "./emailService";

// >>> PDF ANALYSIS START
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
// <<< PDF ANALYSIS END

export async function registerRoutes(app: Express): Promise<Server> {
  // >>> PDF ANALYSIS START
  const upload = multer({ dest: "uploads/" });

  /**
   * POST /api/analyze
   * Cuerpo (multipart/form-data): { pdf: <archivo.pdf> }
   */
  app.post("/api/analyze", upload.single("pdf"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const pdfPath = req.file.path;                                  // tmp file
    const pythonScript = path.join(__dirname, "python", "analyze_pdf.py");

    // Ejecuta: python3 analyze_pdf.py <ruta_pdf>
    const py = spawn("python3", [pythonScript, pdfPath]);           // usa "python" si "python3" falla

    let output = "";
    py.stdout.on("data", (chunk) => (output += chunk.toString()));
    py.stderr.on("data", (err) => console.error(err.toString()));

    py.on("close", (code) => {
      fs.unlinkSync(pdfPath);                                       // elimina tmp

      if (code !== 0) {
        return res.status(500).json({ error: "Python script failed" });
      }
      res.type("text/plain").send(output);                          // respuesta del modelo
    });
  });
  // <<< PDF ANALYSIS END

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
      console.log("Attempting to get waitlist count...");
      const count = await storage.getWaitlistCount();
      console.log("Waitlist count retrieved:", count);
      res.json({ count });
    } catch (error) {
      console.error("Error getting waitlist count:", error);
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

  // ... (END CHANGES FROM HARIAS)
  //  🔻  (NO CHANGES FROM HERE)
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

      // Generate verification token and send verification email
      const verificationToken = randomBytes(32).toString('hex');
      await storage.updateUserVerification(user.email, verificationToken);

      // Send verification email
      let emailSent = false;
      try {
        const emailResult = await sendVerificationEmail({
          email: user.email,
          fullName: user.fullName,
          verificationToken
        });
        
        emailSent = emailResult.success;
        if (!emailResult.success) {
          console.error('Failed to send verification email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        // Continue with signup even if email fails
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.status(201).json({ 
        message: emailSent 
          ? "Account created successfully. Please check your email to verify your account."
          : "Account created successfully. Email verification may be pending.", 
        user: userWithoutPassword,
        emailSent
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
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ 
          message: "Invalid email or password" 
        });
      }

      // Skip email verification check for now
      // if (!user.emailVerified) {
      //   return res.status(401).json({ 
      //     message: "Please verify your email before logging in" 
      //   });
      // }

      // In production, use bcrypt to compare hashed passwords
      if (user.password !== password) {
        return res.status(401).json({ 
          message: "Invalid email or password" 
        });
      }

      // Log user in using passport (skip email confirmation)
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ 
            message: "Failed to establish session" 
          });
        }
        
        // Save session explicitly
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
            return res.status(500).json({ 
              message: "Failed to save session" 
            });
          }
          
          console.log("Session saved successfully for user:", user.email);
          console.log("Session ID:", req.sessionID);
          
          // Remove password from response
          const { password: _, ...userWithoutPassword } = user;
          
          res.json({ 
            message: "Login successful",
            user: userWithoutPassword
          });
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid credentials format", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to login" 
        });
      }
    }
  });

  app.get("/api/auth/me", (req, res) => {
    console.log("Auth check - Session ID:", req.sessionID);
    console.log("Auth check - User:", req.user);
    console.log("Auth check - Session:", req.session);
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { password: _, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const token = req.query.token as string;
      
      if (!token) {
        return res.status(400).json({ message: "Verification token required" });
      }

      const user = await storage.getUserByVerificationToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      await storage.verifyUserEmail(user.email);
      
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });

  // OAuth routes
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  
  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { 
      failureRedirect: "/login?error=google_auth_failed",
      successRedirect: "/dashboard" 
    })
  );

  app.get("/api/auth/microsoft", passport.authenticate("microsoft", { scope: ["user.read"] }));
  
  app.get("/api/auth/microsoft/callback", 
    passport.authenticate("microsoft", { 
      failureRedirect: "/login?error=microsoft_auth_failed",
      successRedirect: "/dashboard" 
    })
  );

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContactMessage(validatedData);

      // Send contact confirmation email
      const emailResult = await sendContactEmail({
        email: contact.email,
        fullName: contact.fullName,
        message: contact.message
      });

      if (!emailResult.success) {
        console.error('Failed to send contact email:', emailResult.error);
        // Continue even if email fails
      }

      res.json({ 
        success: true, 
        contact: { 
          id: contact.id, 
          createdAt: contact.createdAt 
        },
        emailSent: emailResult.success
      });
    } catch (error) {
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

  // Onboarding endpoint
  app.post("/api/onboarding/complete", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { companyNameEn, companyNameAr, country, contractRole } = req.body;
      
      const updatedUser = await storage.updateUserOnboarding(req.user.id, {
        companyNameEn,
        companyNameAr,
        country,
        contractRole
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ 
        message: "Onboarding completed successfully", 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error('Onboarding error:', error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Contract endpoints
  app.get("/api/contracts", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { status, type, search } = req.query;
      const contracts = await storage.getUserContracts(req.user.id, {
        status: status as string,
        type: type as string,
        search: search as string
      });

      res.json({ contracts });
    } catch (error) {
      console.error('Error fetching contracts:', error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get("/api/contracts/recent", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const contracts = await storage.getRecentContracts(req.user.id, limit);

      res.json({ contracts });
    } catch (error) {
      console.error('Error fetching recent contracts:', error);
      res.status(500).json({ message: "Failed to fetch recent contracts" });
    }
  });

  app.get("/api/contracts/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const contract = await storage.getContract(parseInt(req.params.id));
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Check if user owns this contract
      if (contract.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json({ contract });
    } catch (error) {
      console.error('Error fetching contract:', error);
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const validatedData = insertContractSchema.parse(req.body);
      const contract = await storage.createContract({
        ...validatedData,
        userId: req.user.id
      });

      res.status(201).json({ 
        message: "Contract created successfully",
        contract 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      } else {
        console.error('Error creating contract:', error);
        res.status(500).json({ message: "Failed to create contract" });
      }
    }
  });

  app.patch("/api/contracts/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const contractId = parseInt(req.params.id);
      const contract = await storage.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      if (contract.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedContract = await storage.updateContract(contractId, req.body);

      res.json({ 
        message: "Contract updated successfully",
        contract: updatedContract 
      });
    } catch (error) {
      console.error('Error updating contract:', error);
      res.status(500).json({ message: "Failed to update contract" });
    }
  });

  app.delete("/api/contracts/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const contractId = parseInt(req.params.id);
      const contract = await storage.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      if (contract.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const deleted = await storage.deleteContract(contractId);

      if (deleted) {
        res.json({ message: "Contract deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete contract" });
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      res.status(500).json({ message: "Failed to delete contract" });
    }
  });

  // Contract chat endpoints
  app.get("/api/contracts/:id/chats", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const contractId = parseInt(req.params.id);
      const contract = await storage.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      if (contract.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const chats = await storage.getContractChats(contractId);
      res.json({ chats });
    } catch (error) {
      console.error('Error fetching contract chats:', error);
      res.status(500).json({ message: "Failed to fetch contract chats" });
    }
  });

  app.post("/api/contracts/:id/chats", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const contractId = parseInt(req.params.id);
      const contract = await storage.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      if (contract.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const validatedData = insertContractChatSchema.parse(req.body);
      const chat = await storage.createContractChat({
        ...validatedData,
        contractId,
        userId: req.user.id
      });

      res.status(201).json({ 
        message: "Chat message created successfully",
        chat 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      } else {
        console.error('Error creating contract chat:', error);
        res.status(500).json({ message: "Failed to create chat message" });
      }
    }
  });

  app.get("/api/contracts/search/chats", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const searchTerm = req.query.q as string;
      
      if (!searchTerm) {
        return res.status(400).json({ message: "Search term is required" });
      }

      const results = await storage.searchContractChats(req.user.id, searchTerm);
      res.json({ results });
    } catch (error) {
      console.error('Error searching contract chats:', error);
      res.status(500).json({ message: "Failed to search contract chats" });
    }
  });

  // Saved prompts endpoints
  app.get("/api/prompts", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const [userPrompts, systemPrompts] = await Promise.all([
        storage.getUserPrompts(req.user.id),
        storage.getSystemPrompts()
      ]);

      res.json({ 
        userPrompts,
        systemPrompts 
      });
    } catch (error) {
      console.error('Error fetching prompts:', error);
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  app.post("/api/prompts", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const validatedData = insertSavedPromptSchema.parse(req.body);
      const prompt = await storage.createSavedPrompt({
        ...validatedData,
        userId: req.user.id,
        isSystem: false
      });

      res.status(201).json({ 
        message: "Prompt saved successfully",
        prompt 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      } else {
        console.error('Error creating prompt:', error);
        res.status(500).json({ message: "Failed to save prompt" });
      }
    }
  });

  app.post("/api/prompts/:id/use", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const promptId = parseInt(req.params.id);
      await storage.updatePromptUsage(promptId);

      res.json({ message: "Prompt usage updated" });
    } catch (error) {
      console.error('Error updating prompt usage:', error);
      res.status(500).json({ message: "Failed to update prompt usage" });
    }
  });

  app.delete("/api/prompts/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const promptId = parseInt(req.params.id);
      const deleted = await storage.deleteSavedPrompt(promptId, req.user.id);

      if (deleted) {
        res.json({ message: "Prompt deleted successfully" });
      } else {
        res.status(404).json({ message: "Prompt not found or access denied" });
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      res.status(500).json({ message: "Failed to delete prompt" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
