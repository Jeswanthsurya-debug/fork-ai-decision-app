import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VerdictData, BranchPath } from '../types/decision';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  GitBranch,
} from 'lucide-react';

interface VerdictScreenProps {
  verdict: VerdictData;
  pathA: BranchPath;
  pathB: BranchPath;
  onOpenTwistModal: () => void;
  onOpenShareModal: () => void;
  onViewFork: () => void;
  onNewDecision: () => void;
}

export const VerdictScreen: React.FC<VerdictScreenProps> = ({
  verdict,
  pathA,
  pathB,
  onOpenTwistModal,
  onOpenShareModal,
  onViewFork,
}) => {
  const [copied, setCopied] = useState(false);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  const winningPath = verdict.winningPathId === 'pathA' ? pathA : pathB;
  const isWinningA = verdict.winningPathId === 'pathA';

  // Split headline into words for word-by-word typography reveal
  const words = verdict.headline.split(' ');

  // Animate confidence count up on mount
  useEffect(() => {
    sound.verdictPulse();
    let current = 0;
    const target = verdict.confidence;
    const step = Math.ceil(target / 45);

    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedConfidence(target);
        clearInterval(interval);
      } else {
        setAnimatedConfidence(current);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [verdict.confidence]);

  const handleCopySummary = () => {
    sound.click();
    const textToCopy = `Fork Decision Verdict
Verdict: "${verdict.headline}"
Confidence: ${verdict.confidence}%

Recommended path: ${winningPath.title}
Why: ${verdict.why}
Biggest risk: ${verdict.biggestRisk}
This week: ${verdict.firstStep}

Simulated via Fork (NVIDIA Nemotron on Nebius • Tavily search)`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  // SVG circular gauge math
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedConfidence / 100) * circumference;

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col justify-between items-center px-4 sm:px-8 pt-20 pb-10 z-10 max-w-4xl mx-auto w-full select-none">
      {/* Background radiant ambient glow for winning branch */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center items-center opacity-40 overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full bg-[#76B900]/10 blur-[130px]" />
      </div>

      {/* Top Visual Mini Fork: Weaker branch fades to 15% opacity, winning one glows */}
      <div className="flex flex-col items-center space-y-2 mb-2 sm:mb-4">
        <div className="flex items-center space-x-3 text-xs font-sans">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full border border-[#76B900]/30 bg-[#76B900]/10 text-[#76B900]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] animate-pulse" />
            <span className="font-medium">Verdict</span>
          </div>
          <span className="text-white/20">•</span>
          <button
            onClick={onViewFork}
            className="flex items-center space-x-1 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Full path</span>
          </button>
        </div>

        {/* Visual Mini Fork: Weaker branch exactly 15% opacity (0.15), winning branch bright & pulsing */}
        <div className="w-48 h-16 relative flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 70" fill="none">
            {/* Base trunk */}
            <line
              x1="100"
              y1="65"
              x2="100"
              y2="40"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="100" cy="40" r="3" fill="#FFFFFF" />

            {/* Left branch (Path A) */}
            <motion.path
              d="M 100,40 C 90,25 60,18 40,8"
              stroke="#76B900"
              strokeWidth={isWinningA ? '3.5' : '2'}
              strokeLinecap="round"
              style={{
                filter: isWinningA ? 'drop-shadow(0 0 10px #76B900)' : 'none',
              }}
              opacity={isWinningA ? 1 : 0.15}
              animate={
                isWinningA
                  ? {
                      opacity: [0.85, 1, 0.85],
                    }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            />
            <circle
              cx="40"
              cy="8"
              r={isWinningA ? '4.5' : '3'}
              fill="#76B900"
              opacity={isWinningA ? 1 : 0.15}
            />

            {/* Right branch (Path B) */}
            <motion.path
              d="M 100,40 C 110,25 140,18 160,8"
              stroke="#8B7CFF"
              strokeWidth={!isWinningA ? '3.5' : '2'}
              strokeLinecap="round"
              style={{
                filter: !isWinningA ? 'drop-shadow(0 0 10px #8B7CFF)' : 'none',
              }}
              opacity={!isWinningA ? 1 : 0.15}
              animate={
                !isWinningA
                  ? {
                      opacity: [0.85, 1, 0.85],
                    }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            />
            <circle
              cx="160"
              cy="8"
              r={!isWinningA ? '4.5' : '3'}
              fill="#8B7CFF"
              opacity={!isWinningA ? 1 : 0.15}
            />
          </svg>
        </div>
      </div>

      {/* Main Verdict Block */}
      <div className="w-full flex flex-col items-center text-center my-auto py-2">
        {/* Word-by-Word Instrument Serif Reveal */}
        <div className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-[-0.02em] leading-[1.14] max-w-3xl mb-8 flex flex-wrap justify-center gap-x-3 gap-y-1">
          {words.map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.45,
                delay: 0.12 + idx * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block text-white glow-text-white"
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Circular Confidence Meter & Recommended Path Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 w-full max-w-xl">
          {/* Circular Confidence Gauge */}
          <div className="flex items-center space-x-3.5 px-4 py-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 80 80">
                {/* Background Ring */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Active Ring */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="#76B900"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute font-mono text-xs font-semibold text-white tabular-nums">
                {animatedConfidence}%
              </span>
            </div>
            <div className="text-left font-sans">
              <div className="text-xs text-white/90 font-medium">
                Model confidence
              </div>
              <div className="text-[11px] text-white/40">
                NVIDIA Nemotron multi-pass
              </div>
            </div>
          </div>

          {/* Recommended Path Badge */}
          <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl border border-[#76B900]/30 bg-[#76B900]/10 text-left">
            <span className="w-2 h-2 rounded-full bg-[#76B900] shadow-[0_0_8px_#76B900]" />
            <div>
              <div className="text-[11px] font-sans text-[#76B900] font-medium">
                Recommended path
              </div>
              <div className="text-sm font-medium text-white truncate max-w-[200px]">
                {winningPath.title}
              </div>
            </div>
          </div>
        </div>

        {/* The Three Short Lines: Why, Biggest risk, This week */}
        <div className="w-full max-w-2xl space-y-3 text-left">
          {/* 1. Why */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="p-4 sm:p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/15 transition-all"
          >
            <div className="text-xs font-sans font-semibold text-[#76B900] mb-1">
              Why
            </div>
            <p className="text-sm sm:text-base text-white/90 font-sans font-light leading-relaxed">
              {verdict.why}
            </p>
          </motion.div>

          {/* 2. Biggest risk */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-4 sm:p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/15 transition-all"
          >
            <div className="text-xs font-sans font-semibold text-[#FF5C5C] mb-1">
              Biggest risk
            </div>
            <p className="text-sm sm:text-base text-white/90 font-sans font-light leading-relaxed">
              {verdict.biggestRisk}
            </p>
          </motion.div>

          {/* 3. This week */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="p-4 sm:p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/15 transition-all"
          >
            <div className="text-xs font-sans font-semibold text-[#38BDF8] mb-1">
              This week
            </div>
            <p className="text-sm sm:text-base text-white/90 font-sans font-light leading-relaxed">
              {verdict.firstStep}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Action Bar: Add a twist, Copy summary, Export card */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-white/[0.06] text-xs font-sans">
        {/* Add a twist */}
        <button
          onClick={() => {
            sound.click();
            onOpenTwistModal();
          }}
          className="group flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-[#76B900]/40 bg-[#76B900]/10 hover:bg-[#76B900]/20 text-[#76B900] transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Add a twist</span>
        </button>

        {/* Copy summary */}
        <button
          onClick={handleCopySummary}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04] text-white/80 hover:text-white transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#76B900]" />
              <span className="text-[#76B900]">Copied to clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy summary</span>
            </>
          )}
        </button>

        {/* Share / Export card */}
        <button
          onClick={() => {
            sound.click();
            onOpenShareModal();
          }}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04] text-white/80 hover:text-white transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Export card</span>
        </button>
      </div>
    </div>
  );
};
