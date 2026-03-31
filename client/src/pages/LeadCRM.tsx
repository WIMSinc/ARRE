import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { Lead } from "@shared/schema";
import {
  Users, Plus, Search, Phone, Mail, Building2, TrendingUp,
  Star, CheckCircle2, XCircle, Clock, Edit3, Trash2, Filter
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  new:         { label: "New",         color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",    icon: Star },
  contacted:   { label: "Contacted",   color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", icon: Phone },
  qualified:   { label: "Qualified",   color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", icon: CheckCircle2 },
  proposal:    { label: "Proposal",    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300", icon: TrendingUp },
  closed_won:  { label: "Closed Won",  color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",  icon: CheckCircle2 },
  closed_lost: { label: "Closed Lost", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",   icon: XCircle },
};

const SOURCE_LABELS: Record<string, string> = {
  website: "Website", referral: "Referral", mls: "MLS", open_house: "Open House", direct: "Direct"
};

export default function LeadCRM() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);

  const { data: leads = [], isLoading } = useQuery<Lead[]>({ queryKey: ["/api/leads"] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/leads", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/leads"] }); setShowAddDialog(false); toast({ title: "Lead added successfully" }); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PATCH", `/api/leads/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/leads"] }); setEditLead(null); toast({ title: "Lead updated" }); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/leads/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/leads"] }); setSelectedLead(null); toast({ title: "Lead removed" }); }
  });

  const form = useForm({ defaultValues: { name: "", email: "", phone: "", company: "", source: "website", status: "new", notes: "" } });
  const editForm = useForm();

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()) || (l.company || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.status === s).length }), {} as Record<string, number>);
  const pipeline = leads.filter(l => l.status !== "closed_won" && l.status !== "closed_lost").length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <SidebarNavigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" /> Lead & CRM
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track prospects, manage relationships, and close more deals</p>
              </div>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white"><Plus className="h-4 w-4 mr-2" />Add Lead</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(d => createMutation.mutate(d))} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="James Whitfield" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="company" render={({ field }) => (
                          <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Vertex Capital" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem><FormLabel>Email *</FormLabel><FormControl><Input placeholder="james@example.com" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="312-555-0182" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="source" render={({ field }) => (
                          <FormItem><FormLabel>Source</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="website">Website</SelectItem>
                                <SelectItem value="referral">Referral</SelectItem>
                                <SelectItem value="mls">MLS</SelectItem>
                                <SelectItem value="open_house">Open House</SelectItem>
                                <SelectItem value="direct">Direct</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="status" render={({ field }) => (
                          <FormItem><FormLabel>Status</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {Object.entries(STATUS_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea placeholder="Add notes about this lead..." {...field} /></FormControl></FormItem>
                      )} />
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                        <Button type="submit" disabled={createMutation.isPending}>Add Lead</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-primary">{leads.length}</div><div className="text-sm text-gray-500">Total Leads</div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-blue-600">{pipeline}</div><div className="text-sm text-gray-500">In Pipeline</div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-green-600">{counts.closed_won || 0}</div><div className="text-sm text-gray-500">Closed Won</div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-orange-600">{counts.proposal || 0}</div><div className="text-sm text-gray-500">Proposals Out</div></CardContent></Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search leads..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(STATUS_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Lead Table */}
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">Loading leads...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No leads found. Add your first lead to get started.</div>
            ) : (
              <div className="grid gap-3">
                {filtered.map(lead => {
                  const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                  const Icon = cfg.icon;
                  return (
                    <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedLead(lead)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                              {lead.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-white truncate">{lead.name}</div>
                              <div className="text-sm text-gray-500 truncate">{lead.company} · {lead.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                            <Badge className={`text-xs ${cfg.color} border-0`}><Icon className="h-3 w-3 mr-1" />{cfg.label}</Badge>
                            {lead.source && <span className="hidden md:inline text-xs text-gray-400">{SOURCE_LABELS[lead.source] || lead.source}</span>}
                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditLead(lead); editForm.reset({ status: lead.status, notes: lead.notes || "" }); }}>
                                <Edit3 className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => deleteMutation.mutate(lead.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileNavigation />

      {/* Lead Detail Dialog */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {selectedLead.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                {selectedLead.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-gray-500 mb-1">Company</div><div className="font-medium">{selectedLead.company || "—"}</div></div>
                <div><div className="text-gray-500 mb-1">Status</div><Badge className={`text-xs ${STATUS_CONFIG[selectedLead.status]?.color} border-0`}>{STATUS_CONFIG[selectedLead.status]?.label}</Badge></div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline">{selectedLead.email}</a></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /><span>{selectedLead.phone || "—"}</span></div>
                <div><div className="text-gray-500 mb-1">Source</div><div>{SOURCE_LABELS[selectedLead.source || ""] || selectedLead.source || "—"}</div></div>
              </div>
              {selectedLead.notes && <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300">{selectedLead.notes}</div>}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => { setSelectedLead(null); setEditLead(selectedLead); editForm.reset({ status: selectedLead.status, notes: selectedLead.notes || "" }); }}>
                  <Edit3 className="h-4 w-4 mr-2" />Edit Lead
                </Button>
                <Button variant="outline" className="text-red-500" onClick={() => deleteMutation.mutate(selectedLead.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Lead Dialog */}
      {editLead && (
        <Dialog open={!!editLead} onOpenChange={() => setEditLead(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Update Lead — {editLead.name}</DialogTitle></DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(d => updateMutation.mutate({ id: editLead.id, data: d }))} className="space-y-4">
                <FormField control={editForm.control} name="status" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(STATUS_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl></FormItem>
                )} />
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setEditLead(null)}>Cancel</Button>
                  <Button type="submit" disabled={updateMutation.isPending}>Save Changes</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
