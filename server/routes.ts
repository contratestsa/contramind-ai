import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { randomBytes } from "crypto";
import passport from "./passport";
import { storage } from "./storage";
import { insertWaitlistSchema, insertContactSchema, insertUserSchema, loginSchema } from "@shared/schema";
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

      // Check if email is verified
      if (!user.emailVerified) {
        return res.status(401).json({ 
          message: "Please verify your email before logging in" 
        });
      }

      // In production, use bcrypt to compare hashed passwords
      if (user.password !== password) {
        return res.status(401).json({ 
          message: "Invalid email or password" 
        });
      }

      // Send login confirmation email
      const emailResult = await sendLoginConfirmationEmail({
        email: user.email,
        fullName: user.fullName
      });

      if (!emailResult.success) {
        console.error('Failed to send login confirmation email:', emailResult.error);
      }

      // Log user in using passport
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ 
            message: "Failed to establish session" 
          });
        }
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({ 
          message: "Login successful",
          user: userWithoutPassword,
          emailSent: emailResult.success
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

  const httpServer = createServer(app);
  return httpServer;
}
