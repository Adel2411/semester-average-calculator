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

  // Load data from URL parameters on component mount
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
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Semester Average Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Enter your module scores to calculate your semester average
        </p>
      </div>

      <AverageForm onSubmit={handleFormSubmit} initialData={initialData} />

      {formData && <ResultCard average={average} />}
    </main>
  );
}
