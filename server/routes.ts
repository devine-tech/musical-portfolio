import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get content items by type
  app.get("/api/content/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const items = await storage.getContentItems(type);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content items" });
    }
  });

  // Get all content items
  app.get("/api/content", async (_req, res) => {
    try {
      const items = await storage.getContentItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content items" });
    }
  });
  
  // Submit contact form message
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = insertMessageSchema.parse(req.body);
      
      // Simple email validation
      const emailSchema = z.string().email();
      emailSchema.parse(validatedData.email);
      
      // Create a new message
      const newMessage = await storage.createMessage(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Your message has been sent successfully!" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send message" 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
