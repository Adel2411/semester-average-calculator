import { FormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface ResultViewProps {
  data: FormValues;
  average: number;
  onBack: () => void;
}

export function ResultView({ data, average, onBack }: ResultViewProps) {
  const totalCoefficients = data.modules.reduce(
    (acc, module) => acc + module.coefficient,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Your Results</span>
          <span className="text-xl font-bold">{average.toFixed(2)}/20</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Module</th>
                <th className="text-center py-2">Coefficient</th>
                <th className="text-center py-2">Score</th>
                <th className="text-center py-2">Weighted</th>
              </tr>
            </thead>
            <tbody>
              {data.modules.map((module, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{module.name}</td>
                  <td className="text-center py-2">{module.coefficient}</td>
                  <td className="text-center py-2">{module.average}/20</td>
                  <td className="text-center py-2">
                    {(module.average * module.coefficient).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-medium">
                <td className="py-2">Total</td>
                <td className="text-center py-2">{totalCoefficients}</td>
                <td className="text-center py-2"></td>
                <td className="text-center py-2">
                  {(average * totalCoefficients).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <Button onClick={onBack} className="w-full mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Form
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
