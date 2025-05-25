import { useState } from 'react';
import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import AdvancedAnalyticsDashboard from "@/components/AdvancedAnalyticsDashboard";
import AIPropertyRecommendations from "@/components/AIPropertyRecommendations";
import EnhancedCollaborationTools from "@/components/EnhancedCollaborationTools";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Brain, 
  Users, 
  Smartphone,
  Eye,
  Headphones,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function Analytics() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const featureStats = [
    { name: "VR Sessions", value: "1,247", change: "+23%", icon: Headphones, color: "text-blue-600" },
    { name: "Mobile AR Views", value: "856", change: "+18%", icon: Smartphone, color: "text-green-600" },
    { name: "AI Recommendations", value: "342", change: "+45%", icon: Brain, color: "text-purple-600" },
    { name: "Collaborations", value: "189", change: "+12%", icon: Users, color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Header />
      
      <div className="flex">
        <SidebarNavigation />
        
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold mb-4">
                    Advanced Analytics & AI Dashboard
                  </h1>
                  <p className="text-xl mb-6 text-blue-100">
                    Your comprehensive platform for VR/AR property visualization, AI recommendations, and collaborative tools
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                      <Eye className="mr-2 h-4 w-4" />
                      VR/AR Ready
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                      <Brain className="mr-2 h-4 w-4" />
                      AI Powered
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                      <Users className="mr-2 h-4 w-4" />
                      Multi-Platform
                    </Badge>
                  </div>
                </div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-12 gap-2 h-full">
                    {Array.from({ length: 96 }).map((_, i) => (
                      <div key={i} className="bg-white rounded animate-pulse" style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '3s'
                      }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featureStats.map((stat) => (
                <Card key={stat.name} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.name}
                        </p>
                        <p className="text-2xl font-bold mt-2">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Platform Features Overview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Platform Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg">
                    <Headphones className="h-8 w-8 text-blue-600 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Meta Quest VR</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Immersive property walkthroughs with hand tracking, spatial audio, and multi-user collaboration
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>✓ 4K resolution per eye</li>
                      <li>✓ Hand & eye tracking</li>
                      <li>✓ Up to 20 users</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg">
                    <Smartphone className="h-8 w-8 text-green-600 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Mobile AR</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      iOS/Android AR experiences with spatial mapping, measurements, and virtual staging
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>✓ ARKit & ARCore support</li>
                      <li>✓ Real-time measurements</li>
                      <li>✓ Virtual furniture placement</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg">
                    <Eye className="h-8 w-8 text-purple-600 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Apple Vision Pro</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Spatial computing with passthrough, eye tracking, and SharePlay integration
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>✓ Spatial computing</li>
                      <li>✓ Eye & hand tracking</li>
                      <li>✓ SharePlay support</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg">
                    <Brain className="h-8 w-8 text-orange-600 mb-4" />
                    <h3 className="font-bold text-lg mb-2">AI Recommendations</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Machine learning property matching based on VR engagement patterns and preferences
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>✓ 92% accuracy rate</li>
                      <li>✓ Behavioral analysis</li>
                      <li>✓ Predictive insights</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-6 rounded-lg">
                    <Users className="h-8 w-8 text-teal-600 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Collaboration Hub</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Real-time chat, 3D whiteboards, document sharing, and screen sharing capabilities
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>✓ Real-time collaboration</li>
                      <li>✓ 3D spatial drawing</li>
                      <li>✓ Document synchronization</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-6 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-pink-600 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Advanced Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Comprehensive tracking of VR sessions, user engagement, and conversion metrics
                    </p>
                    <ul className="text-xs space-y-1">
                      <li>✓ Real-time insights</li>
                      <li>✓ Performance metrics</li>
                      <li>✓ Custom reports</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger value="collaboration" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Collaboration
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics" className="mt-6">
                <AdvancedAnalyticsDashboard />
              </TabsContent>
              
              <TabsContent value="ai" className="mt-6">
                <AIPropertyRecommendations />
              </TabsContent>
              
              <TabsContent value="collaboration" className="mt-6">
                <EnhancedCollaborationTools />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <MobileNavigation 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
    </div>
  );
}