import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, insertPropertySchema, insertProjectSchema,
  insertModelSchema, insertTeamMemberSchema, insertTimelineEventSchema,
  insertLeadSchema, insertDealSchema, insertOfferSchema, insertDocumentSchema,
  insertOpenHouseSessionSchema, insertSubscriptionSchema,
  insertCalendarEventSchema, insertTourAnnotationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();

  // User routes
  apiRouter.get("/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't send password to client
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  apiRouter.post("/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { password, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  apiRouter.patch("/users/:id/preferences", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const preferences = req.body;
      const updatedUser = await storage.updateUserPreferences(userId, preferences);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Auth route (simplified for demo)
  apiRouter.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // In a real app, this would use JWT or sessions
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  });

  // Property routes
  apiRouter.get("/properties", async (req, res) => {
    // In a real app, we'd get userId from the auth token
    const userId = 1; // Demo user ID
    const properties = await storage.getProperties(userId);
    res.json(properties);
  });

  apiRouter.get("/properties/:id", async (req, res) => {
    const propertyId = parseInt(req.params.id);
    if (isNaN(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await storage.getProperty(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  });

  apiRouter.post("/properties", async (req, res) => {
    try {
      // In a real app, we'd get userId from the auth token
      const userId = 1; // Demo user ID
      const propertyData = insertPropertySchema.parse({
        ...req.body,
        userId
      });
      
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  apiRouter.patch("/properties/:id", async (req, res) => {
    const propertyId = parseInt(req.params.id);
    if (isNaN(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    try {
      // In a real app, we'd verify ownership
      const updatedProperty = await storage.updateProperty(propertyId, req.body);
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  apiRouter.delete("/properties/:id", async (req, res) => {
    const propertyId = parseInt(req.params.id);
    if (isNaN(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    // In a real app, we'd verify ownership
    const success = await storage.deleteProperty(propertyId);
    if (!success) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(204).end();
  });

  // Project routes
  apiRouter.get("/projects", async (req, res) => {
    // In a real app, we'd get userId from the auth token
    const userId = 1; // Demo user ID
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string) : undefined;
    
    let projects;
    if (propertyId && !isNaN(propertyId)) {
      projects = await storage.getProjectsByPropertyId(propertyId);
    } else {
      projects = await storage.getProjects(userId);
    }
    
    res.json(projects);
  });

  apiRouter.get("/projects/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await storage.getProject(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  });

  apiRouter.post("/projects", async (req, res) => {
    try {
      // In a real app, we'd get userId from the auth token
      const userId = 1; // Demo user ID
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId
      });
      
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  apiRouter.patch("/projects/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    try {
      // In a real app, we'd verify ownership
      const updatedProject = await storage.updateProject(projectId, req.body);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  apiRouter.delete("/projects/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // In a real app, we'd verify ownership
    const success = await storage.deleteProject(projectId);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(204).end();
  });

  // 3D Model routes
  apiRouter.get("/models", async (req, res) => {
    // In a real app, we'd get userId from the auth token
    const userId = 1; // Demo user ID
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string) : undefined;
    
    let models;
    if (propertyId && !isNaN(propertyId)) {
      models = await storage.getModelsByPropertyId(propertyId);
    } else {
      models = await storage.getModels(userId);
    }
    
    res.json(models);
  });

  apiRouter.get("/models/:id", async (req, res) => {
    const modelId = parseInt(req.params.id);
    if (isNaN(modelId)) {
      return res.status(400).json({ message: "Invalid model ID" });
    }

    const model = await storage.getModel(modelId);
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.json(model);
  });

  apiRouter.post("/models", async (req, res) => {
    try {
      // In a real app, we'd get userId from the auth token
      const userId = 1; // Demo user ID
      const modelData = insertModelSchema.parse({
        ...req.body,
        userId
      });
      
      const model = await storage.createModel(modelData);
      res.status(201).json(model);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create model" });
    }
  });

  apiRouter.patch("/models/:id", async (req, res) => {
    const modelId = parseInt(req.params.id);
    if (isNaN(modelId)) {
      return res.status(400).json({ message: "Invalid model ID" });
    }

    try {
      // In a real app, we'd verify ownership
      const updatedModel = await storage.updateModel(modelId, req.body);
      if (!updatedModel) {
        return res.status(404).json({ message: "Model not found" });
      }
      
      res.json(updatedModel);
    } catch (error) {
      res.status(500).json({ message: "Failed to update model" });
    }
  });

  apiRouter.delete("/models/:id", async (req, res) => {
    const modelId = parseInt(req.params.id);
    if (isNaN(modelId)) {
      return res.status(400).json({ message: "Invalid model ID" });
    }

    // In a real app, we'd verify ownership
    const success = await storage.deleteModel(modelId);
    if (!success) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.status(204).end();
  });

  // Team member routes
  apiRouter.get("/team-members", async (req, res) => {
    const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
    
    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    
    const teamMembers = await storage.getTeamMembers(projectId);
    res.json(teamMembers);
  });

  apiRouter.post("/team-members", async (req, res) => {
    try {
      const teamMemberData = insertTeamMemberSchema.parse(req.body);
      const teamMember = await storage.createTeamMember(teamMemberData);
      res.status(201).json(teamMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  apiRouter.delete("/team-members/:id", async (req, res) => {
    const teamMemberId = parseInt(req.params.id);
    if (isNaN(teamMemberId)) {
      return res.status(400).json({ message: "Invalid team member ID" });
    }

    const success = await storage.deleteTeamMember(teamMemberId);
    if (!success) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(204).end();
  });

  // Timeline event routes
  apiRouter.get("/timeline-events", async (req, res) => {
    // In a real app, we'd get userId from the auth token
    const userId = 1; // Demo user ID
    const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    let events;
    if (projectId && !isNaN(projectId)) {
      events = await storage.getProjectTimelineEvents(projectId);
    } else {
      events = await storage.getTimelineEvents(userId, limit);
    }
    
    res.json(events);
  });

  apiRouter.post("/timeline-events", async (req, res) => {
    try {
      // In a real app, we'd get userId from the auth token
      const userId = 1; // Demo user ID
      const eventData = insertTimelineEventSchema.parse({
        ...req.body,
        userId
      });
      
      const event = await storage.createTimelineEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create timeline event" });
    }
  });

  apiRouter.patch("/timeline-events/:id", async (req, res) => {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    try {
      // In a real app, we'd verify ownership
      const updatedEvent = await storage.updateTimelineEvent(eventId, req.body);
      if (!updatedEvent) {
        return res.status(404).json({ message: "Timeline event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update timeline event" });
    }
  });

  apiRouter.delete("/timeline-events/:id", async (req, res) => {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // In a real app, we'd verify ownership
    const success = await storage.deleteTimelineEvent(eventId);
    if (!success) {
      return res.status(404).json({ message: "Timeline event not found" });
    }

    res.status(204).end();
  });

  // Lead (CRM) routes
  apiRouter.get("/leads", async (req, res) => {
    const userId = 1;
    const leads = await storage.getLeads(userId);
    res.json(leads);
  });

  apiRouter.get("/leads/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const lead = await storage.getLead(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  });

  apiRouter.post("/leads", async (req, res) => {
    try {
      const data = insertLeadSchema.parse({ ...req.body, userId: 1 });
      const lead = await storage.createLead(data);
      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create lead" });
    }
  });

  apiRouter.patch("/leads/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const updated = await storage.updateLead(id, req.body);
      if (!updated) return res.status(404).json({ message: "Lead not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  apiRouter.delete("/leads/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const success = await storage.deleteLead(id);
    if (!success) return res.status(404).json({ message: "Lead not found" });
    res.status(204).end();
  });

  // Deal routes
  apiRouter.get("/deals", async (req, res) => {
    const userId = 1;
    const deals = await storage.getDeals(userId);
    res.json(deals);
  });

  apiRouter.post("/deals", async (req, res) => {
    try {
      const data = insertDealSchema.parse({ ...req.body, userId: 1 });
      const deal = await storage.createDeal(data);
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create deal" });
    }
  });

  apiRouter.patch("/deals/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const updated = await storage.updateDeal(id, req.body);
      if (!updated) return res.status(404).json({ message: "Deal not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update deal" });
    }
  });

  apiRouter.delete("/deals/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const success = await storage.deleteDeal(id);
    if (!success) return res.status(404).json({ message: "Deal not found" });
    res.status(204).end();
  });

  // Offer routes
  apiRouter.get("/offers", async (req, res) => {
    const userId = 1;
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string) : undefined;
    const result = propertyId ? await storage.getOffersByPropertyId(propertyId) : await storage.getOffers(userId);
    res.json(result);
  });

  apiRouter.post("/offers", async (req, res) => {
    try {
      const data = insertOfferSchema.parse({ ...req.body, userId: 1 });
      const offer = await storage.createOffer(data);
      res.status(201).json(offer);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create offer" });
    }
  });

  apiRouter.patch("/offers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const updated = await storage.updateOffer(id, req.body);
      if (!updated) return res.status(404).json({ message: "Offer not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update offer" });
    }
  });

  apiRouter.delete("/offers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const success = await storage.deleteOffer(id);
    if (!success) return res.status(404).json({ message: "Offer not found" });
    res.status(204).end();
  });

  // Document routes
  apiRouter.get("/documents", async (req, res) => {
    const userId = 1;
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string) : undefined;
    const result = propertyId ? await storage.getDocumentsByPropertyId(propertyId) : await storage.getDocuments(userId);
    res.json(result);
  });

  apiRouter.post("/documents", async (req, res) => {
    try {
      const data = insertDocumentSchema.parse({ ...req.body, userId: 1 });
      const doc = await storage.createDocument(data);
      res.status(201).json(doc);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  apiRouter.patch("/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const updated = await storage.updateDocument(id, req.body);
      if (!updated) return res.status(404).json({ message: "Document not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  apiRouter.delete("/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const success = await storage.deleteDocument(id);
    if (!success) return res.status(404).json({ message: "Document not found" });
    res.status(204).end();
  });

  // Open House Session routes
  apiRouter.get("/open-house-sessions", async (req, res) => {
    const userId = 1;
    const sessions = await storage.getOpenHouseSessions(userId);
    res.json(sessions);
  });

  apiRouter.get("/open-house-sessions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const session = await storage.getOpenHouseSession(id);
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  });

  apiRouter.post("/open-house-sessions", async (req, res) => {
    try {
      const data = insertOpenHouseSessionSchema.parse({ ...req.body, hostId: 1 });
      const session = await storage.createOpenHouseSession(data);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  apiRouter.patch("/open-house-sessions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const updated = await storage.updateOpenHouseSession(id, req.body);
      if (!updated) return res.status(404).json({ message: "Session not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  apiRouter.delete("/open-house-sessions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const success = await storage.deleteOpenHouseSession(id);
    if (!success) return res.status(404).json({ message: "Session not found" });
    res.status(204).end();
  });

  // Subscription routes
  apiRouter.get("/subscription", async (req, res) => {
    const userId = 1;
    const sub = await storage.getSubscription(userId);
    res.json(sub || null);
  });

  apiRouter.patch("/subscription", async (req, res) => {
    const userId = 1;
    try {
      const updated = await storage.updateSubscription(userId, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  // Calendar event routes
  apiRouter.get("/calendar-events", async (req, res) => {
    const userId = 1;
    const events = await storage.getCalendarEvents(userId);
    res.json(events);
  });

  apiRouter.post("/calendar-events", async (req, res) => {
    try {
      const data = insertCalendarEventSchema.parse({ ...req.body, userId: 1 });
      const event = await storage.createCalendarEvent(data);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create calendar event" });
    }
  });

  apiRouter.patch("/calendar-events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const updated = await storage.updateCalendarEvent(id, req.body);
      if (!updated) return res.status(404).json({ message: "Event not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  apiRouter.delete("/calendar-events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const success = await storage.deleteCalendarEvent(id);
    if (!success) return res.status(404).json({ message: "Event not found" });
    res.status(204).end();
  });

  // Tour annotation routes
  apiRouter.get("/tour-annotations", async (req, res) => {
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string) : undefined;
    if (!propertyId) return res.status(400).json({ message: "Property ID required" });
    const annotations = await storage.getTourAnnotations(propertyId);
    res.json(annotations);
  });

  apiRouter.post("/tour-annotations", async (req, res) => {
    try {
      const data = insertTourAnnotationSchema.parse({ ...req.body, userId: 1 });
      const annotation = await storage.createTourAnnotation(data);
      res.status(201).json(annotation);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: error.errors });
      res.status(500).json({ message: "Failed to create annotation" });
    }
  });

  apiRouter.delete("/tour-annotations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const success = await storage.deleteTourAnnotation(id);
    if (!success) return res.status(404).json({ message: "Annotation not found" });
    res.status(204).end();
  });

  // Stats route
  apiRouter.get("/stats", async (req, res) => {
    const userId = 1;
    const stats = await storage.getStats(userId);
    res.json(stats);
  });

  // Mount the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
