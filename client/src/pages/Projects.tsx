import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Clock, Check, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Project } from "@shared/schema";
import { Link } from "wouter";

const ProjectStatus = ({ status }: { status: string }) => {
  let bgColor = "bg-gray-100 text-gray-800";
  let icon = null;
  
  if (status === "active") {
    bgColor = "bg-success/10 text-success border-success/20";
    icon = <Clock className="mr-1 h-3 w-3" />;
  } else if (status === "completed") {
    bgColor = "bg-primary/10 text-primary border-primary/20";
    icon = <Check className="mr-1 h-3 w-3" />;
  } else if (status === "pending") {
    bgColor = "bg-warning/10 text-warning border-warning/20";
    icon = <Clock className="mr-1 h-3 w-3" />;
  }
  
  return (
    <Badge variant="outline" className={bgColor}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['/api/projects'],
    enabled: true,
  });
  
  // Fetch team members (for display on project cards)
  const { data: teamMembersMap = {} } = useQuery({
    queryKey: ['/api/team-members'],
    enabled: true,
    select: (data) => {
      const map = {};
      data.forEach(member => {
        if (!map[member.projectId]) {
          map[member.projectId] = [];
        }
        map[member.projectId].push(member);
      });
      return map;
    }
  });
  
  // Filter projects based on search and status filter
  const filteredProjects = projects.filter((project: Project) => {
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter && project.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarNavigation />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Projects</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your development and visualization projects</p>
            </div>
            <div>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-9 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter || ""} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto dashboard-scrollbar p-6 bg-gray-50 dark:bg-gray-900">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <div 
                    key={index} 
                    className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: Project) => {
                  const teamMembers = teamMembersMap[project.id] || [];
                  
                  return (
                    <Card key={project.id} className="border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-semibold dark:text-white">{project.name}</CardTitle>
                            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                              Est. Completion: {project.estimatedCompletion}
                            </CardDescription>
                          </div>
                          <ProjectStatus status={project.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
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
                        
                        {teamMembers.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Team Members</p>
                            <div className="flex -space-x-2">
                              {teamMembers.slice(0, 3).map((member) => (
                                <Avatar key={member.id} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                                  <AvatarImage src={member.imageUrl} alt={member.name} />
                                  <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                              {teamMembers.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs border-2 border-white dark:border-gray-800">
                                  +{teamMembers.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
                          Details
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Project</DropdownMenuItem>
                            <DropdownMenuItem>View Timeline</DropdownMenuItem>
                            <DropdownMenuItem>Manage Team</DropdownMenuItem>
                            <DropdownMenuItem>Export Data</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">No projects found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm || statusFilter
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "Create your first project to get started with visualization and management."}
                  </p>
                  <Button>
                    <Plus className="mr-1 h-4 w-4" />
                    New Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
};

export default Projects;
