import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  horoscopeSign: text("horoscope_sign").notNull(),
  mood: text("mood").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubmissionSchema = createInsertSchema(submissions).pick({
  email: true,
  horoscopeSign: true,
  mood: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  horoscopeSign: z.string().min(1, "Please select your horoscope sign"),
  mood: z.string().min(1, "Please describe your current mood").max(500, "Mood description is too long"),
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Horoscope sign options
export const horoscopeSigns = [
  { value: "aries", label: "♈ Aries (March 21 - April 19)" },
  { value: "taurus", label: "♉ Taurus (April 20 - May 20)" },
  { value: "gemini", label: "♊ Gemini (May 21 - June 20)" },
  { value: "cancer", label: "♋ Cancer (June 21 - July 22)" },
  { value: "leo", label: "♌ Leo (July 23 - August 22)" },
  { value: "virgo", label: "♍ Virgo (August 23 - September 22)" },
  { value: "libra", label: "♎ Libra (September 23 - October 22)" },
  { value: "scorpio", label: "♏ Scorpio (October 23 - November 21)" },
  { value: "sagittarius", label: "♐ Sagittarius (November 22 - December 21)" },
  { value: "capricorn", label: "♑ Capricorn (December 22 - January 19)" },
  { value: "aquarius", label: "♒ Aquarius (January 20 - February 18)" },
  { value: "pisces", label: "♓ Pisces (February 19 - March 20)" },
] as const;
