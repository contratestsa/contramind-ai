import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { storage } from "./storage";
import { User } from "../shared/schema";

// Serialize user for session storage
passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user.id, user.email);
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  console.log("Deserializing user with ID:", id);
  try {
    const user = await storage.getUser(id);
    console.log("Deserialized user:", user ? user.email : "not found");
    done(null, user);
  } catch (error) {
    console.error("Deserialize error:", error);
    done(error, null);
  }
});

// Local Strategy for email/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        // Find user by email
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Check password (in production, compare hashed passwords)
        if (user.password !== password) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Skip email verification check for now

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Get the correct base URL for Replit
  const baseUrl = process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : "http://localhost:5000";

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${baseUrl}/api/auth/google/callback`,
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
          console.log("Google OAuth profile:", {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            photos: profile.photos,
          });

          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(
              new Error("No email found in Google profile"),
              undefined,
            );
          }

          // Get profile picture URL
          const profilePicture = profile.photos?.[0]?.value;

          // Check if user already exists
          let user = await storage.getUserByEmail(email);

          if (user) {
            console.log("Existing user found:", user.email);
            // Update profile picture if available
            if (profilePicture && profilePicture !== user.profilePicture) {
              await storage.updateUserProfilePicture(user.id, profilePicture);
            }
            return done(null, user);
          }

          // Create new user (OAuth providers already verify emails)
          const newUser = await storage.createUser({
            email: email,
            username: email, // Use email as username
            fullName: profile.displayName || "Google User",
            password: "oauth_google_" + profile.id, // OAuth users get a special password
            profilePicture: profilePicture || undefined,
          });

          // Mark email as verified for OAuth users (since OAuth providers verify emails)
          await storage.verifyUserEmailByEmail(email);

          console.log("New Google user created:", newUser.email);
          return done(null, newUser);
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error, undefined);
        }
      },
    ),
  );
}

// Microsoft OAuth Strategy
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  // Get the correct base URL for Replit (reuse the same baseUrl)
  const baseUrl = process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : "http://localhost:5000";

  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: `${baseUrl}/api/auth/microsoft/callback`,
        scope: ["user.read"],
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
          console.log("Microsoft OAuth profile:", {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            photos: profile.photos,
          });

          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(
              new Error("No email found in Microsoft profile"),
              undefined,
            );
          }

          // Get profile picture URL
          const profilePicture = profile.photos?.[0]?.value;

          // Check if user already exists
          let user = await storage.getUserByEmail(email);

          if (user) {
            console.log("Existing user found:", user.email);
            // Update profile picture if available
            if (profilePicture && profilePicture !== user.profilePicture) {
              await storage.updateUserProfilePicture(user.id, profilePicture);
            }
            return done(null, user);
          }

          // Create new user (OAuth providers already verify emails)
          const newUser = await storage.createUser({
            email: email,
            username: email, // Use email as username
            fullName: profile.displayName || "Microsoft User",
            password: "oauth_microsoft_" + profile.id, // OAuth users get a special password
            profilePicture: profilePicture || undefined,
          });

          // Mark email as verified for OAuth users (since OAuth providers verify emails)
          await storage.verifyUserEmailByEmail(email);

          console.log("New Microsoft user created:", newUser.email);
          return done(null, newUser);
        } catch (error) {
          console.error("Microsoft OAuth error:", error);
          return done(error, undefined);
        }
      },
    ),
  );
}

export default passport;
