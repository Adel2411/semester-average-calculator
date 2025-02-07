import * as z from "zod";
import { MODULES } from "./constants";

const moduleSchema = z.object({
  name: z.string(),
  coefficient: z.number().positive(),
  average: z
    .number()
    .min(0, "Average must be non-negative")
    .max(20, "Average must be 20 or less"),
});

export const formSchema = z.object({
  modules: z
    .array(moduleSchema)
    .length(
      MODULES.length,
      `You must provide averages for all ${MODULES.length} modules`,
    ),
});

export type ModuleInput = z.infer<typeof moduleSchema>;
export type FormValues = z.infer<typeof formSchema>;
