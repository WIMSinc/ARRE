import { useState } from "react";
import { Link } from "wouter";
import { Star, Info, Axis3d } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'office':
        return 'bg-primary/90 text-white';
      case 'retail':
        return 'bg-secondary/90 text-white';
      case 'mixed-use':
        return 'bg-accent/90 text-white';
      default:
        return 'bg-gray-500/90 text-white';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-white';
      case 'pending':
        return 'bg-warning text-white';
      case 'archived':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div 
      className="property-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <img 
          src={property.imageUrl || "https://via.placeholder.com/600x300?text=No+Image"} 
          alt={property.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{property.name}</h3>
          <p className="text-white/80 text-sm">{property.location}</p>
        </div>
        <div className={cn(
          "property-actions absolute top-2 right-2 transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white rounded-full text-gray-700 shadow-sm">
            <Star className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <Badge className={getTypeColor(property.type)}>
            {property.type}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <div>
            <span className="text-sm font-medium dark:text-white">
              {property.size.toLocaleString()} sq ft
            </span>
          </div>
          <div className="flex items-center">
            <span className={cn(
              "inline-block w-2 h-2 rounded-full mr-1",
              property.status === 'active' ? 'bg-success' : 
              property.status === 'pending' ? 'bg-warning' : 'bg-gray-500'
            )}></span>
            <span className={cn(
              "text-xs font-medium",
              property.status === 'active' ? 'text-success' : 
              property.status === 'pending' ? 'text-warning' : 'text-gray-500'
            )}>
              {property.status === 'active' ? 'Active' : 
               property.status === 'pending' ? 'In Progress' : 'Archived'}
            </span>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Visualization Status</span>
            <span>{property.visualizationProgress}%</span>
          </div>
          <Progress 
            value={property.visualizationProgress} 
            className="h-1.5 mt-1"
          />
        </div>
        
        <div className="flex justify-between">
          <Link href={`/properties/${property.id}`}>
            <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
              <Info className="mr-1 h-4 w-4" />
              Details
            </Button>
          </Link>
          <Link href={`/models?propertyId=${property.id}`}>
            <Button variant="secondary" size="sm">
              <Axis3d className="mr-1 h-4 w-4" />
              View 3D
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
