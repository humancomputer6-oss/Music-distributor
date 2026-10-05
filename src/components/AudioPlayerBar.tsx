import React, { useRef, useState, useEffect } from 'react';
import { useDistro } from '../context/DistroContext';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Disc3, Share2 } from 'lucide-react';

export const AudioPlayerBar: React.FC = () => {
  const {
    playingTrackId,
    isPlaying,
    playTrack,
    pauseTrack,
    currentAudioUrl,
    activeTrackInfo,
    releases,
    setSelectedReleaseForShare,
  } = useDistro();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(218);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.warn('Audio auto-play prevented:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentAudioUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.8;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Find corresponding release for smart link share
  const activeRelease = releases.find(r => r.tracks.some(t => t.id === playingTrackId)) || releases[0];

  if (!playingTrackId && !activeTrackInfo) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-xl px-4 py-2.5 sm:px-6 shadow-2xl">
      <audio
        ref={audioRef}
        src={currentAudioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => pauseTrack()}
        preload="metadata"
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 w-1/4">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-neutral-800 bg-neutral-900 group">
            {activeTrackInfo?.cover ? (
              <img
                src={activeTrackInfo.cover}
                alt={activeTrackInfo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                <Disc3 className="w-5 h-5 text-neutral-500" />
              </div>
            )}
            {isPlaying && (
              <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-neutral-100 truncate">
              {activeTrackInfo?.title || 'Track Playback'}
            </h4>
            <p className="text-[11px] text-neutral-400 truncate">
              {activeTrackInfo?.artist || 'Artist'} · Master Audio 24-bit
            </p>
          </div>
        </div>

        {/* Player Controls & Scrubber */}
        <div className="flex flex-col items-center gap-1.5 w-full max-w-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.currentTime = Math.max(0, currentTime - 10);
              }}
              className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              title="Skip back 10s"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => (isPlaying ? pauseTrack() : playTrack(playingTrackId || 'trk-01'))}
              className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 flex items-center justify-center shadow-md shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-neutral-950" /> : <Play className="w-4 h-4 fill-neutral-950 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.currentTime = Math.min(duration, currentTime + 10);
              }}
              className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              title="Skip forward 10s"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Scrubber slider and time display */}
          <div className="w-full flex items-center gap-2 text-[11px] font-mono tabular-nums text-neutral-400">
            <span className="w-8 text-right">{formatTime(currentTime)}</span>
            
            <div className="relative flex-1 flex items-center group">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400 group-hover:h-1.5 transition-all"
              />
            </div>

            <span className="w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Share Actions */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
          <button
            onClick={() => setSelectedReleaseForShare(activeRelease)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart Link</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
