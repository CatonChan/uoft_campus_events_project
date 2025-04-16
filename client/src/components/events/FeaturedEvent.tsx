import { MapPin } from "lucide-react";
import { Event } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";

interface FeaturedEventProps {
  event: Event;
}

const FeaturedEvent = ({ event }: FeaturedEventProps) => {
  // Temporary fix - will be replaced with auth context
  const user = null;
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
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 w-full md:w-1/3">
            {event.imageUrl && (
              <img 
                className="h-48 w-full md:h-full object-cover"
                src={event.imageUrl}
                alt={event.title}
              />
            )}
          </div>
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <span className="bg-[#FFD54F] px-3 py-1 text-[#002A5C] text-sm font-medium rounded-full">
                  Featured
                </span>
                <span className="ml-2 text-sm text-neutral-600">{event.date}, {event.time}</span>
              </div>
              <h3 className="text-xl font-bold font-['Roboto_Slab'] mb-2">{event.title}</h3>
              <p className="text-neutral-600 mb-3">{event.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {event.categories.map((category, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-[#DAE5F2] text-[#002A5C] rounded-full text-xs"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-neutral-600 mr-1" />
                <span className="text-neutral-600 text-sm">{event.location}</span>
              </div>
              <button 
                onClick={handleRSVP}
                disabled={isRsvping}
                className="ml-4 px-4 py-2 bg-[#002A5C] text-white rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {isRsvping ? "Processing..." : "RSVP Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
