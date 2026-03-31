import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Property } from "@shared/schema";
import ARRELogo from "@/assets/ARRE Logo.png";
import {
  FileBarChart, Download, Eye, Star, Building2, TrendingUp, Users, Clock,
  BarChart3, Mail, Share2, Printer, ChevronRight, CheckCircle2
} from "lucide-react";

const REPORT_TEMPLATES = [
  {
    id: "property_deck",
    name: "Property Marketing Deck",
    description: "Professional branded presentation with photos, specs, financials, and 3D tour links",
    pages: "8-12 pages",
    icon: Building2,
    color: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600",
    badge: "Most Used",
  },
  {
    id: "tour_recap",
    name: "Tour Recap Report",
    description: "Post-tour summary with client feedback, highlighted features, and next steps",
    pages: "3-5 pages",
    icon: Eye,
    color: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-600",
    badge: "",
  },
  {
    id: "market_analysis",
    name: "Market Analysis Report",
    description: "Comparable sales, market trends, demographic data, and investment analysis",
    pages: "10-15 pages",
    icon: BarChart3,
    color: "bg-purple-50 dark:bg-purple-950/30",
    iconColor: "text-purple-600",
    badge: "",
  },
  {
    id: "investment_summary",
    name: "Investment Summary",
    description: "ROI analysis, cap rate calculations, cash flow projections, and risk assessment",
    pages: "6-8 pages",
    icon: TrendingUp,
    color: "bg-orange-50 dark:bg-orange-950/30",
    iconColor: "text-orange-600",
    badge: "Popular",
  },
  {
    id: "client_portfolio",
    name: "Client Portfolio Overview",
    description: "Full portfolio summary of all properties and projects for a specific client",
    pages: "12-20 pages",
    icon: Users,
    color: "bg-red-50 dark:bg-red-950/30",
    iconColor: "text-red-600",
    badge: "",
  },
  {
    id: "deal_recap",
    name: "Deal Summary Report",
    description: "Transaction recap with offer history, terms, timeline, and closing details",
    pages: "4-6 pages",
    icon: CheckCircle2,
    color: "bg-teal-50 dark:bg-teal-950/30",
    iconColor: "text-teal-600",
    badge: "",
  },
];

const RECENT_REPORTS = [
  { name: "Riverfront Tower - Property Deck.pdf", template: "Property Marketing Deck", property: "Riverfront Tower", date: "Mar 28, 2026", size: "4.2 MB" },
  { name: "Metropolitan Plaza - Investment Summary.pdf", template: "Investment Summary", property: "Metropolitan Plaza", date: "Mar 25, 2026", size: "2.8 MB" },
  { name: "Summit Plaza - Market Analysis.pdf", template: "Market Analysis Report", property: "Summit Plaza", date: "Mar 20, 2026", size: "6.1 MB" },
  { name: "Westgate - Tour Recap (Vertex Capital).pdf", template: "Tour Recap Report", property: "Westgate Office Park", date: "Mar 15, 2026", size: "1.4 MB" },
];

export default function AutomatedReports() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<typeof REPORT_TEMPLATES[0] | null>(null);
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });

  const handleGenerate = () => {
    if (!selectedTemplate) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setPreviewOpen(true);
    }, 2000);
  };

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
                  <FileBarChart className="h-6 w-6 text-primary" /> Automated Reports
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Generate professionally branded PDF reports and presentations in seconds</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Report Builder */}
              <div className="lg:col-span-2">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Select Report Template</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {REPORT_TEMPLATES.map(tmpl => {
                    const Icon = tmpl.icon;
                    const isSelected = selectedTemplate?.id === tmpl.id;
                    return (
                      <Card
                        key={tmpl.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "border-primary ring-2 ring-primary/20" : ""}`}
                        onClick={() => setSelectedTemplate(tmpl)}
                      >
                        <CardContent className={`p-4 rounded-xl ${tmpl.color}`}>
                          <div className="flex items-start justify-between mb-2">
                            <Icon className={`h-6 w-6 ${tmpl.iconColor}`} />
                            {tmpl.badge && <Badge className="bg-primary/10 text-primary border-0 text-xs">{tmpl.badge}</Badge>}
                            {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{tmpl.name}</div>
                          <div className="text-xs text-gray-500 leading-relaxed mb-2">{tmpl.description}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1"><Clock className="h-3 w-3" />{tmpl.pages}</div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Generate Options */}
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Report Options</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Property</label>
                        <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Properties</SelectItem>
                            {properties.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Branding</label>
                        <Select defaultValue="arre">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arre">ARRE (Default)</SelectItem>
                            <SelectItem value="custom">Custom White-Label</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-primary text-white"
                        disabled={!selectedTemplate || generating}
                        onClick={handleGenerate}
                      >
                        {generating ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Generating...</>
                        ) : (
                          <><FileBarChart className="h-4 w-4 mr-2" />Generate Report</>
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => toast({ title: "Scheduled!", description: "Report will be auto-generated and emailed weekly." })}>
                        <Clock className="h-4 w-4 mr-2" />Schedule Auto-Send
                      </Button>
                    </div>
                    {!selectedTemplate && <p className="text-xs text-gray-400 mt-2 text-center">Select a template above to get started</p>}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Reports */}
              <div>
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Reports</h2>
                <div className="space-y-3">
                  {RECENT_REPORTS.map((r, i) => (
                    <Card key={i} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm text-gray-900 dark:text-white mb-1 leading-tight">{r.name}</div>
                        <div className="text-xs text-gray-500 mb-2">{r.property} · {r.date} · {r.size}</div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setPreviewOpen(true)}>
                            <Eye className="h-3 w-3 mr-1" />Preview
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => toast({ title: "Downloading...", description: r.name })}>
                            <Download className="h-3 w-3 mr-1" />PDF
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => toast({ title: "Share link copied!" })}>
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
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

      {/* Report Preview */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Report Preview — {selectedTemplate?.name || "Property Report"}</DialogTitle></DialogHeader>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {/* Mock Report Header */}
            <div className="bg-gray-900 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={ARRELogo} alt="ARRE" className="h-10 w-10 object-contain" />
                <div>
                  <div className="text-white font-bold text-lg">ARRE</div>
                  <div className="text-gray-400 text-xs">Augmented Reality Real Estate</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{selectedTemplate?.name || "Property Report"}</div>
                <div className="text-gray-400 text-xs">Generated {new Date().toLocaleDateString()}</div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">[ Property Photo / 3D Model Screenshot ]</div>
              <div className="grid grid-cols-3 gap-3">
                {["125,000 sqft", "$24.5M", "6.2% Cap Rate"].map((v, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <div className="font-bold text-primary">{v}</div>
                    <div className="text-xs text-gray-500">{["Total Area", "Asking Price", "Cap Rate"][i]}</div>
                  </div>
                ))}
              </div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
              <div className="text-xs text-gray-400 text-center pt-2">mike@eolianvr.com · 305-562-9639 · www.arre.com</div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button className="flex-1" onClick={() => { toast({ title: "Downloading PDF..." }); setPreviewOpen(false); }}>
              <Download className="h-4 w-4 mr-2" />Download PDF
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Email sent!" })}>
              <Mail className="h-4 w-4 mr-2" />Email Report
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Print dialog opened" })}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
