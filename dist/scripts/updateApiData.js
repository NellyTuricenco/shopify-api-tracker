import axios from "axios";
import { parseStringPromise } from "xml2js";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
dayjs.extend(utc);
// ESM-safe __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FEED_URL = "https://shopify.dev/changelog/feed.xml";
const PROJECT_ROOT = path.resolve(__dirname, "../../");
const DATA_FILE_PATH = path.join(PROJECT_ROOT, "data/api_versions.json");
async function fetchChangelog() {
    const { data } = await axios.get(FEED_URL);
    const parsed = await parseStringPromise(data, { explicitArray: false });
    return parsed.rss.channel.item;
}
function extractApiVersions(text) {
    const regex = /\b(20\d{2}-\d{2})\b/g;
    const versions = new Set();
    let match;
    while ((match = regex.exec(text)) !== null) {
        versions.add(match[1]);
    }
    return Array.from(versions);
}
function determineStatus(version) {
    const today = dayjs.utc();
    const [year, quarterRaw] = version.split("-").map(Number);
    const quarter = (quarterRaw - 1) / 3;
    const releaseDate = dayjs.utc(`${year}-${quarter * 3 + 1}-01`);
    const deprecationDate = releaseDate.add(1, "year");
    if (today.isBefore(releaseDate))
        return "upcoming";
    if (today.isAfter(deprecationDate))
        return "deprecated";
    return "current";
}
function extractReleaseDate(version) {
    const [year, quarterRaw] = version.split("-").map(Number);
    const quarter = (quarterRaw - 1) / 3;
    return dayjs.utc(`${year}-${quarter * 3 + 1}-01`).format("YYYY-MM-DD");
}
function extractDeprecationDate(version) {
    const releaseDate = extractReleaseDate(version);
    return dayjs.utc(releaseDate).add(1, "year").format("YYYY-MM-DD");
}
async function generateApiData() {
    const changelog = await fetchChangelog();
    const versionMap = new Map();
    for (const entry of changelog) {
        const content = `${entry.title} ${entry.description}`;
        const versions = extractApiVersions(content);
        versions.forEach((version) => {
            const status = determineStatus(version);
            if (!versionMap.has(version)) {
                versionMap.set(version, {
                    version,
                    status,
                    releaseDate: extractReleaseDate(version),
                    deprecationDate: extractDeprecationDate(version),
                    breakingChanges: [],
                });
            }
            const content = `${entry.title} ${entry.description}`.toLowerCase();
            const breakingKeywords = [
                "breaking change",
                "deprecated",
                "will be removed",
                "has been removed",
                "no longer supported",
                "not supported",
                "migration guide",
                "need to migrate",
                "incompatible change",
            ];
            const isBreaking = breakingKeywords.some((keyword) => content.includes(keyword));
            if (isBreaking) {
                versionMap.get(version)?.breakingChanges?.push(`${entry.title} — ${entry.description}`);
            }
        });
    }
    const data = Array.from(versionMap.values()).sort((a, b) => a.version.localeCompare(b.version));
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    console.log(`✅ Wrote ${data.length} API versions to ${DATA_FILE_PATH}`);
}
generateApiData().catch((err) => {
    console.error("❌ Failed to generate API data:", err);
    process.exit(1);
});
