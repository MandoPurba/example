import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().min(3, "Nama branch minimal 3 karakter"),

  code: z.string().min(2, "Code minimal 2 karakter"),

  city: z.string().min(2, "City wajib diisi"),

  address: z.string().min(5, "Alamat wajib diisi"),

  radius: z.number({
    error: "Radius wajib diisi",
  }),

  latitude: z.number({
    error: "Latitude wajib diisi",
  }),

  longitude: z.number({
    error: "Longitude wajib diisi",
  }),

  isActive: z.boolean(),
});

export type BranchInput = z.infer<typeof branchSchema>;