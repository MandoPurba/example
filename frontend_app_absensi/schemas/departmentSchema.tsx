import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Nama branch minimal 3 karakter"),

  code: z.string().optional(),

  isActive: z.boolean(),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;