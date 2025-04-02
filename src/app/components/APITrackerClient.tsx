"use client";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface APIData {
  version: string;
  status: 'current' | 'upcoming' | 'deprecated';
  releaseDate: string;
  deprecationDate: string;
  breakingChanges?: string[];
}

dayjs.extend(utc);

export default function APITrackerClient({ apiVersions }: { apiVersions: APIData[] }) {
  const [visibleChanges, setVisibleChanges] = useState<Record<string, boolean>>({});
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    setUpdatedAt(dayjs().format('DD/MM/YYYY, HH:mm:ss'));
  }, []);

  const toggleBreaking = (version: string) => {
    setVisibleChanges((prev) => ({ ...prev, [version]: !prev[version] }));
  };

  const getDaysUntilSunset = (deprecationDate: string): number => {
    return dayjs(deprecationDate).diff(dayjs(), 'day');
  };

  const getRecommendedVersion = (data: APIData[]): APIData | null => {
    const stableVersions = data.filter((v) => v.status === 'current');
    return stableVersions.sort((a, b) => b.version.localeCompare(a.version))[0] || null;
  };

  const sunsettingSoon = apiVersions.filter((v) => {
    const days = getDaysUntilSunset(v.deprecationDate);
    return days > 0 && days <= 90;
  });

  const recommended = getRecommendedVersion(apiVersions);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-6xl space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center">Shopify API Version Tracker</h1>

        <div className="border rounded-md bg-white shadow-sm p-4 space-y-4">
          {sunsettingSoon.length > 0 && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
              <p className="font-semibold text-orange-800 flex items-center gap-2">
                <span>⚠️ Action Required</span>
              </p>
              <p className="text-orange-800 mt-2">
                {sunsettingSoon.length} version(s) will sunset within the next 90 days:
              </p>
              <ul className="list-disc ml-6 text-orange-800">
                {sunsettingSoon.map((v) => (
                  <li key={`sunset-${v.version}`}>
                    {v.version} ({getDaysUntilSunset(v.deprecationDate)} days)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommended && (
            <p>
              Recommended version: <strong>{recommended.version}</strong>
            </p>
          )}

          {updatedAt && (
            <p className="text-sm text-gray-600">
              Last updated: {updatedAt}
            </p>
          )}
        </div>

        <div className="overflow-x-auto rounded-md border bg-white shadow-sm">
          <table className="min-w-[600px] w-full text-left border-t text-sm">
            <thead className="text-gray-700 bg-gray-100">
              <tr>
                <th className="py-2 px-2 sm:px-4">Version</th>
                <th className="py-2 px-2 sm:px-4">Status</th>
                <th className="py-2 px-2 sm:px-4">Release Date</th>
                <th className="py-2 px-2 sm:px-4">Sunset Date</th>
                <th className="py-2 px-2 sm:px-4">Days Until Sunset</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {apiVersions.map((v) => {
                const days = getDaysUntilSunset(v.deprecationDate);
                let badgeColor = 'bg-green-100 text-green-800';
                let label = 'Stable';

                if (v.status === 'deprecated') {
                  badgeColor = 'bg-red-100 text-red-800';
                  label = 'Deprecated';
                } else if (v.status === 'upcoming') {
                  badgeColor = 'bg-blue-100 text-blue-800';
                  label = 'Coming Soon';
                } else if (days <= 90 && days > 0) {
                  badgeColor = 'bg-yellow-100 text-yellow-800';
                  label = 'Sunsetting Soon';
                }

                const hasBreaking = v.breakingChanges && v.breakingChanges.length > 0;

                return (
                  <React.Fragment key={`row-${v.version}`}>
                    <tr className="align-top">
                      <td className="py-2 px-2 sm:px-4 font-medium whitespace-nowrap">{v.version}</td>
                      <td className="py-2 px-2 sm:px-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}>{label}</span>
                      </td>
                      <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{dayjs(v.releaseDate).format('MMMM YYYY')}</td>
                      <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{dayjs(v.deprecationDate).format('MMMM YYYY')}</td>
                      <td className={`py-2 px-2 sm:px-4 ${days <= 90 ? 'text-red-600 font-semibold' : ''}`}>{days}</td>
                    </tr>
                    {hasBreaking && (
                      <tr key={`breaking-${v.version}`}>
                        <td colSpan={5} className="bg-gray-50 px-4 py-2 text-sm text-gray-700">
                          <button
                            className="flex items-center gap-1 font-bold text-gray-600 text-sm mb-2 cursor-pointer"
                            onClick={() => toggleBreaking(v.version)}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${
                                visibleChanges[v.version] ? 'rotate-180' : 'rotate-0'
                              }`}
                            />
                            {visibleChanges[v.version] ? 'Hide' : 'Show'} breaking changes
                          </button>

                          <AnimatePresence initial={false} mode="wait">
                            <motion.div
                              key={`animated-${v.version}`}
                              initial="collapsed"
                              animate={visibleChanges[v.version] ? 'open' : 'collapsed'}
                              exit="collapsed"
                              variants={{
                                open: { opacity: 1, height: 'auto' },
                                collapsed: { opacity: 0, height: 0 }
                              }}
                              transition={{ duration: 0.3 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <p className="font-medium mb-1">🔧 Breaking Changes:</p>
                              <div className="space-y-2">
                                {v.breakingChanges!.map((html, idx) => (
                                  <div
                                    key={`change-${v.version}-${idx}`}
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: html }}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 text-left">
          **Data automatically fetched from Shopify API versioning documentation.
        </p>
      </div>
    </main>
  );
}