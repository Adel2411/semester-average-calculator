import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultCardProps {
  average: number;
}

export function ResultCard({ average }: ResultCardProps) {
  const grade = average >= 10 ? "Pass" : "Fail";
  const colorClass = average >= 10 ? "text-green-600" : "text-red-600";

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Semester Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <p className="text-lg">
            Your semester average is:{" "}
            <span className="font-semibold">{average.toFixed(2)}</span>
          </p>
          <p className={`text-lg font-bold ${colorClass}`}>Status: {grade}</p>
        </div>
      </CardContent>
    </Card>
  );
}
