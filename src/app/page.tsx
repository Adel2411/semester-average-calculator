"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Constants
const MODULES = [
  { name: "Algo and Complexity", coefficient: 4 },
  { name: "Software Engineering", coefficient: 4 },
  { name: "Database Administration", coefficient: 4 },
  { name: "Operating System", coefficient: 3 },
  { name: "Linear Programming", coefficient: 3 },
  { name: "Intro to AI", coefficient: 2 },
] as const;

// Schema
const moduleSchema = z.object({
  name: z.string(),
  coefficient: z.number().positive(),
  average: z
    .number()
    .min(0, "Average must be non-negative")
    .max(20, "Average must be 20 or less")
    .multipleOf(0.01, "Average must have at most 2 decimal places"),
});

const formSchema = z.object({
  modules: z
    .array(moduleSchema)
    .length(
      MODULES.length,
      `You must provide averages for all ${MODULES.length} modules`,
    ),
});

type FormValues = z.infer<typeof formSchema>;

// Average Calculator Hook
function useAverageCalculator(data: FormValues) {
  return useMemo(() => {
    const totalWeightedAverage = data.modules.reduce(
      (sum, module) => sum + module.coefficient * (module.average || 0),
      0,
    );
    const totalCoefficients = data.modules.reduce(
      (sum, module) => sum + module.coefficient,
      0,
    );
    return totalWeightedAverage / totalCoefficients;
  }, [data]);
}

// Main Component
export default function Home() {
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modules: MODULES.map((module) => ({ ...module, average: 0 })),
    },
  });

  const average = useAverageCalculator(formData || form.getValues());

  const onSubmit = (data: FormValues) => {
    setFormData(data);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Semester Average Calculator</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            {MODULES.map((module, index) => (
              <FormField
                key={module.name}
                control={form.control}
                name={`modules.${index}.average`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{module.name}</FormLabel>
                    <div className="flex items-center gap-2">
                      <div>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            max="20"
                            step="0.01"
                            value={
                              field.value === 0 ? "" : field.value.toString()
                            }
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? 0
                                  : Number.parseFloat(e.target.value);
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                      <FormDescription>
                        Coefficient: {module.coefficient}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button type="submit">Calculate Average</Button>
        </form>
      </Form>

      {formData && (
        <div className="mt-8 p-4 bg-primary/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Semester Results</h2>
          <p className="text-lg">
            Your semester average is:{" "}
            <span className="font-semibold">{average.toFixed(2)}</span>
          </p>
        </div>
      )}
    </main>
  );
}
