import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property } from "@shared/schema";

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  // Fetch properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['/api/properties'],
    enabled: true,
  });

  // Filter and sort properties
  const filteredProperties = properties
    .filter((property: Property) => {
      // Filter by search term
      if (searchTerm && !property.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !property.location.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Filter by property type
      if (propertyType && property.type !== propertyType) {
        return false;
      }
      return true;
    })
    .sort((a: Property, b: Property) => {
      // Sort properties
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortBy === "size-desc") {
        return b.size - a.size;
      } else if (sortBy === "size-asc") {
        return a.size - b.size;
      } else if (sortBy === "progress-desc") {
        return b.visualizationProgress - a.visualizationProgress;
      } else if (sortBy === "progress-asc") {
        return a.visualizationProgress - b.visualizationProgress;
      }
      // Default sorting (recent first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Properties</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your commercial real estate properties</p>
            </div>
            <div>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                Add Property
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
                  placeholder="Search properties..."
                  className="pl-9 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={propertyType || ""} onValueChange={setPropertyType}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Property Type</SelectLabel>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy || ""} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort By</SelectLabel>
                      <SelectItem value="">Most Recent</SelectItem>
                      <SelectItem value="name-asc">Name A-Z</SelectItem>
                      <SelectItem value="name-desc">Name Z-A</SelectItem>
                      <SelectItem value="size-desc">Size (Largest)</SelectItem>
                      <SelectItem value="size-asc">Size (Smallest)</SelectItem>
                      <SelectItem value="progress-desc">Progress (Highest)</SelectItem>
                      <SelectItem value="progress-asc">Progress (Lowest)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Advanced Filters</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className="flex-1 overflow-y-auto dashboard-scrollbar p-6 bg-gray-50 dark:bg-gray-900">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <div 
                    key={index} 
                    className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property: Property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">No properties found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm || propertyType
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "Create your first property to get started with your portfolio."}
                  </p>
                  <Button>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Property
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

export default Properties;
