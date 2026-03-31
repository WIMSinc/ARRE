import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, MapPin, Users, Car, ShoppingBag, ArrowUpRight, RefreshCw, Brain } from "lucide-react";

const COMPS = [
  { address: "200 W Adams St, Chicago, IL", type: "Office", size: 118000, salePrice: 24500000, leaseRate: "$28/sqft", date: "2024-01-15", capRate: "6.2%", trend: "up" },
  { address: "100 N Wacker Dr, Chicago, IL", type: "Office", size: 145000, salePrice: 32100000, leaseRate: "$32/sqft", date: "2023-11-20", capRate: "5.8%", trend: "up" },
  { address: "150 N Michigan Ave, Chicago, IL", type: "Mixed-Use", size: 210000, salePrice: 58000000, leaseRate: "$35/sqft", date: "2023-09-05", capRate: "5.4%", trend: "down" },
  { address: "401 N Wabash Ave, Chicago, IL", type: "Retail", size: 88000, salePrice: 19800000, leaseRate: "$42/sqft", date: "2024-02-28", capRate: "6.7%", trend: "up" },
];

const FOOT_TRAFFIC = [
  { label: "Morning Rush (7-9am)", value: 85, color: "bg-primary" },
  { label: "Lunch (11am-1pm)", value: 92, color: "bg-primary" },
  { label: "Afternoon (2-5pm)", value: 71, color: "bg-blue-500" },
  { label: "Evening (5-8pm)", value: 64, color: "bg-purple-500" },
  { label: "Weekend Average", value: 45, color: "bg-orange-500" },
];

const DEMOGRAPHICS = [
  { label: "Median Household Income", value: "$87,400", icon: Users },
  { label: "Population (5-mi radius)", value: "342,000", icon: Users },
  { label: "Traffic Count (daily)", value: "48,200 cars", icon: Car },
  { label: "Retail Spending Power", value: "$1.2B/yr", icon: ShoppingBag },
];

const AI_INSIGHTS = [
  { title: "Strong Office Demand", description: "Office vacancy rates in this submarket dropped 2.3% YoY, signaling strong absorption and pricing power.", trend: "positive" },
  { title: "Rising Lease Rates", description: "Average NNN lease rates increased $3.40/sqft compared to 12 months ago, outpacing inflation.", trend: "positive" },
  { title: "Transit Access Premium", description: "Properties within 0.5 mi of transit command a 12-18% premium over market average.", trend: "neutral" },
  { title: "Cap Rate Compression", description: "Cap rates compressed 40bps this quarter as investor demand outpaces supply.", trend: "warning" },
];

export default function MarketData() {
  const [market, setMarket] = useState("chicago");
  const [propType, setPropType] = useState("all");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <SidebarNavigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" /> Market Data & Intelligence
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Comparable sales, foot traffic, demographics, and AI-driven market insights</p>
              </div>
              <div className="flex gap-2">
                <Select value={market} onValueChange={setMarket}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chicago">Chicago, IL</SelectItem>
                    <SelectItem value="miami">Miami, FL</SelectItem>
                    <SelectItem value="sf">San Francisco</SelectItem>
                    <SelectItem value="austin">Austin, TX</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={propType} onValueChange={setPropType}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="mixed">Mixed-Use</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Market Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Avg Lease Rate", value: "$31.40/sqft", change: "+5.2%", up: true },
                { label: "Avg Cap Rate", value: "5.9%", change: "-0.4%", up: false },
                { label: "Vacancy Rate", value: "8.2%", change: "-2.3%", up: false },
                { label: "Avg Days on Market", value: "47 days", change: "-8 days", up: false },
              ].map(m => (
                <Card key={m.label}><CardContent className="pt-4">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{m.value}</div>
                  <div className="text-xs text-gray-500 mb-1">{m.label}</div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${m.up ? "text-green-600" : "text-red-500"}`}>
                    {m.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {m.change} vs last year
                  </div>
                </CardContent></Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Market Comps */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300">Recent Comparable Sales</h2>
                {COMPS.map((comp, i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            <span className="font-medium text-sm text-gray-900 dark:text-white truncate">{comp.address}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            <Badge variant="outline" className="text-xs">{comp.type}</Badge>
                            <span>{comp.size.toLocaleString()} sqft</span>
                            <span>Cap Rate: {comp.capRate}</span>
                            <span>{comp.date}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <div className="font-bold text-primary">${(comp.salePrice / 1_000_000).toFixed(1)}M</div>
                          <div className="text-xs text-gray-500">{comp.leaseRate}</div>
                          {comp.trend === "up" ? <TrendingUp className="h-3.5 w-3.5 text-green-500 ml-auto mt-1" /> : <TrendingDown className="h-3.5 w-3.5 text-red-500 ml-auto mt-1" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Foot Traffic */}
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 pt-2">Foot Traffic Analysis</h2>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {FOOT_TRAFFIC.map(ft => (
                      <div key={ft.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{ft.label}</span>
                          <span className="font-medium">{ft.value}% capacity</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${ft.color}`} style={{ width: `${ft.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar: Demographics + AI */}
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300">Demographics</h2>
                <div className="space-y-3">
                  {DEMOGRAPHICS.map(d => {
                    const Icon = d.icon;
                    return (
                      <Card key={d.label}><CardContent className="p-3 flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                        <div><div className="font-semibold text-sm">{d.value}</div><div className="text-xs text-gray-500">{d.label}</div></div>
                      </CardContent></Card>
                    );
                  })}
                </div>

                <h2 className="font-semibold text-gray-700 dark:text-gray-300 pt-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" /> AI Market Insights
                </h2>
                <div className="space-y-3">
                  {AI_INSIGHTS.map(insight => (
                    <Card key={insight.title} className={`border-l-4 ${insight.trend === "positive" ? "border-l-green-500" : insight.trend === "warning" ? "border-l-yellow-500" : "border-l-blue-500"}`}>
                      <CardContent className="p-3">
                        <div className="font-medium text-sm mb-1">{insight.title}</div>
                        <div className="text-xs text-gray-500 leading-relaxed">{insight.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}
