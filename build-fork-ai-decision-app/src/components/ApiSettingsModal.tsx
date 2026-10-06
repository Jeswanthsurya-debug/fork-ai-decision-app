import React, { useState } from 'react';
import { X, Key, Check, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { ApiSettings } from '../types/decision';
import { sound } from '../utils/audio';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSave: (settings: Partial<ApiSettings>) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [nebiusKey, setNebiusKey] = useState(settings.nebiusApiKey);
  const [tavilyKey, setTavilyKey] = useState(settings.tavilyApiKey);
  const [model, setModel] = useState(settings.model);
  const [demoMode, setDemoMode] = useState(settings.demoMode);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.click();
    onSave({
      nebiusApiKey: nebiusKey.trim(),
      tavilyApiKey: tavilyKey.trim(),
      model,
      demoMode,
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0A0A0E] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-[#76B900]" />
            <h3 className="font-serif text-xl font-normal text-white">
              API configuration & keys
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

        {/* Demo Mode Highlight */}
        <div className="my-4 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start space-x-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs font-sans text-white/70">
            <span className="text-emerald-400 font-medium">Demo mode is active by default.</span>
            <p className="mt-0.5 text-white/50 leading-relaxed">
              No API keys required to test Fork. All four personas, real-world data points, and the glowing branching path work immediately.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          {/* Demo Mode Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div>
              <div className="text-white font-medium">Use pre-loaded demo scenarios</div>
              <div className="text-[11px] text-white/40">Zero setup required for judging review</div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.click();
                setDemoMode(!demoMode);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                demoMode ? 'bg-[#76B900]' : 'bg-white/10'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  demoMode ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Nebius API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-white/70">Nebius Token Factory API key</label>
              <a
                href="https://studio.nebius.ai/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#76B900] hover:underline flex items-center space-x-1"
              >
                <span>Get Nebius key</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={nebiusKey}
              onChange={(e) => setNebiusKey(e.target.value)}
              placeholder="neb-live-..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white focus:outline-none focus:border-[#76B900]/50 placeholder-white/20 font-mono text-xs"
            />
          </div>

          {/* Tavily API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-white/70">Tavily search API key</label>
              <a
                href="https://tavily.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#76B900] hover:underline flex items-center space-x-1"
              >
                <span>Get Tavily key</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={tavilyKey}
              onChange={(e) => setTavilyKey(e.target.value)}
              placeholder="tvly-..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white focus:outline-none focus:border-[#76B900]/50 placeholder-white/20 font-mono text-xs"
            />
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-white/70 mb-1.5">Reasoning model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#0E0E14] text-white focus:outline-none focus:border-[#76B900]/50 font-sans text-xs cursor-pointer"
            >
              <option value="nvidia/nemotron-4-340b-instruct">
                nvidia/nemotron-4-340b-instruct (Recommended)
              </option>
              <option value="meta-llama/Meta-Llama-3.1-70B-Instruct">
                meta-llama/Meta-Llama-3.1-70B-Instruct
              </option>
              <option value="Qwen/Qwen2.5-72B-Instruct">
                Qwen/Qwen2.5-72B-Instruct
              </option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                sound.click();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 shadow transition-all cursor-pointer"
            >
              {savedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#76B900]" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
