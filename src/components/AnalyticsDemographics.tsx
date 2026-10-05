import React, { useState } from 'react';
import { useDistro } from '../context/DistroContext';
import {
  COUNTRY_STATS,
  CITY_STATS,
  PLAYLIST_PLACEMENTS,
} from '../data/mockData';
import {
  Globe2,
  Users,
  Smartphone,
  Radio,
  TrendingUp,
  MapPin,
  ListMusic,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AnalyticsDemographics: React.FC = () => {
  const { totalStreamsAccrued, liveListenersCount } = useDistro();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_STATS[0]);

  // Demographic Data
  const ageDistribution = [
    { label: '18–24', percent: 44, color: '#F59E0B' },
    { label: '25–34', percent: 36, color: '#10B981' },
    { label: '35–44', percent: 14, color: '#3B82F6' },
    { label: '45–54', percent: 4, color: '#8B5CF6' },
    { label: '55+', percent: 2, color: '#6B7280' },
  ];

  const genderDistribution = [
    { label: 'Female', percent: 49, color: '#EC4899' },
    { label: 'Male', percent: 45, color: '#3B82F6' },
    { label: 'Non-binary / Other', percent: 6, color: '#10B981' },
  ];

  const deviceDistribution = [
    { platform: 'iOS (Apple iPhone & iPad)', percent: 58, icon: 'apple', color: '#FA2D48' },
    { platform: 'Android (Google & Samsung)', percent: 36, icon: 'android', color: '#10B981' },
    { platform: 'Desktop Web & Hi-Fi Players', percent: 6, icon: 'desktop', color: '#60A5FA' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Audience Demographics & Geographic Reach</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
          Real-time global listener intelligence, age & gender distributions, mobile operating systems, and editorial playlist placements.
        </p>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <span className="text-xs text-neutral-400 block">Active Streaming Territories</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            68 Countries
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">+12 this quarter</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <span className="text-xs text-neutral-400 block">Primary Audience Age Cohort</span>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-1">
            18–34 (80%)
          </div>
          <span className="text-[11px] text-neutral-400">Gen Z & Millennial core</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <span className="text-xs text-neutral-400 block">Mobile Stream Share</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            94% Mobile
          </div>
          <span className="text-[11px] text-neutral-400">58% iOS · 36% Android</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <span className="text-xs text-neutral-400 block">Total Playlist Reach</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
            2.84M Followers
          </div>
          <span className="text-[11px] text-neutral-400">Across 18 curated lists</span>
        </div>
      </div>

      {/* Geographic Reach Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Country Breakdown (2 Cols) */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-amber-400" />
                <span>Geographic Reach & Global Stream Velocity</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Sorted by total stream count and localized listener volume.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Worldwide (DSPs)</span>
          </div>

          <div className="space-y-3">
            {COUNTRY_STATS.map(country => (
              <div
                key={country.countryCode}
                onClick={() => setSelectedCountry(country)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedCountry.countryCode === country.countryCode
                    ? 'bg-neutral-950 border-amber-400/50 shadow-md'
                    : 'bg-neutral-950/60 border-neutral-850 hover:border-neutral-750'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 font-medium text-white">
                    <span className="font-mono text-neutral-400 w-6">{country.countryCode}</span>
                    <span>{country.countryName}</span>
                  </div>

                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-neutral-400">
                      {country.listeners.toLocaleString()} listeners
                    </span>
                    <span className="text-neutral-200 tabular-nums">
                      {country.streams.toLocaleString()} streams
                    </span>
                    <span className="text-emerald-400 flex items-center gap-0.5 w-14 justify-end">
                      <TrendingUp className="w-3 h-3" />+{country.growth}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-850 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${country.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities Ranking (1 Col) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Top Streaming Cities</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Metropolitan areas with highest engagement.
            </p>
          </div>

          <div className="space-y-2.5">
            {CITY_STATS.map((c, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-neutral-950/70 border border-neutral-850 rounded-lg flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-neutral-500 w-4 text-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-neutral-100 block">{c.city}</span>
                    <span className="text-[11px] text-neutral-400">{c.country}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-amber-400 font-semibold block tabular-nums">
                    {c.streams.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {c.listeners.toLocaleString()} listeners
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demographics: Age, Gender & Device OS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Age Brackets */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Age Distribution</span>
          </h3>

          <div className="space-y-2.5">
            {ageDistribution.map(item => (
              <div key={item.label} className="text-xs space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>{item.label} years</span>
                  <span className="font-mono font-bold tabular-nums text-white">{item.percent}%</span>
                </div>
                <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Demographics */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-400" />
            <span>Gender Demographics</span>
          </h3>

          <div className="space-y-3 pt-2">
            {genderDistribution.map(item => (
              <div key={item.label} className="text-xs space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>{item.label}</span>
                  <span className="font-mono font-bold tabular-nums text-white">{item.percent}%</span>
                </div>
                <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400">
            Source: Aggregated anonymous DSP reporting (Spotify for Artists & Apple Music for Artists sync).
          </div>
        </div>

        {/* Device & OS Reach */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Device & Platform Share</span>
          </h3>

          <div className="space-y-3">
            {deviceDistribution.map(item => (
              <div key={item.platform} className="p-3 bg-neutral-950/70 border border-neutral-850 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between text-neutral-200">
                  <span className="font-medium">{item.platform}</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">{item.percent}%</span>
                </div>
                <div className="w-full bg-neutral-850 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-neutral-400">
            Cross-platform syncing active for continuous mobile listening.
          </div>
        </div>
      </div>

      {/* Editorial & Algorithmic Playlist Additions */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-amber-400" />
              <span>Editorial & Algorithmic Playlist Placements</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Curated playlists featuring your catalog with verified streams conversion.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono">4 Active Placements</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950/60 text-neutral-400 border-b border-neutral-800 font-mono">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Playlist Name</th>
                <th className="py-2.5 px-4 font-semibold">Curator / Platform</th>
                <th className="py-2.5 px-4 font-semibold">Featured Track</th>
                <th className="py-2.5 px-4 font-semibold text-right">Playlist Followers</th>
                <th className="py-2.5 px-4 font-semibold text-right">Streams Driven</th>
                <th className="py-2.5 px-4 font-semibold text-right">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono">
              {PLAYLIST_PLACEMENTS.map(pl => (
                <tr key={pl.id} className="hover:bg-neutral-850/50 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{pl.title}</span>
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-300">
                    <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[11px]">
                      {pl.curator}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-200">{pl.trackTitle}</td>
                  <td className="py-3 px-4 text-right text-neutral-300 tabular-nums">
                    {pl.followers.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-400 font-semibold tabular-nums">
                    {pl.streamsGenerated.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-400 tabular-nums">{pl.dateAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
