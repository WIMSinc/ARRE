import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  properties,
  projects,
  models,
  teamMembers,
  timelineEvents,
  type User,
  type InsertUser,
  type Property,
  type InsertProperty,
  type Project,
  type InsertProject,
  type Model,
  type InsertModel,
  type TeamMember,
  type InsertTeamMember,
  type TimelineEvent,
  type InsertTimelineEvent,
  type Stats,
} from "@shared/schema";
import { IStorage } from "./storage";

export class PgStorage implements IStorage {
  constructor() {
    // Initialize with demo data if tables are empty
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    try {
      // Check if we already have users
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) {
        return; // Data already exists
      }

      // Create demo user
      const [user] = await db.insert(users).values({
        username: "janderson",
        password: "password123",
        fullName: "John Anderson",
        email: "john@example.com",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
        preferences: {}
      }).returning();

      // Create demo properties
      const propertyData = [
        {
          name: "Riverfront Tower",
          location: "Chicago, IL",
          type: "Office",
          size: 125000,
          description: "A prime office location with river views",
          userId: user.id,
          status: "active",
          visualizationProgress: 75,
          imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
        },
        {
          name: "Westgate Office Park",
          location: "Austin, TX",
          type: "Mixed-Use",
          size: 82500,
          description: "Modern mixed-use development in a prime location",
          userId: user.id,
          status: "active",
          visualizationProgress: 45,
          imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
        },
        {
          name: "Summit Plaza",
          location: "Denver, CO",
          type: "Retail",
          size: 95000,
          description: "High-end retail space in downtown Denver",
          userId: user.id,
          status: "active",
          visualizationProgress: 90,
          imageUrl: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
        },
        {
          name: "Metropolitan Plaza",
          location: "Financial District, San Francisco",
          type: "Mixed-Use",
          size: 186000,
          description: "Iconic mixed-use development in the heart of the financial district",
          userId: user.id,
          status: "active",
          visualizationProgress: 75,
          imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
        }
      ];

      const createdProperties = await db.insert(properties).values(propertyData).returning();

      // Create demo project
      const [project] = await db.insert(projects).values({
        name: "Metropolitan Plaza Development",
        description: "Mixed-use development project in San Francisco",
        userId: user.id,
        status: "active",
        progress: 75,
        budget: 28500000,
        roi: "12.8%",
        timeSaved: 38,
        designChanges: 24,
        estimatedCompletion: "Q2 2024",
        propertyId: createdProperties[3].id
      }).returning();

      // Create team members
      await db.insert(teamMembers).values([
        {
          name: "Sarah Johnson",
          role: "Project Manager",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop",
          projectId: project.id
        },
        {
          name: "Michael Chen",
          role: "Architect",
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
          projectId: project.id
        },
        {
          name: "Alicia Rodriguez",
          role: "3D Visualization Specialist",
          imageUrl: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=100&auto=format&fit=crop",
          projectId: project.id
        }
      ]);

      // Create timeline events
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const twoWeeksLater = new Date(now);
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

      await db.insert(timelineEvents).values([
        {
          title: "3D Model Completed: Metropolitan Plaza",
          description: "The 3D visualization of Metropolitan Plaza has been completed and is ready for client presentation.",
          date: now,
          completed: true,
          projectId: project.id,
          userId: user.id
        },
        {
          title: "Client Presentation Scheduled",
          description: "Presentation for Westgate Office Park scheduled with Vertex Investments.",
          date: yesterday,
          completed: true,
          projectId: project.id,
          userId: user.id
        },
        {
          title: "AR Walkthrough Development",
          description: "Begin development of AR walkthrough experience for Riverfront Tower.",
          date: nextWeek,
          completed: false,
          projectId: project.id,
          userId: user.id
        },
        {
          title: "Project Kickoff: Summit Plaza Phase 2",
          description: "Initial planning meeting for Phase 2 expansion of Summit Plaza.",
          date: twoWeeksLater,
          completed: false,
          projectId: project.id,
          userId: user.id
        }
      ]);

      // Create 3D models
      await db.insert(models).values([
        {
          name: "Metropolitan Plaza 3D Model",
          propertyId: createdProperties[3].id,
          userId: user.id,
          modelData: {},
          status: "complete"
        },
        {
          name: "Riverfront Tower 3D Model",
          propertyId: createdProperties[0].id,
          userId: user.id,
          modelData: {},
          status: "in_progress"
        }
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
    const [updated] = await db.update(users)
      .set({ preferences })
      .where(eq(users.id, id))
      .returning();
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
    const [updated] = await db.update(properties)
      .set(property)
      .where(eq(properties.id, id))
      .returning();
    return updated;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return result.rowCount > 0;
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
    const [updated] = await db.update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
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
    const [updated] = await db.update(models)
      .set(model)
      .where(eq(models.id, id))
      .returning();
    return updated;
  }

  async deleteModel(id: number): Promise<boolean> {
    const result = await db.delete(models).where(eq(models.id, id));
    return result.rowCount > 0;
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
    return result.rowCount > 0;
  }

  // Timeline event operations
  async getTimelineEvents(userId: number, limit?: number): Promise<TimelineEvent[]> {
    let query = db.select().from(timelineEvents)
      .where(eq(timelineEvents.userId, userId))
      .orderBy(desc(timelineEvents.date));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async getProjectTimelineEvents(projectId: number): Promise<TimelineEvent[]> {
    return await db.select().from(timelineEvents)
      .where(eq(timelineEvents.projectId, projectId))
      .orderBy(desc(timelineEvents.date));
  }

  async createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent> {
    const [created] = await db.insert(timelineEvents).values(event).returning();
    return created;
  }

  async updateTimelineEvent(id: number, event: Partial<TimelineEvent>): Promise<TimelineEvent | undefined> {
    const [updated] = await db.update(timelineEvents)
      .set(event)
      .where(eq(timelineEvents.id, id))
      .returning();
    return updated;
  }

  async deleteTimelineEvent(id: number): Promise<boolean> {
    const result = await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
    return result.rowCount > 0;
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
      clientPresentations: 34 // This could be calculated from actual presentation data
    };
  }
}