import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import SidebarNavigation from "@/components/SidebarNavigation";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import type { Document } from "@shared/schema";
import { FolderOpen, Plus, Search, FileText, Download, PenLine, CheckCircle2, Clock, Trash2, Shield, Eye } from "lucide-react";

const TYPE_ICONS: Record<string, any> = {
  lease: FileText, loi: FileText, nda: FileText, floor_plan: FileText,
  survey: FileText, environmental: FileText, other: FileText
};

const TYPE_COLORS: Record<string, string> = {
  lease:       "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  loi:         "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  nda:         "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  floor_plan:  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  survey:      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  environmental:"bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  other:       "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const SIG_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  none:    { label: "No Signature",  color: "text-gray-400",  icon: FileText },
  pending: { label: "Sig Pending",   color: "text-yellow-500", icon: Clock },
  signed:  { label: "Signed",        color: "text-green-500",  icon: CheckCircle2 },
};

export default function DocumentVault() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const { data: docs = [], isLoading } = useQuery<Document[]>({ queryKey: ["/api/documents"] });

  const createMutation = useMutation({
    mutationFn: (d: any) => apiRequest("POST", "/api/documents", d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/documents"] }); setShowAdd(false); toast({ title: "Document added to vault" }); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PATCH", `/api/documents/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/documents"] }); toast({ title: "Document updated" }); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/documents/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/documents"] }); toast({ title: "Document removed" }); }
  });

  const form = useForm({ defaultValues: { name: "", type: "other", fileSize: "", signatureStatus: "none" } });

  const filtered = docs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || d.type === typeFilter;
    return matchSearch && matchType;
  });

  const typeCounts = docs.reduce((acc, d) => ({ ...acc, [d.type]: (acc[d.type] || 0) + 1 }), {} as Record<string, number>);

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
                  <FolderOpen className="h-6 w-6 text-primary" /> Document Vault
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Securely store leases, surveys, floor plans, and all property documents</p>
              </div>
              <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white"><Plus className="h-4 w-4 mr-2" />Add Document</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Document to Vault</DialogTitle></DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(d => createMutation.mutate(d))} className="space-y-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Document Name *</FormLabel><FormControl><Input placeholder="Riverfront Tower - Lease Agreement.pdf" {...field} /></FormControl></FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="type" render={({ field }) => (
                          <FormItem><FormLabel>Document Type</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lease">Lease</SelectItem>
                                <SelectItem value="loi">Letter of Intent</SelectItem>
                                <SelectItem value="nda">NDA</SelectItem>
                                <SelectItem value="floor_plan">Floor Plan</SelectItem>
                                <SelectItem value="survey">Survey</SelectItem>
                                <SelectItem value="environmental">Environmental</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="signatureStatus" render={({ field }) => (
                          <FormItem><FormLabel>Signature Status</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Signature Needed</SelectItem>
                                <SelectItem value="pending">Awaiting Signature</SelectItem>
                                <SelectItem value="signed">Signed</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="fileSize" render={({ field }) => (
                        <FormItem><FormLabel>File Size</FormLabel><FormControl><Input placeholder="2.4 MB" {...field} /></FormControl></FormItem>
                      )} />
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                        <Button type="submit" disabled={createMutation.isPending}>Add to Vault</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{docs.length}</div><div className="text-sm text-gray-500">Total Documents</div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-green-600">{docs.filter(d => d.signatureStatus === "signed").length}</div><div className="text-sm text-gray-500">Signed</div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-yellow-600">{docs.filter(d => d.signatureStatus === "pending").length}</div><div className="text-sm text-gray-500">Awaiting Signature</div></CardContent></Card>
              <Card><CardContent className="pt-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /><div><div className="text-sm font-semibold text-primary">Encrypted</div><div className="text-xs text-gray-500">All docs secure</div></div></CardContent></Card>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search documents..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lease">Lease</SelectItem>
                  <SelectItem value="loi">LOI</SelectItem>
                  <SelectItem value="nda">NDA</SelectItem>
                  <SelectItem value="floor_plan">Floor Plan</SelectItem>
                  <SelectItem value="survey">Survey</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document List */}
            {isLoading ? <div className="text-center py-12 text-gray-400">Loading documents...</div> : (
              <div className="grid gap-3">
                {filtered.map(doc => {
                  const typeCfg = TYPE_COLORS[doc.type] || TYPE_COLORS.other;
                  const sigCfg = SIG_CONFIG[doc.signatureStatus || "none"];
                  const SigIcon = sigCfg.icon;
                  return (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 dark:text-white truncate">{doc.name}</div>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge className={`text-xs border-0 ${typeCfg}`}>{doc.type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</Badge>
                                <span className={`flex items-center gap-1 text-xs ${sigCfg.color}`}>
                                  <SigIcon className="h-3 w-3" />{sigCfg.label}
                                </span>
                                {doc.fileSize && <span className="text-xs text-gray-400">{doc.fileSize}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0 ml-4">
                            {doc.signatureStatus === "pending" && (
                              <Button size="sm" variant="outline" className="text-xs h-7 text-yellow-600 border-yellow-300" onClick={() => updateMutation.mutate({ id: doc.id, data: { signatureStatus: "signed" } })}>
                                <PenLine className="h-3 w-3 mr-1" />Sign
                              </Button>
                            )}
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast({ title: "Downloading...", description: doc.name })}>
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => deleteMutation.mutate(doc.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No documents found. Upload your first document.</div>}
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}
