import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

// Check for Alibaba Cloud ApsaraDB connection URL
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please provide your Alibaba Cloud ApsaraDB connection string.",
  );
}

console.log("Initializing Alibaba Cloud ApsaraDB connection...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

// Configure connection pool for Alibaba Cloud ApsaraDB
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
  // Add SSL configuration if required by Alibaba Cloud
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const db = drizzle(pool, { schema });

// Test database connection
pool.on('connect', () => {
  console.log('Connected to Alibaba Cloud ApsaraDB successfully');
});

pool.on('error', (err) => {
  console.error('Alibaba Cloud ApsaraDB connection error:', err);
});

// Test the connection immediately
async function testConnection() {
  try {
    console.log("Testing Alibaba Cloud ApsaraDB connection...");
    const result = await pool.query('SELECT 1 as test');
    console.log("ApsaraDB connection test successful:", result.rows[0]);
    
    // Test PostgreSQL version
    const versionResult = await pool.query('SELECT version()');
    console.log("PostgreSQL version:", versionResult.rows[0].version);
  } catch (error) {
    console.error("ApsaraDB connection test failed:", error);
  }
}

testConnection();