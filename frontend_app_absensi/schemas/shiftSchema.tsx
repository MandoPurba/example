import { z } from "zod";

export const shiftSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nama minimal 3 karakter"),
    crossDay: z.boolean(),
    startTime: z
      .string()
      .min(1, "Jam masuk wajib diisi"),

    endTime: z
      .string()
      .min(1, "Jam pulang wajib diisi"),

    graceMinutes: z
      .number({
        error: "Grace minutes wajib diisi",
      })
      .min(0, "Grace minutes tidak boleh negatif"),

    description: z
      .string()
      .max(255, "Deskripsi maksimal 255 karakter")
      .optional(),
  })

export type ShiftInput = z.infer<typeof shiftSchema>;