import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users).omit({ id: true });

// Property Model
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  description: text("description"),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("active"),
  visualizationProgress: integer("visualization_progress").notNull().default(0),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({ id: true, createdAt: true });

// Project Model
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(),
  progress: integer("progress").notNull().default(0),
  budget: integer("budget"),
  roi: text("roi"),
  timeSaved: integer("time_saved"),
  designChanges: integer("design_changes"),
  estimatedCompletion: text("estimated_completion"),
  propertyId: integer("property_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });

// 3D Model
export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  propertyId: integer("property_id").notNull(),
  userId: integer("user_id").notNull(),
  modelData: jsonb("model_data"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertModelSchema = createInsertSchema(models).omit({ id: true, createdAt: true });

// Team Members
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  imageUrl: text("image_url"),
  projectId: integer("project_id").notNull(),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });

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

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({ id: true });

// ── NEW TABLES ──────────────────────────────────────────────────────────────

// Leads (CRM)
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  status: text("status").notNull().default("new"), // new, contacted, qualified, proposal, closed_won, closed_lost
  source: text("source"), // website, referral, mls, open_house, direct
  propertyId: integer("property_id"),
  notes: text("notes"),
  userId: integer("user_id").notNull(),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true });

// Deals (Pipeline)
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  propertyId: integer("property_id"),
  leadId: integer("lead_id"),
  stage: text("stage").notNull().default("prospect"), // prospect, loi, due_diligence, negotiation, closed_won, closed_lost
  value: integer("value"),
  probability: integer("probability").default(0),
  notes: text("notes"),
  userId: integer("user_id").notNull(),
  expectedCloseDate: text("expected_close_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDealSchema = createInsertSchema(deals).omit({ id: true, createdAt: true });

// Offers
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  dealId: integer("deal_id"),
  buyerName: text("buyer_name").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, countered, rejected
  expiresAt: text("expires_at"),
  terms: text("terms"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOfferSchema = createInsertSchema(offers).omit({ id: true, createdAt: true });

// Documents (Vault)
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // lease, survey, environmental, floor_plan, loi, nda, other
  propertyId: integer("property_id"),
  projectId: integer("project_id"),
  url: text("url"),
  fileSize: text("file_size"),
  signatureStatus: text("signature_status").default("none"), // none, pending, signed
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true });

// Open House Sessions (Live Virtual)
export const openHouseSessions = pgTable("open_house_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  propertyId: integer("property_id").notNull(),
  hostId: integer("host_id").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  status: text("status").notNull().default("scheduled"), // scheduled, live, completed, cancelled
  attendeeCount: integer("attendee_count").default(0),
  maxAttendees: integer("max_attendees").default(50),
  recordingUrl: text("recording_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOpenHouseSessionSchema = createInsertSchema(openHouseSessions).omit({ id: true, createdAt: true });

// Subscriptions (Billing)
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  plan: text("plan").notNull().default("starter"), // starter, professional, enterprise
  status: text("status").notNull().default("active"), // active, cancelled, past_due, trialing
  currentPeriodEnd: text("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true });

// Calendar Events
export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  eventType: text("event_type").notNull().default("tour"), // tour, meeting, open_house, inspection, call
  propertyId: integer("property_id"),
  leadId: integer("lead_id"),
  attendees: jsonb("attendees"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({ id: true, createdAt: true });

// Tour Annotations
export const tourAnnotations = pgTable("tour_annotations", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  userId: integer("user_id").notNull(),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  roomLabel: text("room_label"),
  xPos: real("x_pos"),
  yPos: real("y_pos"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTourAnnotationSchema = createInsertSchema(tourAnnotations).omit({ id: true, createdAt: true });

// ── TYPES ────────────────────────────────────────────────────────────────────

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

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type OpenHouseSession = typeof openHouseSessions.$inferSelect;
export type InsertOpenHouseSession = z.infer<typeof insertOpenHouseSessionSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;

export type TourAnnotation = typeof tourAnnotations.$inferSelect;
export type InsertTourAnnotation = z.infer<typeof insertTourAnnotationSchema>;

// Stats object for dashboard
export interface Stats {
  activeProperties: number;
  models3d: number;
  activeProjects: number;
  clientPresentations: number;
}
