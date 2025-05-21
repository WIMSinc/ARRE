# AugmentedRealityRE - Commercial Real Estate Visualization Platform

## Overview

AugmentedRealityRE is a full-stack web application for commercial real estate professionals to manage, visualize, and showcase properties using 3D models and mixed reality. The platform allows users to track properties, manage projects, and create/view 3D visualizations of commercial real estate spaces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack JavaScript architecture:

1. **Frontend**: React-based SPA (Single Page Application) with TypeScript, using React Router for navigation and TanStack Query for data fetching.

2. **Backend**: Express.js server with TypeScript, providing a RESTful API for the frontend.

3. **Database**: PostgreSQL database with Drizzle ORM for type-safe database access.

4. **State Management**: React Query for server state management and context APIs for global client state.

5. **UI Framework**: Custom component library built on top of Radix UI primitives and styled with Tailwind CSS.

6. **3D Visualization**: Three.js for 3D model rendering and visualization.

7. **Building/Bundling**: Vite for frontend development and bundling, with ESBuild for server-side code bundling.

## Key Components

### Frontend

1. **Pages**: Main application views including Dashboard, Properties, PropertyDetails, Projects, and Models.

2. **Components**: 
   - UI components (built with Radix UI primitives)
   - Domain-specific components (PropertyCard, ProjectDetails, ThreeJSModelViewer, etc.)
   - Layout components (Header, SidebarNavigation, MobileNavigation)

3. **Context Providers**:
   - UserContext: Handles user authentication and profile information
   - ThemeContext: Manages light/dark mode preferences

4. **Hooks**:
   - useThreeJS: Custom hook for Three.js initialization and management
   - useToast: Notifications system
   - useIsMobile: Responsive design helper

### Backend

1. **API Routes**: RESTful endpoints for CRUD operations on properties, projects, models, users, etc.

2. **Storage Layer**: Abstraction for database operations using Drizzle ORM.

3. **Authentication**: User authentication and session management.

4. **Static File Serving**: Serving frontend assets in production.

### Database Schema

1. **Users**: User accounts with authentication information and preferences.

2. **Properties**: Commercial real estate properties with details like location, size, type.

3. **Projects**: Development or renovation projects associated with properties.

4. **Models**: 3D models associated with properties for visualization.

5. **TeamMembers**: People associated with projects.

6. **TimelineEvents**: Project milestones and timeline events.

## Data Flow

1. **User Authentication**:
   - User logs in through the frontend
   - Backend validates credentials and creates a session
   - Frontend stores session information and includes it in subsequent requests

2. **Property Management**:
   - Users can view, create, update, and delete properties
   - Property data is stored in the PostgreSQL database
   - 3D models can be associated with properties for visualization

3. **Project Tracking**:
   - Projects are associated with properties
   - Users can track project progress, budget, and timeline events
   - Team members can be assigned to projects

4. **3D Visualization**:
   - Three.js is used to render 3D models in the browser
   - Models can be viewed, rotated, and zoomed for better visualization
   - Visualization progress is tracked in the database

## External Dependencies

### Frontend
- React and React DOM
- TanStack Query for data fetching
- Wouter for routing
- Radix UI components
- Tailwind CSS for styling
- Lucide for icons
- Three.js for 3D visualization
- date-fns for date manipulation

### Backend
- Express.js for API server
- Drizzle ORM for database access
- zod for validation
- PostgreSQL database connector

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development**: `npm run dev` starts both the frontend dev server and backend API.

2. **Production Build**: 
   - Frontend: Vite builds optimized assets to `dist/public`
   - Backend: ESBuild bundles server code to `dist/index.js`

3. **Production Start**: `npm run start` runs the production Node.js server which serves both the API and static frontend assets.

4. **Database**: Using PostgreSQL, with connection details specified in environment variables.

The deployment is configured to use autoscaling on Replit, with appropriate build and run commands specified in the `.replit` file.