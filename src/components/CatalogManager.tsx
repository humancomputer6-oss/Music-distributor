import React, { useState } from 'react';
import { useDistro } from '../context/DistroContext';
import { Release, DeliveryStatus } from '../types';
import { DSP_STORES } from '../data/mockData';
import {
  Plus,
  Play,
  Share2,
  Disc3,
  Calendar,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Music,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CatalogManagerProps {
  onOpenUpload: () => void;
}

export const CatalogManager: React.FC<CatalogManagerProps> = ({ onOpenUpload }) => {
  const {
    releases,
    playTrack,
    playingTrackId,
    isPlaying,
    setSelectedReleaseForShare,
    setActiveTab,
  } = useDistro();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DeliveryStatus>('all');
  const [expandedReleaseId, setExpandedReleaseId] = useState<string | null>('rel-01');

  const filteredReleases = releases.filter(r => {
    const matchesQuery =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.upc.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedReleaseId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Music Catalog & Store Distribution</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Manage your singles, EPs, and albums with lossless FLAC ingestion to Spotify, Apple Music, and 7 other platforms.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload & Distribute Release</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 p-3 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, genre, or UPC..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800 self-start md:self-auto overflow-x-auto">
          {(['all', 'live', 'scheduled', 'processing'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === status
                  ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {status === 'all' ? 'All Releases' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Release List */}
      <div className="space-y-4">
        {filteredReleases.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
            <Disc3 className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No releases match your query</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords or upload a new release to distribute to global streaming stores.
            </p>
            <button
              onClick={onOpenUpload}
              className="mt-4 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
            >
              Upload New Track
            </button>
          </div>
        ) : (
          filteredReleases.map(release => {
            const isExpanded = expandedReleaseId === release.id;
            const primaryTrack = release.tracks[0];
            const isCurrentPlaying = playingTrackId === primaryTrack?.id && isPlaying;

            return (
              <div
                key={release.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-neutral-750 rounded-xl overflow-hidden transition-all shadow-sm"
              >
                {/* Release Card Header */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Cover Art with Quick Play */}
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-neutral-950 border border-neutral-800 group">
                      <img
                        src={release.coverArtUrl}
                        alt={release.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <button
                        onClick={() => {
                          if (primaryTrack) {
                            playTrack(primaryTrack.id, primaryTrack.audioUrl);
                          }
                        }}
                        className="absolute inset-0 bg-neutral-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Preview audio"
                      >
                        <Play className="w-7 h-7 text-amber-400 fill-amber-400" />
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-bold text-white hover:text-amber-400 transition-colors">
                          {release.title}
                        </h2>
                        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                          {release.type}
                        </span>
                        <span className="text-xs text-neutral-300 flex items-center gap-1.5 ml-2">
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
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1 flex-wrap">
                        <span>Artist: {release.artistName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{release.genre}</span>
                        <span aria-hidden="true">·</span>
                        <span>Label: {release.label}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {release.releaseDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400 mt-1.5 flex-wrap">
                        <span>UPC: <strong className="text-neutral-300">{release.upc}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Total Streams: <strong className="text-amber-400">{release.totalStreams.toLocaleString()}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Stores: <strong className="text-neutral-300">{release.stores.length} platforms</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Expand Chevron */}
                  <div className="flex items-center gap-2.5 self-end md:self-center">
                    <button
                      onClick={() => setSelectedReleaseForShare(release)}
                      className="px-3 py-1.5 text-xs text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Smart Link & Socials</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(release.id)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
                      title={isExpanded ? 'Collapse tracks' : 'Expand track details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Section: Tracklist, Splits, DSP Store Badges */}
                {isExpanded && (
                  <div className="border-t border-neutral-800 bg-neutral-950/60 p-4 sm:p-6 space-y-4">
                    {/* Tracklist Table */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          Track Master Files & ISRC Identifiers ({release.tracks.length})
                        </h4>
                        <button
                          onClick={() => setActiveTab('splits')}
                          className="text-xs text-amber-400 hover:underline cursor-pointer"
                        >
                          Manage Split Sheets →
                        </button>
                      </div>

                      <div className="border border-neutral-800/80 rounded-lg divide-y divide-neutral-800/60 overflow-hidden bg-neutral-900/50">
                        {release.tracks.map((track, idx) => {
                          const isPlayingThis = playingTrackId === track.id && isPlaying;
                          const minutes = Math.floor(track.duration / 60);
                          const seconds = track.duration % 60;

                          return (
                            <div
                              key={track.id}
                              className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-neutral-850 transition-colors text-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="font-mono text-neutral-500 w-4 text-center">
                                  {idx + 1}
                                </span>
                                <button
                                  onClick={() => playTrack(track.id, track.audioUrl)}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                                    isPlayingThis
                                      ? 'bg-amber-400 text-neutral-950'
                                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                  }`}
                                >
                                  <Play className="w-3.5 h-3.5 ml-0.5" />
                                </button>
                                <div className="min-w-0">
                                  <div className="font-semibold text-neutral-100 truncate flex items-center gap-2">
                                    <span>{track.title}</span>
                                    {track.version && (
                                      <span className="text-[11px] font-normal text-neutral-400">
                                        ({track.version})
                                      </span>
                                    )}
                                    {track.explicit && (
                                      <span className="text-[10px] font-mono px-1 bg-neutral-800 text-neutral-400 rounded">
                                        E
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                                    ISRC: {track.isrc} · {track.bpm} BPM · Key: {track.key}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 shrink-0 font-mono text-neutral-400">
                                <div className="hidden sm:block text-right">
                                  <span className="text-neutral-200 tabular-nums">
                                    {track.streamsCount.toLocaleString()}
                                  </span>{' '}
                                  streams
                                </div>
                                <div className="text-right tabular-nums">
                                  {minutes}:{seconds < 10 ? '0' : ''}{seconds}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stores Active */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                        Delivered Streaming Outlets ({release.stores.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {release.stores.map(storeId => {
                          const store = DSP_STORES.find(s => s.id === storeId);
                          return (
                            <div
                              key={storeId}
                              className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[11px] flex items-center gap-2 text-neutral-300"
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: store?.color || '#F59E0B' }}
                              />
                              <span>{store?.name || storeId}</span>
                              <span className="text-emerald-400 text-[10px]">● Live</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
