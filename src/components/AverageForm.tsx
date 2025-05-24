import { useState, useEffect } from "react";
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
import { Plus, Trash2, Save, LayoutTemplate } from "lucide-react";
import { ResultView } from "./ResultView";
import { encodeFormDataToUrl } from "@/lib/urlUtils";
import { SaveTemplateDialog } from "./SaveTemplateDialog";
import { TemplateManager } from "./TemplateManager";
import { TemplateSelector } from "./TemplateSelector";

interface AverageFormProps {
  onSubmit: (data: FormValues) => void;
  initialData?: FormValues | null;
  shouldShowResults?: boolean;
}

export function AverageForm({
  onSubmit,
  initialData,
  shouldShowResults = false,
}: AverageFormProps) {
  const [showResults, setShowResults] = useState(shouldShowResults);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [calculatedAverage, setCalculatedAverage] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modules: initialData?.modules || [{ name: "Module 1", coefficient: 1, average: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      if (shouldShowResults) {
        handleSubmit(initialData);
      }
    }
  }, [initialData, shouldShowResults]);

  // Update URL when form data changes
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (data.modules && data.modules.length > 0) {
        const validModules = data.modules.filter(
          (module) => module?.name && module?.coefficient && module?.average !== undefined
        );

        if (validModules.length > 0) {
          const formData = { modules: validModules as any };
          const queryString = encodeFormDataToUrl(formData);
          const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
          window.history.replaceState({}, '', newUrl);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = (data: FormValues) => {
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

  const handleTemplateSelected = (templateData: FormValues) => {
    form.reset(templateData);
  };

  const handleSaveTemplate = () => {
    const currentData = form.getValues();
    if (currentData.modules.length > 0) {
      setShowSaveDialog(true);
    }
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
        <div className="flex flex-col gap-4 md:flex-row md:gap-0 items-center justify-center md:justify-between">
          <CardTitle>Enter Module Scores</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateManager(true)}
            >
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Templates
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveTemplate}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Template
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Template Selector */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Quick Start with Template</h4>
              <TemplateSelector onTemplateSelected={handleTemplateSelected} />
            </div>

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
                              min="1"
                              step="1"
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

        {/* Template Dialogs */}
        <SaveTemplateDialog
          open={showSaveDialog}
          onOpenChange={setShowSaveDialog}
          formData={form.getValues()}
        />
        
        <TemplateManager
          open={showTemplateManager}
          onOpenChange={setShowTemplateManager}
          onTemplateSelected={handleTemplateSelected}
        />
      </CardContent>
    </Card>
  );
}
