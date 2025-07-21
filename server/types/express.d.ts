import { User as DBUser } from '../storage';

declare global {
  namespace Express {
    interface User extends DBUser {}
  }
}

export {};