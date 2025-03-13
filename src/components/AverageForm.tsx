import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formSchema, FormValues } from "@/lib/schemas";
import { Plus, Trash2 } from "lucide-react"; // Import icons
import { ResultView } from "./ResultView";

interface AverageFormProps {
  onSubmit: (data: FormValues) => void;
}

export function AverageForm({ onSubmit }: AverageFormProps) {
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [calculatedAverage, setCalculatedAverage] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modules: [{ name: "Module 1", coefficient: 1, average: 0 }],
    },
  });

  // Use fieldArray to manage dynamic modules
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  // Add this function to handle form submission
  const handleSubmit = (data: FormValues) => {
    // Calculate the weighted average
    const totalWeightedScore = data.modules.reduce(
      (sum, module) => sum + module.average * module.coefficient,
      0,
    );
    const totalCoefficients = data.modules.reduce(
      (sum, module) => sum + module.coefficient,
      0,
    );
    const average =
      totalCoefficients > 0 ? totalWeightedScore / totalCoefficients : 0;

    setFormData(data);
    setCalculatedAverage(average);
    setShowResults(true);
    onSubmit(data);
  };

  return showResults && formData ? (
    <ResultView
      data={formData}
      average={calculatedAverage}
      onBack={() => setShowResults(false)}
    />
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Enter Module Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Module {index + 1}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`modules.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Module Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`modules.${index}.coefficient`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coefficient</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0.1"
                              step="0.1"
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? 1
                                    : Number.parseFloat(e.target.value);
                                field.onChange(isNaN(value) ? 1 : value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`modules.${index}.average`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Score</FormLabel>
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
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  append({
                    name: `Module ${fields.length + 1}`,
                    coefficient: 1,
                    average: 0,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Module
              </Button>
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
