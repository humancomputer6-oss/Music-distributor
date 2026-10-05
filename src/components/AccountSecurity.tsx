import React, { useState } from 'react';
import { useDistro } from '../context/DistroContext';
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  Lock,
  RefreshCw,
  Wifi,
  WifiOff,
  User,
  Key,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AccountSecurity: React.FC = () => {
  const {
    user,
    setUser,
    sessions,
    isOffline,
    toggleOfflineSimulation,
    syncCrossPlatform,
    isSyncing,
    lastSyncedAt,
    offlineQueue,
  } = useDistro();

  const [artistName, setArtistName] = useState(user.artistName);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      artistName,
      email,
      bio,
      twoFactorEnabled: twoFactor,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Account Security, Cross-Platform Sync & Offline Access</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
          Manage your verified artist credentials, two-factor authentication, active mobile sessions, and local offline cache.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Artist Credentials & 2FA (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>Artist Account Profile</span>
              </h2>
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Changes saved successfully</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Legal Account Holder Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full bg-neutral-950/60 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-400 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Artist & Stage Name
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={e => setArtistName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Primary Account Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Tax Identification Status
                </label>
                <div className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-emerald-400 font-semibold font-mono flex items-center justify-between">
                  <span>{user.taxStatus}</span>
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-neutral-300 mb-1">
                Artist Bio & DSP Profile Note
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Two-Factor Authentication Security */}
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-xs">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-neutral-400">
                    Require TOTP authenticator verification (Google Authenticator, 1Password) for all payout disbursements and metadata updates.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={e => setTwoFactor(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400" />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Save Profile Updates
              </button>
            </div>
          </form>

          {/* Active Sessions across iOS, Android & Desktop */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Active Cross-Platform Sessions</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Continuous encrypted sync across your mobile and desktop devices.
                </p>
              </div>

              <button
                onClick={() => syncCrossPlatform()}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Force Cloud Sync'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {sessions.map(sess => (
                <div
                  key={sess.id}
                  className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                      {sess.platform === 'macOS' || sess.platform === 'Windows' ? (
                        <Laptop className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-amber-400" />
                      )}
                    </div>

                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Current Device
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {sess.location} · {sess.lastActive}
                      </div>
                    </div>
                  </div>

                  <span className="text-emerald-400 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Synced</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Offline Mode & Storage Engine (1 col) */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>Offline Mode & Local Storage Cache</span>
            </h3>

            <p className="text-xs text-neutral-300 leading-relaxed">
              DistroPulse caches your entire catalog, metadata, streams analytics, and subscriber roster locally in browser storage so you can review releases and draft uploads on planes or in offline studio environments without internet connectivity.
            </p>

            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Current Network Status:</span>
                <span
                  className={`font-semibold font-mono flex items-center gap-1.5 ${
                    isOffline ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                  <span>{isOffline ? 'Offline Mode Active' : 'Online & Connected'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-400">
                <span>Queued Offline Edits:</span>
                <span className="font-mono text-white font-bold">{offlineQueue.length} action(s)</span>
              </div>

              <div className="flex items-center justify-between text-neutral-400">
                <span>Last Cloud Synchronization:</span>
                <span className="font-mono text-neutral-300">
                  {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>

            <button
              onClick={toggleOfflineSimulation}
              className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isOffline
                  ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 border-amber-400'
                  : 'bg-neutral-950 hover:bg-neutral-850 text-neutral-300 border-neutral-800'
              }`}
            >
              {isOffline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isOffline ? 'Switch Back to Online' : 'Simulate Offline Mode'}</span>
            </button>
          </div>

          {/* Account Role Switcher */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Experience View Mode</h3>
            <p className="text-xs text-neutral-400">
              Toggle between your Artist Creator console and the public Fan Supporter experience.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setUser(prev => ({ ...prev, role: 'artist' }))}
                className={`py-2 rounded-lg font-semibold border transition-colors cursor-pointer ${
                  user.role === 'artist'
                    ? 'bg-amber-400 text-neutral-950 border-amber-400'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                Artist Admin
              </button>
              <button
                onClick={() => setUser(prev => ({ ...prev, role: 'fan' }))}
                className={`py-2 rounded-lg font-semibold border transition-colors cursor-pointer ${
                  user.role === 'fan'
                    ? 'bg-amber-400 text-neutral-950 border-amber-400'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                Fan Supporter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
