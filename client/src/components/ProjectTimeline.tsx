import { useState } from "react";
import { Check, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimelineEvent } from "@shared/schema";
import { format } from "date-fns";

interface ProjectTimelineProps {
  events: TimelineEvent[];
}

const ProjectTimeline = ({ events }: ProjectTimelineProps) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming'>('all');
  
  // Filter events based on current filter
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'completed') return event.completed;
    if (filter === 'upcoming') return !event.completed;
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-lg dark:text-white">Project Timeline</h3>
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            className={filter === 'all' ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" : ""}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'completed' ? 'default' : 'outline'} 
            size="sm"
            className={filter === 'completed' ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" : ""}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
          <Button 
            variant={filter === 'upcoming' ? 'default' : 'outline'} 
            size="sm"
            className={filter === 'upcoming' ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" : ""}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
        </div>
      </div>
      
      <div className="space-y-5">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => {
            const isLastItem = index === filteredEvents.length - 1;
            const date = new Date(event.date);
            const isToday = new Date().toDateString() === date.toDateString();
            const isYesterday = new Date(Date.now() - 86400000).toDateString() === date.toDateString();
            
            let dateDisplay;
            if (isToday) {
              dateDisplay = "Today";
            } else if (isYesterday) {
              dateDisplay = "Yesterday";
            } else {
              dateDisplay = format(date, "MMM d, yyyy");
            }
            
            return (
              <div 
                key={event.id} 
                className={`relative pl-8 ${isLastItem ? '' : 'pb-5 border-l-2 border-' + (event.completed ? 'success' : 'gray-200 dark:border-gray-700')}`}
              >
                <div 
                  className={`absolute left-[-8px] top-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                    event.completed 
                      ? 'bg-success dark:bg-success' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                ></div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">{event.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.description}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{dateDisplay}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No timeline events matching your filter
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTimeline;
