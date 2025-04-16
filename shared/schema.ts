import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  major: text("major").default("Undeclared"),
  year: text("year").default("1st Year"),
  interests: jsonb("interests").default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  categories: jsonb("categories").default([]).notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  organizerId: integer("organizer_id").references(() => users.id),
  organizer: text("organizer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RSVPs table
export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: text("status").notNull(), // 'attending', 'interested', 'not_attending'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Clubs table
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categories: jsonb("categories").default([]).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Club followers table
export const clubFollowers = pgTable("club_followers", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertRsvpSchema = createInsertSchema(rsvps).omit({ id: true, createdAt: true });
export const insertClubSchema = createInsertSchema(clubs).omit({ id: true, createdAt: true });
export const insertClubFollowerSchema = createInsertSchema(clubFollowers).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type InsertClub = z.infer<typeof insertClubSchema>;
export type InsertClubFollower = z.infer<typeof insertClubFollowerSchema>;

export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Rsvp = typeof rsvps.$inferSelect;
export type Club = typeof clubs.$inferSelect;
export type ClubFollower = typeof clubFollowers.$inferSelect;
