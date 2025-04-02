import { loadApiData } from '../lib/loadApiData';
import APITrackerClient from './components/APITrackerClient';

export default function HomePage() {
  const apiVersions = loadApiData();

  return <APITrackerClient apiVersions={apiVersions} />;
}
