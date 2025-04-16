import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  clubs, type Club, type InsertClub,
  rsvps, type Rsvp, type InsertRsvp,
  clubFollowers, type ClubFollower, type InsertClubFollower 
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  getEventsByOrganizer(organizerId: number): Promise<Event[]>;
  getEventsByUser(userId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, eventData: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // RSVP operations
  getRsvps(eventId: number): Promise<Rsvp[]>;
  getRsvpsByUser(userId: number): Promise<Rsvp[]>;
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  deleteRsvp(eventId: number, userId: number): Promise<boolean>;
  
  // Club operations
  getClubs(): Promise<Club[]>;
  getClub(id: number): Promise<Club | undefined>;
  getRecommendedClubs(userId: number): Promise<Club[]>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, clubData: Partial<Club>): Promise<Club | undefined>;
  deleteClub(id: number): Promise<boolean>;
  
  // Club follower operations
  getClubFollowers(clubId: number): Promise<ClubFollower[]>;
  getClubFollowersByUser(userId: number): Promise<ClubFollower[]>;
  createClubFollower(follower: InsertClubFollower): Promise<ClubFollower>;
  deleteClubFollower(clubId: number, userId: number): Promise<boolean>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private rsvps: Map<number, Rsvp>;
  private clubs: Map<number, Club>;
  private clubFollowers: Map<number, ClubFollower>;
  private userIdCounter: number;
  private eventIdCounter: number;
  private rsvpIdCounter: number;
  private clubIdCounter: number;
  private clubFollowerIdCounter: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.rsvps = new Map();
    this.clubs = new Map();
    this.clubFollowers = new Map();
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.rsvpIdCounter = 1;
    this.clubIdCounter = 1;
    this.clubFollowerIdCounter = 1;
    
    // Adding sample data for testing
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample user
    const sampleUser: InsertUser = {
      username: "alex",
      password: "password123",
      name: "Alex Kim",
      major: "Computer Science",
      year: "3rd Year",
      interests: ["Technology", "Entrepreneurship", "Sports"]
    };
    this.createUser(sampleUser);

    // Sample events
    const sampleEvents: InsertEvent[] = [
      {
        title: "Technology Career Fair",
        description: "Connect with top tech companies recruiting UofT students for internships and full-time positions. Companies include Google, Microsoft, Amazon, and local startups.",
        date: "Tomorrow",
        time: "2:00-5:00 PM",
        location: "Myhal Centre, Main Auditorium",
        categories: ["Career", "Technology", "Networking"],
        imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        featured: true,
        organizerId: 1,
        organizer: "UofT Career Centre"
      },
      {
        title: "Entrepreneurship Workshop",
        description: "Learn from successful founders about building startups while in university.",
        date: "Friday",
        time: "3:00-5:00 PM",
        location: "Rotman School",
        categories: ["Entrepreneurship", "Business", "Workshop"],
        imageUrl: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
        organizerId: 1,
        organizer: "Entrepreneurship Association"
      },
      {
        title: "AI Research Showcase",
        description: "Learn about cutting-edge AI research from UofT's top labs and professors.",
        date: "Thursday",
        time: "1:00-4:00 PM",
        location: "Bahen Centre",
        categories: ["Technology", "AI/ML", "Research"],
        imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
        organizerId: 1,
        organizer: "AI Research Group"
      },
      {
        title: "Campus Concert Series",
        description: "Live music featuring student bands and local artists at Hart House.",
        date: "Saturday",
        time: "7:00-10:00 PM",
        location: "Hart House",
        categories: ["Music", "Arts", "Social"],
        imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
        organizerId: 1,
        organizer: "Hart House Music Committee"
      },
      {
        title: "Cultural Festival",
        description: "Celebrate diversity with food, performances, and activities from different cultures.",
        date: "Next Week",
        time: "12:00-6:00 PM",
        location: "King's College Circle",
        categories: ["Cultural", "Food", "Social"],
        imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80",
        organizerId: 1,
        organizer: "Cultural Clubs Association"
      }
    ];

    for (const event of sampleEvents) {
      this.createEvent(event);
    }

    // Sample clubs
    const sampleClubs: InsertClub[] = [
      {
        name: "Computer Science Society",
        description: "Community for CS students with workshops, hackathons, and social events.",
        categories: ["Technology", "Academic"],
        imageUrl: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Entrepreneurship Association",
        description: "Supporting student entrepreneurs with resources, mentorship, and pitch competitions.",
        categories: ["Business", "Entrepreneurship"],
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "AI Research Group",
        description: "Student-led group exploring cutting-edge AI topics through research projects.",
        categories: ["Technology", "AI/ML", "Research"],
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      }
    ];

    for (const club of sampleClubs) {
      this.createClub(club);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventsByOrganizer(organizerId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.organizerId === organizerId
    );
  }

  async getEventsByUser(userId: number): Promise<Event[]> {
    // Get all RSVPs by this user
    const userRsvps = await this.getRsvpsByUser(userId);
    
    // Get the event IDs from RSVPs
    const eventIds = userRsvps.map(rsvp => rsvp.eventId);
    
    // Return all events that match these IDs
    return Array.from(this.events.values()).filter(
      (event) => eventIds.includes(event.id)
    );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const createdAt = new Date();
    const event: Event = { ...insertEvent, id, createdAt };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event | undefined> {
    const event = await this.getEvent(id);
    if (!event) return undefined;

    const updatedEvent = { ...event, ...eventData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // RSVP operations
  async getRsvps(eventId: number): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values()).filter(
      (rsvp) => rsvp.eventId === eventId
    );
  }

  async getRsvpsByUser(userId: number): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values()).filter(
      (rsvp) => rsvp.userId === userId
    );
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    // Check if RSVP already exists
    const existingRsvp = Array.from(this.rsvps.values()).find(
      (rsvp) => rsvp.eventId === insertRsvp.eventId && rsvp.userId === insertRsvp.userId
    );

    if (existingRsvp) {
      // Update status if it already exists
      existingRsvp.status = insertRsvp.status;
      return existingRsvp;
    }

    const id = this.rsvpIdCounter++;
    const createdAt = new Date();
    const rsvp: Rsvp = { ...insertRsvp, id, createdAt };
    this.rsvps.set(id, rsvp);
    return rsvp;
  }

  async deleteRsvp(eventId: number, userId: number): Promise<boolean> {
    const rsvp = Array.from(this.rsvps.values()).find(
      (r) => r.eventId === eventId && r.userId === userId
    );
    
    if (!rsvp) return false;
    return this.rsvps.delete(rsvp.id);
  }

  // Club operations
  async getClubs(): Promise<Club[]> {
    return Array.from(this.clubs.values());
  }

  async getClub(id: number): Promise<Club | undefined> {
    return this.clubs.get(id);
  }

  async getRecommendedClubs(userId: number): Promise<Club[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    // Simple recommendation based on matching categories and interests
    return Array.from(this.clubs.values()).filter(club => {
      return club.categories.some(category => 
        user.interests.some(interest => 
          category.toLowerCase().includes(interest.toLowerCase()) || 
          interest.toLowerCase().includes(category.toLowerCase())
        )
      );
    });
  }

  async createClub(insertClub: InsertClub): Promise<Club> {
    const id = this.clubIdCounter++;
    const createdAt = new Date();
    const club: Club = { ...insertClub, id, createdAt };
    this.clubs.set(id, club);
    return club;
  }

  async updateClub(id: number, clubData: Partial<Club>): Promise<Club | undefined> {
    const club = await this.getClub(id);
    if (!club) return undefined;

    const updatedClub = { ...club, ...clubData };
    this.clubs.set(id, updatedClub);
    return updatedClub;
  }

  async deleteClub(id: number): Promise<boolean> {
    return this.clubs.delete(id);
  }

  // Club follower operations
  async getClubFollowers(clubId: number): Promise<ClubFollower[]> {
    return Array.from(this.clubFollowers.values()).filter(
      (follower) => follower.clubId === clubId
    );
  }

  async getClubFollowersByUser(userId: number): Promise<ClubFollower[]> {
    return Array.from(this.clubFollowers.values()).filter(
      (follower) => follower.userId === userId
    );
  }

  async createClubFollower(insertFollower: InsertClubFollower): Promise<ClubFollower> {
    // Check if follow relationship already exists
    const existingFollow = Array.from(this.clubFollowers.values()).find(
      (f) => f.clubId === insertFollower.clubId && f.userId === insertFollower.userId
    );

    if (existingFollow) {
      return existingFollow;
    }

    const id = this.clubFollowerIdCounter++;
    const createdAt = new Date();
    const follower: ClubFollower = { ...insertFollower, id, createdAt };
    this.clubFollowers.set(id, follower);
    return follower;
  }

  async deleteClubFollower(clubId: number, userId: number): Promise<boolean> {
    const follower = Array.from(this.clubFollowers.values()).find(
      (f) => f.clubId === clubId && f.userId === userId
    );
    
    if (!follower) return false;
    return this.clubFollowers.delete(follower.id);
  }
}

export const storage = new MemStorage();
