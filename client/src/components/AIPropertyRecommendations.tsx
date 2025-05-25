import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  MapPin, 
  Building, 
  DollarSign, 
  Clock,
  Star,
  Eye,
  Heart,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyRecommendation {
  id: number;
  name: string;
  location: string;
  type: string;
  price: string;
  size: number;
  matchScore: number;
  reasons: string[];
  vrEngagement: number;
  imageUrl?: string;
  features: string[];
}

const AIPropertyRecommendations = () => {
  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([
    {
      id: 1,
      name: "Skyline Business Center",
      location: "Downtown District",
      type: "Office Complex",
      price: "$2.8M",
      size: 15000,
      matchScore: 94,
      reasons: [
        "High VR engagement in similar properties",
        "Matches preferred location criteria",
        "Size aligns with client requirements"
      ],
      vrEngagement: 87,
      features: ["Modern Layout", "Tech Infrastructure", "Parking"]
    },
    {
      id: 2,
      name: "Innovation Hub West",
      location: "Tech Quarter",
      type: "Mixed Use",
      price: "$3.2M",
      size: 18500,
      matchScore: 91,
      reasons: [
        "Client spent 15+ minutes in VR for similar spaces",
        "Trending in current market segment",
        "Premium amenities match preferences"
      ],
      vrEngagement: 82,
      features: ["Co-working Spaces", "Cafeteria", "Rooftop Access"]
    },
    {
      id: 3,
      name: "Riverfront Executive Suites",
      location: "Waterfront",
      type: "Executive Offices",
      price: "$2.1M",
      size: 12000,
      matchScore: 88,
      reasons: [
        "High conversion rate from VR sessions",
        "Price point matches budget analysis",
        "Premium location preference"
      ],
      vrEngagement: 75,
      features: ["River Views", "Executive Amenities", "Conference Centers"]
    }
  ]);

  const [aiInsights] = useState({
    totalAnalyzed: 847,
    accuracy: 92,
    trendsIdentified: 23,
    predictiveConfidence: 89
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "AI Analysis Complete",
        description: "Updated recommendations based on latest VR interaction data",
      });
    }, 3000);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Property Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{aiInsights.totalAnalyzed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sessions Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{aiInsights.accuracy}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{aiInsights.trendsIdentified}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Market Trends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{aiInsights.predictiveConfidence}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Confidence Level</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">AI Analysis powered by VR interaction patterns</span>
            </div>
            <Button 
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Refresh Analysis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((property, index) => (
          <Card key={property.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{property.name}</h3>
                    <Badge className="bg-primary text-white">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {property.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {property.price}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-lg">{property.matchScore}%</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getMatchScoreColor(property.matchScore)} mb-1`}></div>
                  <span className="text-xs text-gray-500">Match Score</span>
                </div>
              </div>

              {/* Match Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>AI Match Confidence</span>
                  <span>{property.matchScore}%</span>
                </div>
                <Progress value={property.matchScore} className="h-2" />
              </div>

              {/* VR Engagement */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    VR Engagement Score
                  </span>
                  <span>{property.vrEngagement}%</span>
                </div>
                <Progress value={property.vrEngagement} className="h-2" />
              </div>

              {/* AI Reasons */}
              <div className="mb-4">
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Brain className="h-4 w-4 text-primary" />
                  AI Analysis Reasons
                </h4>
                <ul className="space-y-1">
                  {property.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button size="sm" className="bg-primary">
                  <Eye className="mr-2 h-4 w-4" />
                  View in VR
                </Button>
                <Button size="sm" variant="outline">
                  <Heart className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button size="sm" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Market Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Learning Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Trending Preferences
              </h4>
              <ul className="text-sm space-y-1">
                <li>• Clients spend 40% more time in open-layout spaces</li>
                <li>• High-tech infrastructure increases VR engagement by 65%</li>
                <li>• Waterfront locations have 2.3x conversion rate</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                Behavioral Patterns
              </h4>
              <ul className="text-sm space-y-1">
                <li>• Peak VR session time: 10-15 minutes optimal</li>
                <li>• Conference room features drive 45% of conversions</li>
                <li>• Mobile AR users prefer smaller properties</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPropertyRecommendations;