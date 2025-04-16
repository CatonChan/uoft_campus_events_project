export interface User {
  id: number;
  username: string;
  name: string;
  major: string;
  year: string;
  interests: string[];
  avatar?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  categories: string[];
  organizer: string;
  organizerId: number;
  imageUrl?: string;
  featured?: boolean;
  attendees?: number;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  categories: string[];
  imageUrl?: string;
  followers?: number;
}

export interface Recommendation {
  event: Event;
  matchPercentage: number;
  matchReason: string;
}

export interface EventFilterOptions {
  category?: string;
  location?: string;
  date?: string;
  search?: string;
}

export interface RSVPResponse {
  eventId: number;
  userId: number;
  status: 'attending' | 'interested' | 'not_attending';
}
