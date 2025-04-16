import { useQuery } from "@tanstack/react-query";
import NavigationTabs from "@/components/layouts/NavigationTabs";
import CalendarView from "@/components/calendar/CalendarView";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/types";

export default function Calendar() {
  // Query for user's events (both created and RSVPed)
  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/events/user'],
  });

  return (
    <>
      <NavigationTabs />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-12 w-1/3 rounded-lg" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <CalendarView events={events || []} />
      )}
    </>
  );
}
