import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertEventSchema, 
  insertRsvpSchema, 
  insertClubSchema, 
  insertClubFollowerSchema 
} from "@shared/schema";
import { getRecommendations } from "./ai";

// Session configuration
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "campus-connect-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production" },
    })
  );

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // User routes
  app.patch("/api/users/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const updatedUser = await storage.updateUser(userId, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/events/organizer", requireAuth, async (req, res) => {
    try {
      const organizerId = req.session.userId!;
      const events = await storage.getEventsByOrganizer(organizerId);
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/events/user", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const events = await storage.getEventsByUser(userId);
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/events", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Add organizer info to the event
      const eventData = {
        ...req.body,
        organizerId: userId,
        organizer: user.name
      };
      
      const validatedData = insertEventSchema.parse(eventData);
      const event = await storage.createEvent(validatedData);
      
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.patch("/api/events/:id", requireAuth, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      // Get the event
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Check if the user is the organizer
      if (event.organizerId !== userId) {
        return res.status(403).json({ message: "You don't have permission to update this event" });
      }
      
      const updatedEvent = await storage.updateEvent(eventId, req.body);
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/events/:id", requireAuth, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      // Get the event
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Check if the user is the organizer
      if (event.organizerId !== userId) {
        return res.status(403).json({ message: "You don't have permission to delete this event" });
      }
      
      await storage.deleteEvent(eventId);
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // RSVP routes
  app.post("/api/events/:id/rsvp", requireAuth, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      const rsvpData = {
        eventId,
        userId,
        status: req.body.status || "attending"
      };
      
      const validatedData = insertRsvpSchema.parse(rsvpData);
      const rsvp = await storage.createRsvp(validatedData);
      
      res.status(201).json(rsvp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.delete("/api/events/:id/rsvp", requireAuth, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      const success = await storage.deleteRsvp(eventId, userId);
      
      if (!success) {
        return res.status(404).json({ message: "RSVP not found" });
      }
      
      res.status(200).json({ message: "RSVP cancelled successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Club routes
  app.get("/api/clubs", async (req, res) => {
    try {
      const clubs = await storage.getClubs();
      res.status(200).json(clubs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const clubId = parseInt(req.params.id);
      const club = await storage.getClub(clubId);
      
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      
      res.status(200).json(club);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/clubs/recommended", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const recommendedClubs = await storage.getRecommendedClubs(userId);
      res.status(200).json(recommendedClubs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/clubs", requireAuth, async (req, res) => {
    try {
      const validatedData = insertClubSchema.parse(req.body);
      const club = await storage.createClub(validatedData);
      
      res.status(201).json(club);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // Club follower routes
  app.post("/api/clubs/:id/follow", requireAuth, async (req, res) => {
    try {
      const clubId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      // Check if club exists
      const club = await storage.getClub(clubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      
      const followerData = {
        clubId,
        userId
      };
      
      const validatedData = insertClubFollowerSchema.parse(followerData);
      const follower = await storage.createClubFollower(validatedData);
      
      res.status(201).json(follower);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.delete("/api/clubs/:id/follow", requireAuth, async (req, res) => {
    try {
      const clubId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      const success = await storage.deleteClubFollower(clubId, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Follow relationship not found" });
      }
      
      res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Recommendation routes
  app.get("/api/recommendations", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const events = await storage.getEvents();
      const recommendations = await getRecommendations(user, events);
      
      res.status(200).json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
