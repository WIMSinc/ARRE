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

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(id: number, preferences: any): Promise<User | undefined>;

  // Property operations
  getProperties(userId: number): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;

  // Project operations
  getProjects(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByPropertyId(propertyId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // 3D Model operations
  getModels(userId: number): Promise<Model[]>;
  getModel(id: number): Promise<Model | undefined>;
  getModelsByPropertyId(propertyId: number): Promise<Model[]>;
  createModel(model: InsertModel): Promise<Model>;
  updateModel(id: number, model: Partial<Model>): Promise<Model | undefined>;
  deleteModel(id: number): Promise<boolean>;

  // Team member operations
  getTeamMembers(projectId: number): Promise<TeamMember[]>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<boolean>;

  // Timeline event operations
  getTimelineEvents(userId: number, limit?: number): Promise<TimelineEvent[]>;
  getProjectTimelineEvents(projectId: number): Promise<TimelineEvent[]>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
  updateTimelineEvent(id: number, event: Partial<TimelineEvent>): Promise<TimelineEvent | undefined>;
  deleteTimelineEvent(id: number): Promise<boolean>;

  // Stats
  getStats(userId: number): Promise<Stats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private projects: Map<number, Project>;
  private models: Map<number, Model>;
  private teamMembers: Map<number, TeamMember>;
  private timelineEvents: Map<number, TimelineEvent>;
  private userIdCounter: number;
  private propertyIdCounter: number;
  private projectIdCounter: number;
  private modelIdCounter: number;
  private teamMemberIdCounter: number;
  private timelineEventIdCounter: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.projects = new Map();
    this.models = new Map();
    this.teamMembers = new Map();
    this.timelineEvents = new Map();
    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.projectIdCounter = 1;
    this.modelIdCounter = 1;
    this.teamMemberIdCounter = 1;
    this.timelineEventIdCounter = 1;

    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const user: InsertUser = {
      username: "janderson",
      password: "password123", // In a real app, this would be hashed
      fullName: "John Anderson",
      email: "john@example.com",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      preferences: {}
    };
    const createdUser = this.createUser(user);

    // Create properties
    const properties: InsertProperty[] = [
      {
        name: "Riverfront Tower",
        location: "Chicago, IL",
        type: "Office",
        size: 125000,
        description: "A prime office location with river views",
        userId: createdUser.id,
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
        userId: createdUser.id,
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
        userId: createdUser.id,
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
        userId: createdUser.id,
        status: "active",
        visualizationProgress: 75,
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
      }
    ];

    const createdProperties = properties.map(prop => this.createProperty(prop));

    // Create projects
    const metropolitanPlazaProject: InsertProject = {
      name: "Metropolitan Plaza Development",
      description: "Mixed-use development project in San Francisco",
      userId: createdUser.id,
      status: "active",
      progress: 75,
      budget: 28500000,
      roi: "12.8%",
      timeSaved: 38,
      designChanges: 24,
      estimatedCompletion: "Q2 2024",
      propertyId: createdProperties[3].id
    };

    const metroProject = this.createProject(metropolitanPlazaProject);

    // Add team members
    const teamMembers: InsertTeamMember[] = [
      {
        name: "Sarah Johnson",
        role: "Project Manager",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop",
        projectId: metroProject.id
      },
      {
        name: "Michael Chen",
        role: "Architect",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
        projectId: metroProject.id
      },
      {
        name: "Alicia Rodriguez",
        role: "3D Visualization Specialist",
        imageUrl: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=100&auto=format&fit=crop",
        projectId: metroProject.id
      }
    ];

    teamMembers.forEach(member => this.createTeamMember(member));

    // Create timeline events
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const twoWeeksLater = new Date(now);
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

    const timelineEvents: InsertTimelineEvent[] = [
      {
        title: "3D Model Completed: Metropolitan Plaza",
        description: "The 3D visualization of Metropolitan Plaza has been completed and is ready for client presentation.",
        date: now,
        completed: true,
        projectId: metroProject.id,
        userId: createdUser.id
      },
      {
        title: "Client Presentation Scheduled",
        description: "Presentation for Westgate Office Park scheduled with Vertex Investments.",
        date: yesterday,
        completed: true,
        projectId: metroProject.id,
        userId: createdUser.id
      },
      {
        title: "AR Walkthrough Development",
        description: "Begin development of AR walkthrough experience for Riverfront Tower.",
        date: nextWeek,
        completed: false,
        projectId: metroProject.id,
        userId: createdUser.id
      },
      {
        title: "Project Kickoff: Summit Plaza Phase 2",
        description: "Initial planning meeting for Phase 2 expansion of Summit Plaza.",
        date: twoWeeksLater,
        completed: false,
        projectId: metroProject.id,
        userId: createdUser.id
      }
    ];

    timelineEvents.forEach(event => this.createTimelineEvent(event));

    // Create 3D models
    const models: InsertModel[] = [
      {
        name: "Metropolitan Plaza 3D Model",
        propertyId: createdProperties[3].id,
        userId: createdUser.id,
        modelData: { /* This would contain Three.js model data in a real app */ },
        status: "complete"
      },
      {
        name: "Riverfront Tower 3D Model",
        propertyId: createdProperties[0].id,
        userId: createdUser.id,
        modelData: { /* This would contain Three.js model data in a real app */ },
        status: "in_progress"
      }
    ];

    models.forEach(model => this.createModel(model));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserPreferences(id: number, preferences: any): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      }
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Property operations
  async getProperties(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.userId === userId,
    );
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const now = new Date();
    const property: Property = { 
      ...insertProperty, 
      id, 
      createdAt: now
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, propertyUpdate: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...propertyUpdate };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Project operations
  async getProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByPropertyId(propertyId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.propertyId === propertyId,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectUpdate };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // 3D Model operations
  async getModels(userId: number): Promise<Model[]> {
    return Array.from(this.models.values()).filter(
      (model) => model.userId === userId,
    );
  }

  async getModel(id: number): Promise<Model | undefined> {
    return this.models.get(id);
  }

  async getModelsByPropertyId(propertyId: number): Promise<Model[]> {
    return Array.from(this.models.values()).filter(
      (model) => model.propertyId === propertyId,
    );
  }

  async createModel(insertModel: InsertModel): Promise<Model> {
    const id = this.modelIdCounter++;
    const now = new Date();
    const model: Model = { 
      ...insertModel, 
      id, 
      createdAt: now
    };
    this.models.set(id, model);
    return model;
  }

  async updateModel(id: number, modelUpdate: Partial<Model>): Promise<Model | undefined> {
    const model = this.models.get(id);
    if (!model) return undefined;
    
    const updatedModel = { ...model, ...modelUpdate };
    this.models.set(id, updatedModel);
    return updatedModel;
  }

  async deleteModel(id: number): Promise<boolean> {
    return this.models.delete(id);
  }

  // Team member operations
  async getTeamMembers(projectId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(
      (member) => member.projectId === projectId,
    );
  }

  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberIdCounter++;
    const teamMember: TeamMember = { ...insertTeamMember, id };
    this.teamMembers.set(id, teamMember);
    return teamMember;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    return this.teamMembers.delete(id);
  }

  // Timeline event operations
  async getTimelineEvents(userId: number, limit?: number): Promise<TimelineEvent[]> {
    let events = Array.from(this.timelineEvents.values())
      .filter((event) => event.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    if (limit) {
      events = events.slice(0, limit);
    }
    
    return events;
  }

  async getProjectTimelineEvents(projectId: number): Promise<TimelineEvent[]> {
    return Array.from(this.timelineEvents.values())
      .filter((event) => event.projectId === projectId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createTimelineEvent(insertEvent: InsertTimelineEvent): Promise<TimelineEvent> {
    const id = this.timelineEventIdCounter++;
    const event: TimelineEvent = { ...insertEvent, id };
    this.timelineEvents.set(id, event);
    return event;
  }

  async updateTimelineEvent(id: number, eventUpdate: Partial<TimelineEvent>): Promise<TimelineEvent | undefined> {
    const event = this.timelineEvents.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventUpdate };
    this.timelineEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteTimelineEvent(id: number): Promise<boolean> {
    return this.timelineEvents.delete(id);
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
      clientPresentations: 34 // Hardcoded for demo
    };
  }
}

export const storage = new MemStorage();
