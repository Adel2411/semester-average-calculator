import { FormValues } from "./schemas";
import LZString from "lz-string";

export function isFormDataComplete(data: FormValues): boolean {
  return data.modules.every(module =>
    module.name.trim() !== '' &&
    module.coefficient > 0 &&
    module.average >= 0 &&
    module.average <= 20
  );
}

function toCompactArray(data: FormValues): (string | number)[] {
  return data.modules.flatMap(({ name, coefficient, average }) => [name, coefficient, average]);
}

function fromCompactArray(array: (string | number)[]): FormValues {
  const modules = [];
  for (let i = 0; i < array.length; i += 3) {
    modules.push({
      name: array[i] as string,
      coefficient: array[i + 1] as number,
      average: array[i + 2] as number,
    });
  }
  return { modules };
}

function compressDataLZ(data: FormValues): string {
  const compact = JSON.stringify(data.modules.map(m => [m.name, m.coefficient, m.average]));
  return LZString.compressToEncodedURIComponent(compact);
}

function decompressDataLZ(compressed: string): FormValues {
  const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
  if (!decompressed) throw new Error("LZ decompression failed");
  const modules = JSON.parse(decompressed).map(
    ([name, coefficient, average]: [string, number, number]) => ({ name, coefficient, average })
  );
  return { modules };
}

function compressToBase64(data: FormValues): string {
  const json = JSON.stringify(toCompactArray(data));
  const base64 = typeof window !== 'undefined'
    ? btoa(json)
    : Buffer.from(json).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decompressFromBase64(base64: string): FormValues {
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  const normalized = padded.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = typeof window !== 'undefined'
    ? atob(normalized)
    : Buffer.from(normalized, 'base64').toString();
  return fromCompactArray(JSON.parse(decoded));
}

function encodeFormDataToUrlLegacy(data: FormValues): string {
  const params = new URLSearchParams();
  data.modules.forEach((m, i) => {
    params.append(`m${i}_name`, m.name);
    params.append(`m${i}_coef`, m.coefficient.toString());
    params.append(`m${i}_avg`, m.average.toString());
  });
  return params.toString();
}

function decodeFormDataFromLegacy(searchParams: URLSearchParams): FormValues | null {
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
  return modules.length ? { modules } : null;
}

export function encodeFormDataToUrl(data: FormValues): string {
  if (!isFormDataComplete(data)) return '';

  try {
    const v2 = compressDataLZ(data);
    if (v2.length <= 1500) return `v2=${v2}`;

    const base64 = compressToBase64(data);
    if (base64.length <= 1800) return `data=${base64}`;

    return encodeFormDataToUrlLegacy(data);
  } catch (err) {
    console.warn("Encoding failed, fallback to legacy format", err);
    return encodeFormDataToUrlLegacy(data);
  }
}

export function decodeUrlToFormData(searchParams: URLSearchParams): FormValues | null {
  const v2 = searchParams.get('v2');
  if (v2) {
    try {
      return decompressDataLZ(v2);
    } catch (err) {
      console.warn("Failed to decode v2 data:", err);
    }
  }

  const b64 = searchParams.get('data');
  if (b64) {
    try {
      return decompressFromBase64(b64);
    } catch (err) {
      console.warn("Failed to decode base64 data:", err);
    }
  }

  return decodeFormDataFromLegacy(searchParams);
}

export function generateShareableUrl(data: FormValues): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin + window.location.pathname
    : '';
  const query = encodeFormDataToUrl(data);
  return `${baseUrl}?${query}`;
}