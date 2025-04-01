import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { ChangelogItem } from '@/types/changelog';

export async function fetchChangelog(): Promise<ChangelogItem[]> {
  const url = 'https://shopify.dev/changelog/feed.xml';
  const { data } = await axios.get(url);
  const parsed = await parseStringPromise(data, { explicitArray: false });
  return parsed.rss.channel.item as ChangelogItem[];
}
