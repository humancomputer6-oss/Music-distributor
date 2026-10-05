export type ViewTab = 'overview' | 'catalog' | 'royalties' | 'analytics' | 'fans' | 'splits' | 'settings';

export type DeviceMode = 'desktop' | 'ios' | 'android';

export type ReleaseType = 'single' | 'ep' | 'album';

export type DeliveryStatus = 'live' | 'processing' | 'scheduled' | 'draft';

export interface DspStore {
  id: string;
  name: string;
  icon: string; // identifier
  color: string;
  enabled: boolean;
  royaltyPerStream: number;
}

export interface CollaboratorSplit {
  id: string;
  name: string;
  role: 'Artist' | 'Producer' | 'Songwriter' | 'Mixer' | 'Label';
  email: string;
  percentage: number;
  payoutStatus: 'verified' | 'pending_w9' | 'ready';
}

export interface Track {
  id: string;
  title: string;
  version?: string; // e.g. "Original Mix", "Acoustic", "Radio Edit"
  duration: number; // in seconds
  isrc: string;
  audioUrl?: string;
  explicit: boolean;
  genre: string;
  streamsCount: number;
  bpm: number;
  key: string;
  collaborators: CollaboratorSplit[];
}

export interface Release {
  id: string;
  title: string;
  artistName: string;
  type: ReleaseType;
  releaseDate: string;
  upc: string;
  coverArtUrl: string;
  genre: string;
  secondaryGenre?: string;
  label: string;
  status: DeliveryStatus;
  stores: string[]; // Store IDs
  tracks: Track[];
  totalStreams: number;
  smartLinkSlug: string;
}

export interface PayoutTransaction {
  id: string;
  date: string;
  amount: number;
  method: 'Direct Deposit (ACH)' | 'Stripe Connect' | 'PayPal' | 'Wire Transfer';
  destination: string;
  status: 'completed' | 'processing' | 'scheduled';
  statementPeriod: string;
  referenceId: string;
}

export interface CountryStat {
  countryCode: string;
  countryName: string;
  streams: number;
  percentage: number;
  listeners: number;
  growth: number;
}

export interface CityStat {
  city: string;
  country: string;
  listeners: number;
  streams: number;
}

export interface PlaylistPlacement {
  id: string;
  title: string;
  curator: string; // e.g. "Spotify", "Apple Music", "Indie Shuffle"
  type: 'editorial' | 'algorithmic' | 'user';
  trackTitle: string;
  followers: number;
  streamsGenerated: number;
  dateAdded: string;
}

export interface FanTier {
  id: string;
  name: string;
  priceMonthly: number;
  description: string;
  perks: string[];
  subscribersCount: number;
  colorTheme: string;
}

export interface FanSubscriber {
  id: string;
  name: string;
  avatar: string;
  tierId: string;
  tierName: string;
  joinedDate: string;
  totalContributed: number;
  status: 'active' | 'renewing';
}

export interface ExclusiveFanItem {
  id: string;
  title: string;
  tierRequired: string;
  type: 'stem' | 'demo' | 'backstage_qna' | 'discount';
  date: string;
  description: string;
  downloadSize?: string;
  duration?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'milestone' | 'payout' | 'fan' | 'distribution' | 'system';
  read: boolean;
  linkTab?: ViewTab;
}

export interface UserSession {
  id: string;
  device: string;
  platform: 'iOS' | 'Android' | 'macOS' | 'Windows';
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserProfile {
  name: string;
  artistName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  verifiedArtist: boolean;
  twoFactorEnabled: boolean;
  taxStatus: 'W-9 Verified' | 'W-8BEN Verified' | 'Action Required';
  defaultPayoutMethod: string;
  currency: string;
  spotifyUri: string;
  appleMusicId: string;
  role: 'artist' | 'fan';
}

export interface OfflineAction {
  id: string;
  action: string;
  timestamp: number;
  data: unknown;
}
