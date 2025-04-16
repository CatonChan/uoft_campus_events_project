import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/types";
import { Link } from "wouter";
import { Clock, MapPin, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { queryClient } from "@/lib/queryClient";

interface OrganizerDashboardProps {
  events: Event[];
}

const OrganizerDashboard = ({ events }: OrganizerDashboardProps) => {
  const { user } = useAuth();
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const { toast } = useToast();
  const form = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats for the dashboard
  const upcomingEvents = events.length;
  const totalRSVPs = events.reduce((sum, event) => sum + (event.attendees || 0), 0);
  const avgRSVPs = upcomingEvents > 0 ? Math.round(totalRSVPs / upcomingEvents) : 0;

  const handleCreateEvent = async (data: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create events.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/events', {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        categories: data.categories.split(',').map((cat: string) => cat.trim()),
      });
      
      toast({
        title: "Event Created",
        description: "Your event has been successfully created.",
      });
      
      // Invalidate events queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      
      // Close the dialog and reset form
      setShowCreateEvent(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-['Roboto_Slab'] font-bold">Event Organizer Dashboard</h2>
        <button 
          onClick={() => setShowCreateEvent(true)}
          className="px-4 py-2 bg-[#002A5C] text-white rounded-lg font-medium hover:bg-opacity-90 transition flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          Create Event
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Total Events</h3>
            <span className="text-2xl font-bold text-[#002A5C]">{upcomingEvents}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600">
            <span>{upcomingEvents} Upcoming</span>
            <span>0 Past</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Total RSVPs</h3>
            <span className="text-2xl font-bold text-[#002A5C]">{totalRSVPs}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Across all events</span>
            <span>{avgRSVPs} avg. per event</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Event Views</h3>
            <span className="text-2xl font-bold text-[#002A5C]">--</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Analytics coming soon</span>
            <span></span>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-['Roboto_Slab'] font-bold mb-4">Your Upcoming Events</h3>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="divide-y">
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-3 md:mb-0">
                  <h4 className="font-bold">{event.title}</h4>
                  <div className="text-sm text-neutral-600">
                    {event.date}, {event.time} • {event.location}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                  <div className="bg-[#DAE5F2] text-[#002A5C] rounded-lg px-3 py-1 text-sm font-medium">
                    {event.attendees || 0} RSVPs
                  </div>
                  <Link href={`/events/${event.id}`}>
                    <a className="px-3 py-1 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-100 transition text-center">
                      View Details
                    </a>
                  </Link>
                  <Link href={`/events/${event.id}/edit`}>
                    <a className="px-3 py-1 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-100 transition text-center">
                      Edit
                    </a>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-neutral-600">
              You haven't created any events yet. Click "Create Event" to get started!
            </div>
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-['Roboto_Slab'] font-bold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowCreateEvent(true)}
          className="p-4 bg-white rounded-lg shadow-sm border border-neutral-200 hover:border-[#002A5C] hover:shadow-md transition text-left"
        >
          <svg className="h-6 w-6 text-[#002A5C] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h4 className="font-bold mb-1">Create Event</h4>
          <p className="text-sm text-neutral-600">Add a new event to your calendar</p>
        </button>
        
        <button className="p-4 bg-white rounded-lg shadow-sm border border-neutral-200 hover:border-[#002A5C] hover:shadow-md transition text-left">
          <svg className="h-6 w-6 text-[#002A5C] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h4 className="font-bold mb-1">Manage Attendees</h4>
          <p className="text-sm text-neutral-600">View and export RSVP lists</p>
        </button>
        
        <button className="p-4 bg-white rounded-lg shadow-sm border border-neutral-200 hover:border-[#002A5C] hover:shadow-md transition text-left">
          <svg className="h-6 w-6 text-[#002A5C] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h4 className="font-bold mb-1">View Analytics</h4>
          <p className="text-sm text-neutral-600">Track event performance</p>
        </button>
        
        <button className="p-4 bg-white rounded-lg shadow-sm border border-neutral-200 hover:border-[#002A5C] hover:shadow-md transition text-left">
          <svg className="h-6 w-6 text-[#002A5C] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h4 className="font-bold mb-1">Calendar Settings</h4>
          <p className="text-sm text-neutral-600">Manage event publishing</p>
        </button>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new event.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleCreateEvent)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input 
                id="title" 
                placeholder="Enter event title"
                {...form.register("title", { required: true })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Enter event description"
                {...form.register("description", { required: true })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  placeholder="e.g., September 15"
                  {...form.register("date", { required: true })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  placeholder="e.g., 2:00-5:00 PM"
                  {...form.register("time", { required: true })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="Enter event location"
                {...form.register("location", { required: true })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categories">Categories (comma separated)</Label>
              <Input 
                id="categories" 
                placeholder="e.g., Technology, Career, Networking"
                {...form.register("categories", { required: true })}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateEvent(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerDashboard;
