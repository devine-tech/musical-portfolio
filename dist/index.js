// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  contentItems;
  messages;
  currentUserId;
  currentContentItemId;
  currentMessageId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contentItems = /* @__PURE__ */ new Map();
    this.messages = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentContentItemId = 1;
    this.currentMessageId = 1;
    this.seedInitialContent();
  }
  seedInitialContent() {
    const initialContent = [
      {
        type: "bio",
        title: "About Me",
        content: "American vocalist with a passion for performance. My music combines traditional American sounds with contemporary influences.",
        isActive: true,
        displayOrder: 1
      },
      {
        type: "video",
        title: "Live at Nashville",
        content: "https://www.facebook.com/facebook/videos/10153231379946729/",
        isActive: true,
        displayOrder: 1
      },
      {
        type: "video",
        title: "Studio Session",
        content: "https://www.facebook.com/facebook/videos/10154659446646729/",
        isActive: true,
        displayOrder: 2
      },
      {
        type: "social",
        title: "Facebook",
        content: "https://facebook.com/vocalist",
        isActive: true,
        displayOrder: 1
      },
      {
        type: "social",
        title: "Instagram",
        content: "https://instagram.com/vocalist",
        isActive: true,
        displayOrder: 2
      },
      {
        type: "social",
        title: "YouTube",
        content: "https://youtube.com/vocalist",
        isActive: true,
        displayOrder: 3
      }
    ];
    initialContent.forEach((item) => {
      this.createContentItem({
        type: item.type,
        title: item.title,
        content: item.content,
        isActive: item.isActive,
        displayOrder: item.displayOrder
      });
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Content item methods
  async getContentItems(type) {
    const items = Array.from(this.contentItems.values());
    if (type) {
      return items.filter((item) => item.type === type && item.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return items.filter((item) => item.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
  }
  async getContentItem(id) {
    return this.contentItems.get(id);
  }
  async createContentItem(insertItem) {
    const id = this.currentContentItemId++;
    const item = { ...insertItem, id };
    this.contentItems.set(id, item);
    return item;
  }
  async updateContentItem(id, updateData) {
    const existingItem = this.contentItems.get(id);
    if (!existingItem) {
      return void 0;
    }
    const updatedItem = { ...existingItem, ...updateData };
    this.contentItems.set(id, updatedItem);
    return updatedItem;
  }
  async deleteContentItem(id) {
    return this.contentItems.delete(id);
  }
  // Contact message methods
  async getMessages() {
    return Array.from(this.messages.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  async getMessage(id) {
    return this.messages.get(id);
  }
  async createMessage(insertMessage) {
    const id = this.currentMessageId++;
    const now = /* @__PURE__ */ new Date();
    const message = {
      ...insertMessage,
      id,
      createdAt: now,
      read: false
    };
    this.messages.set(id, message);
    return message;
  }
  async markMessageAsRead(id) {
    const message = this.messages.get(id);
    if (!message) {
      return false;
    }
    message.read = true;
    this.messages.set(id, message);
    return true;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { boolean, integer } from "drizzle-orm/pg-core";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  // 'bio', 'video', 'social'
  title: text("title").notNull(),
  content: text("content").notNull(),
  // Can be text content or URLs
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0)
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  read: boolean("read").default(false).notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContentItemSchema = createInsertSchema(contentItems).pick({
  type: true,
  title: true,
  content: true,
  isActive: true,
  displayOrder: true
});
var insertMessageSchema = createInsertSchema(messages).pick({
  name: true,
  email: true,
  message: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/content/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const items = await storage.getContentItems(type);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content items" });
    }
  });
  app2.get("/api/content", async (_req, res) => {
    try {
      const items = await storage.getContentItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content items" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const emailSchema = z.string().email();
      emailSchema.parse(validatedData.email);
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
