"use client";

import { useState } from "react";
import type { FormValues } from "@/lib/schema";
import { MODULES } from "@/lib/constants";
import { useAverageCalculator } from "@/hooks/useAverageCalculator";
import { SemesterForm } from "@/components/SemesterForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";

export default function Home() {
  const [formData, setFormData] = useState<FormValues | null>(null);
  const average = useAverageCalculator(
    formData || {
      modules: MODULES.map((module) => ({ ...module, average: 0 })),
    },
  );

  const handleSubmit = (data: FormValues) => {
    setFormData(data);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Semester Average Calculator</h1>
      <SemesterForm onSubmit={handleSubmit} />
      {formData && <ResultsDisplay average={average} />}
    </main>
  );
}
