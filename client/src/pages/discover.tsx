import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import NavigationTabs from "@/components/layouts/NavigationTabs";
import SearchFilters from "@/components/events/SearchFilters";
import EventCard from "@/components/events/EventCard";
import FeaturedEvent from "@/components/events/FeaturedEvent";
import EventDetail from "@/components/events/EventDetail";
import { Event, EventFilterOptions } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Discover() {
  const [filters, setFilters] = useState<EventFilterOptions>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Query for events
  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/events', filters],
  });

  // Find a featured event (first event marked as featured, or just the first event)
  const featuredEvent = events?.find((event: Event) => event.featured) || (events?.length > 0 ? events[0] : null);
  
  // Filter out the featured event from the regular list
  const regularEvents = featuredEvent 
    ? events?.filter((event: Event) => event.id !== featuredEvent.id)
    : events;

  return (
    <>
      <NavigationTabs />
      <SearchFilters onFilterChange={setFilters} />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : events?.length > 0 ? (
        <>
          {featuredEvent && <FeaturedEvent event={featuredEvent} />}

          <h2 className="text-2xl font-['Roboto_Slab'] font-bold mb-6">Events This Week</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularEvents?.map((event: Event) => (
              <div key={event.id} onClick={() => setSelectedEvent(event)}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
          
          {regularEvents?.length > 6 && (
            <div className="mt-8 text-center">
              <button className="px-6 py-2 border border-[#002A5C] text-[#002A5C] rounded-lg font-medium hover:bg-[#DAE5F2] transition">
                Load More Events
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium mb-2">No events found</h3>
          <p className="text-neutral-600">
            Try adjusting your filters or check back later for new events.
          </p>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
