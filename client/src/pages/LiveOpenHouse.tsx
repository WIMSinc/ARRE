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
import type { OpenHouseSession, Property } from "@shared/schema";
import { Video, Plus, Users, Calendar, Play, Square, CheckCircle2, Clock, Eye, Share2, Mic, MicOff, VideoIcon, Settings } from "lucide-react";
import { format, parseISO } from "date-fns";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  scheduled:  { label: "Scheduled",  color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",   icon: Clock },
  live:       { label: "LIVE",       color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",       icon: Play },
  completed:  { label: "Completed",  color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", icon: CheckCircle2 },
  cancelled:  { label: "Cancelled",  color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",      icon: Square },
};

export default function LiveOpenHouse() {
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [liveSession, setLiveSession] = useState<OpenHouseSession | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const { data: sessions = [], isLoading } = useQuery<OpenHouseSession[]>({ queryKey: ["/api/open-house-sessions"] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });

  const createMutation = useMutation({
    mutationFn: (d: any) => apiRequest("POST", "/api/open-house-sessions", d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/open-house-sessions"] }); setShowAdd(false); toast({ title: "Session scheduled" }); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PATCH", `/api/open-house-sessions/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/open-house-sessions"] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/open-house-sessions/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/open-house-sessions"] }); toast({ title: "Session removed" }); }
  });

  const form = useForm({ defaultValues: { title: "", propertyId: "", maxAttendees: "25", scheduledAt: "", notes: "" } });

  const goLive = (session: OpenHouseSession) => {
    updateMutation.mutate({ id: session.id, data: { status: "live" } });
    setLiveSession(session);
    toast({ title: "You're live!", description: `${session.title} is now broadcasting to attendees.` });
  };

  const endSession = (session: OpenHouseSession) => {
    updateMutation.mutate({ id: session.id, data: { status: "completed" } });
    setLiveSession(null);
    toast({ title: "Session ended", description: "Recording will be available shortly." });
  };

  const scheduled = sessions.filter(s => s.status === "scheduled");
  const live = sessions.filter(s => s.status === "live");
  const past = sessions.filter(s => s.status === "completed" || s.status === "cancelled");

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
                  <Video className="h-6 w-6 text-primary" /> Live Virtual Open Houses
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Host immersive VR property tours for multiple clients simultaneously</p>
              </div>
              <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-white"><Plus className="h-4 w-4 mr-2" />Schedule Session</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Schedule Open House</DialogTitle></DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(d => createMutation.mutate({ ...d, propertyId: parseInt(d.propertyId), maxAttendees: parseInt(d.maxAttendees), scheduledAt: d.scheduledAt ? new Date(d.scheduledAt).toISOString() : null }))} className="space-y-4">
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Session Title *</FormLabel><FormControl><Input placeholder="Riverfront Tower VR Open House" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="propertyId" render={({ field }) => (
                        <FormItem><FormLabel>Property *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                            <SelectContent>{properties.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="scheduledAt" render={({ field }) => (
                          <FormItem><FormLabel>Date & Time</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="maxAttendees" render={({ field }) => (
                          <FormItem><FormLabel>Max Attendees</FormLabel><FormControl><Input type="number" min="1" max="500" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea rows={2} placeholder="What will you showcase in this session?" {...field} /></FormControl></FormItem>
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

            {/* Live Now Banner */}
            {live.length > 0 && (
              <div className="mb-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-red-700 dark:text-red-400">{live[0].title} is LIVE</span>
                  <Badge className="bg-red-100 text-red-700 border-0 text-xs">{live[0].attendeeCount} attending</Badge>
                </div>
                <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => setLiveSession(live[0])}>
                  <Eye className="h-4 w-4 mr-1" />View Session
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-blue-600">{scheduled.length}</div><div className="text-sm text-gray-500">Upcoming</div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-red-600">{live.length}</div><div className="text-sm text-gray-500">Live Now</div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-green-600">{past.length}</div><div className="text-sm text-gray-500">Completed</div></CardContent></Card>
            </div>

            {/* Scheduled Sessions */}
            {scheduled.length > 0 && (
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Upcoming Sessions</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {scheduled.map(session => (
                    <Card key={session.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{session.title}</div>
                            {session.scheduledAt && <div className="text-sm text-gray-500 mt-0.5"><Calendar className="inline h-3.5 w-3.5 mr-1" />{format(new Date(session.scheduledAt), "MMM d, yyyy 'at' h:mm a")}</div>}
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0 text-xs">Scheduled</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <Users className="h-4 w-4" />
                          <span>Up to {session.maxAttendees} attendees</span>
                        </div>
                        {session.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{session.notes}</p>}
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => goLive(session)}>
                            <Play className="h-3.5 w-3.5 mr-1" />Go Live
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-3.5 w-3.5 mr-1" />Share Link
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-500 ml-auto" onClick={() => deleteMutation.mutate(session.id)}>Cancel</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Sessions */}
            {past.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Past Sessions</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {past.map(session => {
                    const cfg = STATUS_CONFIG[session.status];
                    const Icon = cfg.icon;
                    return (
                      <Card key={session.id} className="opacity-80">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-800 dark:text-gray-200">{session.title}</div>
                            <Badge className={`${cfg.color} border-0 text-xs`}><Icon className="h-3 w-3 mr-1" />{cfg.label}</Badge>
                          </div>
                          {session.scheduledAt && <div className="text-sm text-gray-400 mb-2"><Calendar className="inline h-3.5 w-3.5 mr-1" />{format(new Date(session.scheduledAt), "MMM d, yyyy")}</div>}
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span><Users className="inline h-3.5 w-3.5 mr-1" />{session.attendeeCount} attended</span>
                            {session.recordingUrl && <Button size="sm" variant="link" className="p-0 h-auto text-primary">View Recording</Button>}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {sessions.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sessions yet. Schedule your first virtual open house!</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileNavigation />

      {/* Live Session Console */}
      {liveSession && (
        <Dialog open={!!liveSession} onOpenChange={() => setLiveSession(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                LIVE: {liveSession.title}
              </DialogTitle>
            </DialogHeader>
            <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="text-white text-center">
                <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm opacity-70">VR Session Active — Clients are viewing the property</p>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className="bg-red-600 text-white border-0 animate-pulse">● LIVE</Badge>
                <Badge className="bg-black/60 text-white border-0"><Users className="h-3 w-3 mr-1 inline" />{liveSession.attendeeCount} watching</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => setMicOn(!micOn)}>
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
                </Button>
                <Button size="icon" variant="outline" onClick={() => setCamOn(!camOn)}>
                  {camOn ? <VideoIcon className="h-4 w-4" /> : <VideoIcon className="h-4 w-4 text-red-500" />}
                </Button>
                <Button size="icon" variant="outline"><Settings className="h-4 w-4" /></Button>
              </div>
              <Button variant="destructive" onClick={() => { liveSession && endSession(liveSession); }}>
                <Square className="h-4 w-4 mr-2" />End Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
