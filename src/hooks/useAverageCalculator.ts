"use client";

import { useMemo } from "react";
import type { FormValues } from "@/lib/schema";

export function useAverageCalculator(data: FormValues) {
  return useMemo(() => {
    const totalWeightedAverage = data.modules.reduce(
      (sum, module) => sum + module.coefficient * module.average,
      0,
    );
    const totalCoefficients = data.modules.reduce(
      (sum, module) => sum + module.coefficient,
      0,
    );
    return totalWeightedAverage / totalCoefficients;
  }, [data]);
}
