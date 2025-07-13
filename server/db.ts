import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Initializing database connection...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10
});

export const db = drizzle({ client: pool, schema });

// Test database connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Test the connection immediately
async function testConnection() {
  try {
    console.log("Testing database connection...");
    const result = await pool.query('SELECT 1 as test');
    console.log("Database connection test successful:", result.rows[0]);
  } catch (error) {
    console.error("Database connection test failed:", error);
  }
}

testConnection();