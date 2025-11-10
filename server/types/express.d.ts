import { User as DBUser } from '../storage';

declare global {
  namespace Express {
    interface User extends DBUser {
      id: number; // Explicitly add id property for TypeScript
    }
  }
}

export {};