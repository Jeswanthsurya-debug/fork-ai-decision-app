import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BranchPath } from '../types/decision';
import { sound } from '../utils/audio';
import { ArrowRight, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react';
import { CountUpText } from './CountUpText';

interface ForkScreenProps {
  query: string;
  pathA: BranchPath;
  pathB: BranchPath;
  onProceedToVerdict: () => void;
}

export const ForkScreen: React.FC<ForkScreenProps> = ({
  query,
  pathA,
  pathB,
  onProceedToVerdict,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<'oneMonth' | 'sixMonths' | 'oneYear'>('oneYear');

  useEffect(() => {
    sound.forkChord();
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const milestonesKeyOrder: ('oneMonth' | 'sixMonths' | 'oneYear')[] = ['oneMonth', 'sixMonths', 'oneYear'];

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col justify-between items-center px-4 sm:px-8 pt-20 pb-8 z-10 max-w-6xl mx-auto w-full select-none">
      {/* Top Dilemma & Branch Headings */}
      <div className="text-center max-w-3xl mx-auto mb-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs font-sans text-white/50 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#76B900]" />
          <span>Trajectory projection</span>
          <span className="text-white/20">•</span>
          <span>1 month → 6 months → 1 year</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white/95 leading-tight tracking-[-0.02em] px-2 mb-3">
          &ldquo;{query}&rdquo;
        </h2>

        {/* Quiet Subtitle for Branches */}
        <div className="flex items-center justify-center space-x-6 sm:space-x-12 text-sm font-sans pt-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#76B900] shadow-[0_0_8px_#76B900]" />
            <span className="text-[#76B900] font-medium">{pathA.title}</span>
            <span className="text-xs text-white/30 hidden sm:inline">({pathA.subtitle})</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#8B7CFF] shadow-[0_0_8px_#8B7CFF]" />
            <span className="text-[#8B7CFF] font-medium">{pathB.title}</span>
            <span className="text-xs text-white/30 hidden sm:inline">({pathB.subtitle})</span>
          </div>
        </div>
      </div>

      {/* Central Hero: The Luminous Fork Path with Milestone Nodes */}
      <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center my-2 sm:my-4">
        {/* SVG Path Graphic */}
        <div className="relative w-full h-[400px] sm:h-[460px] flex items-center justify-center">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 520"
            fill="none"
          >
            {/* Trunk: bottom center drawing up to fork junction */}
            <motion.path
              d="M 400,500 L 400,340"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isRevealed ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {/* Trunk glow */}
            <motion.path
              d="M 400,500 L 400,340"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isRevealed ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* Junction dot */}
            <motion.circle
              cx="400"
              cy="340"
              r="4.5"
              fill="#FFFFFF"
              initial={{ scale: 0 }}
              animate={{ scale: isRevealed ? 1 : 0 }}
              transition={{ delay: 0.7, type: 'spring' }}
            />

            {/* Branch A: Smooth bezier curve to top-left (NVIDIA Green) */}
            <motion.path
              d="M 400,340 C 385,270 240,240 180,140 C 150,90 155,40 160,20"
              stroke="#76B900"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 10px rgba(118, 185, 0, 0.8))' }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isRevealed ? 1 : 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Branch B: Smooth bezier curve to top-right (Soft Violet) */}
            <motion.path
              d="M 400,340 C 415,270 560,240 620,140 C 650,90 645,40 640,20"
              stroke="#8B7CFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 10px rgba(139, 124, 255, 0.7))' }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isRevealed ? 1 : 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Branch A: Milestone Dots */}
            {/* 1 Month Node A */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: isRevealed ? 1 : 0 }}
              transition={{ delay: 1.0, type: 'spring' }}
              className="cursor-pointer"
              onClick={() => {
                sound.nodePop();
                setSelectedMilestone('oneMonth');
              }}
            >
              <circle cx="310" cy="265" r="7" fill="#76B900" />
              <circle cx="310" cy="265" r="14" stroke="#76B900" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
            </motion.g>

            {/* 6 Months Node A */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: isRevealed ? 1 : 0 }}
              transition={{ delay: 1.3, type: 'spring' }}
              className="cursor-pointer"
              onClick={() => {
                sound.nodePop();
                setSelectedMilestone('sixMonths');
              }}
            >
              <circle cx="205" cy="165" r="7" fill="#76B900" />
              <circle cx="205" cy="165" r="14" stroke="#76B900" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
            </motion.g>

            {/* 1 Year Node A */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: isRevealed ? 1 : 0 }}
              transition={{ delay: 1.6, type: 'spring' }}
              className="cursor-pointer"
              onClick={() => {
                sound.nodePop();
                setSelectedMilestone('oneYear');
              }}
            >
              <circle cx="160" cy="45" r="8" fill="#76B900" />
              <circle cx="160" cy="45" r="18" stroke="#76B900" strokeWidth="1.5" opacity="0.5" className="animate-ping" />
            </motion.g>

            {/* Branch B: Milestone Dots */}
            {/* 1 Month Node B */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: isRevealed ? 1 : 0 }}
              transition={{ delay: 1.0, type: 'spring' }}
              className="cursor-pointer"
              onClick={() => {
                sound.nodePop();
                setSelectedMilestone('oneMonth');
              }}
            >
              <circle cx="490" cy="265" r="7" fill="#8B7CFF" />
              <circle cx="490" cy="265" r="14" stroke="#8B7CFF" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
            </motion.g>

            {/* 6 Months Node B */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: isRevealed ? 1 : 0 }}
              transition={{ delay: 1.3, type: 'spring' }}
              className="cursor-pointer"
              onClick={() => {
                sound.nodePop();
                setSelectedMilestone('sixMonths');
              }}
            >
              <circle cx="595" cy="165" r="7" fill="#8B7CFF" />
              <circle cx="595" cy="165" r="14" stroke="#8B7CFF" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
            </motion.g>

            {/* 1 Year Node B */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: isRevealed ? 1 : 0 }}
              transition={{ delay: 1.6, type: 'spring' }}
              className="cursor-pointer"
              onClick={() => {
                sound.nodePop();
                setSelectedMilestone('oneYear');
              }}
            >
              <circle cx="640" cy="45" r="8" fill="#8B7CFF" />
              <circle cx="640" cy="45" r="18" stroke="#8B7CFF" strokeWidth="1.5" opacity="0.5" className="animate-ping" />
            </motion.g>
          </svg>

          {/* HTML Overlay: One short line of text and one number per milestone dot */}
          {/* Left Branch Labels (Option A - Green) */}
          {/* 1 Month Label A */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isRevealed ? 1 : 0, x: 0 }}
            transition={{ delay: 1.1 }}
            className="absolute left-2 sm:left-12 top-[54%] -translate-y-1/2 text-left max-w-[170px] sm:max-w-[210px] pointer-events-auto cursor-pointer"
            onClick={() => {
              sound.nodePop();
              setSelectedMilestone('oneMonth');
            }}
          >
            <div className="text-[11px] font-sans text-[#76B900] font-medium tracking-wide">
              1 month
            </div>
            <div className="text-xs sm:text-sm text-white/90 font-sans leading-snug">
              {pathA.milestones.oneMonth.shortText}
            </div>
            <div className="text-xs sm:text-sm font-mono text-[#76B900] font-medium mt-0.5">
              <CountUpText value={pathA.milestones.oneMonth.metricValue} />
            </div>
          </motion.div>

          {/* 6 Months Label A */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isRevealed ? 1 : 0, x: 0 }}
            transition={{ delay: 1.4 }}
            className="absolute left-2 sm:left-8 top-[32%] -translate-y-1/2 text-left max-w-[170px] sm:max-w-[210px] pointer-events-auto cursor-pointer"
            onClick={() => {
              sound.nodePop();
              setSelectedMilestone('sixMonths');
            }}
          >
            <div className="text-[11px] font-sans text-[#76B900] font-medium tracking-wide">
              6 months
            </div>
            <div className="text-xs sm:text-sm text-white/90 font-sans leading-snug">
              {pathA.milestones.sixMonths.shortText}
            </div>
            <div className="text-xs sm:text-sm font-mono text-[#76B900] font-medium mt-0.5">
              <CountUpText value={pathA.milestones.sixMonths.metricValue} />
            </div>
          </motion.div>

          {/* 1 Year Label A */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isRevealed ? 1 : 0, x: 0 }}
            transition={{ delay: 1.7 }}
            className="absolute left-2 sm:left-4 top-[8%] -translate-y-1/2 text-left max-w-[180px] sm:max-w-[220px] pointer-events-auto cursor-pointer"
            onClick={() => {
              sound.nodePop();
              setSelectedMilestone('oneYear');
            }}
          >
            <div className="text-[11px] font-sans text-[#76B900] font-semibold tracking-wide flex items-center space-x-1">
              <span>1 year</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#76B900]/20 text-[#76B900]">Target</span>
            </div>
            <div className="text-xs sm:text-sm text-white font-sans font-medium leading-snug">
              {pathA.milestones.oneYear.shortText}
            </div>
            <div className="text-xs sm:text-sm font-mono text-[#76B900] font-semibold mt-0.5">
              <CountUpText value={pathA.milestones.oneYear.metricValue} />
            </div>
          </motion.div>

          {/* Right Branch Labels (Option B - Violet) */}
          {/* 1 Month Label B */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isRevealed ? 1 : 0, x: 0 }}
            transition={{ delay: 1.1 }}
            className="absolute right-2 sm:right-12 top-[54%] -translate-y-1/2 text-right max-w-[170px] sm:max-w-[210px] pointer-events-auto cursor-pointer"
            onClick={() => {
              sound.nodePop();
              setSelectedMilestone('oneMonth');
            }}
          >
            <div className="text-[11px] font-sans text-[#8B7CFF] font-medium tracking-wide">
              1 month
            </div>
            <div className="text-xs sm:text-sm text-white/80 font-sans leading-snug">
              {pathB.milestones.oneMonth.shortText}
            </div>
            <div className="text-xs sm:text-sm font-mono text-[#8B7CFF] font-medium mt-0.5">
              <CountUpText value={pathB.milestones.oneMonth.metricValue} />
            </div>
          </motion.div>

          {/* 6 Months Label B */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isRevealed ? 1 : 0, x: 0 }}
            transition={{ delay: 1.4 }}
            className="absolute right-2 sm:right-8 top-[32%] -translate-y-1/2 text-right max-w-[170px] sm:max-w-[210px] pointer-events-auto cursor-pointer"
            onClick={() => {
              sound.nodePop();
              setSelectedMilestone('sixMonths');
            }}
          >
            <div className="text-[11px] font-sans text-[#8B7CFF] font-medium tracking-wide">
              6 months
            </div>
            <div className="text-xs sm:text-sm text-white/80 font-sans leading-snug">
              {pathB.milestones.sixMonths.shortText}
            </div>
            <div className="text-xs sm:text-sm font-mono text-[#8B7CFF] font-medium mt-0.5">
              <CountUpText value={pathB.milestones.sixMonths.metricValue} />
            </div>
          </motion.div>

          {/* 1 Year Label B */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isRevealed ? 1 : 0, x: 0 }}
            transition={{ delay: 1.7 }}
            className="absolute right-2 sm:right-4 top-[8%] -translate-y-1/2 text-right max-w-[180px] sm:max-w-[220px] pointer-events-auto cursor-pointer"
            onClick={() => {
              sound.nodePop();
              setSelectedMilestone('oneYear');
            }}
          >
            <div className="text-[11px] font-sans text-[#8B7CFF] font-medium tracking-wide">
              1 year
            </div>
            <div className="text-xs sm:text-sm text-white/90 font-sans leading-snug">
              {pathB.milestones.oneYear.shortText}
            </div>
            <div className="text-xs sm:text-sm font-mono text-[#8B7CFF] font-medium mt-0.5">
              <CountUpText value={pathB.milestones.oneYear.metricValue} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Expandable Details Link & Drawer */}
      <div className="w-full max-w-2xl flex flex-col items-center">
        <button
          onClick={() => {
            sound.click();
            setShowDetails(!showDetails);
          }}
          className="group flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-sans text-white/60 hover:text-white transition-all cursor-pointer mb-3"
        >
          <span>Details</span>
          {showDetails ? (
            <ChevronUp className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-transform" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-transform" />
          )}
        </button>

        {/* Expandable Details Card */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full rounded-2xl border border-white/[0.08] bg-[#0A0A0E]/95 backdrop-blur-md p-5 shadow-2xl mb-4 overflow-hidden"
            >
              {/* Milestone Scrubber Tabs */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-sans text-white/40">Detailed timeframe:</span>
                  <div className="flex items-center space-x-1">
                    {milestonesKeyOrder.map((key) => {
                      const label = key === 'oneMonth' ? '1 month' : key === 'sixMonths' ? '6 months' : '1 year';
                      const isActive = selectedMilestone === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            sound.click();
                            setSelectedMilestone(key);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                            isActive
                              ? 'bg-white text-black font-medium shadow-sm'
                              : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setShowDetails(false)}
                  className="p-1 rounded text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Side-by-side comparison for selected timeframe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                {/* Option A Detailed Breakdown */}
                <div className="p-3.5 rounded-xl border border-[#76B900]/20 bg-[#76B900]/[0.02]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#76B900] font-medium">{pathA.title}</span>
                    <span className="text-[11px] text-[#76B900]/70 font-mono">Option A</span>
                  </div>
                  <div className="text-white/90 font-medium mb-1">
                    {pathA.milestones[selectedMilestone].headline}
                  </div>
                  <p className="text-white/60 text-[11px] leading-relaxed mb-3">
                    {pathA.milestones[selectedMilestone].summary}
                  </p>

                  {pathA.milestones[selectedMilestone].metrics && (
                    <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                      {pathA.milestones[selectedMilestone].metrics.map((m, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px]">
                          <span className="text-white/50">{m.label}</span>
                          <span className="text-white font-mono font-medium">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Option B Detailed Breakdown */}
                <div className="p-3.5 rounded-xl border border-[#8B7CFF]/20 bg-[#8B7CFF]/[0.02]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#8B7CFF] font-medium">{pathB.title}</span>
                    <span className="text-[11px] text-[#8B7CFF]/70 font-mono">Option B</span>
                  </div>
                  <div className="text-white/90 font-medium mb-1">
                    {pathB.milestones[selectedMilestone].headline}
                  </div>
                  <p className="text-white/60 text-[11px] leading-relaxed mb-3">
                    {pathB.milestones[selectedMilestone].summary}
                  </p>

                  {pathB.milestones[selectedMilestone].metrics && (
                    <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                      {pathB.milestones[selectedMilestone].metrics.map((m, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px]">
                          <span className="text-white/50">{m.label}</span>
                          <span className="text-white font-mono font-medium">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar: Action to proceed to Verdict */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs font-sans text-white/40">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#76B900]" />
          <span>Calculated with 4-persona consensus</span>
        </div>

        <button
          onClick={() => {
            sound.verdictPulse();
            onProceedToVerdict();
          }}
          className="group flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all cursor-pointer"
        >
          <span>See verdict</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
