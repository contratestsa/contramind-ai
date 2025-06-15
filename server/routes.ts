import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Disabled waitlist endpoints to remove email dependencies
  app.post("/api/waitlist", async (req, res) => {
    res.json({ success: true, message: "Waitlist functionality temporarily disabled" });
  });

  app.get("/api/waitlist/count", async (req, res) => {
    res.json({ count: 0 });
  });

  app.get("/api/waitlist", async (req, res) => {
    res.json({ entries: [] });
  });

  const httpServer = createServer(app);
  return httpServer;
}
