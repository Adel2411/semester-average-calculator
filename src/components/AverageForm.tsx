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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MODULES } from "@/lib/constants";
import { formSchema, FormValues } from "@/lib/schemas";

interface AverageFormProps {
  onSubmit: (data: FormValues) => void;
}

export function AverageForm({ onSubmit }: AverageFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modules: MODULES.map((module) => ({ ...module, average: 0 })),
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Module Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {MODULES.map((module, index) => (
                <FormField
                  key={module.name}
                  control={form.control}
                  name={`modules.${index}.average`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{module.name}</FormLabel>
                      <div className="flex flex-col gap-1">
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
                            className="w-full"
                          />
                        </FormControl>
                        <FormDescription>
                          Coefficient: {module.coefficient}
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button type="submit" className="w-full">
              Calculate Average
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
