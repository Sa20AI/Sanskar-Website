import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertContactSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull(),
});

export const insertCertificateSchema = createInsertSchema(certificates).pick({
  title: true,
  issuer: true,
  date: true,
  description: true,
  credentialId: true,
  credentialUrl: true,
  imageUrl: true,
});

export const profileSummary = pgTable("profile_summary", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  headline: text("headline").notNull(),
  resumeUrl: text("resume_url"),
  updatedAt: text("updated_at").notNull(),
});

export const insertProfileSummarySchema = createInsertSchema(profileSummary).pick({
  title: true,
  bio: true,
  headline: true,
  resumeUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;

export type InsertProfileSummary = z.infer<typeof insertProfileSummarySchema>;
export type ProfileSummary = typeof profileSummary.$inferSelect;
