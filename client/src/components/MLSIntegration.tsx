import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Search, 
  Download, 
  RefreshCw, 
  Building,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MLSProperty {
  id: string;
  mlsNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  squareFeet: number;
  propertyType: string;
  listingDate: string;
  status: 'Active' | 'Pending' | 'Sold' | 'Withdrawn';
  agentName: string;
  agentPhone: string;
  photos: string[];
  description: string;
}

const MLSIntegration = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [mlsProperties, setMlsProperties] = useState<MLSProperty[]>([
    {
      id: 'mls_001',
      mlsNumber: 'MLS12345',
      address: '123 Business Park Drive',
      city: 'Downtown',
      state: 'CA',
      zipCode: '90210',
      price: 2800000,
      squareFeet: 15000,
      propertyType: 'Office Building',
      listingDate: '2024-01-15',
      status: 'Active',
      agentName: 'Sarah Mitchell',
      agentPhone: '(555) 123-4567',
      photos: [],
      description: 'Premium office building with modern amenities and excellent location.'
    },
    {
      id: 'mls_002',
      mlsNumber: 'MLS12346',
      address: '456 Corporate Center',
      city: 'Business District',
      state: 'CA',
      zipCode: '90211',
      price: 3200000,
      squareFeet: 18500,
      propertyType: 'Mixed Use',
      listingDate: '2024-01-20',
      status: 'Pending',
      agentName: 'Mike Johnson',
      agentPhone: '(555) 234-5678',
      photos: [],
      description: 'Versatile mixed-use property perfect for retail and office combination.'
    }
  ]);

  const { toast } = useToast();

  const searchMLS = async () => {
    setIsSearching(true);
    
    // Simulate MLS search
    setTimeout(() => {
      setIsSearching(false);
      toast({
        title: "MLS Search Complete",
        description: `Found ${mlsProperties.length} matching properties in the MLS database`,
      });
    }, 2000);
  };

  const syncWithMLS = async () => {
    setIsSyncing(true);
    
    // Simulate MLS sync
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date());
      toast({
        title: "MLS Sync Complete",
        description: "All property data has been synchronized with the MLS database",
      });
    }, 3000);
  };

  const importProperty = (property: MLSProperty) => {
    toast({
      title: "Property Imported",
      description: `${property.address} has been imported to your portfolio`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Sold': return 'bg-blue-500';
      case 'Withdrawn': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* MLS Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            MLS Integration Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">MLS Connected</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time access to Multiple Listing Service
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Live Data Feed</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatic updates every 15 minutes
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Last Sync</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lastSync.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={syncWithMLS} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync MLS Data
                </>
              )}
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MLS Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            MLS Property Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Search by address, MLS number, or property type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={searchMLS} disabled={isSearching}>
              {isSearching ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search MLS
                </>
              )}
            </Button>
          </div>
          
          {isSearching && (
            <div className="mb-4">
              <Progress value={75} className="h-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Searching MLS database...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MLS Results */}
      <div className="space-y-4">
        {mlsProperties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{property.address}</h3>
                    <Badge className={`text-white ${getStatusColor(property.status)}`}>
                      {property.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {property.city}, {property.state} {property.zipCode}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {property.propertyType}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatPrice(property.price)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">MLS #{property.mlsNumber}</div>
                  <div className="text-sm text-gray-500">Listed: {property.listingDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Property Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>Square Feet: {property.squareFeet.toLocaleString()}</div>
                    <div>Type: {property.propertyType}</div>
                    <div>Status: {property.status}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Listing Agent</h4>
                  <div className="space-y-1 text-sm">
                    <div>Name: {property.agentName}</div>
                    <div>Phone: {property.agentPhone}</div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {property.description}
              </p>

              <div className="flex gap-2">
                <Button onClick={() => importProperty(property)} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Import Property
                </Button>
                <Button variant="outline" size="sm">
                  <Building className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  Create VR Tour
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MLS Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle>MLS Integration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Real-time Features</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Live property data synchronization</li>
                <li>✓ Automatic price and status updates</li>
                <li>✓ New listing notifications</li>
                <li>✓ Market trend analysis</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Enhanced Capabilities</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Bulk property import from MLS</li>
                <li>✓ Advanced search and filtering</li>
                <li>✓ Agent contact integration</li>
                <li>✓ Automated VR tour generation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLSIntegration;