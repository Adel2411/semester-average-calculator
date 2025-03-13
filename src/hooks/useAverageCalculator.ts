import { FormValues } from "@/lib/schemas";
import { useMemo } from "react";

export function useAverageCalculator(data: FormValues | null) {
  return useMemo(() => {
    if (!data) return 0;

    const totalWeightedAverage = data.modules.reduce(
      (sum, module) => sum + module.coefficient * (module.average || 0),
      0,
    );
    const totalCoefficients = data.modules.reduce(
      (sum, module) => sum + module.coefficient,
      0,
    );
    return totalWeightedAverage / totalCoefficients;
  }, [data]);
}
