import { useState, useEffect } from "react";
import NavigationTabs from "@/components/layouts/NavigationTabs";
import RecommendationCard from "@/components/recommendations/RecommendationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Recommendation } from "@/types";
import { Lightbulb } from "lucide-react";

export default function Recommendations() {
  // Temporary hardcoded user for development - will be replaced with auth context
  const user = null;
  
  // Mock data for recommendations
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  // Simulate loading recommendations from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecommendations([
        {
          event: {
            id: 1,
            title: 'AI Research Showcase',
            description: 'Explore the latest AI research projects from UofT students and faculty.',
            date: 'April 22, 2025',
            time: '2:00 PM - 5:00 PM',
            location: 'Myhal Centre',
            categories: ['Technology', 'Research'],
            organizer: 'Computer Science Student Union',
            organizerId: 1,
            imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          },
          matchPercentage: 92,
          matchReason: 'Based on your interest in technology and AI research.'
        },
        {
          event: {
            id: 2,
            title: 'Engineering Networking Night',
            description: 'Connect with industry professionals and fellow engineering students.',
            date: 'April 25, 2025',
            time: '6:30 PM - 9:00 PM',
            location: 'Bahen Centre',
            categories: ['Networking', 'Career'],
            organizer: 'Engineering Society',
            organizerId: 2,
            imageUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          },
          matchPercentage: 85,
          matchReason: 'Popular among computer science students.'
        }
      ]);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <NavigationTabs />

      <h2 className="text-2xl font-['Roboto_Slab'] font-bold mb-6">Recommended for You</h2>
      
      <div className="bg-neutral-100 rounded-xl p-5 mb-8 border border-neutral-200">
        <div className="flex items-center mb-3">
          <Lightbulb className="h-6 w-6 text-[#002A5C] mr-2" />
          <h3 className="text-lg font-bold">AI-Powered Recommendations</h3>
        </div>
        <p className="text-neutral-700 mb-3">Sign in to get personalized event recommendations based on your interests and major.</p>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : recommendations?.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((recommendation: Recommendation) => (
            <RecommendationCard 
              key={recommendation.event.id} 
              recommendation={recommendation} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <h3 className="text-xl font-medium mb-2">No recommendations available</h3>
          <p className="text-neutral-600 mb-4">
            Update your profile with more interests to get personalized recommendations.
          </p>
          {!user && (
            <button className="px-6 py-2 bg-[#002A5C] text-white rounded-lg font-medium hover:bg-opacity-90 transition">
              Sign In to Get Recommendations
            </button>
          )}
        </div>
      )}
    </>
  );
}
