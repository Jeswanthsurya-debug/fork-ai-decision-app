import React, { useRef, useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { DecisionScenario } from '../types/decision';
import { sound } from '../utils/audio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: DecisionScenario;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  scenario,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handleDownloadImage = () => {
    sound.click();
    setIsExporting(true);

    try {
      // Create high-res canvas (1200x630 social card)
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 630;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsExporting(false);
        return;
      }

      // Background
      ctx.fillStyle = '#07070A';
      ctx.fillRect(0, 0, width, height);

      // Subtle border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // Header
      ctx.fillStyle = '#76B900';
      ctx.font = '20px "Instrument Serif", Georgia, serif';
      ctx.fillText('Fork', 64, 84);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '14px "Inter", sans-serif';
      ctx.fillText('• Nebius × NVIDIA Decision Engine', 110, 84);

      // Dilemma
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '14px "Inter", sans-serif';
      ctx.fillText('Dilemma:', 64, 134);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '22px "Inter", sans-serif';
      ctx.fillText(`“${scenario.query}”`, 64, 168);

      // Divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(64, 210);
      ctx.lineTo(width - 64, 210);
      ctx.stroke();

      // Verdict Headline in Instrument Serif
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '36px "Instrument Serif", Georgia, serif';
      ctx.fillText(scenario.verdict.headline, 64, 280);

      // Confidence badge
      ctx.fillStyle = '#76B900';
      ctx.font = '15px "Inter", sans-serif';
      ctx.fillText(`Confidence: ${scenario.verdict.confidence}% • Recommended: ${scenario.pathA_name}`, 64, 335);

      // Three short lines: Why, Biggest risk, This week
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '16px "Inter", sans-serif';
      ctx.fillText(`Why: ${scenario.verdict.why.slice(0, 115)}...`, 64, 390);
      ctx.fillText(`Biggest risk: ${scenario.verdict.biggestRisk.slice(0, 115)}...`, 64, 435);
      ctx.fillText(`This week: ${scenario.verdict.firstStep.slice(0, 115)}...`, 64, 480);

      // Footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '13px "Inter", sans-serif';
      ctx.fillText('Simulated with NVIDIA Nemotron on Nebius Token Factory • Tavily search', 64, 555);

      // Download
      const link = document.createElement('a');
      link.download = `fork-verdict-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export canvas:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyMarkdown = () => {
    sound.click();
    const md = `### Fork Decision Synthesis
**Dilemma:** "${scenario.query}"

**Verdict:** ${scenario.verdict.headline}
**Confidence:** ${scenario.verdict.confidence}%

- **Recommended path:** ${scenario.pathA_name}
- **Alternative:** ${scenario.pathB_name}
- **Why:** ${scenario.verdict.why}
- **Biggest risk:** ${scenario.verdict.biggestRisk}
- **This week:** ${scenario.verdict.firstStep}

*Generated via Fork (NVIDIA Nemotron on Nebius • Tavily Search)*`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-[#0A0A0E] p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="font-serif text-xl font-normal text-white">
            Share decision card
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

        {/* Card Visual Preview in sentence case */}
        <div
          ref={cardRef}
          className="my-5 p-6 rounded-xl border border-white/[0.12] bg-[#07070A] relative overflow-hidden"
        >
          {/* Brand header */}
          <div className="flex items-center justify-between text-xs font-sans mb-3 text-white/40">
            <span className="text-[#76B900] font-serif text-base">Fork</span>
            <span>Nebius × NVIDIA Global AI Hackathon</span>
          </div>

          <p className="text-xs font-sans text-white/40 mb-1">Dilemma</p>
          <p className="text-sm font-sans font-light text-white mb-4 line-clamp-1">
            &ldquo;{scenario.query}&rdquo;
          </p>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans text-[#76B900] font-medium">
                Recommended path
              </span>
              <span className="text-xs font-sans text-white/60">
                {scenario.verdict.confidence}% confidence
              </span>
            </div>
            <p className="font-serif text-xl sm:text-2xl text-white mb-2 leading-snug">
              &ldquo;{scenario.verdict.headline}&rdquo;
            </p>
            <p className="text-xs text-white/70 font-sans font-light">
              {scenario.verdict.why}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-sans pt-2 border-t border-white/[0.06]">
            <div>
              <span className="text-red-400 font-medium">Biggest risk:</span>
              <p className="text-white/60 text-xs mt-0.5 line-clamp-2">
                {scenario.verdict.biggestRisk}
              </p>
            </div>
            <div>
              <span className="text-[#38BDF8] font-medium">This week:</span>
              <p className="text-white/60 text-xs mt-0.5 line-clamp-2">
                {scenario.verdict.firstStep}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons in sentence case */}
        <div className="flex items-center justify-end space-x-3 pt-2 text-xs font-sans">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#76B900]" />
                <span className="text-[#76B900]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy text</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 shadow transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Rendering...' : 'Download PNG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
