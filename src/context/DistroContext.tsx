import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Release,
  DspStore,
  PayoutTransaction,
  CountryStat,
  CityStat,
  PlaylistPlacement,
  FanTier,
  FanSubscriber,
  ExclusiveFanItem,
  NotificationItem,
  UserSession,
  UserProfile,
  OfflineAction,
  ViewTab,
  DeviceMode,
  CollaboratorSplit,
} from '../types';
import {
  DSP_STORES,
  INITIAL_USER,
  INITIAL_RELEASES,
  INITIAL_TRANSACTIONS,
  COUNTRY_STATS,
  CITY_STATS,
  PLAYLIST_PLACEMENTS,
  FAN_TIERS,
  EXCLUSIVE_FAN_ITEMS,
  INITIAL_SUBSCRIBERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SESSIONS,
} from '../data/mockData';

interface DistroContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  releases: Release[];
  setReleases: React.Dispatch<React.SetStateAction<Release[]>>;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  transactions: PayoutTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<PayoutTransaction[]>>;
  fanTiers: FanTier[];
  setFanTiers: React.Dispatch<React.SetStateAction<FanTier[]>>;
  fanSubscribers: FanSubscriber[];
  setFanSubscribers: React.Dispatch<React.SetStateAction<FanSubscriber[]>>;
  exclusiveItems: ExclusiveFanItem[];
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  sessions: UserSession[];
  
  // Real-time & Live Counters
  liveListenersCount: number;
  totalStreamsAccrued: number;
  availableBalance: number;
  allTimeEarnings: number;
  monthlyRecurringRevenue: number;
  
  // Audio playback state
  playingTrackId: string | null;
  isPlaying: boolean;
  playTrack: (trackId: string, audioUrl?: string) => void;
  pauseTrack: () => void;
  currentAudioUrl: string | null;
  activeTrackInfo: { title: string; artist: string; cover: string } | null;

  // Offline & Sync
  isOffline: boolean;
  toggleOfflineSimulation: () => void;
  offlineQueue: OfflineAction[];
  lastSyncedAt: Date;
  syncCrossPlatform: () => Promise<void>;
  isSyncing: boolean;

  // Actions
  addNewRelease: (newRelease: Omit<Release, 'id' | 'totalStreams' | 'smartLinkSlug'>) => void;
  requestPayout: (amount: number, method: PayoutTransaction['method'], destination: string) => boolean;
  supportArtistSubscribe: (tierId: string, fanName: string) => void;
  supportArtistTip: (amount: number, fanName: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  triggerSimulatedPushAlert: (title?: string, message?: string) => void;
  requestNotificationPermission: () => Promise<string>;
  notificationPermission: NotificationPermission;
  selectedReleaseForShare: Release | null;
  setSelectedReleaseForShare: (release: Release | null) => void;
  selectedReleaseForUpload: boolean;
  setSelectedReleaseForUpload: (open: boolean) => void;
  updateCollaborators: (releaseId: string, trackId: string, splits: CollaboratorSplit[]) => void;
}

const DistroContext = createContext<DistroContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RELEASES: 'distropulse_releases_v1',
  TRANSACTIONS: 'distropulse_transactions_v1',
  USER: 'distropulse_user_v1',
  SUBSCRIBERS: 'distropulse_subs_v1',
  NOTIFICATIONS: 'distropulse_notifs_v1',
  BALANCE: 'distropulse_balance_v1',
};

export const DistroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [releases, setReleases] = useState<Release[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RELEASES);
    return saved ? JSON.parse(saved) : INITIAL_RELEASES;
  });

  const [transactions, setTransactions] = useState<PayoutTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [fanTiers, setFanTiers] = useState<FanTier[]>(FAN_TIERS);
  const [fanSubscribers, setFanSubscribers] = useState<FanSubscriber[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIBERS;
  });

  const [exclusiveItems] = useState<ExclusiveFanItem[]>(EXCLUSIVE_FAN_ITEMS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [sessions] = useState<UserSession[]>(INITIAL_SESSIONS);
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  // Available Payout Balance
  const [availableBalance, setAvailableBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
    return saved ? parseFloat(saved) : 2840.45;
  });

  // Audio Playback
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [activeTrackInfo, setActiveTrackInfo] = useState<{ title: string; artist: string; cover: string } | null>(null);

  // Offline Simulation & Cross-Platform Sync
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isBrowserOffline, setIsBrowserOffline] = useState<boolean>(!navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals
  const [selectedReleaseForShare, setSelectedReleaseForShare] = useState<Release | null>(null);
  const [selectedReleaseForUpload, setSelectedReleaseForUpload] = useState<boolean>(false);

  // Push Permission State
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Live Listeners & Stream Count simulation
  const [liveListenersCount, setLiveListenersCount] = useState<number>(148);
  const [streamDelta, setStreamDelta] = useState<number>(0);

  const isOffline = isSimulatedOffline || isBrowserOffline;

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RELEASES, JSON.stringify(releases));
  }, [releases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(fanSubscribers));
  }, [fanSubscribers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BALANCE, availableBalance.toFixed(2));
  }, [availableBalance]);

  // Online / offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOffline(false);
      // Auto flush queue if returning online
      flushOfflineQueue();
    };
    const handleOffline = () => setIsBrowserOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const flushOfflineQueue = () => {
    if (offlineQueue.length > 0) {
      setNotifications(prev => [
        {
          id: `n-${Date.now()}`,
          title: 'Offline Sync Completed',
          message: `Synchronized ${offlineQueue.length} queued action(s) across your devices.`,
          timestamp: 'Just now',
          type: 'system',
          read: false,
        },
        ...prev,
      ]);
      setOfflineQueue([]);
      setLastSyncedAt(new Date());
    }
  };

  // Live stream pulse simulator (adds 1-4 streams every 4.5 seconds and fluctuates active listeners)
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamDelta(prev => prev + Math.floor(Math.random() * 4) + 1);
      setLiveListenersCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        return Math.max(85, Math.min(290, prev + change));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Sync across platforms (iOS, Android, Web)
  const syncCrossPlatform = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 900));
    setLastSyncedAt(new Date());
    setIsSyncing(false);
  };

  const toggleOfflineSimulation = () => {
    setIsSimulatedOffline(prev => {
      const next = !prev;
      if (!next) {
        flushOfflineQueue();
      }
      return next;
    });
  };

  // Audio Playback handler
  const playTrack = (trackId: string, audioUrl?: string) => {
    let chosenUrl = audioUrl;
    let title = 'Selected Track';
    let artist = user.artistName;
    let cover = '/src/assets/images/cover_midnight_drift_1791203264525.jpg';

    // Locate track in catalog
    for (const rel of releases) {
      const t = rel.tracks.find(x => x.id === trackId);
      if (t) {
        title = t.title;
        artist = rel.artistName;
        cover = rel.coverArtUrl;
        chosenUrl = chosenUrl || t.audioUrl;
        break;
      }
    }

    if (!chosenUrl) {
      chosenUrl = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3';
    }

    setPlayingTrackId(trackId);
    setCurrentAudioUrl(chosenUrl);
    setActiveTrackInfo({ title, artist, cover });
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  // Add new release (tracks + stores + metadata)
  const addNewRelease = (newRelease: Omit<Release, 'id' | 'totalStreams' | 'smartLinkSlug'>) => {
    const id = `rel-${Date.now()}`;
    const slug = newRelease.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const releaseWithId: Release = {
      ...newRelease,
      id,
      totalStreams: 0,
      smartLinkSlug: slug,
    };

    if (isOffline) {
      setOfflineQueue(prev => [
        ...prev,
        { id: `q-${Date.now()}`, action: 'NEW_RELEASE', timestamp: Date.now(), data: releaseWithId },
      ]);
    }

    setReleases(prev => [releaseWithId, ...prev]);

    // Push notification
    triggerSimulatedPushAlert(
      'New Release Distributed to Stores',
      `"${newRelease.title}" is queued for ingest across ${newRelease.stores.length} streaming platforms.`
    );
  };

  // Request payout
  const requestPayout = (amount: number, method: PayoutTransaction['method'], destination: string): boolean => {
    if (amount <= 0 || amount > availableBalance) {
      return false;
    }

    const newTx: PayoutTransaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      method,
      destination,
      status: 'completed',
      statementPeriod: 'September 2026 Earnings',
      referenceId: `DP-${Date.now().toString().slice(-8)}`,
    };

    setAvailableBalance(prev => Math.max(0, prev - amount));
    setTransactions(prev => [newTx, ...prev]);

    if (isOffline) {
      setOfflineQueue(prev => [
        ...prev,
        { id: `q-${Date.now()}`, action: 'PAYOUT_REQUEST', timestamp: Date.now(), data: newTx },
      ]);
    }

    triggerSimulatedPushAlert(
      'Royalty Payout Processed',
      `$${amount.toFixed(2)} has been transferred via ${method} (${destination}).`
    );

    return true;
  };

  // Fan direct subscription support
  const supportArtistSubscribe = (tierId: string, fanName: string) => {
    const tier = fanTiers.find(t => t.id === tierId) || fanTiers[0];
    const newSub: FanSubscriber = {
      id: `sub-${Date.now()}`,
      name: fanName || 'Loyal Supporter',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      tierId: tier.id,
      tierName: tier.name,
      joinedDate: new Date().toISOString().split('T')[0],
      totalContributed: tier.priceMonthly,
      status: 'active',
    };

    setFanSubscribers(prev => [newSub, ...prev]);
    setFanTiers(prev =>
      prev.map(t => (t.id === tierId ? { ...t, subscribersCount: t.subscribersCount + 1 } : t))
    );
    setAvailableBalance(prev => prev + tier.priceMonthly * 0.95); // 95% to artist

    triggerSimulatedPushAlert(
      'New Fan Subscriber!',
      `${newSub.name} joined "${tier.name}" tier ($${tier.priceMonthly}/mo)!`
    );
  };

  // Fan Tip
  const supportArtistTip = (amount: number, fanName: string, message: string) => {
    setAvailableBalance(prev => prev + amount * 0.97);
    triggerSimulatedPushAlert(
      `Fan Boost: +$${amount.toFixed(2)}`,
      `${fanName || 'A fan'} sent a tip: "${message || 'Keep making incredible music!'}"`
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const triggerSimulatedPushAlert = (title = 'DistroPulse Alert', message = 'New streaming update available.') => {
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type: title.toLowerCase().includes('payout')
        ? 'payout'
        : title.toLowerCase().includes('fan')
        ? 'fan'
        : 'milestone',
      read: false,
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Native browser push notification if permitted
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.warn('Native notification suppressed:', err);
      }
    }
  };

  const requestNotificationPermission = async (): Promise<string> => {
    if (typeof Notification === 'undefined') return 'denied';
    try {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
      if (res === 'granted') {
        triggerSimulatedPushAlert(
          'Push Notifications Activated',
          'You will receive instant alerts for milestone streams, royalties, and fan subscriptions.'
        );
      }
      return res;
    } catch {
      return 'denied';
    }
  };

  const updateCollaborators = (releaseId: string, trackId: string, splits: CollaboratorSplit[]) => {
    setReleases(prev =>
      prev.map(r => {
        if (r.id !== releaseId) return r;
        return {
          ...r,
          tracks: r.tracks.map(t => (t.id === trackId ? { ...t, collaborators: splits } : t)),
        };
      })
    );
  };

  // Computations
  const totalStreamsAccrued = releases.reduce((acc, r) => acc + r.totalStreams, 0) + streamDelta;
  const allTimeEarnings = 32840.50 + streamDelta * 0.0042;
  const monthlyRecurringRevenue = fanTiers.reduce((acc, t) => acc + t.priceMonthly * t.subscribersCount, 0);

  return (
    <DistroContext.Provider
      value={{
        user,
        setUser,
        releases,
        setReleases,
        activeTab,
        setActiveTab,
        deviceMode,
        setDeviceMode,
        transactions,
        setTransactions,
        fanTiers,
        setFanTiers,
        fanSubscribers,
        setFanSubscribers,
        exclusiveItems,
        notifications,
        setNotifications,
        sessions,
        liveListenersCount,
        totalStreamsAccrued,
        availableBalance,
        allTimeEarnings,
        monthlyRecurringRevenue,
        playingTrackId,
        isPlaying,
        playTrack,
        pauseTrack,
        currentAudioUrl,
        activeTrackInfo,
        isOffline,
        toggleOfflineSimulation,
        offlineQueue,
        lastSyncedAt,
        syncCrossPlatform,
        isSyncing,
        addNewRelease,
        requestPayout,
        supportArtistSubscribe,
        supportArtistTip,
        markNotificationAsRead,
        clearAllNotifications,
        triggerSimulatedPushAlert,
        requestNotificationPermission,
        notificationPermission,
        selectedReleaseForShare,
        setSelectedReleaseForShare,
        selectedReleaseForUpload,
        setSelectedReleaseForUpload,
        updateCollaborators,
      }}
    >
      {children}
    </DistroContext.Provider>
  );
};

export const useDistro = () => {
  const context = useContext(DistroContext);
  if (!context) throw new Error('useDistro must be used within a DistroProvider');
  return context;
};
