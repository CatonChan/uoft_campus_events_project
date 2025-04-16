import OpenAI from "openai";
import { Event, User } from "@shared/schema";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-demo-key" });

interface RecommendationResult {
  event: Event;
  matchPercentage: number;
  matchReason: string;
}

// Function to get AI-powered event recommendations
export async function getRecommendations(
  user: User,
  events: Event[]
): Promise<RecommendationResult[]> {
  try {
    // If OpenAI key is missing, use basic recommendations
    if (!process.env.OPENAI_API_KEY) {
      return getBasicRecommendations(user, events);
    }
    
    // Create the user profile and events context for the AI
    const userProfileContext = `
      User Profile:
      - Name: ${user.name}
      - Major: ${user.major}
      - Year: ${user.year}
      - Interests: ${user.interests.join(', ')}
    `;
    
    const eventsContext = events.map((event, index) => `
      Event ${index + 1}:
      - ID: ${event.id}
      - Title: ${event.title}
      - Description: ${event.description}
      - Categories: ${event.categories.join(', ')}
      - Date: ${event.date}
      - Time: ${event.time}
      - Location: ${event.location}
    `).join('\n');
    
    const prompt = `
      You are an AI assistant for a campus event discovery platform. I have a student's profile and a list of events.
      I need you to recommend the most relevant events for this student.
      
      ${userProfileContext}
      
      Available Events:
      ${eventsContext}
      
      For each event, determine:
      1. A match percentage (0-100) based on how relevant the event is to the user's major, year, and interests
      2. A brief reason explaining why you think the event is a good match for the user
      
      Return ONLY a JSON array of event recommendations with the following structure:
      [
        {
          "eventId": number,
          "matchPercentage": number,
          "matchReason": string
        }
      ]
      
      Limit to 5 events with the highest match percentage. Sort by match percentage in descending order.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to get AI recommendations");
    }
    
    const aiRecommendations = JSON.parse(content);
    
    // Map AI recommendations to actual events and format them for the frontend
    const recommendations = aiRecommendations.recommendations || [];
    return recommendations.map((recommendation: any) => {
      const event = events.find(e => e.id === recommendation.eventId);
      if (!event) return null;
      
      return {
        event,
        matchPercentage: recommendation.matchPercentage,
        matchReason: recommendation.matchReason
      };
    }).filter(Boolean);
  } catch (error) {
    console.error("AI recommendation error:", error);
    // Fallback to basic recommendations
    return getBasicRecommendations(user, events);
  }
}

// Basic recommendation system as fallback
function getBasicRecommendations(user: User, events: Event[]): RecommendationResult[] {
  const results = events.map(event => {
    // Calculate match based on interests and major
    let matchScore = 0;
    let matchReasons = [];
    
    // Match event categories to user interests
    for (const category of event.categories) {
      for (const interest of user.interests) {
        if (
          category.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(category.toLowerCase())
        ) {
          matchScore += 20;
          matchReasons.push(`Matches your interest in ${interest}`);
          break;
        }
      }
    }
    
    // Match event categories to user major
    for (const category of event.categories) {
      if (
        category.toLowerCase().includes(user.major.toLowerCase()) ||
        user.major.toLowerCase().includes(category.toLowerCase())
      ) {
        matchScore += 30;
        matchReasons.push(`Relevant to your major in ${user.major}`);
        break;
      }
    }
    
    // Add some randomness for variety
    matchScore += Math.floor(Math.random() * 10);
    
    // Cap the score at 100
    matchScore = Math.min(Math.max(matchScore, 50), 100);
    
    return {
      event,
      matchPercentage: matchScore,
      matchReason: matchReasons.join('. ') || "Recommended event on campus"
    };
  });
  
  // Sort by match percentage and take top 5
  return results
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 5);
}
