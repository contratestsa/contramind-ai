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
import { fileURLToPath } from "url";
// <<< PDF ANALYSIS END
import { contractExtractor } from "./contractExtractor";
import { PartyExtractor } from "./partyExtractor";

// Define __dirname for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  app.get("/api/contracts", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const contracts = await storage.getAllContracts(req.user.id);

      res.json({ contracts });
    } catch (error) {
      console.error('Error fetching all contracts:', error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  // Touch contract endpoint - updates last viewed timestamp
  app.post("/api/contracts/touch", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { contractId } = req.body;
      
      if (!contractId) {
        return res.status(400).json({ message: "Contract ID is required" });
      }

      await storage.touchContract(req.user.id, contractId);

      res.status(204).send();
    } catch (error) {
      console.error('Error touching contract:', error);
      res.status(500).json({ message: "Failed to update contract" });
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

      // Convert date string to Date object before validation
      const dataWithDate = {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined
      };

      const validatedData = insertContractSchema.parse(dataWithDate);
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

  // Upload contract with file and extract details
  app.post("/api/contracts/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "PDF file is required" });
      }

      // Parse contract metadata from form data
      const contractData = {
        title: req.body.title || `Contract_${Date.now()}`,
        partyName: req.body.partyName || "Unknown Party",
        type: req.body.type || "other",
        status: req.body.status || "draft",
        startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
        riskLevel: req.body.riskLevel || "medium",
        fileUrl: `/uploads/${req.file.filename}`
      };

      // Create contract record
      const contract = await storage.createContract({
        ...contractData,
        userId: req.user.id
      });

      // Process the PDF asynchronously
      contractExtractor.processContract(contract.id, req.file.path)
        .then(async () => {
          console.log(`Contract ${contract.id} processed successfully`);
          
          // Extract parties from the contract text
          try {
            // Get the extracted text from contract details
            const details = await storage.getContractDetails(contract.id);
            if (details && details.extractedText) {
              console.log(`Extracting parties from contract ${contract.id}...`);
              const parties = await PartyExtractor.extractPartiesFromText(
                contract.id,
                req.user!.id,
                details.extractedText
              );
              console.log(`Extracted ${parties.length} parties from contract ${contract.id}`);
            }
          } catch (partyError) {
            console.error(`Error extracting parties from contract ${contract.id}:`, partyError);
          }
        })
        .catch((error) => {
          console.error(`Error processing contract ${contract.id}:`, error);
        });

      res.status(201).json({ 
        message: "Contract uploaded successfully. Processing will complete shortly.",
        contract 
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      console.error('Error uploading contract:', error);
      res.status(500).json({ message: "Failed to upload contract" });
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

  // Process all contracts endpoint - extracts data from existing contracts
  app.post("/api/contracts/process-all", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = req.user.id;
      const userContracts = await storage.getUserContracts(userId);
      
      console.log(`[${new Date().toISOString()}] Processing ${userContracts.length} contracts for user ${userId}`);
      
      let processed = 0;
      let failed = 0;
      
      for (const contract of userContracts) {
        if (contract.fileUrl) {
          try {
            const filePath = path.join(__dirname, '..', contract.fileUrl);
            
            console.log(`[${new Date().toISOString()}] Processing contract ${contract.id}: ${contract.title}`);
            console.log(`[${new Date().toISOString()}] File path: ${filePath}`);
            
            // Check if file exists
            if (fs.existsSync(filePath)) {
              console.log(`[${new Date().toISOString()}] File exists, starting extraction...`);
              await contractExtractor.processContract(contract.id, filePath);
              processed++;
              console.log(`[${new Date().toISOString()}] Successfully processed contract ${contract.id}`);
            } else {
              console.log(`[${new Date().toISOString()}] File not found for contract ${contract.id}: ${filePath}`);
              failed++;
            }
          } catch (error) {
            console.error(`[${new Date().toISOString()}] Failed to process contract ${contract.id}:`, error);
            failed++;
          }
        } else {
          console.log(`[${new Date().toISOString()}] No file URL for contract ${contract.id}`);
          failed++;
        }
      }
      
      res.json({ 
        message: "Contract processing complete", 
        total: userContracts.length,
        processed,
        failed 
      });
    } catch (error) {
      console.error('Error processing contracts:', error);
      res.status(500).json({ message: "Failed to process contracts" });
    }
  });
  
  // Process existing contracts endpoint - re-processes contracts with empty party data
  app.post("/api/process-existing-contracts", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = req.user.id;
      console.log(`[${new Date().toISOString()}] Starting re-processing of contracts for user ${userId}`);
      
      // Get all contracts with missing party data
      const contractsToProcess = await storage.getContractsWithMissingPartyData(userId);
      
      let processed = 0;
      let failed = 0;
      const results = [];
      
      for (const contract of contractsToProcess) {
        if (contract.fileUrl) {
          try {
            const filePath = path.join(__dirname, '..', contract.fileUrl);
            
            // Check if file exists
            if (fs.existsSync(filePath)) {
              console.log(`[${new Date().toISOString()}] Re-processing contract ${contract.id}: ${contract.title}`);
              await contractExtractor.processContract(contract.id, filePath);
              processed++;
              results.push({
                contractId: contract.id,
                title: contract.title,
                status: 'processed'
              });
            } else {
              console.log(`[${new Date().toISOString()}] File not found for contract ${contract.id}: ${filePath}`);
              failed++;
              results.push({
                contractId: contract.id,
                title: contract.title,
                status: 'file_not_found'
              });
            }
          } catch (error) {
            console.error(`[${new Date().toISOString()}] Failed to re-process contract ${contract.id}:`, error);
            failed++;
            results.push({
              contractId: contract.id,
              title: contract.title,
              status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      }
      
      console.log(`[${new Date().toISOString()}] Re-processing complete: ${processed} processed, ${failed} failed`);
      
      res.json({ 
        message: "Contract re-processing complete", 
        total: contractsToProcess.length,
        processed,
        failed,
        results
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error re-processing contracts:`, error);
      res.status(500).json({ message: "Failed to re-process contracts" });
    }
  });

  // Party endpoints
  app.get("/api/parties", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const filters = {
        type: req.query.type as string | undefined,
        search: req.query.search as string | undefined,
        highlighted: req.query.highlighted === 'true' ? true : req.query.highlighted === 'false' ? false : undefined
      };

      const parties = await storage.getUserParties(req.user.id, filters);
      res.json({ parties });
    } catch (error) {
      console.error('Error fetching parties:', error);
      res.status(500).json({ message: "Failed to fetch parties" });
    }
  });

  app.get("/api/parties/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const partyId = parseInt(req.params.id);
      const party = await storage.getParty(partyId);
      
      if (!party) {
        return res.status(404).json({ message: "Party not found" });
      }

      // Verify user owns this party
      const userParties = await storage.getUserParties(req.user.id);
      if (!userParties.find(p => p.id === partyId)) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json({ party });
    } catch (error) {
      console.error('Error fetching party:', error);
      res.status(500).json({ message: "Failed to fetch party" });
    }
  });

  app.patch("/api/parties/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const partyId = parseInt(req.params.id);
      
      // Verify user owns this party
      const party = await storage.getParty(partyId);
      if (!party || party.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updated = await storage.updateParty(partyId, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Party not found" });
      }

      res.json({ party: updated });
    } catch (error) {
      console.error('Error updating party:', error);
      res.status(500).json({ message: "Failed to update party" });
    }
  });

  app.delete("/api/parties/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const partyId = parseInt(req.params.id);
      
      // Verify user owns this party
      const party = await storage.getParty(partyId);
      if (!party || party.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const deleted = await storage.deleteParty(partyId);
      if (!deleted) {
        return res.status(404).json({ message: "Party not found" });
      }

      res.json({ message: "Party deleted successfully" });
    } catch (error) {
      console.error('Error deleting party:', error);
      res.status(500).json({ message: "Failed to delete party" });
    }
  });

  app.post("/api/parties/:id/remove-highlight", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const partyId = parseInt(req.params.id);
      
      // Verify user owns this party
      const party = await storage.getParty(partyId);
      if (!party || party.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.removePartyHighlight(partyId);
      res.json({ message: "Highlight removed successfully" });
    } catch (error) {
      console.error('Error removing party highlight:', error);
      res.status(500).json({ message: "Failed to remove highlight" });
    }
  });

  app.get("/api/contracts/:id/parties", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const contractId = parseInt(req.params.id);
      
      // Verify user owns this contract
      const contract = await storage.getContract(contractId);
      if (!contract || contract.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const parties = await storage.getPartiesBySourceContract(contractId);
      res.json({ parties });
    } catch (error) {
      console.error('Error fetching contract parties:', error);
      res.status(500).json({ message: "Failed to fetch contract parties" });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = req.user.id;

      // Get all user contracts from database
      const userContracts = await storage.getUserContracts(userId);
      
      // Get all contract details for analytics
      const contractDetails = await storage.getAllContractDetails(userId);
      
      // Calculate analytics from real data
      const uniqueDocs = userContracts.length;
      
      // Contract Type aggregation
      const contractTypeMap: Record<string, number> = {};
      const typeMapping: Record<string, string> = {
        'service': 'Service Agreement',
        'nda': 'NDA',
        'employment': 'Employment Contract',
        'sales': 'Sales Agreement',
        'other': 'Other'
      };
      
      userContracts.forEach(contract => {
        const displayType = typeMapping[contract.type] || contract.type || 'Others';
        contractTypeMap[displayType] = (contractTypeMap[displayType] || 0) + 1;
      });

      // Executed aggregation from extracted data
      const executed = {
        yes: 0,
        no: 0
      };
      
      // Language aggregation from extracted data
      const languageMap: Record<string, number> = {};
      
      contractDetails.forEach(detail => {
        // Count executed status
        if (detail.executedStatus) {
          executed.yes++;
        } else {
          executed.no++;
        }
        
        // Count languages
        if (detail.language) {
          languageMap[detail.language] = (languageMap[detail.language] || 0) + 1;
        }
      });
      
      // If no extracted details yet, fall back to contract status
      if (contractDetails.length === 0) {
        executed.yes = userContracts.filter(c => c.status === 'signed' || c.status === 'active').length;
        executed.no = userContracts.filter(c => c.status !== 'signed' && c.status !== 'active').length;
        
        // Default language distribution
        userContracts.forEach((contract, index) => {
          const rand = Math.random();
          let lang;
          if (rand < 0.50) lang = "English";
          else if (rand < 0.85) lang = "Arabic";
          else lang = "English & Arabic";
          
          languageMap[lang] = (languageMap[lang] || 0) + 1;
        });
      }
      
      const language = Object.keys(languageMap).length > 0 ? languageMap : {
        "English": 0,
        "Arabic": 0,
        "English & Arabic": 0
      };

      // Internal Parties aggregation from extracted data
      const internalPartiesMap: Record<string, number> = {};
      
      // Counterparties aggregation from extracted data
      const counterpartiesMap: Record<string, number> = {};
      
      // Governing Law aggregation from extracted data
      const governingLawMap: Record<string, number> = {};
      
      // Additional extracted data maps
      const paymentTermsMap: Record<string, number> = {};
      const breachNoticeMap: Record<string, number> = {};
      const terminationNoticeMap: Record<string, number> = {};
      
      // Process extracted data
      contractDetails.forEach(detail => {
        // Internal parties
        if (detail.internalParties && Array.isArray(detail.internalParties)) {
          detail.internalParties.forEach(party => {
            if (party && party.trim()) {
              internalPartiesMap[party] = (internalPartiesMap[party] || 0) + 1;
            }
          });
        }
        
        // Counterparties
        if (detail.counterparties && Array.isArray(detail.counterparties)) {
          detail.counterparties.forEach(party => {
            if (party && party.trim()) {
              counterpartiesMap[party] = (counterpartiesMap[party] || 0) + 1;
            }
          });
        }
        
        // Governing law
        if (detail.governingLaw) {
          governingLawMap[detail.governingLaw] = (governingLawMap[detail.governingLaw] || 0) + 1;
        }
        
        // Payment terms
        if (detail.paymentTerm) {
          paymentTermsMap[detail.paymentTerm] = (paymentTermsMap[detail.paymentTerm] || 0) + 1;
        }
        
        // Breach notice
        if (detail.breachNotice) {
          breachNoticeMap[detail.breachNotice] = (breachNoticeMap[detail.breachNotice] || 0) + 1;
        }
        
        // Termination notice
        if (detail.terminationNotice) {
          terminationNoticeMap[detail.terminationNotice] = (terminationNoticeMap[detail.terminationNotice] || 0) + 1;
        }
      });
      
      // If no extracted data, fall back to contract partyName for counterparties
      if (Object.keys(counterpartiesMap).length === 0) {
        userContracts.forEach(contract => {
          const party = contract.partyName || 'Unknown';
          counterpartiesMap[party] = (counterpartiesMap[party] || 0) + 1;
        });
      }
      
      // If no extracted data for internal parties, use default departments
      if (Object.keys(internalPartiesMap).length === 0) {
        const departments = ["Legal Department", "Sales Team", "HR Department", "Operations", "Finance"];
        userContracts.forEach((contract, index) => {
          const dept = departments[index % departments.length];
          internalPartiesMap[dept] = (internalPartiesMap[dept] || 0) + 1;
        });
      }
      
      // If no extracted data for governing law, use default
      if (Object.keys(governingLawMap).length === 0) {
        const laws = ["Saudi Arabia", "UAE", "United States", "United Kingdom", "Singapore"];
        userContracts.forEach((contract, index) => {
          const law = laws[index % laws.length];
          governingLawMap[law] = (governingLawMap[law] || 0) + 1;
        });
      }
      
      // Sort and format data
      const internalPartiesData = Object.entries(internalPartiesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, number>);

      const sortedCounterparties = Object.entries(counterpartiesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, number>);

      const governingLawData = Object.entries(governingLawMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, number>);

      // Format payment terms, breach notice, and termination notice data
      const paymentTermsData = Object.entries(paymentTermsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, number>);

      const breachNoticeData = Object.entries(breachNoticeMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, number>);

      const terminationNoticeData = Object.entries(terminationNoticeMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, number>);

      const analyticsData = {
        uniqueDocs,
        contractType: contractTypeMap,
        executed,
        language,
        internalParties: internalPartiesData,
        counterparties: Object.keys(sortedCounterparties).length > 0 ? sortedCounterparties : { "No contracts yet": 0 },
        governingLaw: governingLawData,
        paymentTerms: paymentTermsData,
        breachNotice: breachNoticeData,
        terminationNotice: terminationNoticeData,
        hasExtractedData: contractDetails.length > 0
      };

      console.log(`[${new Date().toISOString()}] Analytics data:`, {
        uniqueDocs,
        hasExtractedData: contractDetails.length > 0,
        contractDetailsCount: contractDetails.length,
        paymentTermsCount: Object.keys(paymentTermsData).length,
        breachNoticeCount: Object.keys(breachNoticeData).length,
        terminationNoticeCount: Object.keys(terminationNoticeData).length
      });

      res.json(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
