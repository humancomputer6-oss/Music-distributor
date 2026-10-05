import React, { useState } from 'react';
import { useDistro } from '../context/DistroContext';
import { FanTier } from '../types';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  Users,
  CheckCircle2,
  DollarSign,
  Download,
  Lock,
  Unlock,
  Radio,
  Coffee,
  Play,
  FileAudio,
  Plus,
} from 'lucide-react';

export const FanSubscriptions: React.FC = () => {
  const {
    user,
    fanTiers,
    fanSubscribers,
    exclusiveItems,
    monthlyRecurringRevenue,
    supportArtistSubscribe,
    supportArtistTip,
    playTrack,
  } = useDistro();

  // Test Fan Support Experience State
  const [subscribeModalTier, setSubscribeModalTier] = useState<FanTier | null>(null);
  const [fanName, setFanName] = useState('');
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState('15');
  const [tipMessage, setTipMessage] = useState('Incredible production on Midnight Drift! Keep creating.');
  const [unlockedItems, setUnlockedItems] = useState<string[]>(['item-03']);

  const handleConfirmSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeModalTier) return;

    supportArtistSubscribe(subscribeModalTier.id, fanName || 'Loyal Supporter');

    // Unlock exclusive items for this tier
    setUnlockedItems(exclusiveItems.map(i => i.id));

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#EC4899', '#F59E0B', '#10B981'],
      });
    } catch {}

    setSubscribeModalTier(null);
    setFanName('');
  };

  const handleSendTip = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(tipAmount);
    if (isNaN(amt) || amt <= 0) return;

    supportArtistTip(amt, fanName || 'Anonymous Fan', tipMessage);

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch {}

    setTipModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Direct Fan Subscriptions & Community Support</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Empower your most dedicated listeners to support your music career directly through monthly membership tiers and exclusive stem drops.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTipModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Coffee className="w-4 h-4 text-amber-400" />
            <span>Send Fan Tip / Boost</span>
          </button>
        </div>
      </div>

      {/* Revenue & Tier Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <span className="text-xs text-neutral-400 block">Monthly Recurring Fan Revenue (MRR)</span>
          <div className="text-3xl font-bold text-amber-400 font-mono tabular-nums mt-1">
            ${monthlyRecurringRevenue.toLocaleString()}/mo
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            95% Creator Split · Automatic monthly disbursement
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <span className="text-xs text-neutral-400 block">Active Fan Club Members</span>
          <div className="text-3xl font-bold text-white font-mono tabular-nums mt-1">
            {fanTiers.reduce((acc, t) => acc + t.subscribersCount, 0)} Subscribers
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 font-mono">
            +18 new fans this month (96% retention)
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <span className="text-xs text-neutral-400 block">Annual Fan Run Rate</span>
          <div className="text-3xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
            ${(monthlyRecurringRevenue * 12).toLocaleString()}/yr
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Sustainable independent income beyond streaming
          </div>
        </div>
      </div>

      {/* Subscription Tiers Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>Artist Subscription Tiers</span>
          </h2>
          <span className="text-xs text-neutral-400">Fans can join via Web, iOS or Android</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fanTiers.map(tier => (
            <div
              key={tier.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-6 flex flex-col justify-between transition-all relative overflow-hidden shadow-sm"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-10"
                style={{ backgroundColor: tier.colorTheme }}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">{tier.name}</span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tier.colorTheme }}
                  />
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-white tabular-nums">
                    ${tier.priceMonthly}
                  </span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed min-h-[48px]">
                  {tier.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Tier Perks Included
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-3 font-mono">
                  <span>Current Supporters:</span>
                  <span className="text-white font-semibold tabular-nums">
                    {tier.subscribersCount} fans
                  </span>
                </div>

                <button
                  onClick={() => setSubscribeModalTier(tier)}
                  className="w-full py-2.5 px-4 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join Tier (Simulate Fan Support)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive Fan Vault: Multitracks, Demos & Stems */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileAudio className="w-4 h-4 text-amber-400" />
              <span>Subscriber-Only Music Vault & Unreleased Stems</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Exclusive audio material unlocked automatically for active tier subscribers.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {unlockedItems.length} of {exclusiveItems.length} unlocked
          </span>
        </div>

        <div className="space-y-3">
          {exclusiveItems.map(item => {
            const isUnlocked = unlockedItems.includes(item.id);
            const tierReq = fanTiers.find(t => t.id === item.tierRequired);

            return (
              <div
                key={item.id}
                className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                    {isUnlocked ? (
                      <Unlock className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-neutral-500" />
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-white flex items-center gap-2 flex-wrap">
                      <span>{item.title}</span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        ({item.duration || item.downloadSize})
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400">
                        Requires {tierReq?.name || 'Subscription'}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  {isUnlocked ? (
                    <button
                      onClick={() => alert(`Downloading ${item.title} (Lossless Master Archive)`)}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Download File ({item.downloadSize})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSubscribeModalTier(tierReq || fanTiers[0])}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock with {tierReq?.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Subscribers Roster */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Recent Fan Club Supporters</span>
          </h3>
          <span className="text-xs text-neutral-400 font-mono">
            {fanSubscribers.length} total subscribers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950/60 text-neutral-400 border-b border-neutral-800 font-mono">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Fan Supporter</th>
                <th className="py-2.5 px-4 font-semibold">Membership Tier</th>
                <th className="py-2.5 px-4 font-semibold">Joined Date</th>
                <th className="py-2.5 px-4 font-semibold text-right">Lifetime Support</th>
                <th className="py-2.5 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono">
              {fanSubscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-neutral-850/50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-2.5 font-sans font-medium text-neutral-200">
                    <img
                      src={sub.avatar}
                      alt={sub.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-neutral-700"
                    />
                    <span>{sub.name}</span>
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-300">
                    <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-amber-400">
                      {sub.tierName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-400 tabular-nums">{sub.joinedDate}</td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-semibold tabular-nums">
                    ${sub.totalContributed.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Modal (Simulates Fan Checkout) */}
      {subscribeModalTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="font-bold text-white text-base">Support {user.artistName}</h3>
                <span className="text-xs text-neutral-400">
                  Joining {subscribeModalTier.name} (${subscribeModalTier.priceMonthly}/mo)
                </span>
              </div>
              <button
                onClick={() => setSubscribeModalTier(null)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSubscription} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Your Fan / Supporter Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leo Vance"
                  value={fanName}
                  onChange={e => setFanName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-1.5 text-neutral-300">
                <div className="flex justify-between">
                  <span>Subscription Price:</span>
                  <span className="font-mono font-bold text-white">${subscribeModalTier.priceMonthly}.00 / month</span>
                </div>
                <div className="flex justify-between">
                  <span>Creator Receives:</span>
                  <span className="font-mono text-emerald-400">
                    ${(subscribeModalTier.priceMonthly * 0.95).toFixed(2)} (95%)
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Billing Cycle:</span>
                  <span>Monthly recurring (Cancel anytime)</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubscribeModalTier(null)}
                  className="px-4 py-2 font-semibold text-neutral-400 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-neutral-950" />
                  <span>Confirm Subscription</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fan Tip Modal */}
      {tipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="font-bold text-white text-base">Send Artist Tip / Boost</h3>
                <span className="text-xs text-neutral-400">Direct creator appreciation</span>
              </div>
              <button
                onClick={() => setTipModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTip} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Tip Amount ($ USD)
                </label>
                <div className="flex gap-2">
                  {['5', '10', '25', '50'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTipAmount(val)}
                      className={`flex-1 py-1.5 rounded-lg border font-mono font-bold cursor-pointer transition-colors ${
                        tipAmount === val
                          ? 'bg-amber-400 text-neutral-950 border-amber-400'
                          : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Message for {user.artistName}
                </label>
                <textarea
                  rows={3}
                  value={tipMessage}
                  onChange={e => setTipMessage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTipModalOpen(false)}
                  className="px-4 py-2 font-semibold text-neutral-400 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Send ${tipAmount} Boost</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
