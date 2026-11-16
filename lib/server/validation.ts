import { z } from "zod";

export const newsletterSubscriptionSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
});

export const waitlistEntrySchema = z.object({
  category: z.enum(["Driver", "Rider"]),
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  whatsappPhone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .refine(
      (value) => /^(?:\+?[1-9]\d{7,14}|0\d{7,14})$/.test(value),
      "Enter a valid WhatsApp phone number.",
    ),
});
