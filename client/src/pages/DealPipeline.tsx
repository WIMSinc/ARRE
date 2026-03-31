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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { Deal } from "@shared/schema";
import { TrendingUp, Plus, DollarSign, Target, Briefcase, ArrowRight, Edit3, Trash2 } from "lucide-react";

const STAGES = [
  { key: "prospect",     label: "Prospect",      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",     bar: "bg-gray-400" },
  { key: "loi",          label: "LOI",            color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",   bar: "bg-blue-500" },
  { key: "due_diligence",label: "Due Diligence",  color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", bar: "bg-purple-500" },
  { key: "negotiation",  label: "Negotiation",    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300", bar: "bg-orange-500" },
  { key: "closed_won",   label: "Closed Won",     color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", bar: "bg-green-500" },
  { key: "closed_lost",  label: "Closed Lost",    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",     bar: "bg-red-400" },
];

function fmt(v: number | null | undefined) {
  if (!v) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export default function DealPipeline() {
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [editDeal, setEditDeal] = useState<Deal | null>(null);

  const { data: deals = [], isLoading } = useQuery<Deal[]>({ queryKey: ["/api/deals"] });

  const createMutation = useMutation({
    mutationFn: (d: any) => apiRequest("POST", "/api/deals", d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/deals"] }); setShowAdd(false); toast({ title: "Deal added" }); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PATCH", `/api/deals/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/deals"] }); setEditDeal(null); toast({ title: "Deal updated" }); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/deals/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/deals"] }); toast({ title: "Deal removed" }); }
  });

  const form = useForm({ defaultValues: { title: "", stage: "prospect", value: "", probability: "20", notes: "", expectedCloseDate: "" } });
  const editForm = useForm();

  const totalPipeline = deals.filter(d => d.stage !== "closed_lost").reduce((s, d) => s + (d.value || 0), 0);
  const weightedPipeline = deals.filter(d => d.stage !== "closed_lost").reduce((s, d) => s + ((d.value || 0) * (d.probability || 0) / 100), 0);
  const closedWon = deals.filter(d => d.stage === "closed_won").reduce((s, d) => s + (d.value || 0), 0);

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
                  <TrendingUp className="h-6 w-6 text-primary" /> Deal Pipeline
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track transactions from prospect to close</p>
              </div>
              <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white"><Plus className="h-4 w-4 mr-2" />Add Deal</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>New Deal</DialogTitle></DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(d => createMutation.mutate({ ...d, value: parseInt(d.value) || null, probability: parseInt(d.probability) || 0 }))} className="space-y-4">
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Deal Title *</FormLabel><FormControl><Input placeholder="Riverfront Tower - Lease" {...field} /></FormControl></FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="value" render={({ field }) => (
                          <FormItem><FormLabel>Deal Value ($)</FormLabel><FormControl><Input type="number" placeholder="5000000" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="probability" render={({ field }) => (
                          <FormItem><FormLabel>Probability (%)</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="stage" render={({ field }) => (
                          <FormItem><FormLabel>Stage</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>{STAGES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="expectedCloseDate" render={({ field }) => (
                          <FormItem><FormLabel>Expected Close</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl></FormItem>
                      )} />
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                        <Button type="submit" disabled={createMutation.isPending}>Add Deal</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Pipeline Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card><CardContent className="pt-4 flex items-center gap-3"><DollarSign className="h-8 w-8 text-primary opacity-80" /><div><div className="text-xl font-bold">{fmt(totalPipeline)}</div><div className="text-xs text-gray-500">Total Pipeline</div></div></CardContent></Card>
              <Card><CardContent className="pt-4 flex items-center gap-3"><Target className="h-8 w-8 text-blue-500 opacity-80" /><div><div className="text-xl font-bold">{fmt(weightedPipeline)}</div><div className="text-xs text-gray-500">Weighted Value</div></div></CardContent></Card>
              <Card><CardContent className="pt-4 flex items-center gap-3"><Briefcase className="h-8 w-8 text-green-500 opacity-80" /><div><div className="text-xl font-bold">{fmt(closedWon)}</div><div className="text-xs text-gray-500">Closed Won</div></div></CardContent></Card>
            </div>

            {/* Kanban-style pipeline */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {STAGES.filter(s => s.key !== "closed_lost").map(stage => {
                  const stageDeals = deals.filter(d => d.stage === stage.key);
                  return (
                    <div key={stage.key} className="w-64 flex-shrink-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">{stage.label}</span>
                        <Badge className={`text-xs ${stage.color} border-0`}>{stageDeals.length}</Badge>
                      </div>
                      <div className={`h-1 rounded-full ${stage.bar} mb-3 opacity-60`} />
                      <div className="space-y-2">
                        {stageDeals.map(deal => (
                          <Card key={deal.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-3">
                              <div className="font-medium text-sm text-gray-900 dark:text-white mb-1 leading-tight">{deal.title}</div>
                              <div className="text-primary font-semibold text-sm">{fmt(deal.value)}</div>
                              {deal.probability !== null && deal.probability !== undefined && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Probability</span><span>{deal.probability}%</span></div>
                                  <Progress value={deal.probability} className="h-1" />
                                </div>
                              )}
                              {deal.expectedCloseDate && <div className="text-xs text-gray-400 mt-1">Close: {deal.expectedCloseDate}</div>}
                              <div className="flex gap-1 mt-2">
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setEditDeal(deal); editForm.reset({ stage: deal.stage, probability: String(deal.probability || 0), notes: deal.notes || "" }); }}>
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => deleteMutation.mutate(deal.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {stageDeals.length === 0 && <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center text-xs text-gray-400">No deals</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNavigation />

      {/* Edit Deal Dialog */}
      {editDeal && (
        <Dialog open={!!editDeal} onOpenChange={() => setEditDeal(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Update Deal — {editDeal.title}</DialogTitle></DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(d => updateMutation.mutate({ id: editDeal.id, data: { ...d, probability: parseInt(d.probability) } }))} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={editForm.control} name="stage" render={({ field }) => (
                    <FormItem><FormLabel>Stage</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{STAGES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={editForm.control} name="probability" render={({ field }) => (
                    <FormItem><FormLabel>Probability (%)</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} /></FormControl></FormItem>
                  )} />
                </div>
                <FormField control={editForm.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl></FormItem>
                )} />
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setEditDeal(null)}>Cancel</Button>
                  <Button type="submit" disabled={updateMutation.isPending}>Save</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
