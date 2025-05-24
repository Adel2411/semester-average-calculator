import { FormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, Copy, FileText } from "lucide-react";
import { exportResultsToCSV, exportResultsToPDF } from "@/lib/csvUtils";
import { generateShareableUrl } from "@/lib/urlUtils";
import { useState } from "react";

interface ResultViewProps {
  data: FormValues;
  average: number;
  onBack: () => void;
}

export function ResultView({ data, average, onBack }: ResultViewProps) {
  const [copied, setCopied] = useState(false);

  const totalCoefficients = data.modules.reduce(
    (acc, module) => acc + module.coefficient,
    0,
  );

  const handleDownloadCSV = () => {
    exportResultsToCSV(data, average);
  };

  const handleDownloadPDF = async () => {
    await exportResultsToPDF(data, average);
  };

  const handleShare = async () => {
    const shareUrl = generateShareableUrl(data);

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

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

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={onBack} variant="outline" className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Form
            </Button>

            <Button
              onClick={handleDownloadCSV}
              variant="outline"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" /> CSV
            </Button>

            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="flex-1"
            >
              <FileText className="mr-2 h-4 w-4" /> PDF
            </Button>

            <Button onClick={handleShare} variant="outline" className="flex-1">
              {copied ? (
                <>
                  <Copy className="mr-2 h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
