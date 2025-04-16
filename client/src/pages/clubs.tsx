import { useQuery } from "@tanstack/react-query";
import NavigationTabs from "@/components/layouts/NavigationTabs";
import SearchFilters from "@/components/events/SearchFilters";
import ClubCard from "@/components/clubs/ClubCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EventFilterOptions, Club } from "@/types";
import { useState } from "react";

export default function Clubs() {
  const [filters, setFilters] = useState<EventFilterOptions>({});

  // Query for clubs
  const { data: clubs, isLoading } = useQuery({
    queryKey: ['/api/clubs', filters],
  });

  // Query for recommended clubs
  const { data: recommendedClubs, isLoading: isLoadingRecommended } = useQuery({
    queryKey: ['/api/clubs/recommended'],
  });

  return (
    <>
      <NavigationTabs />
      <SearchFilters onFilterChange={setFilters} />

      <h2 className="text-2xl font-['Roboto_Slab'] font-bold mb-6">Clubs & Organizations</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-60 w-full rounded-lg" />
          ))}
        </div>
      ) : clubs?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {clubs.map((club: Club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm mb-8">
          <h3 className="text-xl font-medium mb-1">No clubs found</h3>
          <p className="text-neutral-600">
            Try adjusting your filters or check back later for new clubs.
          </p>
        </div>
      )}
      
      <h3 className="text-xl font-['Roboto_Slab'] font-bold mb-4">Recommended Clubs</h3>
      {isLoadingRecommended ? (
        <Skeleton className="h-60 w-full rounded-xl" />
      ) : recommendedClubs?.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h4 className="font-bold">Clubs Matching Your Interests</h4>
              <span className="text-neutral-600 text-sm">Based on your profile and interests</span>
            </div>
          </div>
          <div className="divide-y">
            {recommendedClubs.map((club: Club) => (
              <div key={club.id} className="p-4 flex justify-between items-center">
                <div>
                  <h5 className="font-medium mb-1">{club.name}</h5>
                  <p className="text-neutral-600 text-sm">{club.description}</p>
                </div>
                <button className="px-3 py-1 border border-[#002A5C] text-[#002A5C] rounded-lg text-sm hover:bg-[#DAE5F2] transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
          <p className="text-neutral-600">
            Sign in and update your profile to get club recommendations based on your interests.
          </p>
        </div>
      )}
      
      <div className="text-center mt-8">
        <button className="px-6 py-2 border border-[#002A5C] text-[#002A5C] rounded-lg font-medium hover:bg-[#DAE5F2] transition">
          Browse All Clubs
        </button>
      </div>
    </>
  );
}
