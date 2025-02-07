interface ResultsDisplayProps {
  average: number;
}

export function ResultsDisplay({ average }: ResultsDisplayProps) {
  return (
    <div className="mt-8 p-4 bg-primary/10 rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Semester Results</h2>
      <p className="text-lg">
        Your semester average is:{" "}
        <span className="font-semibold">{average.toFixed(2)}</span>
      </p>
    </div>
  );
}
