import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { sound } from '../utils/audio';

interface TwistModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions?: {
    id: string;
    label: string;
    prompt: string;
    impactSummary: string;
  }[];
  onApplyTwist: (twistText: string) => void;
}

const DEFAULT_TWISTS = [
  {
    id: 't-runway',
    label: 'What if you save 6 months of runway first?',
    prompt: 'What if you save 6 months of runway before making the move?',
    impactSummary: 'Eliminates burn anxiety, raises safety threshold by 40%',
  },
  {
    id: 't-cofounder',
    label: 'What if a technical co-founder joins you?',
    prompt: 'What if an experienced technical co-founder joins full-time?',
    impactSummary: 'Doubles execution speed, halves solo burnout risk',
  },
  {
    id: 't-equity',
    label: 'What if the offer grants 0.5% equity?',
    prompt: 'What if the company offer includes 0.5% equity with accelerated vest?',
    impactSummary: 'Significantly tips financial scale toward taking the offer',
  },
];

export const TwistModal: React.FC<TwistModalProps> = ({
  isOpen,
  onClose,
  suggestions = DEFAULT_TWISTS,
  onApplyTwist,
}) => {
  const [customTwist, setCustomTwist] = useState('');

  if (!isOpen) return null;

  const twistList = suggestions.length > 0 ? suggestions : DEFAULT_TWISTS;

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTwist.trim()) return;
    sound.click();
    onApplyTwist(customTwist.trim());
    onClose();
  };

  const handleSelectPreset = (prompt: string) => {
    sound.click();
    onApplyTwist(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/[0.1] bg-[#0A0A0E] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#76B900]" />
            <h3 className="font-serif text-xl font-normal text-white">
              Add a twist
            </h3>
          </div>
          <button
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description in sentence case */}
        <p className="text-xs font-sans text-white/50 my-4 leading-relaxed">
          Inject a new condition to observe how the branches re-weight, shift milestones, and recalculate the winning trajectory.
        </p>

        {/* Custom Input */}
        <form onSubmit={handleSubmitCustom} className="mb-6">
          <div className="relative flex items-center">
            <input
              type="text"
              value={customTwist}
              onChange={(e) => setCustomTwist(e.target.value)}
              placeholder="e.g. What if I save 6 months of runway first?"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#76B900]/60 focus:ring-1 focus:ring-[#76B900]/40 font-sans pr-12"
            />
            <button
              type="submit"
              disabled={!customTwist.trim()}
              className={`absolute right-2 p-2 rounded-lg transition-all cursor-pointer ${
                customTwist.trim()
                  ? 'bg-white text-black hover:bg-white/90 shadow'
                  : 'text-white/20 pointer-events-none'
              }`}
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Suggested Twists */}
        <div className="space-y-2">
          <span className="text-xs font-sans text-white/40">
            Preset variables
          </span>
          <div className="space-y-2">
            {twistList.map((twist) => (
              <button
                key={twist.id}
                onClick={() => handleSelectPreset(twist.prompt)}
                className="group w-full text-left p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.04] hover:border-[#76B900]/40 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs sm:text-sm font-sans text-white/90 group-hover:text-white transition-colors">
                    {twist.label}
                  </div>
                  <div className="text-xs text-[#76B900]/70 font-sans mt-0.5">
                    → {twist.impactSummary}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#76B900] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
