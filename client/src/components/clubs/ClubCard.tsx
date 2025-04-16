import { Club } from "@/types";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ClubCardProps {
  club: Club;
}

const ClubCard = ({ club }: ClubCardProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  // Temporary placeholder for user authentication
  const user = null;
  const { toast } = useToast();

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow clubs.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('POST', `/api/clubs/${club.id}/follow`, {});
      setIsFollowing(true);
      toast({
        title: "Success",
        description: `You are now following ${club.name}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow this club. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {club.imageUrl && (
        <img 
          className="h-32 w-full object-cover"
          src={club.imageUrl}
          alt={club.name}
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{club.name}</h3>
        <p className="text-neutral-600 text-sm mb-3">{club.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            {club.categories.slice(0, 1).map((category, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-[#DAE5F2] text-[#002A5C] rounded-full text-xs"
              >
                {category}
              </span>
            ))}
            {club.categories.length > 1 && (
              <span className="text-xs text-neutral-500">+{club.categories.length - 1} more</span>
            )}
          </div>
          <button 
            onClick={handleFollow}
            disabled={isFollowing}
            className="text-[#002A5C] font-medium text-sm hover:text-opacity-80 transition disabled:opacity-50"
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
