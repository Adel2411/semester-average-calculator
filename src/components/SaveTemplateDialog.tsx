"use client";

import { useState } from "react";
import { Save, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Template, TemplateStorage } from "@/lib/templateStorage";
import { FormValues } from "@/lib/schemas";

interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormValues | null;
  onTemplateSaved?: (template: Template) => void;
}

export function SaveTemplateDialog({
  open,
  onOpenChange,
  formData,
  onTemplateSaved,
}: SaveTemplateDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData || !name.trim()) return;

    setIsLoading(true);
    try {
      const template = TemplateStorage.createTemplateFromFormData(
        formData,
        name.trim(),
        description.trim() || undefined
      );
      
      onTemplateSaved?.(template);
      setName("");
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Template</DialogTitle>
          <DialogDescription>
            Save your current module configuration as a template for future use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Semester 1, Computer Science"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="template-description">Description (optional)</Label>
            <Input
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for this template"
              className="mt-1"
            />
          </div>

          {formData && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Template will include:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {formData.modules.map((module, index) => (
                  <li key={index}>
                    {module.name} (Coefficient: {module.coefficient})
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Averages will be reset to 0 in the template
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!name.trim() || !formData || isLoading}
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
