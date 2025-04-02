import fs from 'fs';
import path from 'path';

export function loadApiData() {
  const filePath = path.join(process.cwd(), 'data', 'api_versions.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}
