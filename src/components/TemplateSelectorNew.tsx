"use client";

import { useState, useEffect } from "react";
import { Template, TemplateStorage } from "@/lib/templateStorage";
import { FormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
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
    <div className={`flex items-center gap-2 ${className}`}>
      <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
      <select
        value={selectedTemplateId}
        onChange={(e) => handleTemplateSelect(e.target.value)}
        className="flex-1 h-10 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Select a template...</option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name} ({template.modules.length} modules)
          </option>
        ))}
      </select>
      <Button
        variant="outline"
        size="sm"
        onClick={handleUseTemplate}
        disabled={!selectedTemplateId}
      >
        <Download className="w-4 h-4 mr-1" />
        Use
      </Button>
    </div>
  );
}
