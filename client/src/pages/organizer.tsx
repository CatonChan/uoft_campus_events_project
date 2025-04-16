import { useState, useEffect } from "react";
import NavigationTabs from "@/components/layouts/NavigationTabs";
import OrganizerDashboard from "@/components/organizer/OrganizerDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Organizer() {
  // Using local state for events and loading
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();
  
  // Simulate loading organizer data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <NavigationTabs />
      <div className="text-center py-20">
        <h2 className="text-2xl font-['Roboto_Slab'] font-bold mb-4">Event Organizer Dashboard</h2>
        <p className="text-lg text-neutral-600 mb-6">
          You need to sign in to access the organizer dashboard.
        </p>
        <button 
          onClick={() => toast({
            title: "Authentication Required",
            description: "Please sign in to access the organizer dashboard.",
          })}
          className="px-6 py-3 bg-[#002A5C] text-white rounded-lg font-medium hover:bg-opacity-90 transition"
        >
          Sign In
        </button>
      </div>
    </>
  );
}
