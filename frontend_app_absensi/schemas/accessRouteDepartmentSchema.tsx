import { z } from "zod";

export const accessRouteDepartmentSchema = z.object({
  frontendRouteIds: z
    .array(z.string())
    .min(1, "Pilih minimal 1 jalur"),
  subitemFrontendRouteIds: z.array(z.string()).optional()
});

export type AccessRouteDepartmentInput = z.infer<typeof accessRouteDepartmentSchema>;