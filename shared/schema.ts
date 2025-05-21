import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  preferences: jsonb("preferences"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Property Model
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // Office, Retail, Mixed-Use
  size: integer("size").notNull(), // Square footage
  description: text("description"),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("active"), // active, pending, archived
  visualizationProgress: integer("visualization_progress").notNull().default(0), // Percentage complete
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

// Project Model
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(), // active, completed, pending
  progress: integer("progress").notNull().default(0), // Percentage complete
  budget: integer("budget"),
  roi: text("roi"),
  timeSaved: integer("time_saved"),
  designChanges: integer("design_changes"),
  estimatedCompletion: text("estimated_completion"),
  propertyId: integer("property_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

// 3D Model
export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  propertyId: integer("property_id").notNull(),
  userId: integer("user_id").notNull(),
  modelData: jsonb("model_data"), // Store Three.js model data
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertModelSchema = createInsertSchema(models).omit({
  id: true,
  createdAt: true,
});

// Team Members (for project teams)
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  imageUrl: text("image_url"),
  projectId: integer("project_id").notNull(),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

// Timeline Events
export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  completed: boolean("completed").notNull().default(false),
  projectId: integer("project_id"),
  userId: integer("user_id").notNull(),
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({
  id: true,
});

// Types for Typescript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Model = typeof models.$inferSelect;
export type InsertModel = z.infer<typeof insertModelSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;

// Stats object for dashboard
export interface Stats {
  activeProperties: number;
  models3d: number;
  activeProjects: number;
  clientPresentations: number;
}
