import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, CornerDownLeft, Cpu } from 'lucide-react';
import { sound } from '../utils/audio';

interface HomeScreenProps {
  onStartDecision: (query: string) => void;
  isLoading: boolean;
}

const EXAMPLE_PROMPTS = [
  'Job offer vs. my own startup',
  'Relocate to Tokyo or stay in London',
  'Raise Series A vs. bootstrap',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartDecision, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;
    sound.click();
    onStartDecision(query.trim());
  };

  const handleSelectExample = (promptText: string) => {
    sound.click();
    setQuery(promptText);
    onStartDecision(promptText);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col justify-between items-center px-4 sm:px-6 pt-24 pb-10 z-10 max-w-5xl mx-auto w-full select-none">
      {/* Top subtle badge in sentence case */}
      <div className="animate-fade-in flex items-center space-x-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs font-sans text-white/50 mb-4 sm:mb-8">
        <Cpu className="w-3.5 h-3.5 text-[#76B900]" />
        <span>NVIDIA Nemotron reasoning</span>
        <span className="text-white/20">•</span>
        <span>Tavily ground truth</span>
      </div>

      {/* Main Centered Typographic Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl text-center py-6">
        {/* Main Headline in Instrument Serif */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-[-0.02em] font-normal text-white/95 leading-[1.08] mb-8 select-text">
          What are you deciding<span className="text-[#76B900]">?</span>
        </h1>

        {/* Blinking Caret Input Container */}
        <form
          onSubmit={handleSubmit}
          className={`w-full relative transition-all duration-300 rounded-2xl p-1 ${
            isFocused
              ? 'ring-1 ring-white/20 shadow-[0_0_40px_-10px_rgba(118,185,0,0.2)] bg-white/[0.03]'
              : 'border border-white/[0.07] bg-white/[0.015] hover:border-white/15'
          }`}
        >
          <div className="relative flex items-center px-4 sm:px-6 py-4 sm:py-5">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
              placeholder="e.g. Job offer vs. my own startup"
              className="w-full bg-transparent text-lg sm:text-2xl text-white placeholder-white/20 font-sans font-light focus:outline-none tracking-tight pr-12"
            />

            {/* Custom blinking caret indicator when empty */}
            {query.length === 0 && (
              <span
                className="absolute left-[20px] sm:left-[27px] w-[2px] h-6 sm:h-7 bg-[#76B900] animate-caret pointer-events-none"
                aria-hidden="true"
              />
            )}

            {/* Action button inside input */}
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className={`absolute right-3.5 sm:right-4 p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                query.trim() && !isLoading
                  ? 'bg-white text-black hover:bg-white/90 shadow-md scale-100'
                  : 'bg-white/5 text-white/20 scale-95 pointer-events-none'
              }`}
              title="Simulate decision"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <CornerDownLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Under-input keyboard hint in sentence case */}
          <div className="flex justify-between items-center px-4 py-2 border-t border-white/[0.04] text-xs font-sans text-white/35">
            <span>Multi-persona simulation</span>
            <span className="flex items-center space-x-1.5">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white/60 font-mono text-[11px]">↵ Enter</kbd>
            </span>
          </div>
        </form>

        {/* Three Quiet Example Prompts */}
        <div className="mt-10 sm:mt-14 w-full max-w-2xl">
          <p className="text-xs font-sans text-white/40 mb-3 text-center">
            Or choose a reference dilemma
          </p>
          <div className="flex flex-col space-y-2">
            {EXAMPLE_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectExample(promptText)}
                disabled={isLoading}
                className="group w-full text-left px-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className="text-xs font-mono text-[#76B900]/70 group-hover:text-[#76B900] transition-colors">
                    0{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base text-white/70 group-hover:text-white transition-colors truncate">
                    {promptText}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer calm telemetry in sentence case */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-6 border-t border-white/[0.04] text-xs font-sans text-white/35 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#76B900]" />
          <span>4 personas: The Optimist • The Skeptic • The Realist • Future You</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>60 fps graph dynamics</span>
          <span>•</span>
          <span>Zero spinners</span>
        </div>
      </div>
    </div>
  );
};
