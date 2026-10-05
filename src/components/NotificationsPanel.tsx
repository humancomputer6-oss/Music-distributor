import React from 'react';
import { useDistro } from '../context/DistroContext';
import {
  X,
  Bell,
  CheckCheck,
  TrendingUp,
  DollarSign,
  Heart,
  Radio,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    triggerSimulatedPushAlert,
    requestNotificationPermission,
    notificationPermission,
    setActiveTab,
  } = useDistro();

  if (!isOpen) return null;

  const handleSimulateAlert = (type: 'milestone' | 'payout' | 'fan') => {
    if (type === 'milestone') {
      triggerSimulatedPushAlert(
        'New Stream Milestone',
        'Your single "Midnight Drift" reached 200,000 streams across Spotify & Apple Music!'
      );
    } else if (type === 'payout') {
      triggerSimulatedPushAlert(
        'Automated Monthly Payout',
        'Direct deposit of $1,840.20 successfully transferred to your Chase bank account.'
      );
    } else {
      triggerSimulatedPushAlert(
        'New VIP Subscriber',
        'A dedicated fan just subscribed to your "Studio Producer Stems" membership tier ($30/mo)!'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-neutral-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Instant Push Notifications</h3>
            <span className="text-[11px] font-mono text-neutral-400">
              ({notifications.filter(n => !n.read).length} unread)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearAllNotifications}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Web Push Permission Banner */}
        {notificationPermission !== 'granted' && (
          <div className="p-3 bg-amber-400/10 border-b border-amber-400/20 text-xs text-neutral-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Receive instant mobile push alerts on DSP milestones & royalties</span>
            </div>
            <button
              onClick={() => requestNotificationPermission()}
              className="px-2.5 py-1 bg-amber-400 text-neutral-950 font-bold rounded text-[11px] hover:bg-amber-300 cursor-pointer shrink-0"
            >
              Enable
            </button>
          </div>
        )}

        {/* Simulate Triggers */}
        <div className="p-3 bg-neutral-950 border-b border-neutral-800 text-xs">
          <div className="text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
            Simulate Instant Alert:
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSimulateAlert('milestone')}
              className="flex-1 py-1 px-2 rounded bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 text-[11px] cursor-pointer"
            >
              Stream Spike
            </button>
            <button
              onClick={() => handleSimulateAlert('payout')}
              className="flex-1 py-1 px-2 rounded bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 text-[11px] cursor-pointer"
            >
              Payout Sent
            </button>
            <button
              onClick={() => handleSimulateAlert('fan')}
              className="flex-1 py-1 px-2 rounded bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 text-[11px] cursor-pointer"
            >
              New Fan Sub
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1 text-xs">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-neutral-500">No new notifications.</div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.linkTab) {
                    setActiveTab(n.linkTab);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-neutral-950/60 border-neutral-850 opacity-70'
                    : 'bg-neutral-950 border-neutral-750 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {n.type === 'milestone' && (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    )}
                    {n.type === 'payout' && <DollarSign className="w-4 h-4 text-emerald-400" />}
                    {n.type === 'fan' && <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />}
                    {n.type === 'distribution' && <Radio className="w-4 h-4 text-amber-400" />}
                    {n.type === 'system' && <ShieldCheck className="w-4 h-4 text-blue-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-white truncate">{n.title}</span>
                      <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
