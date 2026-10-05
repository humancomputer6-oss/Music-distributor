import React, { useState } from 'react';
import { useDistro } from '../context/DistroContext';
import { PayoutTransaction } from '../types';
import { DSP_STORES } from '../data/mockData';
import {
  DollarSign,
  Download,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  FileText,
  Lock,
  Search,
} from 'lucide-react';

interface RoyaltiesPayoutsProps {
  onOpenPayoutModal?: () => void;
}

export const RoyaltiesPayouts: React.FC<RoyaltiesPayoutsProps> = () => {
  const {
    availableBalance,
    allTimeEarnings,
    transactions,
    requestPayout,
    user,
    releases,
    isOffline,
  } = useDistro();

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<string>(availableBalance.toFixed(2));
  const [payoutMethod, setPayoutMethod] = useState<PayoutTransaction['method']>('Direct Deposit (ACH)');
  const [destination, setDestination] = useState('Chase Checking ****8921');
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Compute platform revenue share
  const totalStreams = releases.reduce((acc, r) => acc + r.totalStreams, 0);

  const handleExecutePayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payoutAmount);
    if (isNaN(amt) || amt <= 0 || amt > availableBalance) {
      alert('Please enter a valid amount within your available balance.');
      return;
    }

    const success = requestPayout(amt, payoutMethod, destination);
    if (success) {
      setPayoutSuccessMsg(`Successfully disbursed $${amt.toFixed(2)} to ${destination}.`);
      setTimeout(() => {
        setPayoutSuccessMsg(null);
        setPayoutModalOpen(false);
      }, 1800);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Date,Reference,Period,Method,Destination,Amount,Status']
        .concat(
          transactions.map(
            t =>
              `${t.date},${t.referenceId},"${t.statementPeriod}",${t.method},"${t.destination}",$${t.amount.toFixed(
                2
              )},${t.status}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DistroPulse_Royalty_Statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Streaming Royalties & Financial Payouts</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Transparent DSP revenue accounting, automated split payouts, and monthly direct deposit earnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-neutral-400" />
            <span>Export CSV Ledger</span>
          </button>
          <button
            onClick={() => {
              setPayoutAmount(availableBalance.toFixed(2));
              setPayoutModalOpen(true);
            }}
            disabled={availableBalance <= 0}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <DollarSign className="w-4 h-4" />
            <span>Request Payout</span>
          </button>
        </div>
      </div>

      {/* Financial Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
          <div className="text-xs text-neutral-400">Available For Immediate Cashout</div>
          <div className="text-3xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
            ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Direct deposit ready (ACH / Stripe / Wire)</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="text-xs text-neutral-400">Projected Next Month Royalties (Oct 2026)</div>
          <div className="text-3xl font-bold text-white font-mono tabular-nums mt-1">
            $2,145.80
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.2% from prior accounting period</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="text-xs text-neutral-400">Lifetime Catalog Revenue</div>
          <div className="text-3xl font-bold text-amber-400 font-mono tabular-nums mt-1">
            ${allTimeEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2 font-mono">
            Distributor Take: $0.00 (0% commission)
          </div>
        </div>
      </div>

      {/* Platform Royalty Rates Breakdown Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Streaming Platform Royalty Breakdown</h2>
            <p className="text-xs text-neutral-400">
              Per-stream payout rates delivered by digital service providers based on current DSP accounting pools.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Updated Sep 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950/60 text-neutral-400 border-b border-neutral-800 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-2.5 px-4 font-semibold">DSP Outlet</th>
                <th className="py-2.5 px-4 font-semibold text-right">Avg Rate / Stream</th>
                <th className="py-2.5 px-4 font-semibold text-right">Estimated Catalog Streams</th>
                <th className="py-2.5 px-4 font-semibold text-right">Gross Earnings</th>
                <th className="py-2.5 px-4 font-semibold text-right">Artist Net (100%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono">
              {DSP_STORES.slice(0, 6).map((store, i) => {
                // Approximate weighted distribution of total streams
                const weights = [0.45, 0.22, 0.12, 0.09, 0.07, 0.05];
                const streamsForStore = Math.floor(totalStreams * (weights[i] || 0.05));
                const revenue = streamsForStore * store.royaltyPerStream;

                return (
                  <tr key={store.id} className="hover:bg-neutral-850/50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2.5 font-sans font-medium text-neutral-200">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: store.color }} />
                      <span>{store.name}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-400 tabular-nums">
                      ${store.royaltyPerStream.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-200 tabular-nums">
                      {streamsForStore.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-200 tabular-nums font-semibold">
                      ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400 tabular-nums font-semibold">
                      ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Historical Payout Ledger & Disbursements</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Encrypted transaction records with W-8BEN/W-9 audit references.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit Financial Encryption</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950/60 text-neutral-400 border-b border-neutral-800 font-mono">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Disbursement Date</th>
                <th className="py-2.5 px-4 font-semibold">Audit Reference</th>
                <th className="py-2.5 px-4 font-semibold">Statement Period</th>
                <th className="py-2.5 px-4 font-semibold">Rail & Destination</th>
                <th className="py-2.5 px-4 font-semibold text-right">Disbursed Amount</th>
                <th className="py-2.5 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-neutral-850/50 transition-colors">
                  <td className="py-3 px-4 text-neutral-200 tabular-nums">{tx.date}</td>
                  <td className="py-3 px-4 text-neutral-400 text-[11px]">{tx.referenceId}</td>
                  <td className="py-3 px-4 text-neutral-300 font-sans">{tx.statementPeriod}</td>
                  <td className="py-3 px-4 text-neutral-300 font-sans">
                    <span className="font-semibold block">{tx.method}</span>
                    <span className="text-[11px] text-neutral-400 font-mono">{tx.destination}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white tabular-nums">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Request Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Request Royalty Cashout</h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    Available: ${availableBalance.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPayoutModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {payoutSuccessMsg ? (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-semibold text-emerald-300">{payoutSuccessMsg}</div>
                <div className="text-xs text-neutral-400">
                  Confirmation receipt has been saved to your transactions ledger.
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecutePayout} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Withdrawal Amount ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="10"
                      max={availableBalance}
                      value={payoutAmount}
                      onChange={e => setPayoutAmount(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-7 pr-16 py-2.5 text-base font-bold text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setPayoutAmount(availableBalance.toFixed(2))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded cursor-pointer"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Payment Gateway & Rail
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={e => {
                      const method = e.target.value as PayoutTransaction['method'];
                      setPayoutMethod(method);
                      if (method === 'Direct Deposit (ACH)') setDestination('Chase Checking ****8921');
                      else if (method === 'Stripe Connect') setDestination('acct_1NZk8394Kira');
                      else if (method === 'PayPal') setDestination(user.email);
                      else setDestination('SWIFT: CHASUS33 / Acct ****8921');
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Direct Deposit (ACH)">Direct Deposit (ACH - Free, 1-2 business days)</option>
                    <option value="Stripe Connect">Stripe Connect (Instant Express Payout)</option>
                    <option value="PayPal">PayPal (Instant transfer)</option>
                    <option value="Wire Transfer">International SWIFT Wire Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Destination Account Reference
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Tax Identification:</span>
                    <span className="text-emerald-400 font-semibold">{user.taxStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span className="text-white font-semibold">$0.00 (Zero Fee)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Arrival:</span>
                    <span className="text-neutral-200">Instant to 24 Hours</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutModalOpen(false)}
                    className="px-4 py-2 font-semibold text-neutral-400 hover:text-white rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Authorize Disbursement</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
