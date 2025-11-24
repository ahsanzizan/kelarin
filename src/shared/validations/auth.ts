import z from "zod";

export const authSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(48, "Username must not exceed 48 characters")
    .regex(
      /^[A-Za-z0-9._-]+$/,
      "Only letters, numbers, dots, underscores, and hyphens allowed"
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AuthFormValues = z.infer<typeof authSchema>;
