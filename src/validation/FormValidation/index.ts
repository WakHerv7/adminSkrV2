import { z } from "zod"

export const formSchema = z.object({
  email: z.string().min(10, {
    message: 'Email must be at least 10 characters long'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  }),
});
