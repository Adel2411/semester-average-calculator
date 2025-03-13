import { z } from "zod";

export const moduleSchema = z.object({
  name: z.string().min(1, "Module name is required"),
  coefficient: z.number().positive("Coefficient must be positive"),
  average: z
    .number()
    .min(0, "Score can't be negative")
    .max(20, "Score can't exceed 20"),
});

export const formSchema = z.object({
  modules: z.array(moduleSchema).min(1, "At least one module is required"),
});

export type FormValues = z.infer<typeof formSchema>;
export type ModuleType = z.infer<typeof moduleSchema>;
