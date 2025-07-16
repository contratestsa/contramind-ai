import express from "express";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import routes from "./routes";
import setupVite from "./vite";
import { db } from "./db";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// API routes
app.use(routes);

const server = createServer(app);

(async () => {
  // Test database connection
  try {
    console.log("Initializing Alibaba Cloud ApsaraDB connection...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

    console.log("Testing Alibaba Cloud ApsaraDB connection...");
    await db.execute("SELECT 1 as test");
    console.log("Connected to Alibaba Cloud ApsaraDB successfully");

    const result = await db.execute("SELECT 1 as test");
    console.log("ApsaraDB connection test successful:", result);

    const versionResult = await db.execute("SELECT version()");
    console.log("PostgreSQL version:", versionResult[0]);
  } catch (error) {
    console.error("Database connection failed:", error);
  }

  const port = Number(process.env.PORT) || 5000;
  const isProduction = process.env.REPLIT_DEPLOYMENT === "1";

  // Set up Vite in development, serve static files in production
  if (isProduction) {
    app.use(express.static(join(__dirname, "public")));
    app.get("*", (req, res) => {
      res.sendFile(join(__dirname, "public", "index.html"));
    });
  } else {
    await setupVite(app, server);
  }

  server.listen(port, "0.0.0.0", () => {
    if (isProduction) {
      console.log(`🚀 Production server running on port ${port}`);
    } else {
      console.log(`🚧 Development server running on port ${port}`);
    }
  });
})();