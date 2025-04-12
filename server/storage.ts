import { 
  users, 
  contentItems, 
  messages, 
  type User, 
  type InsertUser, 
  type ContentItem, 
  type InsertContentItem,
  type Message,
  type InsertMessage 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Content item methods
  getContentItems(type?: string): Promise<ContentItem[]>;
  getContentItem(id: number): Promise<ContentItem | undefined>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: number, item: Partial<InsertContentItem>): Promise<ContentItem | undefined>;
  deleteContentItem(id: number): Promise<boolean>;
  
  // Contact message methods
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contentItems: Map<number, ContentItem>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentContentItemId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.contentItems = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentContentItemId = 1;
    this.currentMessageId = 1;
    
    // Initialize with some sample content
    this.seedInitialContent();
  }

  private seedInitialContent() {
    // Add some initial content items for the portfolio
    const initialContent = [
      {
        type: 'bio',
        title: 'About Me',
        content: 'American vocalist with a passion for performance. My music combines traditional American sounds with contemporary influences.',
        isActive: true,
        displayOrder: 1
      },
      {
        type: 'video',
        title: 'Live at Nashville',
        content: 'https://www.facebook.com/facebook/videos/10153231379946729/',
        isActive: true,
        displayOrder: 1
      },
      {
        type: 'video',
        title: 'Studio Session',
        content: 'https://www.facebook.com/facebook/videos/10154659446646729/',
        isActive: true,
        displayOrder: 2
      },
      {
        type: 'social',
        title: 'Facebook',
        content: 'https://facebook.com/vocalist',
        isActive: true,
        displayOrder: 1
      },
      {
        type: 'social',
        title: 'Instagram',
        content: 'https://instagram.com/vocalist',
        isActive: true,
        displayOrder: 2
      },
      {
        type: 'social',
        title: 'YouTube',
        content: 'https://youtube.com/vocalist',
        isActive: true,
        displayOrder: 3
      }
    ];
    
    initialContent.forEach(item => {
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
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Content item methods
  async getContentItems(type?: string): Promise<ContentItem[]> {
    const items = Array.from(this.contentItems.values());
    
    if (type) {
      return items
        .filter(item => item.type === type && item.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder);
    }
    
    return items
      .filter(item => item.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getContentItem(id: number): Promise<ContentItem | undefined> {
    return this.contentItems.get(id);
  }

  async createContentItem(insertItem: InsertContentItem): Promise<ContentItem> {
    const id = this.currentContentItemId++;
    const item: ContentItem = { ...insertItem, id };
    this.contentItems.set(id, item);
    return item;
  }

  async updateContentItem(id: number, updateData: Partial<InsertContentItem>): Promise<ContentItem | undefined> {
    const existingItem = this.contentItems.get(id);
    
    if (!existingItem) {
      return undefined;
    }
    
    const updatedItem = { ...existingItem, ...updateData };
    this.contentItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteContentItem(id: number): Promise<boolean> {
    return this.contentItems.delete(id);
  }

  // Contact message methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values())
      .sort((a, b) => {
        // Sort by created date descending (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: now, 
      read: false 
    };
    
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const message = this.messages.get(id);
    
    if (!message) {
      return false;
    }
    
    message.read = true;
    this.messages.set(id, message);
    return true;
  }
}

export const storage = new MemStorage();
