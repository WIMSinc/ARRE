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
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { CalendarEvent, Property } from "@shared/schema";
import { CalendarDays, Plus, Clock, MapPin, Users, Video, PhoneCall, ClipboardList, Home, Trash2 } from "lucide-react";
import { format, isSameDay, startOfWeek, addDays, isToday } from "date-fns";

const EVENT_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  tour:       { label: "Property Tour",  color: "bg-blue-500",   icon: Home },
  meeting:    { label: "Meeting",        color: "bg-purple-500", icon: Users },
  open_house: { label: "Open House",     color: "bg-red-500",    icon: Video },
  inspection: { label: "Inspection",     color: "bg-orange-500", icon: ClipboardList },
  call:       { label: "Call",           color: "bg-green-500",  icon: PhoneCall },
};

export default function CalendarIntegration() {
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({ queryKey: ["/api/calendar-events"] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });

  const createMutation = useMutation({
    mutationFn: (d: any) => apiRequest("POST", "/api/calendar-events", d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/calendar-events"] }); setShowAdd(false); toast({ title: "Event scheduled" }); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/calendar-events/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/calendar-events"] }); toast({ title: "Event removed" }); }
  });

  const form = useForm({ defaultValues: { title: "", description: "", startTime: "", eventType: "tour", propertyId: "" } });

  const weekStart = startOfWeek(viewDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (day: Date) =>
    events.filter(e => isSameDay(new Date(e.startTime), day));

  const upcomingEvents = events
    .filter(e => new Date(e.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 8);

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
                  <CalendarDays className="h-6 w-6 text-primary" /> Calendar
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Schedule tours, meetings, inspections, and open houses</p>
              </div>
              <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white"><Plus className="h-4 w-4 mr-2" />Add Event</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Schedule Event</DialogTitle></DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(d => createMutation.mutate({ ...d, propertyId: d.propertyId ? parseInt(d.propertyId) : null, startTime: new Date(d.startTime).toISOString() }))} className="space-y-4">
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Event Title *</FormLabel><FormControl><Input placeholder="Vertex Capital - Property Tour" {...field} /></FormControl></FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="eventType" render={({ field }) => (
                          <FormItem><FormLabel>Event Type</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {Object.entries(EVENT_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="propertyId" render={({ field }) => (
                          <FormItem><FormLabel>Property</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No property</SelectItem>
                                {properties.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="startTime" render={({ field }) => (
                        <FormItem><FormLabel>Date & Time *</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl></FormItem>
                      )} />
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                        <Button type="submit" disabled={createMutation.isPending}>Schedule</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Weekly Calendar */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{format(weekStart, "MMMM yyyy")}</CardTitle>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setViewDate(addDays(viewDate, -7))}>‹</Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setViewDate(new Date())}>Today</Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setViewDate(addDays(viewDate, 7))}>›</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                        <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {weekDays.map(day => {
                        const dayEvents = getEventsForDay(day);
                        const today = isToday(day);
                        return (
                          <div key={day.toISOString()} className={`min-h-20 rounded-lg p-1.5 border ${today ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-transparent"}`}>
                            <div className={`text-xs font-medium mb-1 ${today ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}>{format(day, "d")}</div>
                            <div className="space-y-0.5">
                              {dayEvents.slice(0, 3).map(e => {
                                const cfg = EVENT_CONFIG[e.eventType] || EVENT_CONFIG.meeting;
                                return (
                                  <div key={e.id} className={`text-white text-xs px-1 py-0.5 rounded truncate ${cfg.color}`} title={e.title}>
                                    {e.title}
                                  </div>
                                );
                              })}
                              {dayEvents.length > 3 && <div className="text-xs text-gray-400">+{dayEvents.length - 3}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Events Sidebar */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Upcoming Events</h3>
                {isLoading ? <div className="text-sm text-gray-400">Loading...</div> : (
                  <div className="space-y-3">
                    {upcomingEvents.map(event => {
                      const cfg = EVENT_CONFIG[event.eventType] || EVENT_CONFIG.meeting;
                      const Icon = cfg.icon;
                      return (
                        <Card key={event.id} className="hover:shadow-sm transition-shadow">
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <div className={`w-7 h-7 rounded-lg ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="h-3.5 w-3.5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{event.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />{format(new Date(event.startTime), "MMM d 'at' h:mm a")}
                                </div>
                                {event.description && <div className="text-xs text-gray-400 mt-1 truncate">{event.description}</div>}
                              </div>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 flex-shrink-0" onClick={() => deleteMutation.mutate(event.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {upcomingEvents.length === 0 && <div className="text-sm text-gray-400 text-center py-6">No upcoming events</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}
