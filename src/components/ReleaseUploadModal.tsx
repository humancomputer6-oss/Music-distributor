import React, { useState } from 'react';
import { useDistro } from '../context/DistroContext';
import { ReleaseType, CollaboratorSplit, Track } from '../types';
import { DSP_STORES } from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  X,
  Upload,
  Music,
  CheckCircle2,
  Disc3,
  Calendar,
  Layers,
  Percent,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileAudio,
} from 'lucide-react';

interface ReleaseUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COVERS = [
  '/src/assets/images/cover_midnight_drift_1791203264525.jpg',
  '/src/assets/images/cover_astral_solitude_1791203276425.jpg',
  '/src/assets/images/cover_neon_odyssey_1791203287788.jpg',
];

export const ReleaseUploadModal: React.FC<ReleaseUploadModalProps> = ({ isOpen, onClose }) => {
  const { user, addNewRelease } = useDistro();

  const [step, setStep] = useState<number>(1);
  const [releaseTitle, setReleaseTitle] = useState('');
  const [releaseType, setReleaseType] = useState<ReleaseType>('single');
  const [genre, setGenre] = useState('Electronic / Melodic');
  const [secondaryGenre, setSecondaryGenre] = useState('Downtempo');
  const [releaseDate, setReleaseDate] = useState('2026-10-25');
  const [label, setLabel] = useState('Nova Resonance Records');
  const [coverArtUrl, setCoverArtUrl] = useState(PRESET_COVERS[0]);
  const [explicit, setExplicit] = useState(false);

  // Stores
  const [selectedStores, setSelectedStores] = useState<string[]>(DSP_STORES.map(s => s.id));

  // Tracks
  const [tracks, setTracks] = useState<{
    title: string;
    version: string;
    bpm: number;
    key: string;
    duration: number;
    audioFileName: string;
  }[]>([
    {
      title: 'Solar Radiance',
      version: 'Original Mix',
      bpm: 122,
      key: 'G Minor',
      duration: 228,
      audioFileName: 'solar_radiance_master_24bit.wav',
    },
  ]);

  // Splits
  const [splits, setSplits] = useState<CollaboratorSplit[]>([
    { id: '1', name: `${user.name} (${user.artistName})`, role: 'Artist', email: user.email, percentage: 70, payoutStatus: 'verified' },
    { id: '2', name: 'Marcus Vane', role: 'Producer', email: 'marcus@soundgrid.co', percentage: 20, payoutStatus: 'verified' },
    { id: '3', name: 'Elena Rostova', role: 'Mixer', email: 'elena@berlinmastering.de', percentage: 10, payoutStatus: 'verified' },
  ]);

  if (!isOpen) return null;

  const totalSplitPercent = splits.reduce((sum, s) => sum + s.percentage, 0);

  const handleToggleStore = (storeId: string) => {
    setSelectedStores(prev =>
      prev.includes(storeId) ? prev.filter(id => id !== storeId) : [...prev, storeId]
    );
  };

  const handleSelectAllStores = () => {
    if (selectedStores.length === DSP_STORES.length) {
      setSelectedStores([]);
    } else {
      setSelectedStores(DSP_STORES.map(s => s.id));
    }
  };

  const handleAddTrack = () => {
    setTracks(prev => [
      ...prev,
      {
        title: `Track ${prev.length + 1}`,
        version: 'Master',
        bpm: 120,
        key: 'A Minor',
        duration: 210,
        audioFileName: `track_${prev.length + 1}_master.wav`,
      },
    ]);
  };

  const handleRemoveTrack = (index: number) => {
    if (tracks.length <= 1) return;
    setTracks(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSplit = () => {
    setSplits(prev => [
      ...prev,
      {
        id: `split-${Date.now()}`,
        name: 'New Collaborator',
        role: 'Songwriter',
        email: 'collaborator@studio.com',
        percentage: 0,
        payoutStatus: 'ready',
      },
    ]);
  };

  const handleRemoveSplit = (id: string) => {
    setSplits(prev => prev.filter(s => s.id !== id));
  };

  const handleDistribute = () => {
    // Generate unique UPC and ISRCs
    const generatedUpc = `0745${Math.floor(10000000 + Math.random() * 90000000)}`;

    const finalTracks: Track[] = tracks.map((t, i) => ({
      id: `trk-${Date.now()}-${i}`,
      title: t.title,
      version: t.version,
      duration: t.duration,
      isrc: `US-KRN-26-${Math.floor(10000 + Math.random() * 90000)}`,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      explicit,
      genre,
      streamsCount: 0,
      bpm: t.bpm,
      key: t.key,
      collaborators: splits,
    }));

    addNewRelease({
      title: releaseTitle || 'Solar Radiance',
      artistName: user.artistName,
      type: releaseType,
      releaseDate,
      upc: generatedUpc,
      coverArtUrl,
      genre,
      secondaryGenre,
      label,
      status: 'scheduled',
      stores: selectedStores,
      tracks: finalTracks,
    });

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#FFFFFF'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400">Step {step} of 4</div>
            <h3 className="text-lg font-bold text-white">
              {step === 1 && '1. Release Metadata & Cover Art'}
              {step === 2 && '2. Master Audio Files & Track Details'}
              {step === 3 && '3. Streaming Stores & Digital Rights'}
              {step === 4 && '4. Collaborator Splits & Review'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-neutral-200">
          {/* STEP 1: Metadata & Artwork */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Release Title *
                  </label>
                  <input
                    type="text"
                    value={releaseTitle}
                    onChange={e => setReleaseTitle(e.target.value)}
                    placeholder="e.g. Solar Radiance"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Release Type
                  </label>
                  <select
                    value={releaseType}
                    onChange={e => setReleaseType(e.target.value as ReleaseType)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="single">Single (1 Track)</option>
                    <option value="ep">EP (2–6 Tracks)</option>
                    <option value="album">Album / LP (7+ Tracks)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Primary Genre
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Record Label / Imprint
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={releaseDate}
                    onChange={e => setReleaseDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Cover Art selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Square Cover Artwork (3000 x 3000px, RGB)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {PRESET_COVERS.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setCoverArtUrl(url)}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        coverArtUrl === url
                          ? 'border-amber-400 scale-[1.02] shadow-lg'
                          : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Cover option" className="w-full h-full object-cover" />
                      {coverArtUrl === url && (
                        <div className="absolute top-2 right-2 bg-amber-400 text-neutral-950 p-1 rounded-full">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Explicit Content Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="explicitCheck"
                  checked={explicit}
                  onChange={e => setExplicit(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-400 accent-amber-400"
                />
                <label htmlFor="explicitCheck" className="text-xs text-neutral-300 cursor-pointer">
                  Explicit content (Explicit lyrics, advisory language)
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: Tracks & Audio */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  Upload lossless 24-bit 44.1kHz or 96kHz WAV/FLAC master files.
                </span>
                <button
                  onClick={handleAddTrack}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Track</span>
                </button>
              </div>

              <div className="space-y-3">
                {tracks.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-neutral-500">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={t.title}
                          onChange={e => {
                            const val = e.target.value;
                            setTracks(prev =>
                              prev.map((track, i) => (i === idx ? { ...track, title: val } : track))
                            );
                          }}
                          placeholder="Track Title"
                          className="bg-transparent border-b border-neutral-700 focus:border-amber-400 text-white font-semibold text-sm px-1 py-0.5 focus:outline-none"
                        />
                      </div>
                      {tracks.length > 1 && (
                        <button
                          onClick={() => handleRemoveTrack(idx)}
                          className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-neutral-400 block mb-1">Version</span>
                        <input
                          type="text"
                          value={t.version}
                          onChange={e => {
                            const val = e.target.value;
                            setTracks(prev =>
                              prev.map((tr, i) => (i === idx ? { ...tr, version: val } : tr))
                            );
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white"
                        />
                      </div>
                      <div>
                        <span className="text-neutral-400 block mb-1">Tempo (BPM)</span>
                        <input
                          type="number"
                          value={t.bpm}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 120;
                            setTracks(prev =>
                              prev.map((tr, i) => (i === idx ? { ...tr, bpm: val } : tr))
                            );
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-neutral-400 block mb-1">Musical Key</span>
                        <input
                          type="text"
                          value={t.key}
                          onChange={e => {
                            const val = e.target.value;
                            setTracks(prev =>
                              prev.map((tr, i) => (i === idx ? { ...tr, key: val } : tr))
                            );
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-neutral-400 block mb-1">Duration</span>
                        <div className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-300 font-mono">
                          03:48
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-neutral-300">
                        <FileAudio className="w-4 h-4 text-amber-400" />
                        <span className="font-mono">{t.audioFileName}</span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[11px]">Lossless WAV 24-bit Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Store Distribution Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Streaming Platforms & Outlets</h4>
                  <p className="text-xs text-neutral-400">
                    Selected stores will receive your release with simultaneous worldwide delivery.
                  </p>
                </div>
                <button
                  onClick={handleSelectAllStores}
                  className="text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  {selectedStores.length === DSP_STORES.length ? 'Deselect All' : 'Select All Stores'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DSP_STORES.map(store => {
                  const isChecked = selectedStores.includes(store.id);
                  return (
                    <div
                      key={store.id}
                      onClick={() => handleToggleStore(store.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-neutral-950 border-amber-400/40'
                          : 'bg-neutral-950/40 border-neutral-800/80 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: store.color }}
                        />
                        <div>
                          <span className="font-medium text-white text-xs block">{store.name}</span>
                          <span className="text-[11px] font-mono text-neutral-400">
                            Avg. payout: ~${store.royaltyPerStream.toFixed(4)}/stream
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked
                            ? 'bg-amber-400 border-amber-400 text-neutral-950'
                            : 'border-neutral-700'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-400">
                <strong>Territory Ingestion:</strong> Worldwide distribution across 240+ countries and regions with automatic YouTube Content ID and TikTok Sound Library fingerprinting included.
              </div>
            </div>
          )}

          {/* STEP 4: Collaborator Splits & Review */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Royalty Split Sheet Allocation</h4>
                  <button
                    onClick={handleAddSplit}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Collaborator</span>
                  </button>
                </div>
                <p className="text-xs text-neutral-400 mb-3">
                  Streaming revenue will be automatically calculated and credited directly to each collaborator&apos;s verified account.
                </p>

                <div className="space-y-2">
                  {splits.map(split => (
                    <div
                      key={split.id}
                      className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <input
                          type="text"
                          value={split.name}
                          onChange={e => {
                            const val = e.target.value;
                            setSplits(prev =>
                              prev.map(s => (s.id === split.id ? { ...s, name: val } : s))
                            );
                          }}
                          className="bg-transparent text-white font-medium focus:outline-none border-b border-neutral-800 focus:border-amber-400"
                        />
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          {split.email} · {split.role}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={split.percentage}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              setSplits(prev =>
                                prev.map(s => (s.id === split.id ? { ...s, percentage: val } : s))
                              );
                            }}
                            className="w-10 bg-transparent text-right text-white font-mono focus:outline-none"
                          />
                          <span className="text-neutral-400">%</span>
                        </div>

                        {splits.length > 1 && (
                          <button
                            onClick={() => handleRemoveSplit(split.id)}
                            className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Total Royalty Allocation:</span>
                  <span
                    className={`font-mono font-bold ${
                      totalSplitPercent === 100 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {totalSplitPercent}% {totalSplitPercent === 100 ? '✓ Balanced' : '(Must equal 100%)'}
                  </span>
                </div>
              </div>

              {/* Final Checklist Review */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2 text-xs">
                <div className="font-semibold text-white text-sm mb-1">Release Summary</div>
                <div className="flex justify-between text-neutral-400">
                  <span>Title:</span>
                  <span className="text-white font-medium">{releaseTitle || 'Solar Radiance'} ({releaseType.toUpperCase()})</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Stores:</span>
                  <span className="text-amber-400 font-medium">{selectedStores.length} DSP platforms selected</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Target Release Date:</span>
                  <span className="text-white font-mono">{releaseDate}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Distributor Commission:</span>
                  <span className="text-emerald-400 font-medium">0% (You keep 100% of revenue)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-neutral-800 flex items-center justify-between bg-neutral-950/50">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-850 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleDistribute}
              disabled={totalSplitPercent !== 100 || selectedStores.length === 0}
              className="px-6 py-2.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Distribute to Stores Worldwide</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
