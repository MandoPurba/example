import { z } from "zod";

export const permissionSchema = z.object({
  permission_type: z.string().min(1, "Permission type is required"),

  start_date: z.coerce.date({
    error: "Start date is required",
  }),

  end_date: z.coerce.date({
    error: "End date is required",
  }),

  start_time: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
  attachment_file: z
    .instanceof(File)
    .nullable()
    .optional(),
  description: z.string().min(1, "Description is required"),
});

export type PermissionInput = z.infer<typeof permissionSchema>;