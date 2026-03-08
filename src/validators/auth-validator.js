import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  language: z.enum(['ar', 'en']).default('ar')
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
