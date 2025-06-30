import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { storage } from './storage';
import type { User } from '../shared/schema';

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user || false);
  } catch (error) {
    done(error, false);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
    
    if (existingUser) {
      return done(null, existingUser);
    }
    
    // Create new user
    const newUser = await storage.createUser({
      email: profile.emails?.[0]?.value || '',
      fullName: profile.displayName || '',
      username: profile.emails?.[0]?.value || '',
      password: '' // OAuth users don't need passwords
    });
    
    return done(null, newUser);
  } catch (error) {
    return done(error, false);
  }
}));

// Microsoft OAuth Strategy
passport.use(new MicrosoftStrategy({
  clientID: process.env.MICROSOFT_CLIENT_ID!,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
  callbackURL: `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/microsoft/callback`,
  scope: ['user.read']
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
    
    if (existingUser) {
      return done(null, existingUser);
    }
    
    // Create new user
    const newUser = await storage.createUser({
      email: profile.emails?.[0]?.value || '',
      fullName: profile.displayName || '',
      username: profile.emails?.[0]?.value || '',
      password: '' // OAuth users don't need passwords
    });
    
    return done(null, newUser);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;