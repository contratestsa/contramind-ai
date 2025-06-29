import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { storage } from './storage';
import type { User } from '@shared/schema';

// Configure passport serialization
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user || false);
  } catch (error) {
    done(error, false);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value || '';
      if (!email) {
        return done(new Error('No email provided by Google'), false);
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser) {
        return done(null, existingUser);
      }

      // Create new user
      const newUser = await storage.createUser({
        email: email,
        username: email.split('@')[0] || profile.id,
        fullName: profile.displayName || '',
        password: '' // OAuth users don't need password
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, false);
    }
  }));
}

// Microsoft OAuth Strategy
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: "/api/auth/microsoft/callback",
    scope: ['user.read']
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value || '';
      if (!email) {
        return done(new Error('No email provided by Microsoft'), false);
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser) {
        return done(null, existingUser);
      }

      // Create new user
      const newUser = await storage.createUser({
        email: email,
        username: email.split('@')[0] || profile.id,
        fullName: profile.displayName || '',
        password: '' // OAuth users don't need password
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, false);
    }
  }));
}

export default passport;