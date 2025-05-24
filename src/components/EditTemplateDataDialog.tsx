"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Template, TemplateStorage } from "@/lib/templateStorage";
import { formSchema, FormValues, ModuleType } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, Plus, Trash2, Edit2 } from "lucide-react";

interface EditTemplateDataDialogProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateUpdated?: (template: Template) => void;
}

export function EditTemplateDataDialog({
  template,
  open,
  onOpenChange,
  onTemplateUpdated,
}: EditTemplateDataDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modules: [{ name: "Module 1", coefficient: 1, average: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  // Reset form when template changes
  useEffect(() => {
    if (template && open) {
      const templateFormData: FormValues = {
        modules: template.modules.map(module => ({
          name: module.name,
          coefficient: module.coefficient,
          average: module.average,
        })),
      };
      form.reset(templateFormData);
    }
  }, [template, open, form]);

  const handleSave = async (data: FormValues) => {
    if (!template) return;

    setIsLoading(true);
    try {
      const updatedModules: ModuleType[] = data.modules.map(module => ({
        name: module.name,
        coefficient: module.coefficient,
        average: module.average,
      }));

      const updatedTemplate = TemplateStorage.updateTemplate(template.id, {
        modules: updatedModules,
      });

      if (updatedTemplate) {
        onTemplateUpdated?.(updatedTemplate);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to update template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (template) {
      const templateFormData: FormValues = {
        modules: template.modules.map(module => ({
          name: module.name,
          coefficient: module.coefficient,
          average: module.average,
        })),
      };
      form.reset(templateFormData);
    }
  };

  const addModule = () => {
    append({
      name: `Module ${fields.length + 1}`,
      coefficient: 1,
      average: 0,
    });
  };

  const removeModule = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Edit Template Data - {template?.name}
          </DialogTitle>
          <DialogDescription>
            Modify the modules, coefficients, and scores for this template.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Module {index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeModule(index)}
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
                              <Input {...field} placeholder="Enter module name" />
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
                                value={field.value === 0 ? "" : field.value.toString()}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                                placeholder="Enter coefficient"
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
                                value={field.value === 0 ? "" : field.value.toString()}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                                placeholder="Enter score"
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
                  onClick={addModule}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Module
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4 flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(handleSave)} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
