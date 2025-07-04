import { FormValues } from "./schemas";
import { pdf } from '@react-pdf/renderer';
import { ResultsPDF } from '@/components/ResultsPDF';
import React from 'react';

export function exportResultsToCSV(data: FormValues, average: number): void {
  const totalCoefficients = data.modules.reduce(
    (sum, module) => sum + module.coefficient,
    0
  );

  const headers = ['Module Name', 'Coefficient', 'Score', 'Weighted Score'];
  const rows = data.modules.map(module => [
    module.name,
    module.coefficient.toString(),
    module.average.toString(),
    (module.average * module.coefficient).toFixed(2)
  ]);
  
  rows.push([
    'TOTAL',
    totalCoefficients.toString(),
    '',
    (average * totalCoefficients).toFixed(2)
  ]);
  
  rows.push(['', '', '', '']);
  rows.push(['Semester Average', average.toFixed(2), '', '']);
  rows.push(['Status', average >= 10 ? 'Pass' : 'Fail', '', '']);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `semester-results-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportResultsToPDF(data: FormValues, average: number): Promise<void> {
  try {
    const pdfDocument = React.createElement(ResultsPDF, { data, average } as any);
    const blob = await pdf(pdfDocument as any).toBlob();
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `semester-results-${new Date().toISOString().split('T')[0]}.pdf`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
}
