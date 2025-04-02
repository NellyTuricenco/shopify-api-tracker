import fs from 'fs';
import path from 'path';
import APITrackerClient from './components/APITrackerClient';

export default function HomePage() {
  const filePath = path.join(process.cwd(), 'data', 'api_versions.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const apiVersions = JSON.parse(rawData);

  return <APITrackerClient apiVersions={apiVersions} />;
}