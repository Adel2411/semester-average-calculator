"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { formSchema, type FormValues } from "@/lib/schema";
import { MODULES } from "@/lib/constants";

interface SemesterFormProps {
  onSubmit: (data: FormValues) => void;
}

export function SemesterForm({ onSubmit }: SemesterFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modules: MODULES.map((module) => ({ ...module, average: 0 })),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {MODULES.map((module, index) => (
          <FormField
            key={module.name}
            control={form.control}
            name={`modules.${index}.average`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{module.name}</FormLabel>
                <FormDescription>
                  Coefficient: {module.coefficient}
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    onChange={(e) =>
                      field.onChange(Number.parseFloat(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">Calculate Average</Button>
      </form>
    </Form>
  );
}
