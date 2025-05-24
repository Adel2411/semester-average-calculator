import { FormValues, ModuleType } from "./schemas";

export interface Template {
  id: string;
  name: string;
  description?: string;
  modules: ModuleType[];
  createdAt: Date;
  updatedAt: Date;
}

const TEMPLATES_STORAGE_KEY = "semester-calculator-templates";

export class TemplateStorage {
  static getAllTemplates(): Template[] {
    try {
      const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (!stored) return [];
      
      const templates = JSON.parse(stored);
      return templates.map((template: any) => ({
        ...template,
        createdAt: new Date(template.createdAt),
        updatedAt: new Date(template.updatedAt),
      }));
    } catch (error) {
      console.error("Failed to load templates:", error);
      return [];
    }
  }

  static saveTemplate(template: Omit<Template, "id" | "createdAt" | "updatedAt">): Template {
    const templates = this.getAllTemplates();
    const id = crypto.randomUUID();
    const now = new Date();
    
    const newTemplate: Template = {
      ...template,
      id,
      createdAt: now,
      updatedAt: now,
    };

    templates.push(newTemplate);
    this.saveTemplates(templates);
    return newTemplate;
  }

  static updateTemplate(id: string, updates: Partial<Omit<Template, "id" | "createdAt">>): Template | null {
    const templates = this.getAllTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) return null;

    const updatedTemplate: Template = {
      ...templates[index],
      ...updates,
      updatedAt: new Date(),
    };

    templates[index] = updatedTemplate;
    this.saveTemplates(templates);
    return updatedTemplate;
  }

  static deleteTemplate(id: string): boolean {
    const templates = this.getAllTemplates();
    const filteredTemplates = templates.filter(t => t.id !== id);
    
    if (filteredTemplates.length === templates.length) {
      return false; // Template not found
    }

    this.saveTemplates(filteredTemplates);
    return true;
  }

  static getTemplate(id: string): Template | null {
    const templates = this.getAllTemplates();
    return templates.find(t => t.id === id) || null;
  }

  static createTemplateFromFormData(formData: FormValues, name: string, description?: string): Template {
    return this.saveTemplate({
      name,
      description,
      modules: formData.modules.map(module => ({
        name: module.name,
        coefficient: module.coefficient,
        average: module.average,
      })),
    });
  }

  static applyTemplateToForm(template: Template): FormValues {
    return {
      modules: template.modules.map(module => ({
        name: module.name,
        coefficient: module.coefficient,
        average: module.average,
      })),
    };
  }

  private static saveTemplates(templates: Template[]): void {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error("Failed to save templates:", error);
    }
  }
}
