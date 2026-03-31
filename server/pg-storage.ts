import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, properties, projects, models, teamMembers, timelineEvents,
  leads, deals, offers, documents, openHouseSessions, subscriptions,
  calendarEvents, tourAnnotations,
  type User, type InsertUser,
  type Property, type InsertProperty,
  type Project, type InsertProject,
  type Model, type InsertModel,
  type TeamMember, type InsertTeamMember,
  type TimelineEvent, type InsertTimelineEvent,
  type Lead, type InsertLead,
  type Deal, type InsertDeal,
  type Offer, type InsertOffer,
  type Document, type InsertDocument,
  type OpenHouseSession, type InsertOpenHouseSession,
  type Subscription, type InsertSubscription,
  type CalendarEvent, type InsertCalendarEvent,
  type TourAnnotation, type InsertTourAnnotation,
  type Stats,
} from "@shared/schema";
import { IStorage } from "./storage";

export class PgStorage implements IStorage {
  constructor() {
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    try {
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) return;

      const [user] = await db.insert(users).values({
        username: "janderson",
        password: "password123",
        fullName: "John Anderson",
        email: "john@example.com",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
        preferences: {}
      }).returning();

      const propertyData = [
        { name: "Riverfront Tower", location: "Chicago, IL", type: "Office", size: 125000, description: "A prime office location with river views", userId: user.id, status: "active", visualizationProgress: 75, imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" },
        { name: "Westgate Office Park", location: "Austin, TX", type: "Mixed-Use", size: 82500, description: "Modern mixed-use development in a prime location", userId: user.id, status: "active", visualizationProgress: 45, imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" },
        { name: "Summit Plaza", location: "Denver, CO", type: "Retail", size: 95000, description: "High-end retail space in downtown Denver", userId: user.id, status: "active", visualizationProgress: 90, imageUrl: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" },
        { name: "Metropolitan Plaza", location: "Financial District, San Francisco", type: "Mixed-Use", size: 186000, description: "Iconic mixed-use development in the heart of the financial district", userId: user.id, status: "active", visualizationProgress: 75, imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" }
      ];

      const createdProperties = await db.insert(properties).values(propertyData).returning();

      const [project] = await db.insert(projects).values({
        name: "Metropolitan Plaza Development",
        description: "Mixed-use development project in San Francisco",
        userId: user.id, status: "active", progress: 75, budget: 28500000,
        roi: "12.8%", timeSaved: 38, designChanges: 24, estimatedCompletion: "Q2 2024",
        propertyId: createdProperties[3].id
      }).returning();

      await db.insert(teamMembers).values([
        { name: "Sarah Johnson", role: "Project Manager", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop", projectId: project.id },
        { name: "Michael Chen", role: "Architect", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop", projectId: project.id },
        { name: "Alicia Rodriguez", role: "3D Visualization Specialist", imageUrl: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=100&auto=format&fit=crop", projectId: project.id }
      ]);

      const now = new Date();
      const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
      const nextWeek = new Date(now); nextWeek.setDate(nextWeek.getDate() + 7);
      const twoWeeksLater = new Date(now); twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

      await db.insert(timelineEvents).values([
        { title: "3D Model Completed: Metropolitan Plaza", description: "The 3D visualization of Metropolitan Plaza has been completed and is ready for client presentation.", date: now, completed: true, projectId: project.id, userId: user.id },
        { title: "Client Presentation Scheduled", description: "Presentation for Westgate Office Park scheduled with Vertex Investments.", date: yesterday, completed: true, projectId: project.id, userId: user.id },
        { title: "AR Walkthrough Development", description: "Begin development of AR walkthrough experience for Riverfront Tower.", date: nextWeek, completed: false, projectId: project.id, userId: user.id },
        { title: "Project Kickoff: Summit Plaza Phase 2", description: "Initial planning meeting for Phase 2 expansion of Summit Plaza.", date: twoWeeksLater, completed: false, projectId: project.id, userId: user.id }
      ]);

      await db.insert(models).values([
        { name: "Metropolitan Plaza 3D Model", propertyId: createdProperties[3].id, userId: user.id, modelData: {}, status: "complete" },
        { name: "Riverfront Tower 3D Model", propertyId: createdProperties[0].id, userId: user.id, modelData: {}, status: "in_progress" }
      ]);

      // Demo leads
      await db.insert(leads).values([
        { name: "James Whitfield", email: "james@vertexcapital.com", phone: "312-555-0182", company: "Vertex Capital Group", status: "qualified", source: "referral", propertyId: createdProperties[0].id, notes: "Interested in 20,000 sqft lease. Budget approved.", userId: user.id },
        { name: "Sandra Park", email: "spark@unionproperties.com", phone: "415-555-0247", company: "Union Properties", status: "proposal", source: "mls", propertyId: createdProperties[3].id, notes: "Looking for mixed-use investment opportunity.", userId: user.id },
        { name: "Tom Kellerman", email: "tom.k@brightfuture.io", phone: "512-555-0391", company: "Bright Future LLC", status: "new", source: "website", propertyId: createdProperties[1].id, notes: "Initial inquiry via website contact form.", userId: user.id },
        { name: "Maria Santos", email: "maria@denvercommercial.com", phone: "720-555-0128", company: "Denver Commercial RE", status: "contacted", source: "open_house", propertyId: createdProperties[2].id, notes: "Met at VR open house event.", userId: user.id },
        { name: "David Cheng", email: "dcheng@pacificventures.com", phone: "415-555-0556", company: "Pacific Ventures", status: "closed_won", source: "direct", propertyId: createdProperties[3].id, notes: "Closed 5-year lease on floors 12-14.", userId: user.id },
      ]);

      // Demo deals
      await db.insert(deals).values([
        { title: "Riverfront Tower - Office Lease", propertyId: createdProperties[0].id, stage: "due_diligence", value: 4800000, probability: 70, notes: "LOI signed, reviewing lease terms", userId: user.id, expectedCloseDate: "2024-06-30" },
        { title: "Metropolitan Plaza - Mixed-Use Sale", propertyId: createdProperties[3].id, stage: "negotiation", value: 52000000, probability: 55, notes: "Counter-offer submitted", userId: user.id, expectedCloseDate: "2024-08-15" },
        { title: "Summit Plaza - Retail Anchor", propertyId: createdProperties[2].id, stage: "prospect", value: 2200000, probability: 20, notes: "Initial discussions underway", userId: user.id, expectedCloseDate: "2024-09-01" },
        { title: "Westgate - Multi-tenant Lease", propertyId: createdProperties[1].id, stage: "closed_won", value: 1850000, probability: 100, notes: "Deal closed, move-in Q2 2024", userId: user.id, expectedCloseDate: "2024-04-01" },
      ]);

      // Demo documents
      await db.insert(documents).values([
        { name: "Riverfront Tower - Floor Plan.pdf", type: "floor_plan", propertyId: createdProperties[0].id, fileSize: "4.2 MB", signatureStatus: "none", userId: user.id },
        { name: "Metropolitan Plaza - LOI Draft.docx", type: "loi", propertyId: createdProperties[3].id, fileSize: "156 KB", signatureStatus: "pending", userId: user.id },
        { name: "Summit Plaza - Environmental Report.pdf", type: "environmental", propertyId: createdProperties[2].id, fileSize: "8.7 MB", signatureStatus: "signed", userId: user.id },
        { name: "Westgate Office Park - Master Lease.pdf", type: "lease", propertyId: createdProperties[1].id, fileSize: "2.1 MB", signatureStatus: "signed", userId: user.id },
        { name: "Metropolitan Plaza - Survey 2024.pdf", type: "survey", propertyId: createdProperties[3].id, fileSize: "12.3 MB", signatureStatus: "none", userId: user.id },
      ]);

      // Demo open house sessions
      const nextMonth = new Date(now); nextMonth.setDate(nextMonth.getDate() + 30);
      const nextTwoWeeks = new Date(now); nextTwoWeeks.setDate(nextTwoWeeks.getDate() + 14);
      await db.insert(openHouseSessions).values([
        { title: "Riverfront Tower VR Open House", propertyId: createdProperties[0].id, hostId: user.id, scheduledAt: nextTwoWeeks, status: "scheduled", attendeeCount: 0, maxAttendees: 25, notes: "Focus on floor 18-22 office spaces." },
        { title: "Metropolitan Plaza Grand Tour", propertyId: createdProperties[3].id, hostId: user.id, scheduledAt: nextMonth, status: "scheduled", attendeeCount: 0, maxAttendees: 50, notes: "Full property walkthrough with Q&A." },
        { title: "Summit Plaza Retail Showcase", propertyId: createdProperties[2].id, hostId: user.id, scheduledAt: yesterday, status: "completed", attendeeCount: 18, maxAttendees: 30, notes: "Completed successfully." },
      ]);

      // Demo subscription
      await db.insert(subscriptions).values([
        { userId: user.id, plan: "professional", status: "active", currentPeriodEnd: "2024-12-31", cancelAtPeriodEnd: false }
      ]);

      // Demo calendar events
      await db.insert(calendarEvents).values([
        { title: "Property Tour - Vertex Capital", description: "VR tour of Riverfront Tower floors 18-22", startTime: nextWeek, eventType: "tour", propertyId: createdProperties[0].id, attendees: ["james@vertexcapital.com"], userId: user.id },
        { title: "Lease Negotiation Call", description: "Review counter-offer terms for Metropolitan Plaza", startTime: twoWeeksLater, eventType: "meeting", propertyId: createdProperties[3].id, attendees: ["spark@unionproperties.com"], userId: user.id },
        { title: "Summit Plaza Open House", description: "Virtual open house for retail anchor prospects", startTime: nextMonth, eventType: "open_house", propertyId: createdProperties[2].id, attendees: [], userId: user.id },
      ]);

    } catch (error) {
      console.error("Error initializing demo data:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async updateUserPreferences(id: number, preferences: any): Promise<User | undefined> {
    const [updated] = await db.update(users).set({ preferences }).where(eq(users.id, id)).returning();
    return updated;
  }

  // Property operations
  async getProperties(userId: number): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.userId, userId));
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
    return result[0];
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [created] = await db.insert(properties).values(property).returning();
    return created;
  }

  async updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined> {
    const [updated] = await db.update(properties).set(property).where(eq(properties.id, id)).returning();
    return updated;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Project operations
  async getProjects(userId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async getProjectsByPropertyId(propertyId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.propertyId, propertyId));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: number, project: Partial<Project>): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // 3D Model operations
  async getModels(userId: number): Promise<Model[]> {
    return await db.select().from(models).where(eq(models.userId, userId));
  }

  async getModel(id: number): Promise<Model | undefined> {
    const result = await db.select().from(models).where(eq(models.id, id)).limit(1);
    return result[0];
  }

  async getModelsByPropertyId(propertyId: number): Promise<Model[]> {
    return await db.select().from(models).where(eq(models.propertyId, propertyId));
  }

  async createModel(model: InsertModel): Promise<Model> {
    const [created] = await db.insert(models).values(model).returning();
    return created;
  }

  async updateModel(id: number, model: Partial<Model>): Promise<Model | undefined> {
    const [updated] = await db.update(models).set(model).where(eq(models.id, id)).returning();
    return updated;
  }

  async deleteModel(id: number): Promise<boolean> {
    const result = await db.delete(models).where(eq(models.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Team member operations
  async getTeamMembers(projectId: number): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.projectId, projectId));
  }

  async createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    const [created] = await db.insert(teamMembers).values(teamMember).returning();
    return created;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    const result = await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Timeline event operations
  async getTimelineEvents(userId: number, limit?: number): Promise<TimelineEvent[]> {
    let query = db.select().from(timelineEvents).where(eq(timelineEvents.userId, userId)).orderBy(desc(timelineEvents.date));
    if (limit) query = query.limit(limit);
    return await query;
  }

  async getProjectTimelineEvents(projectId: number): Promise<TimelineEvent[]> {
    return await db.select().from(timelineEvents).where(eq(timelineEvents.projectId, projectId)).orderBy(desc(timelineEvents.date));
  }

  async createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent> {
    const [created] = await db.insert(timelineEvents).values(event).returning();
    return created;
  }

  async updateTimelineEvent(id: number, event: Partial<TimelineEvent>): Promise<TimelineEvent | undefined> {
    const [updated] = await db.update(timelineEvents).set(event).where(eq(timelineEvents.id, id)).returning();
    return updated;
  }

  async deleteTimelineEvent(id: number): Promise<boolean> {
    const result = await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Lead operations
  async getLeads(userId: number): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.userId, userId)).orderBy(desc(leads.createdAt));
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return result[0];
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [created] = await db.insert(leads).values(lead).returning();
    return created;
  }

  async updateLead(id: number, lead: Partial<Lead>): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set(lead).where(eq(leads.id, id)).returning();
    return updated;
  }

  async deleteLead(id: number): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Deal operations
  async getDeals(userId: number): Promise<Deal[]> {
    return await db.select().from(deals).where(eq(deals.userId, userId)).orderBy(desc(deals.createdAt));
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    const result = await db.select().from(deals).where(eq(deals.id, id)).limit(1);
    return result[0];
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const [created] = await db.insert(deals).values(deal).returning();
    return created;
  }

  async updateDeal(id: number, deal: Partial<Deal>): Promise<Deal | undefined> {
    const [updated] = await db.update(deals).set(deal).where(eq(deals.id, id)).returning();
    return updated;
  }

  async deleteDeal(id: number): Promise<boolean> {
    const result = await db.delete(deals).where(eq(deals.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Offer operations
  async getOffers(userId: number): Promise<Offer[]> {
    return await db.select().from(offers).where(eq(offers.userId, userId)).orderBy(desc(offers.createdAt));
  }

  async getOffersByPropertyId(propertyId: number): Promise<Offer[]> {
    return await db.select().from(offers).where(eq(offers.propertyId, propertyId)).orderBy(desc(offers.createdAt));
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const [created] = await db.insert(offers).values(offer).returning();
    return created;
  }

  async updateOffer(id: number, offer: Partial<Offer>): Promise<Offer | undefined> {
    const [updated] = await db.update(offers).set(offer).where(eq(offers.id, id)).returning();
    return updated;
  }

  async deleteOffer(id: number): Promise<boolean> {
    const result = await db.delete(offers).where(eq(offers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Document operations
  async getDocuments(userId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.createdAt));
  }

  async getDocumentsByPropertyId(propertyId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.propertyId, propertyId)).orderBy(desc(documents.createdAt));
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [created] = await db.insert(documents).values(doc).returning();
    return created;
  }

  async updateDocument(id: number, doc: Partial<Document>): Promise<Document | undefined> {
    const [updated] = await db.update(documents).set(doc).where(eq(documents.id, id)).returning();
    return updated;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Open House Session operations
  async getOpenHouseSessions(userId: number): Promise<OpenHouseSession[]> {
    return await db.select().from(openHouseSessions).where(eq(openHouseSessions.hostId, userId)).orderBy(desc(openHouseSessions.createdAt));
  }

  async getOpenHouseSession(id: number): Promise<OpenHouseSession | undefined> {
    const result = await db.select().from(openHouseSessions).where(eq(openHouseSessions.id, id)).limit(1);
    return result[0];
  }

  async createOpenHouseSession(session: InsertOpenHouseSession): Promise<OpenHouseSession> {
    const [created] = await db.insert(openHouseSessions).values(session).returning();
    return created;
  }

  async updateOpenHouseSession(id: number, session: Partial<OpenHouseSession>): Promise<OpenHouseSession | undefined> {
    const [updated] = await db.update(openHouseSessions).set(session).where(eq(openHouseSessions.id, id)).returning();
    return updated;
  }

  async deleteOpenHouseSession(id: number): Promise<boolean> {
    const result = await db.delete(openHouseSessions).where(eq(openHouseSessions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Subscription operations
  async getSubscription(userId: number): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
    return result[0];
  }

  async createSubscription(sub: InsertSubscription): Promise<Subscription> {
    const [created] = await db.insert(subscriptions).values(sub).returning();
    return created;
  }

  async updateSubscription(userId: number, sub: Partial<Subscription>): Promise<Subscription | undefined> {
    const [updated] = await db.update(subscriptions).set(sub).where(eq(subscriptions.userId, userId)).returning();
    return updated;
  }

  // Calendar event operations
  async getCalendarEvents(userId: number): Promise<CalendarEvent[]> {
    return await db.select().from(calendarEvents).where(eq(calendarEvents.userId, userId)).orderBy(calendarEvents.startTime);
  }

  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const [created] = await db.insert(calendarEvents).values(event).returning();
    return created;
  }

  async updateCalendarEvent(id: number, event: Partial<CalendarEvent>): Promise<CalendarEvent | undefined> {
    const [updated] = await db.update(calendarEvents).set(event).where(eq(calendarEvents.id, id)).returning();
    return updated;
  }

  async deleteCalendarEvent(id: number): Promise<boolean> {
    const result = await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Tour annotation operations
  async getTourAnnotations(propertyId: number): Promise<TourAnnotation[]> {
    return await db.select().from(tourAnnotations).where(eq(tourAnnotations.propertyId, propertyId)).orderBy(desc(tourAnnotations.createdAt));
  }

  async createTourAnnotation(annotation: InsertTourAnnotation): Promise<TourAnnotation> {
    const [created] = await db.insert(tourAnnotations).values(annotation).returning();
    return created;
  }

  async deleteTourAnnotation(id: number): Promise<boolean> {
    const result = await db.delete(tourAnnotations).where(eq(tourAnnotations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Stats
  async getStats(userId: number): Promise<Stats> {
    const userProperties = await this.getProperties(userId);
    const userProjects = await this.getProjects(userId);
    const userModels = await this.getModels(userId);
    return {
      activeProperties: userProperties.filter(p => p.status === 'active').length,
      models3d: userModels.length,
      activeProjects: userProjects.filter(p => p.status === 'active').length,
      clientPresentations: 34
    };
  }
}
