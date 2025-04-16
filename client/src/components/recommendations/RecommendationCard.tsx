import { MapPin, Clock } from "lucide-react";
import { Recommendation } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  // Temporarily removed auth context dependency
  const user = null;
  const { toast } = useToast();
  const [isRsvping, setIsRsvping] = useState(false);
  const { event, matchPercentage, matchReason } = recommendation;

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
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
      <div className="md:flex">
        <div className="md:flex-shrink-0 w-full md:w-48">
          {event.imageUrl && (
            <img 
              className="h-40 md:h-full w-full object-cover"
              src={event.imageUrl}
              alt={event.title}
            />
          )}
        </div>
        <div className="p-5 flex-grow">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="bg-[#FFD54F] text-[#002A5C] text-xs px-2 py-1 rounded-full">
                  {matchPercentage}% Match
                </span>
                <span className="text-neutral-600 text-sm">{event.date}</span>
              </div>
              <h3 className="text-xl font-bold">{event.title}</h3>
            </div>
            <div className="mt-2 md:mt-0">
              <button 
                onClick={handleRSVP}
                disabled={isRsvping}
                className="px-4 py-2 bg-[#002A5C] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {isRsvping ? "Processing..." : "RSVP"}
              </button>
            </div>
          </div>
          <p className="text-neutral-600 mb-3">{event.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {event.categories.map((category, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-[#DAE5F2] text-[#002A5C] rounded-full text-xs"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
