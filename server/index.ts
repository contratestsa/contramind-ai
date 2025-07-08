import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "./passport";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { pool } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust proxy for production (needed for secure cookies behind reverse proxy)
const isProduction = process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYED_DOMAIN !== undefined;
if (isProduction) {
  app.set('trust proxy', 1); // Trust first proxy
}

// Session configuration for OAuth
// Debug logging for production
if (isProduction) {
  console.log('Running in production mode - cookies will be secure and sameSite=none');
  console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
}

// Use PostgreSQL session store in production
const PgSession = connectPgSimple(session);

const sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  name: 'contramind_session', // Custom session name
  cookie: {
    secure: true, // Always use secure cookies in HTTPS environment
    httpOnly: true,
    sameSite: 'none', // Required for cross-origin cookies with secure=true
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // Don't set domain - let browser handle it per request
  }
};

// Use PostgreSQL store in production for session persistence
if (isProduction) {
  sessionConfig.store = new PgSession({
    pool: pool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  });
}

const sessionMiddleware = session(sessionConfig);

app.use(sessionMiddleware);

// CORS configuration for authentication
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://contramind.ai',
    'https://ai-language-bridge-ceo-ContraMind.replit.app',
    'http://localhost:5173',
    'http://localhost:5000'
  ];
  
  // Add current Replit dev domain if present
  if (process.env.REPLIT_DEV_DOMAIN) {
    allowedOrigins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
  }
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT) || 5000;
  
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`, "express");
  });
})();
