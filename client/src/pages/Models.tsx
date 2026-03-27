import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Plus, Upload, Search, Eye, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import ThreeJSModelViewer from "@/components/ThreeJSModelViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Model } from "@shared/schema";

const Models = () => {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Get propertyId from URL params if available
  const params = new URLSearchParams(location.split("?")[1]);
  const propertyId = params.get("propertyId") ? parseInt(params.get("propertyId")!) : null;
  
  // Fetch models
  const { data: models = [], isLoading } = useQuery({
    queryKey: propertyId 
      ? [`/api/models?propertyId=${propertyId}`] 
      : ['/api/models'],
    enabled: true,
  });
  
  // Fetch property details if propertyId is provided
  const { data: property } = useQuery({
    queryKey: propertyId ? [`/api/properties/${propertyId}`] : null,
    enabled: !!propertyId,
  });
  
  // Filter models based on search and status filter
  const filteredModels = models.filter((model: Model) => {
    if (searchTerm && !model.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter && model.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-success/10 text-success border-success/20';
      case 'in_progress':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarNavigation />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {propertyId && property ? `3D Models - ${property.name}` : "3D Models"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {propertyId && property 
                  ? `Manage 3D visualizations for ${property.name}`
                  : "Manage and view your property 3D visualizations"}
              </p>
            </div>
            <div className="flex space-x-2">
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

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search models..."
                  className="pl-9 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                {propertyId && (
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation("/models")}
                  >
                    Clear Property Filter
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Models Grid */}
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
            ) : filteredModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map((model: Model) => (
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
                      d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">No 3D models found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm || statusFilter || propertyId
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "Create your first 3D model to enhance your property visualizations."}
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
              </div>
            )}
          </div>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
};

export default Models;
