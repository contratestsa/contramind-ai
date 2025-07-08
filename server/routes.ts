import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { randomBytes } from "crypto";
import passport from "./passport";
import { storage } from "./storage";
import { insertWaitlistSchema, insertContactSchema, insertUserSchema, loginSchema } from "@shared/schema";
import { sendWelcomeEmail, sendContactEmail, sendVerificationEmail, sendLoginConfirmationEmail } from "./emailService";
import { getPreferredDomain } from "./authRedirect";

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
      
      // Generate verification token and send verification email
      const verificationToken = randomBytes(32).toString('hex');
      await storage.updateUserVerification(user.email, verificationToken);
      
      // Send verification email
      const emailResult = await sendVerificationEmail({
        email: user.email,
        fullName: user.fullName,
        verificationToken
      });
      
      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error);
      }
      
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

      // Check if email is verified
      if (!user.emailVerified) {
        // Generate new verification token if needed
        if (!user.verificationToken) {
          const verificationToken = randomBytes(32).toString('hex');
          await storage.updateUserVerification(user.email, verificationToken);
          
          // Send verification email
          const emailResult = await sendVerificationEmail({
            email: user.email,
            fullName: user.fullName,
            verificationToken
          });
          
          if (!emailResult.success) {
            console.error('Failed to send verification email:', emailResult.error);
          }
        }
        
        return res.status(403).json({ 
          message: "Please verify your email address. A verification email has been sent.",
          emailVerificationRequired: true
        });
      }

      // Send login confirmation email
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const emailResult = await sendLoginConfirmationEmail({
        email: user.email,
        fullName: user.fullName,
        loginTime: new Date(),
        ipAddress: ipAddress as string
      });
      
      if (!emailResult.success) {
        console.error('Failed to send login confirmation email:', emailResult.error);
      }

      // Login user with passport (creates session)
      req.login(user, (err) => {
        if (err) {
          console.error('Session login error:', err);
          return res.status(500).json({ message: "Login failed" });
        }
        
        // Save session to ensure cookie is set
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
            return res.status(500).json({ message: "Session save failed" });
          }
          
          console.log('Session saved successfully, session ID:', req.sessionID);
          
          // Remove password from response
          const { password, ...userWithoutPassword } = user;
          
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

  // Email verification endpoint
  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ 
          message: "Invalid verification token" 
        });
      }

      // Find user by verification token
      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ 
          message: "Invalid or expired verification token" 
        });
      }

      // Mark email as verified
      const verifiedUser = await storage.verifyUserEmail(token);
      if (!verifiedUser) {
        return res.status(500).json({ 
          message: "Failed to verify email" 
        });
      }

      // Redirect to success page on the same domain
      const preferredDomain = getPreferredDomain(req);
      res.redirect(`${preferredDomain}/dashboard?verified=true`);
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ 
        message: "Email verification failed" 
      });
    }
  });

  // Google OAuth routes
  app.get("/api/auth/google", passport.authenticate("google", { 
    scope: ["profile", "email"] 
  }));

  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { 
      failureRedirect: "/?error=google_auth_failed" 
    }),
    async (req, res) => {
      // Successful authentication
      console.log('Google OAuth successful for user:', req.user);
      
      // Send login confirmation email
      if (req.user) {
        const user = req.user as User;
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        const emailResult = await sendLoginConfirmationEmail({
          email: user.email,
          fullName: user.fullName,
          loginTime: new Date(),
          ipAddress: ipAddress as string
        });
        
        if (!emailResult.success) {
          console.error('Failed to send Google OAuth login confirmation email:', emailResult.error);
        }
      }
      
      // Ensure session is saved before redirecting
      req.session.save((err) => {
        if (err) {
          console.error('Failed to save session after Google OAuth:', err);
        }
        // Always redirect to the Replit app after OAuth
        const replitDomain = process.env.REPLIT_DEV_DOMAIN 
          ? `https://${process.env.REPLIT_DEV_DOMAIN}`
          : 'https://8103ac6b-c2ec-453b-b704-b562d25d30d7-00-1ntd620e4kt76.spock.replit.dev';
        console.log('Google OAuth redirecting to:', `${replitDomain}/dashboard`);
        res.redirect(`${replitDomain}/dashboard`);
      });
    }
  );

  // Microsoft OAuth routes
  app.get("/api/auth/microsoft", passport.authenticate("microsoft", {
    scope: ['user.read']
  }));

  app.get("/api/auth/microsoft/callback",
    passport.authenticate("microsoft", {
      failureRedirect: "/?error=microsoft_auth_failed"
    }),
    async (req, res) => {
      // Successful authentication
      console.log('Microsoft OAuth successful for user:', req.user);
      
      // Send login confirmation email
      if (req.user) {
        const user = req.user as User;
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        const emailResult = await sendLoginConfirmationEmail({
          email: user.email,
          fullName: user.fullName,
          loginTime: new Date(),
          ipAddress: ipAddress as string
        });
        
        if (!emailResult.success) {
          console.error('Failed to send Microsoft OAuth login confirmation email:', emailResult.error);
        }
      }
      
      // Ensure session is saved before redirecting
      req.session.save((err) => {
        if (err) {
          console.error('Failed to save session after Microsoft OAuth:', err);
        }
        // Always redirect to the Replit app after OAuth
        const replitDomain = process.env.REPLIT_DEV_DOMAIN 
          ? `https://${process.env.REPLIT_DEV_DOMAIN}`
          : 'https://8103ac6b-c2ec-453b-b704-b562d25d30d7-00-1ntd620e4kt76.spock.replit.dev';
        console.log('Microsoft OAuth redirecting to:', `${replitDomain}/dashboard`);
        res.redirect(`${replitDomain}/dashboard`);
      });
    }
  );

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user route
  app.get("/api/auth/me", (req, res) => {
    // Debug logging for production
    console.log("Auth check - Headers:", req.headers);
    console.log("Auth check - Cookie header:", req.headers.cookie);
    console.log("Auth check - Session ID:", req.sessionID);
    console.log("Auth check - User:", req.user);
    
    if (req.user) {
      const { password, ...userWithoutPassword } = req.user as any;
      res.json({ user: userWithoutPassword });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
