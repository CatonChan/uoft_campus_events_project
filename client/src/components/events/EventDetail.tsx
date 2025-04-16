import { MapPin, Calendar, Clock, User, Tag } from "lucide-react";
import { Event } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";

interface EventDetailProps {
  event: Event;
  onClose: () => void;
}

const EventDetail = ({ event, onClose }: EventDetailProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRsvping, setIsRsvping] = useState(false);

  const handleRSVP = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to RSVP for events.",
        variant: "destructive",
      });
      return;
    }

    setIsRsvping(true);
    try {
      await apiRequest('POST', `/api/events/${event.id}/rsvp`, { status: 'attending' });
      toast({
        title: "RSVP Successful",
        description: `You've successfully registered for ${event.title}.`,
      });
      
      // Invalidate events queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    } catch (error) {
      toast({
        title: "RSVP Failed",
        description: "There was an error processing your RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRsvping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold font-['Roboto_Slab']">{event.title}</h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-neutral-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <User className="h-5 w-5 mr-2" />
              <span>Organized by {event.organizer}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">About This Event</h3>
            <p className="text-neutral-600">{event.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {event.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#DAE5F2] text-[#002A5C] rounded-full text-sm flex items-center"
                >
                  <Tag className="h-4 w-4 mr-1" />
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition"
            >
              Close
            </button>
            <button
              onClick={handleRSVP}
              disabled={isRsvping}
              className="px-4 py-2 bg-[#002A5C] text-white rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {isRsvping ? "Processing..." : "RSVP Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
