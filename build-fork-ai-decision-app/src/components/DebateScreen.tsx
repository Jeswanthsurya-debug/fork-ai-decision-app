import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonaArgument } from '../types/decision';
import { sound } from '../utils/audio';
import { ArrowRight, Globe, Pause, Play } from 'lucide-react';

interface DebateScreenProps {
  query: string;
  argumentsList: PersonaArgument[];
  onCompleteDebate: () => void;
}

export const DebateScreen: React.FC<DebateScreenProps> = ({
  query,
  argumentsList,
  onCompleteDebate,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visitedIndices, setVisitedIndices] = useState<number[]>([0]);

  const activePersona = argumentsList[activeIndex] || argumentsList[0];

  // Auto-advance through personas unless paused
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      if (activeIndex < argumentsList.length - 1) {
        const next = activeIndex + 1;
        setActiveIndex(next);
        setVisitedIndices((prev) => (prev.includes(next) ? prev : [...prev, next]));
        sound.personaShift(320 + next * 90);
      } else {
        sound.forkChord();
        onCompleteDebate();
      }
    }, 4800);

    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, argumentsList.length, onCompleteDebate]);

  const handleSelectPersona = (index: number) => {
    sound.click();
    sound.personaShift(320 + index * 90);
    setActiveIndex(index);
    setVisitedIndices((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const handleSkipToFork = () => {
    sound.forkChord();
    onCompleteDebate();
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col justify-between items-center px-4 sm:px-6 pt-22 pb-10 z-10 max-w-4xl mx-auto w-full">
      {/* Top Dilemma Anchor */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs font-sans text-white/50 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] animate-ping" />
          <span>Synthesizing 4 agent personas</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white/95 line-clamp-2 px-2">
          &ldquo;{query}&rdquo;
        </h2>
      </div>

      {/* Centerpiece: The Celestial Orb Arc */}
      <div className="w-full flex flex-col items-center justify-center my-auto py-6">
        {/* Arc Container */}
        <div className="relative w-full max-w-md h-36 flex items-center justify-center">
          {/* Subtle curved connecting guide line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 140"
            fill="none"
          >
            <path
              d="M 40,110 Q 200,20 360,110"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>

          {/* 4 Orbs positioned along the parabolic arc */}
          <div className="relative w-full flex items-center justify-between px-6 sm:px-12 z-10">
            {argumentsList.map((arg, idx) => {
              const isActive = idx === activeIndex;
              const hasVisited = visitedIndices.includes(idx);

              // Parabolic height offsets
              const yOffsets = [18, -12, -12, 18];
              const yOffset = yOffsets[idx] ?? 0;

              return (
                <div
                  key={arg.id}
                  className="flex flex-col items-center cursor-pointer transition-transform"
                  style={{ transform: `translateY(${yOffset}px)` }}
                  onClick={() => handleSelectPersona(idx)}
                >
                  {/* The Orb */}
                  <motion.div
                    className="relative flex items-center justify-center"
                    animate={{
                      scale: isActive ? 1.35 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  >
                    {/* Breathing halo for active orb */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-[-12px] rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${arg.color} 0%, transparent 70%)`,
                          opacity: 0.45,
                        }}
                        animate={{
                          scale: [1, 1.25, 1],
                          opacity: [0.35, 0.6, 0.35],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}

                    {/* Concentric boundary ring */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isActive
                          ? 'border-white/80 bg-white/[0.08] shadow-lg'
                          : hasVisited
                          ? 'border-white/20 bg-white/[0.03]'
                          : 'border-white/10 bg-transparent'
                      }`}
                    >
                      {/* Inner luminous core */}
                      <div
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: arg.color,
                          boxShadow: isActive ? `0 0 16px ${arg.color}` : 'none',
                          opacity: isActive ? 1 : hasVisited ? 0.6 : 0.3,
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Label below orb in sentence case */}
                  <span
                    className={`mt-2.5 text-xs font-sans transition-colors duration-200 ${
                      isActive ? 'text-white font-medium' : 'text-white/40'
                    }`}
                  >
                    {arg.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Typographic Argument & Blur-to-Sharp Text Reveal */}
        <div className="w-full max-w-2xl min-h-[160px] flex flex-col items-center justify-center text-center mt-6 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePersona.id}
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center space-y-4"
            >
              {/* Persona Tagline in sentence case */}
              <div
                className="flex items-center space-x-2 text-xs font-sans px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02]"
                style={{ color: activePersona.color }}
              >
                <span className="font-medium">{activePersona.name}</span>
                <span className="text-white/20">—</span>
                <span className="text-white/60">{activePersona.title}</span>
              </div>

              {/* The Argument in Refined Instrument Serif */}
              <p className="font-serif text-xl sm:text-2xl md:text-3xl text-white/95 font-normal leading-relaxed tracking-tight max-w-2xl">
                &ldquo;{activePersona.argument}&rdquo;
              </p>

              {/* Real Data Points / Source Chips */}
              {activePersona.citations && activePersona.citations.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {activePersona.citations.map((cite, cIdx) => (
                    <motion.div
                      key={cIdx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + cIdx * 0.1 }}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.02] text-xs font-sans text-white/70 hover:border-white/20 transition-colors"
                    >
                      <span className="text-white/40">{cite.label}:</span>
                      <span className="text-white font-medium">{cite.value}</span>
                      <span className="text-white/20">•</span>
                      <span className="flex items-center space-x-1 text-white/50">
                        <Globe className="w-2.5 h-2.5 text-white/40" />
                        <span>{cite.domain}</span>
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls in sentence case */}
      <div className="w-full flex items-center justify-between pt-6 border-t border-white/[0.06] text-xs font-sans text-white/40">
        {/* Play/Pause controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sound.click();
              setIsPaused(!isPaused);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-white/[0.08] hover:border-white/20 hover:text-white transition-colors cursor-pointer"
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 text-[#76B900]" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            )}
          </button>

          <span className="text-white/20 hidden sm:inline">|</span>

          <span className="hidden sm:inline">
            Perspective {activeIndex + 1} of {argumentsList.length}
          </span>
        </div>

        {/* Advance directly to The Fork */}
        <button
          onClick={handleSkipToFork}
          className="group flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#76B900]/40 bg-[#76B900]/10 hover:bg-[#76B900]/20 text-[#76B900] transition-all cursor-pointer font-medium"
        >
          <span>See the fork</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
