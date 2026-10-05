import React, { useState } from 'react';
import { useDistro } from '../context/DistroContext';
import { ViewTab, DeviceMode } from '../types';
import {
  Bell,
  Radio,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  RefreshCw,
  Plus,
  ShieldCheck,
  User,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface TopBarProps {
  onOpenNotifications: () => void;
  onOpenUpload: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenNotifications, onOpenUpload }) => {
  const {
    activeTab,
    setActiveTab,
    deviceMode,
    setDeviceMode,
    isOffline,
    toggleOfflineSimulation,
    syncCrossPlatform,
    isSyncing,
    notifications,
    liveListenersCount,
    user,
    setUser,
  } = useDistro();

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const navItems: { id: ViewTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'catalog', label: 'Catalog & Stores' },
    { id: 'royalties', label: 'Royalties & Payouts' },
    { id: 'analytics', label: 'Demographics' },
    { id: 'fans', label: 'Fan Subscriptions' },
    { id: 'splits', label: 'Split Sheets' },
    { id: 'settings', label: 'Security & Sync' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
      {/* Offline Alert Strip if offline */}
      {isOffline && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> All changes, metadata edits, and payout requests are queued locally and will automatically synchronize when reconnected.
            </span>
          </div>
          <button
            onClick={toggleOfflineSimulation}
            className="text-xs underline hover:text-amber-200 transition-colors cursor-pointer"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Main Top Bar adhering to Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4 text-neutral-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              DistroPulse
            </span>
          </button>

          {/* Quiet live listeners indicator */}
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-neutral-800 text-xs text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono tabular-nums text-neutral-200">{liveListenersCount}</span>
            <span>listening live now</span>
          </div>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-400">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                activeTab === item.id
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'hover:text-neutral-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions & Device Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Device mode selector for Mobile-friendly real-time tracking test */}
          <div className="hidden sm:flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs text-neutral-400">
            <button
              title="Desktop View"
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                deviceMode === 'desktop' ? 'bg-neutral-800 text-amber-400 font-medium' : 'hover:text-neutral-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Desktop</span>
            </button>
            <button
              title="Preview iOS App"
              onClick={() => setDeviceMode('ios')}
              className={`p-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                deviceMode === 'ios' ? 'bg-neutral-800 text-amber-400 font-medium' : 'hover:text-neutral-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iOS</span>
            </button>
            <button
              title="Preview Android App"
              onClick={() => setDeviceMode('android')}
              className={`p-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                deviceMode === 'android' ? 'bg-neutral-800 text-amber-400 font-medium' : 'hover:text-neutral-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android</span>
            </button>
          </div>

          {/* Sync Button */}
          <button
            title="Sync cross-platform across iOS, Android and Web"
            onClick={() => syncCrossPlatform()}
            disabled={isSyncing}
            className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-lg border border-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Offline simulator toggle button */}
          <button
            title={isOffline ? 'Currently Offline (Click to go Online)' : 'Simulate Offline Mode'}
            onClick={toggleOfflineSimulation}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isOffline
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                : 'border-neutral-800 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          </button>

          {/* Notifications Trigger */}
          <button
            title="Push & In-app Notifications"
            onClick={onOpenNotifications}
            className="relative p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-lg border border-neutral-800 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-neutral-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Primary CTA: Upload & Distribute */}
          <button
            onClick={onOpenUpload}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Release</span>
          </button>

          {/* User Profile Mini Switch */}
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2 p-1 pl-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg cursor-pointer transition-colors"
          >
            <img
              src={user.avatarUrl}
              alt={user.artistName}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border border-amber-500/40"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="hidden md:inline text-xs font-medium text-neutral-200 truncate max-w-[100px]">
              {user.artistName}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab scrollbar for small screens */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-t border-neutral-800 overflow-x-auto text-xs font-medium text-neutral-400 no-scrollbar">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === item.id
                ? 'bg-amber-400/10 text-amber-400 font-semibold'
                : 'hover:text-neutral-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
