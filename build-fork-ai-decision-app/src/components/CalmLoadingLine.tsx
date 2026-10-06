import React from 'react';
import { motion } from 'framer-motion';

interface CalmLoadingLineProps {
  label?: string;
  sublabel?: string;
}

export const CalmLoadingLine: React.FC<CalmLoadingLineProps> = ({
  label = 'Synthesizing decision branches via NVIDIA Nemotron',
  sublabel = 'Crawling ground data with Tavily • Forming 4-persona consensus',
}) => {
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#07070A]/90 backdrop-blur-md px-6 select-none animate-fade-in">
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6">
        {/* The Calm Glowing Hairline */}
        <div className="w-full relative h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
          {/* Glowing pulse bar sweeping horizontally */}
          <motion.div
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-[#76B900] to-transparent"
            initial={{ left: '-25%' }}
            animate={{ left: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: 'easeInOut',
            }}
            style={{
              filter: 'drop-shadow(0 0 10px #76B900)',
            }}
          />
          {/* Subtle counter pulse in violet */}
          <motion.div
            className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#8B7CFF] to-transparent opacity-60"
            initial={{ left: '100%' }}
            animate={{ left: '-25%' }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Calm Typographic Status in sentence case */}
        <div className="space-y-1.5 font-sans">
          <p className="text-sm font-light text-white/90 tracking-wide">
            {label}
          </p>
          <p className="text-xs text-white/40">
            {sublabel}
          </p>
        </div>
      </div>
    </div>
  );
};
