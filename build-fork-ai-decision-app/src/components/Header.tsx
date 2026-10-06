import React from 'react';
import { Volume2, VolumeX, Sliders, RotateCcw, Sparkles } from 'lucide-react';
import { AppPhase, ApiSettings } from '../types/decision';
import { sound } from '../utils/audio';

interface HeaderProps {
  phase: AppPhase;
  onReset: () => void;
  apiSettings: ApiSettings;
  onUpdateSettings: (settings: Partial<ApiSettings>) => void;
  onOpenSettings: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  phase,
  onReset,
  apiSettings,
  onUpdateSettings,
  onOpenSettings,
  isAudioMuted,
  onToggleAudio,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between border-b border-white/[0.06] bg-[#07070A]/85 backdrop-blur-md transition-all duration-300">
      {/* Left: Brand + Hackathon badge */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => {
            sound.click();
            onReset();
          }}
          className="flex items-center space-x-2.5 group text-left cursor-pointer focus:outline-none"
          title="Return to start"
        >
          {/* Dual Branching Glyph */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white/90 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="6" y1="3" x2="6" y2="15" />
              <circle cx="18" cy="6" r="3" className="stroke-[#76B900]" />
              <circle cx="6" cy="18" r="3" className="stroke-white/70" />
              <path d="M6 12 C 6 8, 12 6, 15 6" className="stroke-[#76B900]" />
            </svg>
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#76B900] animate-pulse" />
          </div>

          <span className="font-serif text-lg tracking-normal font-normal text-white/95 group-hover:text-white transition-colors">
            Fork
          </span>
        </button>

        <span className="hidden sm:inline-block text-white/20 text-xs">/</span>

        {/* Nebius x NVIDIA Hackathon pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border border-white/[0.07] bg-white/[0.02] text-xs font-sans text-white/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] shadow-[0_0_6px_#76B900]" />
          <span>Nebius × NVIDIA</span>
        </div>
      </div>

      {/* Center: Phase indicator in sentence case */}
      {phase !== 'home' && (
        <div className="hidden md:flex items-center space-x-2 text-xs font-sans text-white/40">
          <span className={phase === 'debate' ? 'text-white/90 font-medium' : 'text-white/30'}>
            Debate
          </span>
          <span>→</span>
          <span className={phase === 'fork' ? 'text-[#76B900] font-medium glow-text-nvidia' : 'text-white/30'}>
            The Fork
          </span>
          <span>→</span>
          <span className={phase === 'verdict' ? 'text-[#8B7CFF] font-medium' : 'text-white/30'}>
            Verdict
          </span>
        </div>
      )}

      {/* Right: Sentence case toggles */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-sans">
        {/* Reset button if not on home */}
        {phase !== 'home' && (
          <button
            onClick={() => {
              sound.click();
              onReset();
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04] text-white/70 hover:text-white transition-all cursor-pointer"
            title="Start new decision"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        {/* Demo Mode Toggle in sentence case */}
        <button
          onClick={() => {
            sound.click();
            onUpdateSettings({ demoMode: !apiSettings.demoMode });
          }}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
            apiSettings.demoMode
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-[#76B900]/40 bg-[#76B900]/15 text-[#76B900]'
          }`}
          title="Toggle between curated demo and live API reasoning"
        >
          <Sparkles className="w-3 h-3" />
          <span>{apiSettings.demoMode ? 'Demo mode' : 'Live API'}</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04] transition-colors cursor-pointer ${
            !isAudioMuted ? 'text-white/90' : 'text-white/30'
          }`}
          title={isAudioMuted ? 'Turn sound on' : 'Mute sound'}
          aria-label="Toggle sound"
        >
          {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#76B900]" />}
        </button>

        {/* API Settings Modal Trigger */}
        <button
          onClick={() => {
            sound.click();
            onOpenSettings();
          }}
          className="p-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04] text-white/70 hover:text-white transition-colors cursor-pointer"
          title="Configure API keys"
          aria-label="API settings"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
