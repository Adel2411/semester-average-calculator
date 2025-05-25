"use client";

import { useState, useEffect } from "react";
import { FormValues } from "@/lib/schemas";
import { useAverageCalculator } from "@/hooks/useAverageCalculator";
import { AverageForm } from "@/components/AverageForm";
import { ResultCard } from "@/components/ResultCard";
import { decodeUrlToFormData } from "@/lib/urlUtils";

export default function Home() {
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [initialData, setInitialData] = useState<FormValues | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const dataFromUrl = decodeUrlToFormData(urlParams);

      if (dataFromUrl) {
        setInitialData(dataFromUrl);
        setFormData(dataFromUrl);
      }
    }
  }, []);

  const handleFormSubmit = (data: FormValues) => {
    setFormData(data);
  };

  // Always call the hook, pass null when no data
  const average = useAverageCalculator(formData);

  return (
    <main className="container mx-auto p-4 max-w-4xl pb-8">
      <div className="text-center mb-12">
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Semester Average Calculator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Calculate your weighted semester averages with precision. Save templates, export results, and share your calculations seamlessly.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
          <div className="group relative">
            <div className="flex flex-col items-center p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors duration-200 hover:shadow-md">
              <h3 className="font-semibold text-sm text-foreground mb-1">Weighted Calculations</h3>
              <p className="text-xs text-muted-foreground text-center">Precise coefficient-based averages</p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="flex flex-col items-center p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors duration-200 hover:shadow-md">
              <h3 className="font-semibold text-sm text-foreground mb-1">Template System</h3>
              <p className="text-xs text-muted-foreground text-center">Save & reuse configurations</p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="flex flex-col items-center p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors duration-200 hover:shadow-md">
              <h3 className="font-semibold text-sm text-foreground mb-1">Export & Share</h3>
              <p className="text-xs text-muted-foreground text-center">PDF, CSV & URL sharing</p>
            </div>
          </div>
        </div>
      </div>

      <AverageForm onSubmit={handleFormSubmit} initialData={initialData} />

      {formData && <ResultCard average={average} />}
    </main>
  );
}
