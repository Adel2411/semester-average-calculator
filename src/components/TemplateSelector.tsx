"use client";

import { useState, useEffect } from "react";
import { Template, TemplateStorage } from "@/lib/templateStorage";
import { FormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { LayoutTemplate, Download } from "lucide-react";

interface TemplateSelectorProps {
  onTemplateSelected: (formData: FormValues) => void;
  className?: string;
}

export function TemplateSelector({ onTemplateSelected, className }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const loadedTemplates = TemplateStorage.getAllTemplates();
    // Sort by name
    loadedTemplates.sort((a, b) => a.name.localeCompare(b.name));
    setTemplates(loadedTemplates);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleUseTemplate = () => {
    if (!selectedTemplateId) return;
    
    const template = templates.find(t => t.id === selectedTemplateId);
    if (template) {
      const formData = TemplateStorage.applyTemplateToForm(template);
      onTemplateSelected(formData);
      setSelectedTemplateId("");
    }
  };

  if (templates.length === 0) {
    return (
      <div className={`text-center text-muted-foreground ${className}`}>
        <LayoutTemplate className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No templates saved yet.</p>
        <p className="text-xs">Save your first template to get started!</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 flex-shrink-0">
        <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Template:</span>
      </div>
      <div className="flex items-center gap-2 w-full sm:flex-1">
        <Select
          value={selectedTemplateId}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          className="flex-1"
        >
          <option value="">Select a template...</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} ({template.modules.length} modules)
            </option>
          ))}
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUseTemplate}
          disabled={!selectedTemplateId}
          className="flex-shrink-0"
        >
          <Download className="w-4 h-4 mr-1" />
          Use
        </Button>
      </div>
    </div>
  );
}
