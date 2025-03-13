import * as z from "zod";
import { MODULES } from "./constants";

export const moduleSchema = z.object({
  name: z.string(),
  coefficient: z.number().positive(),
  average: z
    .number()
    .min(0, "Average must be non-negative")
    .max(20, "Average must be 20 or less")
    .multipleOf(0.01, "Average must have at most 2 decimal places"),
});

export const formSchema = z.object({
  modules: z
    .array(moduleSchema)
    .length(
      MODULES.length,
      `You must provide averages for all ${MODULES.length} modules`,
    ),
});

export type FormValues = z.infer<typeof formSchema>;
