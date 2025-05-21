import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Filter, Eye, Edit, MoreHorizontal } from "lucide-react";
import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import ThreeJSModelViewer from "@/components/ThreeJSModelViewer";
import ProjectDetails from "@/components/ProjectDetails";
import StatCard from "@/components/StatCard";
import PropertyCard from "@/components/PropertyCard";
import ProjectTimeline from "@/components/ProjectTimeline";
import ValueProposition from "@/components/ValueProposition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Stats } from "@shared/schema";

const Dashboard = () => {
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['/api/stats'],
    enabled: true,
  });
  
  // Fetch featured property (Metropolitan Plaza)
  const { data: featuredProperty, isLoading: propertyLoading } = useQuery({
    queryKey: ['/api/properties/4'],
    enabled: true,
  });
  
  // Fetch project for the featured property
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects?propertyId=4'],
    enabled: !!featuredProperty,
  });
  
  // Fetch properties for the portfolio section
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
    select: (data) => data.slice(0, 3), // Only show first 3 for dashboard
    enabled: true,
  });
  
  // Fetch timeline events
  const { data: timelineEvents, isLoading: timelineLoading } = useQuery({
    queryKey: ['/api/timeline-events', { limit: 4 }],
    enabled: true,
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarNavigation />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, manage your properties and visualizations</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
                <Filter className="mr-1 h-4 w-4" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-y-auto dashboard-scrollbar p-6 bg-gray-50 dark:bg-gray-900">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard 
                title="Active Properties" 
                value={stats?.activeProperties || 0} 
                icon="building" 
                change={{ value: 8, direction: 'up' }} 
              />
              <StatCard 
                title="3D Models" 
                value={stats?.models3d || 0} 
                icon="cube" 
                change={{ value: 12, direction: 'up' }} 
              />
              <StatCard 
                title="Active Projects" 
                value={stats?.activeProjects || 0} 
                icon="folder" 
                change={{ value: 3, direction: 'down' }} 
              />
              <StatCard 
                title="Client Presentations" 
                value={stats?.clientPresentations || 0} 
                icon="presentation" 
                change={{ value: 15, direction: 'up' }} 
              />
            </div>

            {/* Featured 3D Visualization */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Featured Visualization</h2>
                <Link href="/models">
                  <Button variant="link" className="text-primary">
                    View all visualizations
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {propertyLoading || projectsLoading ? (
                  <div className="lg:col-span-2 h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                ) : (
                  <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                    <ThreeJSModelViewer className="w-full h-80" />
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold dark:text-white">{featuredProperty?.name}</h3>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          Active Project
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{featuredProperty?.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">12 Floors</Badge>
                        <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">{featuredProperty?.size.toLocaleString()} sq ft</Badge>
                        <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">{featuredProperty?.type}</Badge>
                        <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">LEED Gold</Badge>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <Button className="text-white">
                            <Eye className="mr-1 h-4 w-4" />
                            View in AR
                          </Button>
                          <Button variant="outline" className="text-gray-700 dark:text-gray-300">
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                        <Button variant="outline" size="icon" className="text-gray-700 dark:text-gray-300">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="lg:col-span-1">
                  {projectsLoading ? (
                    <div className="h-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  ) : projects && projects.length > 0 ? (
                    <ProjectDetails project={projects[0]} />
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 h-full flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 text-center">
                        No project details available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Property Portfolio */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Property Portfolio</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search properties..."
                      className="pl-8 pr-4 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <Button variant="outline" size="icon" className="text-gray-700 dark:text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="21" y1="10" x2="3" y2="10"></line>
                      <line x1="21" y1="6" x2="3" y2="6"></line>
                      <line x1="21" y1="14" x2="3" y2="14"></line>
                      <line x1="21" y1="18" x2="3" y2="18"></line>
                    </svg>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertiesLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  ))
                ) : properties && properties.length > 0 ? (
                  properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                ) : (
                  <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No properties found. Create your first property to get started.
                    </p>
                    <Button className="mt-4">
                      <Plus className="mr-1 h-4 w-4" />
                      Add Property
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center mt-6">
                <Link href="/properties">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                    Load More Properties
                  </Button>
                </Link>
              </div>
            </div>

            {/* Project Timeline & Value Proposition */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Project Timeline */}
              <div className="lg:col-span-2">
                {timelineLoading ? (
                  <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                ) : timelineEvents && timelineEvents.length > 0 ? (
                  <ProjectTimeline events={timelineEvents} />
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No timeline events available.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Value Proposition */}
              <div className="lg:col-span-1">
                <ValueProposition />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
};

export default Dashboard;
