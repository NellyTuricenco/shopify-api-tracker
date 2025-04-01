import fs from 'fs';
import path from 'path';
import { APIData } from '@/types/apiData';

export const dynamic = 'force-static';

export default function Home() {
  const filePath = path.join(process.cwd(), 'data', 'api_versions.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const apiData: APIData[] = JSON.parse(raw);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shopify API Version Dashboard</h1>
      <ul className="space-y-2">
        {apiData.map((version) => (
          <li key={version.version}>
            <strong>{version.version}</strong> — Status: {version.status}
            {version.releaseDate && (
              <div className="text-sm text-gray-600">Release: {version.releaseDate}</div>
            )}
            {version.deprecationDate && (
              <div className="text-sm text-red-600">Deprecation: {version.deprecationDate}</div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
