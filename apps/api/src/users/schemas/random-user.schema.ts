import { z } from 'zod';

// RandomUser schema (subset of fields we care about)
export const randomUserSchema = z.object({
  id: z.string().uuid(),
  gender: z.string(),
  name: z.object({
    title: z.string(),
    first: z.string(),
    last: z.string(),
  }),
  email: z.string().email(),
  picture: z.object({
    large: z.string().url(),
    medium: z.string().url(),
    thumbnail: z.string().url(),
  }),
});

export type RandomUser = z.infer<typeof randomUserSchema>;
