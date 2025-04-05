import { 
  users, 
  contactMessages,
  certificates,
  profileSummary,
  type User, 
  type InsertUser, 
  type ContactMessage, 
  type InsertContact,
  type Certificate,
  type InsertCertificate,
  type ProfileSummary,
  type InsertProfileSummary
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContact): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Certificate methods
  getCertificates(): Promise<Certificate[]>;
  getCertificate(id: number): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  updateCertificate(id: number, certificate: Partial<InsertCertificate>): Promise<Certificate | undefined>;
  deleteCertificate(id: number): Promise<boolean>;
  
  // Profile summary methods
  getProfileSummary(): Promise<ProfileSummary | undefined>;
  createProfileSummary(summary: InsertProfileSummary): Promise<ProfileSummary>;
  updateProfileSummary(id: number, summary: Partial<InsertProfileSummary>): Promise<ProfileSummary | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Contact messages methods
  async createContactMessage(message: InsertContact): Promise<ContactMessage> {
    const createdAt = new Date().toISOString();
    const [contactMessage] = await db
      .insert(contactMessages)
      .values({
        ...message,
        createdAt
      })
      .returning();
    
    return contactMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
  
  // Certificate methods
  async getCertificates(): Promise<Certificate[]> {
    return db.select().from(certificates).orderBy(desc(certificates.createdAt));
  }
  
  async getCertificate(id: number): Promise<Certificate | undefined> {
    const [certificate] = await db.select().from(certificates).where(eq(certificates.id, id));
    return certificate;
  }
  
  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const createdAt = new Date().toISOString();
    const [newCertificate] = await db
      .insert(certificates)
      .values({
        ...certificate,
        createdAt
      })
      .returning();
    
    return newCertificate;
  }
  
  async updateCertificate(id: number, cert: Partial<InsertCertificate>): Promise<Certificate | undefined> {
    const [updatedCertificate] = await db
      .update(certificates)
      .set(cert)
      .where(eq(certificates.id, id))
      .returning();
    
    return updatedCertificate;
  }
  
  async deleteCertificate(id: number): Promise<boolean> {
    const deleted = await db
      .delete(certificates)
      .where(eq(certificates.id, id))
      .returning();
    
    return deleted.length > 0;
  }
  
  // Profile summary methods
  async getProfileSummary(): Promise<ProfileSummary | undefined> {
    const profiles = await db.select().from(profileSummary);
    return profiles.length > 0 ? profiles[0] : undefined;
  }
  
  async createProfileSummary(summary: InsertProfileSummary): Promise<ProfileSummary> {
    const updatedAt = new Date().toISOString();
    const [newProfile] = await db
      .insert(profileSummary)
      .values({
        ...summary,
        updatedAt
      })
      .returning();
    
    return newProfile;
  }
  
  async updateProfileSummary(id: number, summary: Partial<InsertProfileSummary>): Promise<ProfileSummary | undefined> {
    const updatedAt = new Date().toISOString();
    const [updatedProfile] = await db
      .update(profileSummary)
      .set({
        ...summary,
        updatedAt
      })
      .where(eq(profileSummary.id, id))
      .returning();
    
    return updatedProfile;
  }
  
  // Initialize the database with default data if needed
  async initialize(): Promise<void> {
    // Check if there's already a profile
    const profile = await this.getProfileSummary();
    
    // If no profile exists, create a default one
    if (!profile) {
      await this.createProfileSummary({
        title: "Sanskar Unkule",
        bio: "I specialize in developing and refining prompt structures to improve AI model accuracy and reliability, with expertise in RLHF, LLM optimization, and data annotation.",
        headline: "Prompt Engineer & AI Specialist",
        resumeUrl: "/attached_assets/Sanskar_Resume.pdf"
      });
    }
  }
}

export const storage = new DatabaseStorage();
