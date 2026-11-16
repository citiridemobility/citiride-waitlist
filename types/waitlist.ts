export const WAITLIST_CATEGORIES = ["Driver", "Rider"] as const;

export type WaitlistCategory = (typeof WAITLIST_CATEGORIES)[number];

export type WaitlistEntryPayload = {
  category: WaitlistCategory;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  email: string;
  whatsappPhone: string;
};

export type WaitlistApiResponse = {
  message: string;
};
