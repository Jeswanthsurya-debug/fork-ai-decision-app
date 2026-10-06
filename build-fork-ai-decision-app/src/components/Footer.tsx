import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-5 px-4 sm:px-8 border-t border-white/[0.04] bg-[#07070A] text-xs font-sans text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2.5 z-20">
      <div className="flex items-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] shadow-[0_0_6px_#76B900]" />
        <span className="text-white/60">
          Built with NVIDIA Nemotron on Nebius • Tavily
        </span>
      </div>

      <div className="flex items-center space-x-3 text-xs text-white/35">
        <span>Global AI Hackathon 2026</span>
        <span>•</span>
        <span>Personal AI / Best apps</span>
      </div>
    </footer>
  );
};
