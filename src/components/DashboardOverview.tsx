import React from 'react';
import { useDistro } from '../context/DistroContext';
import { DSP_STORES } from '../data/mockData';
import {
  TrendingUp,
  Play,
  DollarSign,
  Radio,
  Users,
  Globe2,
  ArrowUpRight,
  Sparkles,
  Share2,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  Disc3,
  Flame,
} from 'lucide-react';

interface DashboardOverviewProps {
  onOpenPayout: () => void;
  onOpenUpload: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onOpenPayout, onOpenUpload }) => {
  const {
    user,
    releases,
    totalStreamsAccrued,
    availableBalance,
    monthlyRecurringRevenue,
    liveListenersCount,
    fanSubscribers,
    playTrack,
    playingTrackId,
    isPlaying,
    setSelectedReleaseForShare,
    setActiveTab,
    lastSyncedAt,
    isOffline,
  } = useDistro();

  const activeReleases = releases.filter(r => r.status === 'live');

  return (
    <div className="space-y-6">
      {/* Top Banner / Real-time Live Ticker */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
              <span>Independent Artist Distribution Hub</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-medium">100% Royalties Kept</span>
              <span aria-hidden="true">·</span>
              <span>Synced {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Welcome back, {user.artistName}</span>
              {user.verifiedArtist && (
                <span title="Verified Artist" className="text-amber-400">
                  <CheckCircle2 className="w-5 h-5 fill-amber-400/20" />
                </span>
              )}
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Your global catalog is live across 9 major DSP streaming stores with real-time royalty accrual and direct fan support.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenPayout}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-100 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Cash Out Royalties</span>
            </button>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Distribute Track</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/80">
          {/* Metric 1: Total Streams */}
          <div>
            <span className="text-xs text-neutral-400 block">Total Catalog Streams</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                {totalStreamsAccrued.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-400 font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +16.4%
              </span>
            </div>
            <span className="text-[11px] text-neutral-400">Updated in real-time</span>
          </div>

          {/* Metric 2: Available Royalties Balance */}
          <div>
            <span className="text-xs text-neutral-400 block">Available Payout Balance</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400">Direct deposit ready</span>
          </div>

          {/* Metric 3: Active Live Listeners */}
          <div>
            <span className="text-xs text-neutral-400 block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Listeners Now
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                {liveListenersCount}
              </span>
              <span className="text-xs text-neutral-400 font-mono">worldwide</span>
            </div>
            <span className="text-[11px] text-neutral-400">London, Tokyo, Berlin, NYC</span>
          </div>

          {/* Metric 4: Fan Club MRR */}
          <div>
            <span className="text-xs text-neutral-400 block">Fan Subscriptions (MRR)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
                ${monthlyRecurringRevenue.toLocaleString()}/mo
              </span>
              <span className="text-xs text-neutral-400">({fanSubscribers.length} fans)</span>
            </div>
            <span className="text-[11px] text-neutral-400">95% net creator split</span>
          </div>
        </div>
      </div>

      {/* Grid: Active Releases & DSP Delivery Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Releases with Audio Preview (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-amber-400" />
              <span>Active Catalog Releases</span>
            </h2>
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer"
            >
              View Full Catalog ({releases.length})
            </button>
          </div>

          <div className="space-y-3">
            {releases.slice(0, 3).map(release => {
              const primaryTrack = release.tracks[0];
              const isCurrentPlaying = playingTrackId === primaryTrack?.id && isPlaying;

              return (
                <div
                  key={release.id}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Cover art with play overlay */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-950 border border-neutral-800 group">
                      <img
                        src={release.coverArtUrl}
                        alt={release.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <button
                        onClick={() => {
                          if (isCurrentPlaying) {
                            playTrack(primaryTrack.id);
                          } else {
                            playTrack(primaryTrack.id, primaryTrack.audioUrl);
                          }
                        }}
                        className="absolute inset-0 bg-neutral-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Play className="w-6 h-6 text-amber-400 fill-amber-400" />
                      </button>
                      {isCurrentPlaying && (
                        <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-neutral-950/80 rounded text-[9px] font-mono text-amber-400">
                          PLAYING
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white hover:text-amber-400 transition-colors">
                          {release.title}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {release.type.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                        <span>{release.genre}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{release.tracks.length} track(s)</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{release.totalStreams.toLocaleString()} streams</span>
                      </div>

                      <div className="text-[11px] text-neutral-400 font-mono mt-1">
                        UPC: {release.upc} · ISRC: {primaryTrack?.isrc || 'Pending'}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-2.5 sm:self-center">
                    <span className="text-xs text-neutral-300 flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          release.status === 'live'
                            ? 'bg-emerald-500'
                            : release.status === 'scheduled'
                            ? 'bg-amber-500'
                            : 'bg-neutral-500'
                        }`}
                      />
                      <span className="capitalize">{release.status}</span>
                    </span>

                    <button
                      onClick={() => setSelectedReleaseForShare(release)}
                      className="px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Smart Link</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Geographic Quick Peek */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-amber-400" />
                <span>Top Streaming Territories This Month</span>
              </h3>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer"
              >
                Deep Demographics →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { country: 'United States', flag: '🇺🇸', percent: '42.3%', streams: '228.9K' },
                { country: 'United Kingdom', flag: '🇬🇧', percent: '18.2%', streams: '98.4K' },
                { country: 'Germany', flag: '🇩🇪', percent: '12.0%', streams: '64.9K' },
                { country: 'Japan', flag: '🇯🇵', percent: '9.0%', streams: '48.7K' },
              ].map((c, i) => (
                <div key={i} className="bg-neutral-950/70 border border-neutral-800/80 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base">{c.flag}</span>
                    <span className="text-xs font-mono font-semibold text-amber-400 tabular-nums">{c.percent}</span>
                  </div>
                  <div className="text-xs font-medium text-neutral-200 mt-1 truncate">{c.country}</div>
                  <div className="text-[11px] font-mono text-neutral-400 tabular-nums">{c.streams} streams</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: DSP Ingestion Status & Security Check (1 col) */}
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>DSP Platform Ingestion</span>
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Real-time delivery status across worldwide digital service providers.
            </p>

            <div className="space-y-2.5">
              {DSP_STORES.slice(0, 6).map(store => (
                <div
                  key={store.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/50 border border-neutral-850"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: store.color }}
                    />
                    <span className="text-xs font-medium text-neutral-200">{store.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                      ${store.royaltyPerStream.toFixed(4)}/stream
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Connected & Active" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Automatic FLAC/ALAC Ingestion</span>
              <span className="text-emerald-400 font-medium">9 / 9 DSPs Active</span>
            </div>
          </div>

          {/* Security & Financial Verification */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Financial Security & Split Sheets</span>
            </h3>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-800">
                <span className="text-neutral-400">Tax Compliance Form</span>
                <span className="text-emerald-400 font-mono font-medium">{user.taxStatus}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-800">
                <span className="text-neutral-400">Payout Destination</span>
                <span className="text-neutral-200 font-mono text-[11px] truncate max-w-[150px]">
                  Chase ****8921
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-800">
                <span className="text-neutral-400">Two-Factor Authentication</span>
                <span className="text-emerald-400 font-medium">Enabled (Authenticator App)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-neutral-400">Cross-Platform Sync</span>
                <span className="text-amber-400 font-medium">iOS · Android · Web</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
