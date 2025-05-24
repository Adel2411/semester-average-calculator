import { FormValues } from "./schemas";

export function encodeFormDataToUrl(data: FormValues): string {
  const params = new URLSearchParams();
  
  data.modules.forEach((module, index) => {
    params.append(`m${index}_name`, module.name);
    params.append(`m${index}_coef`, module.coefficient.toString());
    params.append(`m${index}_avg`, module.average.toString());
  });
  
  return params.toString();
}

export function decodeUrlToFormData(searchParams: URLSearchParams): FormValues | null {
  const modules = [];
  let index = 0;
  
  while (searchParams.has(`m${index}_name`)) {
    const name = searchParams.get(`m${index}_name`);
    const coef = searchParams.get(`m${index}_coef`);
    const avg = searchParams.get(`m${index}_avg`);
    
    if (name && coef && avg) {
      modules.push({
        name,
        coefficient: parseFloat(coef),
        average: parseFloat(avg),
      });
    }
    index++;
  }
  
  return modules.length > 0 ? { modules } : null;
}

export function generateShareableUrl(data: FormValues): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const queryString = encodeFormDataToUrl(data);
  return `${baseUrl}?${queryString}`;
}
