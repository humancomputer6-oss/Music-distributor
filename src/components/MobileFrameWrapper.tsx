import React from 'react';
import { useDistro } from '../context/DistroContext';
import {
  Wifi,
  Battery,
  Smartphone,
  Monitor,
  X,
  Radio,
  Signal,
} from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({ children }) => {
  const { deviceMode, setDeviceMode, liveListenersCount } = useDistro();

  if (deviceMode === 'desktop') {
    return <>{children}</>;
  }

  const isIOS = deviceMode === 'ios';

  return (
    <div className="min-h-screen bg-neutral-950 py-6 px-2 sm:px-4 flex flex-col items-center justify-start">
      {/* Device Viewport Bar Switcher */}
      <div className="mb-4 flex items-center justify-between gap-4 w-full max-w-[430px] px-2 text-xs">
        <div className="flex items-center gap-2 text-neutral-400">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white">
            {isIOS ? 'iPhone 16 Pro (iOS)' : 'Google Pixel 9 (Android)'}
          </span>
          <span className="text-[11px] text-neutral-500 font-mono">
            {liveListenersCount} live streams
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDeviceMode(isIOS ? 'android' : 'ios')}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-md border border-neutral-800 transition-colors cursor-pointer text-[11px]"
          >
            Switch to {isIOS ? 'Android' : 'iOS'}
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Exit mobile preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulated Smartphone Enclosure */}
      <div
        className={`w-full max-w-[412px] h-[840px] bg-neutral-950 rounded-[48px] border-[10px] ${
          isIOS ? 'border-neutral-800 shadow-2xl' : 'border-neutral-850 shadow-2xl'
        } flex flex-col overflow-hidden relative transition-all duration-300`}
      >
        {/* Native Status Bar */}
        <div className="h-11 bg-neutral-950 px-7 flex items-center justify-between text-white text-[12px] font-semibold select-none shrink-0 z-30">
          <span>09:41</span>

          {/* Dynamic Island (iOS) or Camera Punch (Android) */}
          {isIOS ? (
            <div className="w-24 h-6 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-neutral-400">DistroPulse</span>
            </div>
          ) : (
            <div className="w-3.5 h-3.5 bg-black rounded-full" />
          )}

          <div className="flex items-center gap-1.5 text-neutral-200">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Scrollable Mobile Content Viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
          <div className="p-3">{children}</div>
        </div>

        {/* Bottom Gesture Bar */}
        <div className="h-6 bg-neutral-950 flex items-center justify-center shrink-0 z-30">
          <div
            className={`h-1 rounded-full bg-neutral-600 ${
              isIOS ? 'w-32' : 'w-20'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
