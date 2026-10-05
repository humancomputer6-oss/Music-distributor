import React, { useState } from 'react';
import { useDistro } from '../context/DistroContext';
import { CollaboratorSplit } from '../types';
import {
  Users,
  Percent,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Mail,
  ShieldCheck,
  Disc3,
  Share2,
} from 'lucide-react';

export const CollaboratorSplits: React.FC = () => {
  const { releases, updateCollaborators, user } = useDistro();
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>(releases[0]?.id || '');
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    releases[0]?.tracks[0]?.id || ''
  );

  const currentRelease = releases.find(r => r.id === selectedReleaseId) || releases[0];
  const currentTrack = currentRelease?.tracks.find(t => t.id === selectedTrackId) || currentRelease?.tracks[0];
  const splits = currentTrack?.collaborators || [];

  const totalPercent = splits.reduce((sum, s) => sum + s.percentage, 0);

  const handlePercentageChange = (id: string, newPct: number) => {
    if (!currentRelease || !currentTrack) return;
    const updated = splits.map(s => (s.id === id ? { ...s, percentage: newPct } : s));
    updateCollaborators(currentRelease.id, currentTrack.id, updated);
  };

  const handleAddCollaborator = () => {
    if (!currentRelease || !currentTrack) return;
    const newSplit: CollaboratorSplit = {
      id: `c-${Date.now()}`,
      name: 'New Collaborator',
      role: 'Producer',
      email: 'collaborator@studio.com',
      percentage: 0,
      payoutStatus: 'pending_w9',
    };
    updateCollaborators(currentRelease.id, currentTrack.id, [...splits, newSplit]);
  };

  const handleRemoveCollaborator = (id: string) => {
    if (!currentRelease || !currentTrack || splits.length <= 1) return;
    const updated = splits.filter(s => s.id !== id);
    updateCollaborators(currentRelease.id, currentTrack.id, updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Collaborator Royalty Split Sheets</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Configure automated royalty routing for producers, songwriters, and featured artists with built-in tax compliance.
          </p>
        </div>

        <button
          onClick={handleAddCollaborator}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collaborator to Track</span>
        </button>
      </div>

      {/* Select Release & Track */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
        <div>
          <label className="block text-xs font-semibold text-neutral-400 mb-1">
            Selected Release
          </label>
          <select
            value={selectedReleaseId}
            onChange={e => {
              const relId = e.target.value;
              setSelectedReleaseId(relId);
              const r = releases.find(x => x.id === relId);
              if (r && r.tracks[0]) setSelectedTrackId(r.tracks[0].id);
            }}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            {releases.map(r => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.type.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-400 mb-1">
            Selected Track Split Sheet
          </label>
          <select
            value={selectedTrackId}
            onChange={e => setSelectedTrackId(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            {currentRelease?.tracks.map(t => (
              <option key={t.id} value={t.id}>
                {t.title} {t.version ? `(${t.version})` : ''} — ISRC: {t.isrc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Split Sheet Status Bar */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-neutral-400">Total Royalty Distribution:</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                totalPercent === 100 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {totalPercent}%
            </span>
            <span className="text-xs text-neutral-400">
              {totalPercent === 100 ? 'All 100% accounted for' : 'Error: Must add up to exactly 100%'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {totalPercent === 100 ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Split Sheet Active & Enforced</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>Imbalance: {100 - totalPercent}% remaining</span>
            </div>
          )}
        </div>
      </div>

      {/* Collaborators Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950/60 text-neutral-400 border-b border-neutral-800 font-mono">
              <tr>
                <th className="py-3 px-4 font-semibold">Collaborator Name</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Payout Email</th>
                <th className="py-3 px-4 font-semibold text-center">Tax Form Status</th>
                <th className="py-3 px-4 font-semibold text-right">Royalty Share %</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono">
              {splits.map(c => (
                <tr key={c.id} className="hover:bg-neutral-850/50 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-amber-400">
                        {c.name.charAt(0)}
                      </div>
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-300">
                    <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[11px]">
                      {c.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-400">{c.email}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        c.payoutStatus === 'verified'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {c.payoutStatus === 'verified' ? 'W-9 Verified' : 'Pending W-8/W-9'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={c.percentage}
                        onChange={e =>
                          handlePercentageChange(c.id, parseFloat(e.target.value) || 0)
                        }
                        className="w-10 text-right text-white font-mono font-bold focus:outline-none"
                      />
                      <span className="text-neutral-400">%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {splits.length > 1 && (
                      <button
                        onClick={() => handleRemoveCollaborator(c.id)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Remove collaborator"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
