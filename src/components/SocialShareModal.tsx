import React, { useState } from 'react';
import { useDistro } from '../context/DistroContext';
import { Release } from '../types';
import { DSP_STORES } from '../data/mockData';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  ExternalLink,
  Sparkles,
  Download,
  Music,
} from 'lucide-react';

interface SocialShareModalProps {
  release: Release | null;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({ release, onClose }) => {
  const { user } = useDistro();
  const [copied, setCopied] = useState(false);
  const [activeShareView, setActiveShareView] = useState<'smartlink' | 'story_card'>('smartlink');

  if (!release) return null;

  const smartLinkUrl = `https://distropulse.fm/${user.artistName.toLowerCase().replace(/\s+/g, '')}/${release.smartLinkSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(smartLinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    let url = '';
    const text = `Listen to "${release.title}" by ${user.artistName} on all streaming platforms:`;

    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(smartLinkUrl)}`;
    } else if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${smartLinkUrl}`)}`;
    } else if (platform === 'reddit') {
      url = `https://reddit.com/submit?title=${encodeURIComponent(`${user.artistName} - ${release.title}`)}&url=${encodeURIComponent(smartLinkUrl)}`;
    }

    if (url) window.open(url, '_blank', 'width=600,height=500');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Share & Fan Smart Link</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-4 flex gap-2 border-b border-neutral-800 pb-3">
          <button
            onClick={() => setActiveShareView('smartlink')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeShareView === 'smartlink'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Smart Link Landing Page
          </button>
          <button
            onClick={() => setActiveShareView('story_card')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeShareView === 'story_card'
                ? 'bg-amber-400 text-neutral-950'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Instagram & TikTok Story Card (9:16)
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {activeShareView === 'smartlink' ? (
            <>
              {/* Release Header Preview */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center gap-4">
                <img
                  src={release.coverArtUrl}
                  alt={release.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover border border-neutral-800 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{release.title}</h4>
                  <p className="text-neutral-400 text-xs mt-0.5">by {release.artistName}</p>
                  <p className="text-[11px] font-mono text-amber-400 mt-1">
                    {release.stores.length} Streaming DSPs Connected
                  </p>
                </div>
              </div>

              {/* URL Copy Bar */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">
                  Universal Fan Smart Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={smartLinkUrl}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 font-mono text-xs focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Streaming Platform Direct Buttons Preview */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-2">
                  Live Streaming Destinations
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DSP_STORES.slice(0, 6).map(store => (
                    <button
                      key={store.id}
                      onClick={() => alert(`Redirecting fan to ${store.name} for ${release.title}`)}
                      className="p-2.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-lg flex items-center justify-between text-neutral-300 hover:text-white transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: store.color }}
                        />
                        <span className="font-medium">{store.name}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Channels */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-2">
                  Broadcast Directly
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSocialShare('twitter')}
                    className="flex-1 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-white font-medium transition-colors cursor-pointer"
                  >
                    X / Twitter
                  </button>
                  <button
                    onClick={() => handleSocialShare('whatsapp')}
                    className="flex-1 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-white font-medium transition-colors cursor-pointer"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleSocialShare('reddit')}
                    className="flex-1 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-white font-medium transition-colors cursor-pointer"
                  >
                    Reddit Music
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Instagram & TikTok Vertical Story Card */
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-56 aspect-[9/16] bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden">
                  <div className="w-full flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                    <span>NOW STREAMING</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  </div>

                  <div className="space-y-3 w-full my-auto">
                    <img
                      src={release.coverArtUrl}
                      alt={release.title}
                      referrerPolicy="no-referrer"
                      className="w-36 h-36 mx-auto rounded-xl object-cover shadow-2xl border border-neutral-800"
                    />

                    <div>
                      <h4 className="font-bold text-white text-sm truncate">{release.title}</h4>
                      <p className="text-[11px] text-neutral-400">{user.artistName}</p>
                    </div>

                    {/* Simulated Waveform bars */}
                    <div className="flex items-center justify-center gap-1 h-6">
                      {[12, 20, 15, 24, 18, 22, 14, 19, 10].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-amber-400 rounded-full"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="w-full pt-2 border-t border-neutral-850 flex items-center justify-between text-[10px] text-neutral-400">
                    <QrCode className="w-6 h-6 text-amber-400" />
                    <span className="font-mono">Scan to Stream</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => alert('Story card asset generated and ready for Instagram & TikTok export!')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Story Card (1080x1920)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
