import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Scale, 
  Plus, 
  X, 
  Building, 
  MapPin, 
  DollarSign, 
  Users, 
  Zap, 
  CheckCircle,
  AlertCircle,
  Download,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: number;
  name: string;
  location: string;
  type: string;
  size: number;
  price: number;
  monthlyRent?: number;
  yearBuilt: number;
  parkingSpaces: number;
  conferenceRooms: number;
  amenities: string[];
  vrTourAvailable: boolean;
  arCompatible: boolean;
  sustainabilityScore: number;
  walkScore: number;
  transitScore: number;
  imageUrl?: string;
}

const PropertyComparisonTool = () => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [availableProperties] = useState<Property[]>([
    {
      id: 1,
      name: "Riverfront Tower",
      location: "Downtown Financial District",
      type: "Office Building",
      size: 12000,
      price: 2100000,
      monthlyRent: 18000,
      yearBuilt: 2019,
      parkingSpaces: 45,
      conferenceRooms: 3,
      amenities: ["High-speed Internet", "Security System", "Elevator", "Parking Garage", "Reception Area"],
      vrTourAvailable: true,
      arCompatible: true,
      sustainabilityScore: 85,
      walkScore: 92,
      transitScore: 88
    },
    {
      id: 4,
      name: "Metropolitan Plaza",
      location: "Business District Central",
      type: "Mixed Use",
      size: 15000,
      price: 2800000,
      monthlyRent: 22000,
      yearBuilt: 2021,
      parkingSpaces: 60,
      conferenceRooms: 5,
      amenities: ["High-speed Internet", "Security System", "Elevator", "Parking Garage", "Reception Area", "Rooftop Terrace", "Fitness Center", "Cafeteria"],
      vrTourAvailable: true,
      arCompatible: true,
      sustainabilityScore: 95,
      walkScore: 88,
      transitScore: 85
    },
    {
      id: 2,
      name: "Tech Innovation Hub",
      location: "Silicon Valley North",
      type: "Office Complex",
      size: 18500,
      price: 3200000,
      monthlyRent: 25000,
      yearBuilt: 2020,
      parkingSpaces: 75,
      conferenceRooms: 8,
      amenities: ["High-speed Internet", "Security System", "Elevator", "Parking Garage", "Reception Area", "Fitness Center", "Cafeteria", "Co-working Spaces", "Podcast Studios"],
      vrTourAvailable: true,
      arCompatible: true,
      sustainabilityScore: 90,
      walkScore: 78,
      transitScore: 82
    }
  ]);

  const { toast } = useToast();

  const addPropertyToComparison = (property: Property) => {
    if (selectedProperties.length >= 3) {
      toast({
        title: "Maximum Properties Reached",
        description: "You can compare up to 3 properties at once",
        variant: "destructive"
      });
      return;
    }

    if (selectedProperties.find(p => p.id === property.id)) {
      toast({
        title: "Property Already Added",
        description: "This property is already in your comparison",
        variant: "destructive"
      });
      return;
    }

    setSelectedProperties([...selectedProperties, property]);
    toast({
      title: "Property Added",
      description: `${property.name} has been added to comparison`,
    });
  };

  const removePropertyFromComparison = (propertyId: number) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft: number) => {
    return new Intl.NumberFormat('en-US').format(sqft) + ' sq ft';
  };

  const getBestValue = (properties: Property[], key: keyof Property, higherIsBetter = true) => {
    if (properties.length === 0) return null;
    
    const values = properties.map(p => p[key] as number);
    const bestValue = higherIsBetter ? Math.max(...values) : Math.min(...values);
    
    return properties.find(p => p[key] === bestValue)?.id;
  };

  const calculatePricePerSqFt = (property: Property) => {
    return property.price / property.size;
  };

  const exportComparison = () => {
    toast({
      title: "Comparison Exported",
      description: "Property comparison has been exported to PDF",
    });
  };

  const shareComparison = () => {
    toast({
      title: "Comparison Shared",
      description: "Comparison link has been copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      {/* Comparison Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Property Comparison Tool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compare up to 3 properties side by side to make informed decisions
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedProperties.length}/3 properties selected
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportComparison} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={shareComparison} variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Properties */}
      {selectedProperties.length < 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Add Properties to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableProperties
                .filter(property => !selectedProperties.find(p => p.id === property.id))
                .map((property) => (
                <Card key={property.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">{property.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </p>
                    </div>
                    <div className="space-y-1 text-sm mb-3">
                      <div>{formatSquareFeet(property.size)}</div>
                      <div className="font-medium text-green-600">{formatPrice(property.price)}</div>
                    </div>
                    <Button 
                      onClick={() => addPropertyToComparison(property)}
                      size="sm" 
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Compare
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      {selectedProperties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Property Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Feature</th>
                    {selectedProperties.map((property) => (
                      <th key={property.id} className="text-center p-4 min-w-48">
                        <div className="space-y-2">
                          <div className="font-medium">{property.name}</div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removePropertyFromComparison(property.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Basic Information */}
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <td className="p-4 font-medium">Location</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center text-sm">
                        {property.location}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-4 font-medium">Property Type</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center text-sm">
                        <Badge variant="outline">{property.type}</Badge>
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <td className="p-4 font-medium">Size</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center text-sm font-medium">
                        {formatSquareFeet(property.size)}
                        {property.id === getBestValue(selectedProperties, 'size', true) && (
                          <CheckCircle className="inline ml-1 h-4 w-4 text-green-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-4 font-medium">Purchase Price</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center text-sm font-medium">
                        {formatPrice(property.price)}
                        {property.id === getBestValue(selectedProperties, 'price', false) && (
                          <CheckCircle className="inline ml-1 h-4 w-4 text-green-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <td className="p-4 font-medium">Price per Sq Ft</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center text-sm">
                        {formatPrice(calculatePricePerSqFt(property))}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-4 font-medium">Monthly Rent</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center text-sm">
                        {property.monthlyRent ? formatPrice(property.monthlyRent) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <td className="p-4 font-medium">Year Built</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center text-sm">
                        {property.yearBuilt}
                        {property.id === getBestValue(selectedProperties, 'yearBuilt', true) && (
                          <CheckCircle className="inline ml-1 h-4 w-4 text-green-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Facilities */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Parking Spaces</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center text-sm">
                        {property.parkingSpaces}
                        {property.id === getBestValue(selectedProperties, 'parkingSpaces', true) && (
                          <CheckCircle className="inline ml-1 h-4 w-4 text-green-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <td className="p-4 font-medium">Conference Rooms</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center text-sm">
                        {property.conferenceRooms}
                        {property.id === getBestValue(selectedProperties, 'conferenceRooms', true) && (
                          <CheckCircle className="inline ml-1 h-4 w-4 text-green-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Technology Features */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">VR Tour Available</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        {property.vrTourAvailable ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <td className="p-4 font-medium">AR Compatible</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        {property.arCompatible ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Scores */}
                  <tr className="border-b">
                    <td className="p-4 font-medium">Sustainability Score</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{property.sustainabilityScore}/100</div>
                          <Progress value={property.sustainabilityScore} className="h-2" />
                          {property.id === getBestValue(selectedProperties, 'sustainabilityScore', true) && (
                            <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <td className="p-4 font-medium">Walk Score</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{property.walkScore}/100</div>
                          <Progress value={property.walkScore} className="h-2" />
                          {property.id === getBestValue(selectedProperties, 'walkScore', true) && (
                            <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-4 font-medium">Transit Score</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{property.transitScore}/100</div>
                          <Progress value={property.transitScore} className="h-2" />
                          {property.id === getBestValue(selectedProperties, 'transitScore', true) && (
                            <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Amenities */}
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <td className="p-4 font-medium">Amenities</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {property.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Insights */}
      {selectedProperties.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Best Value Properties</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Best Price: {availableProperties.find(p => p.id === getBestValue(selectedProperties, 'price', false))?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Most Space: {availableProperties.find(p => p.id === getBestValue(selectedProperties, 'size', true))?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Newest: {availableProperties.find(p => p.id === getBestValue(selectedProperties, 'yearBuilt', true))?.name}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Technology & Sustainability</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>All properties support VR/AR tours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-green-500" />
                    <span>Average sustainability score: {Math.round(selectedProperties.reduce((sum, p) => sum + p.sustainabilityScore, 0) / selectedProperties.length)}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyComparisonTool;