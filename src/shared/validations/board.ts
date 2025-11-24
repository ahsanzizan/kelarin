import { z } from "zod";

export const boardSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  color: z.string().default("#fff"),
});

export type BoardSchema = z.infer<typeof boardSchema>;
