import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import crypto from "crypto";

import passport from "./passport";
import { storage } from "./storage";
import { insertWaitlistSchema, insertContactSchema, insertUserSchema, loginSchema, type User } from "@shared/schema";
import { sendWelcomeEmail, sendContactEmail, sendVerificationEmail } from "./emailService";
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

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Create user with verification token (in production, hash the password)
      const user = await storage.createUser({
        ...validatedData,
        emailVerified: false
      });
      
      // Update user with verification token
      await storage.updateUserVerification(user.email, verificationToken);
      
      // Send verification email
      await sendVerificationEmail({
        email: user.email,
        fullName: user.fullName,
        verificationToken
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        message: "Account created successfully. Please check your email to verify your account.",
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
        return res.status(403).json({ 
          message: "Please verify your email address before logging in. Check your inbox for the verification email." 
        });
      }

      // Login user with passport (creates session)
      req.login(user, (err) => {
        if (err) {
          console.error('Session login error:', err);
          return res.status(500).json({ message: "Login failed" });
        }
        
        // Log session details for debugging
        console.log('Login successful for user:', user.email);
        console.log('Session ID:', req.sessionID);
        console.log('Session user:', req.user);
        
        // Save session to ensure cookie is set
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
            return res.status(500).json({ message: "Session save failed" });
          }
          
          console.log('Session saved successfully, session ID:', req.sessionID);
          console.log('Session cookie:', req.session.cookie);
          
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

      // Redirect to success page on the production domain
      const productionDomain = process.env.PRODUCTION_DOMAIN || 'https://contramind.ai';
      res.redirect(`${productionDomain}/user-dashboard?verified=true`);
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
      const user = req.user as User;
      console.log('Google OAuth successful for user:', user.email);
      
      // Check if email is verified
      if (!user.emailVerified) {
        // Redirect to a page informing them to verify email
        const productionDomain = process.env.PRODUCTION_DOMAIN || 'https://contramind.ai';
        return res.redirect(`${productionDomain}/?message=verify-email`);
      }
      
      // Ensure session is saved before redirecting
      req.session.save((err) => {
        if (err) {
          console.error('Failed to save session after Google OAuth:', err);
        }
        // Always redirect to the production domain after OAuth
        const productionDomain = process.env.PRODUCTION_DOMAIN || 'https://contramind.ai';
        console.log('Google OAuth redirecting to:', `${productionDomain}/user-dashboard`);
        res.redirect(`${productionDomain}/user-dashboard`);
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
      const user = req.user as User;
      console.log('Microsoft OAuth successful for user:', user.email);
      
      // Check if email is verified
      if (!user.emailVerified) {
        // Redirect to a page informing them to verify email
        const productionDomain = process.env.PRODUCTION_DOMAIN || 'https://contramind.ai';
        return res.redirect(`${productionDomain}/?message=verify-email`);
      }
      
      // Ensure session is saved before redirecting
      req.session.save((err) => {
        if (err) {
          console.error('Failed to save session after Microsoft OAuth:', err);
        }
        // Always redirect to the production domain after OAuth
        const productionDomain = process.env.PRODUCTION_DOMAIN || 'https://contramind.ai';
        console.log('Microsoft OAuth redirecting to:', `${productionDomain}/user-dashboard`);
        res.redirect(`${productionDomain}/user-dashboard`);
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
    console.log("Auth check - Session data:", req.session);
    console.log("Auth check - User from req.user:", req.user);
    console.log("Auth check - Passport session:", (req.session as any).passport);
    
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
