import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@shared/schema';

// JWT secret - in production, use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-change-this-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret-change-this-in-production';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export interface TokenPayload {
  id: number;
  email: string;
  username: string;
  fullName: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate JWT access and refresh tokens for a user
 */
export function generateTokens(user: User): TokenPair {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.fullName
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

/**
 * Verify and decode JWT access token
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify and decode JWT refresh token
 */
export function verifyRefreshToken(token: string): { id: number } {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { id: number };
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}