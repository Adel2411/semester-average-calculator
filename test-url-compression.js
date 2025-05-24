const LZString = require('lz-string');

function compressData(data) {
  const compactArray = [];
  data.modules.forEach(module => {
    compactArray.push(module.name, module.coefficient, module.average);
  });
  return JSON.stringify(compactArray);
}

function compressDataUltra(data) {
  const modules = data.modules.map(m => [m.name, m.coefficient, m.average]);
  return JSON.stringify(modules);
}

function compressDataAdvanced(data) {
  const ultraCompact = compressDataUltra(data);
  return LZString.compressToEncodedURIComponent(ultraCompact);
}

function stringToBase64(str) {
  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function encodeFormDataToUrlV2(data) {
  const compressed = compressDataAdvanced(data);
  return `v2=${compressed}`;
}

function encodeFormDataToUrlNew(data) {
  const compressed = compressData(data);
  const encoded = stringToBase64(compressed);
  return `data=${encoded}`;
}

function encodeFormDataToUrlLegacy(data) {
  const params = new URLSearchParams();
  
  data.modules.forEach((module, index) => {
    params.append(`m${index}_name`, module.name);
    params.append(`m${index}_coef`, module.coefficient.toString());
    params.append(`m${index}_avg`, module.average.toString());
  });
  
  return params.toString();
}

// Test data with many modules
const testData = {
  modules: [
    { name: "Mathematics", coefficient: 3, average: 15.5 },
    { name: "Physics", coefficient: 4, average: 14.2 },
    { name: "Chemistry", coefficient: 3, average: 16.8 },
    { name: "Computer Science", coefficient: 5, average: 18.0 },
    { name: "English Literature", coefficient: 2, average: 13.5 },
    { name: "History", coefficient: 2, average: 14.8 },
    { name: "Biology", coefficient: 3, average: 15.2 },
    { name: "Philosophy", coefficient: 2, average: 16.1 },
    { name: "Economics", coefficient: 3, average: 14.9 },
    { name: "Statistics", coefficient: 4, average: 17.3 },
    { name: "Linear Algebra", coefficient: 3, average: 16.4 },
    { name: "Data Structures", coefficient: 4, average: 18.2 },
    { name: "Algorithms", coefficient: 4, average: 17.8 },
    { name: "Database Systems", coefficient: 3, average: 16.7 },
    { name: "Operating Systems", coefficient: 4, average: 15.9 },
    { name: "Software Engineering", coefficient: 4, average: 16.5 },
    { name: "Computer Networks", coefficient: 3, average: 15.8 },
    { name: "Artificial Intelligence", coefficient: 5, average: 17.6 },
    { name: "Machine Learning", coefficient: 4, average: 18.1 },
    { name: "Web Development", coefficient: 3, average: 16.9 },
    { name: "Mobile Development", coefficient: 3, average: 15.7 },
    { name: "Cybersecurity", coefficient: 4, average: 16.3 },
    { name: "Computer Graphics", coefficient: 3, average: 15.4 },
    { name: "Human-Computer Interaction", coefficient: 2, average: 14.6 },
    { name: "Discrete Mathematics", coefficient: 3, average: 16.2 },
    { name: "Calculus I", coefficient: 4, average: 15.1 },
    { name: "Calculus II", coefficient: 4, average: 15.8 },
    { name: "Probability and Statistics", coefficient: 3, average: 16.7 },
    { name: "French Language", coefficient: 2, average: 13.9 },
    { name: "Technical Writing", coefficient: 2, average: 14.3 }
  ]
};

console.log('Testing URL Compression\n');

const legacyUrl = encodeFormDataToUrlLegacy(testData);
const standardUrl = encodeFormDataToUrlNew(testData);
const advancedUrl = encodeFormDataToUrlV2(testData);

console.log(`Test data: ${testData.modules.length} modules`);
console.log(`Legacy URL length: ${legacyUrl.length} characters`);
console.log(`Standard URL length: ${standardUrl.length} characters`);
console.log(`Advanced URL length: ${advancedUrl.length} characters`);
console.log(`Standard reduction: ${Math.round((1 - standardUrl.length / legacyUrl.length) * 100)}%`);
console.log(`Advanced reduction: ${Math.round((1 - advancedUrl.length / legacyUrl.length) * 100)}%`);
console.log(`Standard space saved: ${legacyUrl.length - standardUrl.length} characters`);
console.log(`Advanced space saved: ${legacyUrl.length - advancedUrl.length} characters\n`);

console.log('Legacy URL (truncated):');
console.log(legacyUrl.substring(0, 200) + '...\n');

console.log('Standard compressed URL:');
console.log(standardUrl + '\n');

console.log('Advanced compressed URL:');
console.log(advancedUrl + '\n');

console.log('✅ Compression test completed!');
