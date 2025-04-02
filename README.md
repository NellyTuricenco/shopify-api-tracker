# Shopify API Version Tracker

A static dashboard that automatically displays the latest [Shopify API versions](https://shopify.dev/changelog) and their statuses — including release dates, deprecation timelines, and notable breaking changes.

---

## 🚀 Features

- 📅 **Current, Upcoming & Deprecated API Versions**
- ⏳ **Sunsetting Soon Alert** (within 90 days)
- 🔥 **Breaking Changes** (when available)
- 📌 **Recommended Version** (latest stable)
- 📈 **Auto-updated weekly** via GitHub Actions (Sunday 12:00 UTC)

---

## 📂 Folder Structure

```
├── app/
│   ├── page.tsx               # Loads data & renders UI
│   └── components/
│       └── APITrackerClient.tsx
├── data/
│   └── api_versions.json      # Auto-generated API version data
├── scripts/
│   └── updateApiData.ts       # Fetches & processes the changelog feed
├── .github/workflows/
│   └── update.yml             # GitHub Action to auto-update JSON weekly
├── tsconfig.scripts.json      # Custom TS config for scripts
└── README.md
```

---

## 🔄 How It Works

1. **Data Fetching:**
   - `scripts/updateApiData.ts` fetches `https://shopify.dev/changelog/feed.xml`
   - Parses the feed and extracts all `YYYY-MM` version strings
   - Identifies:
     - Release date (based on version)
     - Deprecation date (1 year later)
     - Status (current, upcoming, deprecated)
     - Breaking changes (if found in the title or description)

2. **Static JSON Output:**
   - Writes the structured result to `data/api_versions.json`

3. **GitHub Actions:**
   - Every Sunday at 12:00 UTC, the action:
     - Runs the update script
     - Commits any new changes to `api_versions.json`

4. **Next.js Frontend:**
   - Loads the JSON file at build/runtime
   - Displays a clean, responsive UI
   - Includes toggles with animated transitions for breaking changes

---

## 🛠 Local Setup

```bash
npm install
npm run dev
```

To manually update API data:
```bash
npm run build:scripts && npm run update
```

> Ensure `tsconfig.scripts.json` is used for compiling scripts, not the main Next.js config.

---

## 🧪 Testing GitHub Action Locally

```bash
npx tsc --project tsconfig.scripts.json
node dist/scripts/updateApiData.js
```

---

## 🧠 Future Ideas

- [ ] Expand/collapse all buttons
- [ ] Deploy to Vercel or GitHub Pages
- [ ] Filter by status (deprecated, current)
- [ ] Highlight newly added versions this week
- [ ] RSS or webhook integration

---

## 📘 License

MIT © 2025 — Built with ❤️ by Nelly Turicenco
