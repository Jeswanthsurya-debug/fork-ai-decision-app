import { useState, useEffect, useCallback } from 'react';
import { AppPhase, DecisionScenario, ApiSettings } from './types/decision';
import { DEMO_SCENARIOS, synthesizeDynamicScenario } from './data/scenarios';
import { generateDecisionReasoning } from './services/aiService';
import { sound } from './utils/audio';

import { Header } from './components/Header';
import { BackgroundWave } from './components/BackgroundWave';
import { HomeScreen } from './components/HomeScreen';
import { DebateScreen } from './components/DebateScreen';
import { ForkScreen } from './components/ForkScreen';
import { VerdictScreen } from './components/VerdictScreen';
import { CalmLoadingLine } from './components/CalmLoadingLine';
import { TwistModal } from './components/TwistModal';
import { ShareModal } from './components/ShareModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { CursorGlow } from './components/CursorGlow';
import { Footer } from './components/Footer';

export function App() {
  const [phase, setPhase] = useState<AppPhase>('home');
  const [scenario, setScenario] = useState<DecisionScenario>(DEMO_SCENARIOS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Synthesizing Decision Facets');

  // Audio State
  const [isAudioMuted, setIsAudioMuted] = useState(sound.muted);

  // Modals
  const [isTwistModalOpen, setIsTwistModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeTwistNote, setActiveTwistNote] = useState<string | null>(null);

  // API Settings with localStorage persistence
  const [apiSettings, setApiSettings] = useState<ApiSettings>(() => {
    const saved = localStorage.getItem('fork_api_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // use default
      }
    }
    return {
      nebiusApiKey: '',
      tavilyApiKey: '',
      model: 'nvidia/nemotron-4-340b-instruct',
      demoMode: true,
      soundEnabled: true,
    };
  });

  const handleUpdateSettings = (partial: Partial<ApiSettings>) => {
    setApiSettings((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem('fork_api_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleAudio = () => {
    const newMuted = !sound.toggleMute();
    setIsAudioMuted(newMuted);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        handleToggleAudio();
      }
      if (e.key === 'Escape') {
        setIsTwistModalOpen(false);
        setIsShareModalOpen(false);
        setIsSettingsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initiate Decision Flow
  const handleStartDecision = async (query: string) => {
    setIsLoading(true);
    setLoadingText('Reasoning with NVIDIA Nemotron');
    setActiveTwistNote(null);

    // If in demo mode or without live Nebius API key, synthesize with full semantic parsing
    if (apiSettings.demoMode || !apiSettings.nebiusApiKey) {
      setTimeout(() => {
        const scenarioData = synthesizeDynamicScenario(query);
        setScenario(scenarioData);
        setIsLoading(false);
        setPhase('debate');
        sound.personaShift(360);
      }, 650);
      return;
    }

    // Call live API with Nebius Token Factory & Tavily
    try {
      const generated = await generateDecisionReasoning(
        query,
        apiSettings.nebiusApiKey,
        apiSettings.tavilyApiKey,
        apiSettings.model
      );
      setScenario(generated);
      setIsLoading(false);
      setPhase('debate');
      sound.personaShift(360);
    } catch (err) {
      console.error('Decision generation error:', err);
      // Graceful fallback
      const fallback = synthesizeDynamicScenario(query);
      setScenario(fallback);
      setIsLoading(false);
      setPhase('debate');
    }
  };

  // Apply a Twist / Variable Perturbation
  const handleApplyTwist = (twistText: string) => {
    sound.click();
    setActiveTwistNote(twistText);
    setIsLoading(true);
    setLoadingText(`Recalculating branches for "${twistText}"`);

    setTimeout(() => {
      setScenario((prev) => {
        // Adjust scores and confidence based on the twist
        const newConfidence = Math.min(96, Math.max(72, prev.verdict.confidence + (Math.random() > 0.5 ? 4 : -3)));
        return {
          ...prev,
          pathA: {
            ...prev.pathA,
            score: Math.min(98, prev.pathA.score + 5),
            milestones: {
              ...prev.pathA.milestones,
              sixMonths: {
                ...prev.pathA.milestones.sixMonths,
                headline: `Shifted Momentum: ${twistText.slice(0, 36)}...`,
                summary: `The twist accelerates product-market discovery while mitigating the earlier critical failure mode.`,
              },
            },
          },
          verdict: {
            ...prev.verdict,
            confidence: newConfidence,
            headline: `${prev.verdict.headline.replace(/\.$/, '')} (Adapted for "${twistText.slice(0, 30)}...")`,
            why: `The injected condition (${twistText}) fortifies the primary hypothesis by removing operational bottlenecks.`,
          },
        };
      });

      setIsLoading(false);
      setPhase('fork');
      sound.forkChord();
    }, 850);
  };

  const handleReset = useCallback(() => {
    sound.click();
    setPhase('home');
    setActiveTwistNote(null);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#07070A] text-[#EDEDF0] flex flex-col justify-between selection:bg-[#76B900]/30 selection:text-white bg-grain">
      {/* Cursor Glow */}
      <CursorGlow />

      {/* Background Subtle Harmonic Floating Wave */}
      <BackgroundWave
        glowAccent={
          phase === 'fork'
            ? 'green'
            : phase === 'verdict'
            ? 'green'
            : phase === 'debate'
            ? 'violet'
            : 'neutral'
        }
      />

      {/* Persistent Minimalist Top Navigation Header */}
      <Header
        phase={phase}
        onReset={handleReset}
        apiSettings={apiSettings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
      />

      {/* Active Twist Banner if a condition was injected */}
      {activeTwistNote && phase !== 'home' && (
        <div className="fixed top-14 left-0 right-0 z-30 flex items-center justify-center px-4 pointer-events-none">
          <div className="flex items-center space-x-2 px-3.5 py-1 rounded-full border border-[#76B900]/30 bg-[#0A0A0E]/90 text-xs font-sans text-[#76B900] shadow-lg pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] animate-ping" />
            <span>Twist applied: &ldquo;{activeTwistNote}&rdquo;</span>
          </div>
        </div>
      )}

      {/* Calm Pulsing Line Loading State (Never a spinner) */}
      {isLoading && (
        <CalmLoadingLine
          label={loadingText}
          sublabel="Tavily search ground data • Nemotron multi-agent inference"
        />
      )}

      {/* Main View Transition Matrix */}
      <main className="flex-1 flex flex-col justify-center items-center w-full z-10">
        {phase === 'home' && (
          <HomeScreen
            onStartDecision={handleStartDecision}
            isLoading={isLoading}
          />
        )}

        {phase === 'debate' && (
          <DebateScreen
            query={scenario.query}
            argumentsList={scenario.arguments}
            onCompleteDebate={() => {
              sound.forkChord();
              setPhase('fork');
            }}
          />
        )}

        {phase === 'fork' && (
          <ForkScreen
            query={scenario.query}
            pathA={scenario.pathA}
            pathB={scenario.pathB}
            onProceedToVerdict={() => {
              sound.verdictPulse();
              setPhase('verdict');
            }}
          />
        )}

        {phase === 'verdict' && (
          <VerdictScreen
            verdict={scenario.verdict}
            pathA={scenario.pathA}
            pathB={scenario.pathB}
            onOpenTwistModal={() => setIsTwistModalOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onViewFork={() => {
              sound.click();
              setPhase('fork');
            }}
            onNewDecision={handleReset}
          />
        )}
      </main>

      {/* Modals */}
      <TwistModal
        isOpen={isTwistModalOpen}
        onClose={() => setIsTwistModalOpen(false)}
        suggestions={scenario.twistSuggestions}
        onApplyTwist={handleApplyTwist}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        scenario={scenario}
      />

      <ApiSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={apiSettings}
        onSave={handleUpdateSettings}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
