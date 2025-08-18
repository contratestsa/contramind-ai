import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader, TokenPayload } from './jwt';
import { storage } from './storage';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      token?: string;
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = verifyAccessToken(token);
    
    // Verify user still exists
    const user = await storage.getUser(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof Error && error.message.includes('expired')) {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

/**
 * Optional authentication middleware - doesn't fail if no token is present
 */
export async function optionalAuthentication(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await storage.getUser(decoded.id);
      if (user) {
        req.user = decoded;
        req.token = token;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}