import { z } from 'zod';

export const readingDraftSchema = z.object({
  guestEmail: z.string().email().optional(),
  language: z.enum(['ar', 'en']),
  questionCategory: z.enum(['love', 'work', 'money', 'travel', 'family', 'general']),
  selectedModes: z.array(z.enum(['arabic', 'oriental', 'tarot', 'horoscope'])).min(1),
  tone: z.enum(['gentle', 'deep', 'practical', 'poetic']),
  personalDetails: z.object({
    fullName: z.string().min(2),
    birthDate: z.string(),
    gender: z.string().optional(),
    country: z.string().optional()
  })
});
