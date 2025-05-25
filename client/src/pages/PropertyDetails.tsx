import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import {
  ArrowLeft,
  Edit,
  Trash,
  Building2,
  MapPin,
  Ruler,
  CalendarCheck,
  BarChart3,
  Axis3d,
  Download,
  Share2,
  FolderKanban,
  Plus
} from "lucide-react";
import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import ThreeJSModelViewer from "@/components/ThreeJSModelViewer";
import VRModelViewer from "@/components/VRModelViewer";
import ProjectTimeline from "@/components/ProjectTimeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Property, Project, Model } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const PropertyDetails = () => {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const propertyId = parseInt(id);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch property details
  const { data: property, isLoading: propertyLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !isNaN(propertyId),
  });
  
  // Fetch projects for this property
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: [`/api/projects?propertyId=${propertyId}`],
    enabled: !isNaN(propertyId),
  });
  
  // Fetch 3D models for this property
  const { data: models = [], isLoading: modelsLoading } = useQuery<Model[]>({
    queryKey: [`/api/models?propertyId=${propertyId}`],
    enabled: !isNaN(propertyId),
  });
  
  // Fetch timeline events for the first project (if any)
  const { data: timelineEvents = [], isLoading: timelineLoading } = useQuery({
    queryKey: projects.length > 0 ? [`/api/timeline-events?projectId=${projects[0]?.id}`] : null,
    enabled: projects.length > 0,
  });
  
  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/properties/${propertyId}`);
    },
    onSuccess: () => {
      toast({
        title: "Property deleted",
        description: "The property has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      navigate("/properties");
    },
    onError: (error) => {
      toast({
        title: "Error deleting property",
        description: "There was a problem deleting the property.",
        variant: "destructive",
      });
    }
  });
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      deletePropertyMutation.mutate();
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'Office':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Retail':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'Mixed-Use':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  if (propertyLoading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <SidebarNavigation />
          <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 p-6">
            <div className="flex justify-center items-center h-full">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </main>
        </div>
        <MobileNavigation />
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <SidebarNavigation />
          <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 p-6">
            <div className="flex justify-center items-center h-full">
              <div className="text-center max-w-md">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Property Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">The property you're looking for doesn't exist or has been deleted.</p>
                <Link href="/properties">
                  <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Properties
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarNavigation />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Property Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
            <div className="mb-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/properties">Properties</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>{property.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{property.name}</h1>
                  <Badge variant="outline" className={getStatusColor(property.status)}>
                    {property.status === 'active' ? 'Active' : 
                     property.status === 'pending' ? 'Pending' : 'Archived'}
                  </Badge>
                  <Badge variant="outline" className={getPropertyTypeColor(property.type)}>
                    {property.type}
                  </Badge>
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.location}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="text-gray-700 dark:text-gray-300">
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="models">3D Models ({models.length})</TabsTrigger>
                <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Property Content */}
          <div className="flex-1 overflow-y-auto dashboard-scrollbar p-6 bg-gray-50 dark:bg-gray-900">
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Property Info */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Property Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Size</p>
                      <p className="font-medium dark:text-white flex items-center">
                        <Ruler className="h-4 w-4 mr-2 text-gray-400" />
                        {property.size.toLocaleString()} sq ft
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                      <p className="font-medium dark:text-white flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                        {property.type}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                      <p className="font-medium dark:text-white flex items-center">
                        <CalendarCheck className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(property.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Visualization Progress</p>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium dark:text-white">{property.visualizationProgress}%</span>
                      </div>
                      <Progress value={property.visualizationProgress} className="h-2" />
                    </div>
                    
                    {property.description && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                        <p className="dark:text-white">{property.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* 3D Visualization */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>3D Visualization</CardTitle>
                    <CardDescription>
                      Interactive 3D model of the property
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full">
                      <ThreeJSModelViewer 
                        modelId={models.length > 0 ? models[0].id : undefined} 
                        className="w-full h-full rounded-md overflow-hidden" 
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="flex gap-2">
                        <Button>
                          <Axis3d className="mr-1 h-4 w-4" /> 
                          View in AR
                        </Button>
                        <Button variant="outline" className="text-gray-700 dark:text-gray-300">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <Button variant="outline" className="text-gray-700 dark:text-gray-300">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Timeline Events */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                    <CardDescription>
                      Recent and upcoming events for this property
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {timelineLoading ? (
                      <div className="h-48 animate-pulse flex flex-col space-y-4">
                        {Array(3).fill(0).map((_, i) => (
                          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                      </div>
                    ) : timelineEvents.length > 0 ? (
                      <ProjectTimeline events={timelineEvents} />
                    ) : (
                      <div className="text-center py-8">
                        <FolderKanban className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No timeline events found for this property.</p>
                        {projects.length > 0 && (
                          <Button>
                            <Plus className="mr-1 h-4 w-4" />
                            Add Timeline Event
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="models" className="mt-0">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">3D Models</h2>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="mr-1 h-4 w-4" />
                    Import Model
                  </Button>
                  <Button>
                    <Plus className="mr-1 h-4 w-4" />
                    New 3D Model
                  </Button>
                </div>
              </div>
              
              {modelsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : models.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {models.map((model) => (
                    <Card key={model.id} className="border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <div className="relative h-48">
                        <ThreeJSModelViewer 
                          modelId={model.id} 
                          className="w-full h-full" 
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={getStatusColor(model.status)}>
                            {model.status === 'complete' ? 'Complete' : 'In Progress'}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2 pt-3">
                        <CardTitle className="text-lg font-semibold dark:text-white">
                          {model.name}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardFooter className="flex justify-between pt-0">
                        <Button className="text-white">
                          <Eye className="mr-1 h-4 w-4" />
                          View Model
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Model</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <Axis3d className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">No 3D models yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                    Create your first 3D model for this property to enhance visualization and client presentations.
                  </p>
                  <div className="flex flex-col xs:flex-row gap-3 justify-center">
                    <Button>
                      <Plus className="mr-1 h-4 w-4" />
                      New 3D Model
                    </Button>
                    <Button variant="outline">
                      <Upload className="mr-1 h-4 w-4" />
                      Import Model
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="projects" className="mt-0">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Projects</h2>
                <Button>
                  <Plus className="mr-1 h-4 w-4" />
                  New Project
                </Button>
              </div>
              
              {projectsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-semibold dark:text-white">{project.name}</CardTitle>
                            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                              Est. Completion: {project.estimatedCompletion}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className={getStatusColor(project.status)}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">Progress</span>
                            <span className="font-medium dark:text-white">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                            <p className="font-semibold dark:text-white">${(project.budget / 1000000).toFixed(1)}M</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-500 dark:text-gray-400">ROI (est.)</p>
                            <p className="font-semibold dark:text-white">{project.roi}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Timeline
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <FolderKanban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">No projects yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                    Start a new project for this property to track progress, budget, and timelines.
                  </p>
                  <Button>
                    <Plus className="mr-1 h-4 w-4" />
                    New Project
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Analytics</h2>
                <Button variant="outline">
                  <Download className="mr-1 h-4 w-4" />
                  Export Data
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Visualization Impact</CardTitle>
                    <CardDescription>
                      How 3D visualization affects client engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <BarChart3 className="h-24 w-24 text-gray-300" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline Analysis</CardTitle>
                    <CardDescription>
                      Timeline performance against projections
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <BarChart3 className="h-24 w-24 text-gray-300" />
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>AR/VR Benefits Analysis</CardTitle>
                    <CardDescription>
                      Quantified benefits of augmented reality for this property
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-2">32%</h3>
                        <p className="text-white/90">Faster client decision-making with AR visualization</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-2">24%</h3>
                        <p className="text-white/90">Reduced revisions when using 3D models</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-accent to-accent/80 text-white rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-2">18%</h3>
                        <p className="text-white/90">Project cost reduction through early visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
};

export default PropertyDetails;
