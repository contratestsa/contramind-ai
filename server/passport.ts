import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { storage } from './storage';
import { User } from '../shared/schema';
import crypto from 'crypto';
import { sendVerificationEmail } from './emailService';


// Serialize user for session storage
passport.serializeUser((user: any, done) => {
  console.log('Serializing user:', user.id, user.email);
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    console.log('Deserializing user ID:', id);
    const user = await storage.getUser(id);
    console.log('Found user:', user?.email);
    done(null, user);
  } catch (error) {
    console.error('Deserialize error:', error);
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Use production domain for OAuth
  const baseUrl = process.env.PRODUCTION_DOMAIN || process.env.REPLIT_DEPLOYED_DOMAIN || 'https://contramind.ai';
    
  console.log('OAuth Base URL:', baseUrl);
  console.log('Google Callback URL:', `${baseUrl}/api/auth/google/callback`);
    
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${baseUrl}/api/auth/google/callback`
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      console.log('Google OAuth profile:', {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName
      });

      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in Google profile'), undefined);
      }

      // Check if user already exists
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        console.log('Existing user found:', user.email);
        return done(null, user);
      }

      // Generate verification token for new OAuth user
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Create new user without auto-verifying email
      const newUser = await storage.createUser({
        email: email,
        username: email, // Use email as username
        fullName: profile.displayName || 'Google User',
        password: 'oauth_google_' + profile.id, // OAuth users get a special password
        emailVerified: false
      });
      
      // Update user with verification token
      await storage.updateUserVerification(email, verificationToken);
      
      // Send verification email
      await sendVerificationEmail({
        email: email,
        fullName: profile.displayName || 'Google User',
        verificationToken
      });

      console.log('New Google user created, verification email sent:', newUser.email);
      return done(null, newUser);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, undefined);
    }
  }));
}

// Microsoft OAuth Strategy
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  // Use production domain for OAuth
  const baseUrl = process.env.PRODUCTION_DOMAIN || process.env.REPLIT_DEPLOYED_DOMAIN || 'https://contramind.ai';
    
  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: `${baseUrl}/api/auth/microsoft/callback`,
    scope: ['user.read']
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      console.log('Microsoft OAuth profile:', {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName
      });

      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in Microsoft profile'), undefined);
      }

      // Check if user already exists
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        console.log('Existing user found:', user.email);
        return done(null, user);
      }

      // Generate verification token for new OAuth user
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Create new user without auto-verifying email
      const newUser = await storage.createUser({
        email: email,
        username: email, // Use email as username
        fullName: profile.displayName || 'Microsoft User',
        password: 'oauth_microsoft_' + profile.id, // OAuth users get a special password
        emailVerified: false
      });
      
      // Update user with verification token
      await storage.updateUserVerification(email, verificationToken);
      
      // Send verification email
      await sendVerificationEmail({
        email: email,
        fullName: profile.displayName || 'Microsoft User',
        verificationToken
      });

      console.log('New Microsoft user created, verification email sent:', newUser.email);
      return done(null, newUser);
    } catch (error) {
      console.error('Microsoft OAuth error:', error);
      return done(error, undefined);
    }
  }));
}

export default passport;