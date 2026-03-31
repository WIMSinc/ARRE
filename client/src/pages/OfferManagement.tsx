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
import { Textarea } from "@/components/ui/textarea";
import type { Offer, Property } from "@shared/schema";
import { DollarSign, Plus, CheckCircle2, XCircle, RefreshCw, Clock, Trash2, TrendingUp } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: "Pending",    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", icon: Clock },
  accepted:  { label: "Accepted",   color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",   icon: CheckCircle2 },
  countered: { label: "Countered",  color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",       icon: RefreshCw },
  rejected:  { label: "Rejected",   color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",           icon: XCircle },
};

function fmt(v: number | null | undefined) {
  if (!v) return "—";
  return `$${v.toLocaleString()}`;
}

export default function OfferManagement() {
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);

  const { data: offers = [], isLoading } = useQuery<Offer[]>({ queryKey: ["/api/offers"] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });

  const createMutation = useMutation({
    mutationFn: (d: any) => apiRequest("POST", "/api/offers", d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/offers"] }); setShowAdd(false); toast({ title: "Offer recorded" }); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PATCH", `/api/offers/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/offers"] }); toast({ title: "Offer updated" }); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/offers/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/offers"] }); toast({ title: "Offer removed" }); }
  });

  const form = useForm({ defaultValues: { propertyId: "", buyerName: "", amount: "", status: "pending", expiresAt: "", terms: "" } });

  const totalOfferValue = offers.reduce((s, o) => s + (o.amount || 0), 0);
  const acceptedValue = offers.filter(o => o.status === "accepted").reduce((s, o) => s + (o.amount || 0), 0);

  const propMap = properties.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {} as Record<number, string>);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <SidebarNavigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-primary" /> Offer Management
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track, compare, and manage all property offers in one place</p>
              </div>
              <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white"><Plus className="h-4 w-4 mr-2" />Record Offer</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Record New Offer</DialogTitle></DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(d => createMutation.mutate({ ...d, propertyId: parseInt(d.propertyId), amount: parseInt(d.amount) }))} className="space-y-4">
                      <FormField control={form.control} name="propertyId" render={({ field }) => (
                        <FormItem><FormLabel>Property *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                            <SelectContent>{properties.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="buyerName" render={({ field }) => (
                          <FormItem><FormLabel>Buyer / Company *</FormLabel><FormControl><Input placeholder="Vertex Capital" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="amount" render={({ field }) => (
                          <FormItem><FormLabel>Offer Amount ($) *</FormLabel><FormControl><Input type="number" placeholder="5000000" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="status" render={({ field }) => (
                          <FormItem><FormLabel>Status</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>{Object.entries(STATUS_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="expiresAt" render={({ field }) => (
                          <FormItem><FormLabel>Expires</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="terms" render={({ field }) => (
                        <FormItem><FormLabel>Terms / Notes</FormLabel><FormControl><Textarea rows={2} placeholder="Key terms, contingencies..." {...field} /></FormControl></FormItem>
                      )} />
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                        <Button type="submit" disabled={createMutation.isPending}>Record Offer</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{offers.length}</div><div className="text-sm text-gray-500">Total Offers</div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-yellow-600">{offers.filter(o => o.status === "pending").length}</div><div className="text-sm text-gray-500">Pending</div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-green-600">{offers.filter(o => o.status === "accepted").length}</div><div className="text-sm text-gray-500">Accepted</div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="text-xl font-bold text-primary">{fmt(totalOfferValue)}</div><div className="text-sm text-gray-500">Total Value</div></CardContent></Card>
            </div>

            {/* Offers by Property */}
            {isLoading ? <div className="text-center py-12 text-gray-400">Loading offers...</div> : (
              <div className="space-y-3">
                {offers.map(offer => {
                  const cfg = STATUS_CONFIG[offer.status || "pending"];
                  const Icon = cfg.icon;
                  const propName = propMap[offer.propertyId] || "Unknown Property";
                  return (
                    <Card key={offer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 dark:text-white">{offer.buyerName}</span>
                              <Badge className={`${cfg.color} border-0 text-xs`}><Icon className="h-3 w-3 mr-1" />{cfg.label}</Badge>
                            </div>
                            <div className="text-sm text-gray-500">{propName}</div>
                            {offer.terms && <div className="text-xs text-gray-400 mt-1 line-clamp-1">{offer.terms}</div>}
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">{fmt(offer.amount)}</div>
                              {offer.expiresAt && <div className="text-xs text-gray-400">Expires {offer.expiresAt}</div>}
                            </div>
                            <div className="flex flex-col gap-1">
                              {offer.status === "pending" && (
                                <>
                                  <Button size="sm" className="h-6 text-xs bg-green-600 hover:bg-green-700 text-white px-2" onClick={() => updateMutation.mutate({ id: offer.id, data: { status: "accepted" } })}>Accept</Button>
                                  <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => updateMutation.mutate({ id: offer.id, data: { status: "countered" } })}>Counter</Button>
                                </>
                              )}
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400" onClick={() => deleteMutation.mutate(offer.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {offers.length === 0 && <div className="text-center py-12 text-gray-400">No offers recorded yet.</div>}
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}
