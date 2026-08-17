import { z } from "zod";

export const workDateSchema = z.object({
  date: z.string(),
  status: z.enum([
    "schedule",
    "off",
    "leave",
  ]),
});

export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter"),

  password: z.string().optional(),

  isActive: z.boolean(),

  user_profile: z.object({
    name: z.string().optional(),

    email: z.string(),

    status: z
      .enum(["Active", "Non-Active"])
      .optional(),

    image: z.string().optional(),

    phone: z.string().optional(),
  }),

  branch_ids: z
    .array(z.string())
    .min(1, "Pilih minimal 1 cabang"),

  shift_id: z
    .string()
    .min(1, "Pilih minimal 1 shift"),

  department_id: z
    .string()
    .min(1, "Pilih minimal 1 department"),

  workDates: z
    .array(workDateSchema)
    .optional(),
});

export type UserInput =
  z.infer<typeof userSchema>;