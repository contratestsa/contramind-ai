import { Router } from "express";
import { z } from "zod";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { users, waitlistEntries, contactMessages } from "../shared/schema";
import { sendWelcomeEmail, sendContactEmail } from "./emailService";
import bcrypt from "bcryptjs";

const router = Router();

// Authentication routes
router.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db.insert(users).values({
      email,
      password: hashedPassword,
      fullName,
      emailVerified: false,
    }).returning();

    res.json({ message: "Account created successfully", user: { id: user.id, email: user.email, fullName: user.fullName } });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ 
      message: "Login successful", 
      user: { id: user.id, email: user.email, fullName: user.fullName } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add missing /api/auth/me route
router.get("/api/auth/me", async (req, res) => {
  try {
    // For now, return null user since we don't have session management
    res.json({ user: null });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Waitlist routes
router.post("/api/waitlist", async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ error: "Email and full name are required" });
    }

    const existingEntry = await db.select().from(waitlistEntries).where(eq(waitlistEntries.email, email));
    if (existingEntry.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const [entry] = await db.insert(waitlistEntries).values({
      email,
      fullName,
    }).returning();

    // Send welcome email
    try {
      const totalEntries = await db.select().from(waitlistEntries);
      const waitlistPosition = totalEntries.length;
      
      await sendWelcomeEmail({
        email,
        fullName,
        waitlistPosition
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    res.json({ message: "Successfully added to waitlist", entry });
  } catch (error) {
    console.error("Waitlist error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/waitlist/count", async (req, res) => {
  try {
    console.log("Attempting to get waitlist count...");
    console.log("Executing waitlist count query...");

    const result = await db.select().from(waitlistEntries);
    console.log("Query result:", result);

    const count = result.length;
    console.log("Waitlist count retrieved:", count);

    res.json({ count });
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Contact routes
router.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [contact] = await db.insert(contactMessages).values({
      name,
      email,
      message,
    }).returning();

    res.json({ message: "Message sent successfully", contact });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;