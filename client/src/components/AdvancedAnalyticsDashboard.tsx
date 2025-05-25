import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Eye, 
  Headphones, 
  Smartphone,
  Download,
  Share2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const AdvancedAnalyticsDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [vrSessionData] = useState([
    { date: '2024-01-20', sessions: 12, avgDuration: 8.5, conversions: 3 },
    { date: '2024-01-21', sessions: 18, avgDuration: 12.2, conversions: 5 },
    { date: '2024-01-22', sessions: 15, avgDuration: 9.8, conversions: 4 },
    { date: '2024-01-23', sessions: 22, avgDuration: 15.1, conversions: 7 },
    { date: '2024-01-24', sessions: 28, avgDuration: 18.3, conversions: 9 },
    { date: '2024-01-25', sessions: 32, avgDuration: 21.7, conversions: 12 },
    { date: '2024-01-26', sessions: 24, avgDuration: 16.4, conversions: 8 },
  ]);

  const [deviceBreakdown] = useState([
    { name: 'Meta Quest 2/3', value: 45, color: '#8884d8' },
    { name: 'Mobile AR (iOS)', value: 30, color: '#82ca9d' },
    { name: 'Mobile AR (Android)', value: 20, color: '#ffc658' },
    { name: 'Web VR', value: 5, color: '#ff7300' },
  ]);

  const [propertyEngagement] = useState([
    { property: 'Metropolitan Plaza', views: 156, duration: 12.5, conversions: 23 },
    { property: 'Riverfront Tower', views: 134, duration: 10.2, conversions: 18 },
    { property: 'Downtown Complex', views: 98, duration: 8.7, conversions: 12 },
    { property: 'Garden Offices', views: 87, duration: 9.1, conversions: 15 },
  ]);

  const totalSessions = vrSessionData.reduce((sum, day) => sum + day.sessions, 0);
  const avgDuration = vrSessionData.reduce((sum, day) => sum + day.avgDuration, 0) / vrSessionData.length;
  const totalConversions = vrSessionData.reduce((sum, day) => sum + day.conversions, 0);
  const conversionRate = ((totalConversions / totalSessions) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            VR/AR engagement insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((period) => (
            <Button
              key={period}
              variant={selectedTimeframe === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total VR Sessions</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +23% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration.toFixed(1)}m</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +18% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VR Session Trends */}
        <Card>
          <CardHeader>
            <CardTitle>VR Session Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vrSessionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [
                    name === 'sessions' ? `${value} sessions` : 
                    name === 'avgDuration' ? `${value}m avg` : 
                    `${value} conversions`, 
                    name
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Property Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Property Engagement Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {propertyEngagement.map((property, index) => (
              <div key={property.property} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{property.property}</h4>
                  <Badge className="bg-primary text-white">
                    #{index + 1}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Total Views</p>
                    <p className="font-semibold text-lg">{property.views}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Avg Duration</p>
                    <p className="font-semibold text-lg">{property.duration}m</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Conversions</p>
                    <p className="font-semibold text-lg">{property.conversions}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Engagement Score</span>
                    <span>{Math.round((property.conversions / property.views) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(property.conversions / property.views) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Headphones className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">VR Session Started</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Client viewing Metropolitan Plaza - Conference Room
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Live
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Mobile AR Active</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    iOS user exploring Riverfront Tower layout
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                2m ago
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Share2 className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Collaboration Session</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    3 users in shared VR meeting space
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                5m ago
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;