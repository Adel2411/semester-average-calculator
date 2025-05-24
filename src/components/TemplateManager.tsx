"use client";

import { useState, useEffect } from "react";
import { Template, TemplateStorage } from "@/lib/templateStorage";
import { FormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LayoutTemplate,
  Trash2,
  Edit,
  Download,
  Calendar,
  Hash,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";
import { EditTemplateDataDialog } from "./EditTemplateDataDialog";

interface TemplateManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelected: (formData: FormValues) => void;
}

export function TemplateManager({
  open,
  onOpenChange,
  onTemplateSelected,
}: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingTemplateData, setEditingTemplateData] = useState<Template | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = () => {
    const loadedTemplates = TemplateStorage.getAllTemplates();
    // Sort by most recently updated
    loadedTemplates.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    setTemplates(loadedTemplates);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      TemplateStorage.deleteTemplate(templateId);
      loadTemplates();
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setEditName(template.name);
    setEditDescription(template.description || "");
  };

  const handleSaveEdit = () => {
    if (!editingTemplate || !editName.trim()) return;

    TemplateStorage.updateTemplate(editingTemplate.id, {
      name: editName.trim(),
      description: editDescription.trim() || undefined,
    });

    setEditingTemplate(null);
    setEditName("");
    setEditDescription("");
    loadTemplates();
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setEditName("");
    setEditDescription("");
  };

  const handleUseTemplate = (template: Template) => {
    const formData = TemplateStorage.applyTemplateToForm(template);
    onTemplateSelected(formData);
    onOpenChange(false);
  };

  const handleEditTemplateData = (template: Template) => {
    setEditingTemplateData(template);
  };

  const handleTemplateDataUpdated = () => {
    loadTemplates();
  };

  const toggleTemplateExpansion = (templateId: string) => {
    const newExpanded = new Set(expandedTemplates);
    if (newExpanded.has(templateId)) {
      newExpanded.delete(templateId);
    } else {
      newExpanded.add(templateId);
    }
    setExpandedTemplates(newExpanded);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5" />
              Template Manager
            </DialogTitle>
            <DialogDescription>
              Manage your saved templates. Select a template to use it, or edit/delete existing ones.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2">
            {templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <LayoutTemplate className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No templates saved yet.</p>
                <p className="text-sm">Create your first template by saving a module configuration!</p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {templates.map((template) => (
                  <Card key={template.id} className="transition-shadow hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                          {template.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {template.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {template.modules.length} modules
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span className="hidden sm:inline">{formatDate(template.updatedAt)}</span>
                              <span className="sm:hidden">{template.updatedAt.toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTemplateExpansion(template.id)}
                            className="h-8 w-8 p-0"
                          >
                            {expandedTemplates.has(template.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                            className="h-8 w-8 p-0"
                            title="Edit template name and description"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTemplateData(template)}
                            className="h-8 w-8 p-0"
                            title="Edit modules and coefficients"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUseTemplate(template)}
                            className="text-xs px-2 sm:px-3"
                          >
                            <Download className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Use Template</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedTemplates.has(template.id) && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Modules:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {template.modules.map((module, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-2 bg-muted rounded text-sm"
                              >
                                <span className="truncate mr-2">{module.name}</span>
                                <span className="text-muted-foreground text-xs whitespace-nowrap">
                                  Coeff: {module.coefficient}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={handleCancelEdit}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update the name and description of your template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Template Name *</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Input
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editName.trim()} className="w-full sm:w-auto">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditTemplateDataDialog
        template={editingTemplateData}
        open={!!editingTemplateData}
        onOpenChange={(open) => !open && setEditingTemplateData(null)}
        onTemplateUpdated={handleTemplateDataUpdated}
      />
    </>
  );
}
