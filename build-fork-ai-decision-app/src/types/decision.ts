export type PersonaType = 'optimist' | 'skeptic' | 'realist' | 'future_you';

export interface PersonaCitation {
  label: string;
  value: string;
  domain: string;
}

export interface PersonaArgument {
  id: string;
  persona: PersonaType;
  name: string;
  title: string;
  color: string;
  argument: string;
  citations: PersonaCitation[];
}

export interface MilestoneMetric {
  label: string;
  value: string;
  numericValue?: number;
  change: string;
  isPositive: boolean;
}

export interface Milestone {
  timeframe: string; // e.g. '1 month' | '6 months' | '1 year'
  shortText: string; // The single short line of text along the branch
  metricValue: string; // The single number / metric along the branch
  headline?: string;
  summary?: string;
  metrics?: MilestoneMetric[];
  keyMoment?: string;
}

export interface BranchPath {
  id: 'pathA' | 'pathB';
  title: string;
  subtitle: string;
  color: string; // #76B900 (NVIDIA Green) or #8B7CFF (Soft Violet)
  glowColor: string;
  isWinner: boolean;
  score: number; // 0-100
  milestones: {
    oneMonth: Milestone;
    sixMonths: Milestone;
    oneYear: Milestone;
  };
}

export interface TradeoffItem {
  category: string;
  pathA: string;
  pathB: string;
  advantage: 'pathA' | 'pathB' | 'neutral';
}

export interface VerdictData {
  winningPathId: 'pathA' | 'pathB';
  headline: string;
  confidence: number; // e.g. 84%
  why: string;
  biggestRisk: string;
  firstStep: string;
  tradeoffs?: TradeoffItem[];
}

export interface DecisionScenario {
  id: string;
  query: string;
  category: string;
  pathA_name: string;
  pathB_name: string;
  arguments: PersonaArgument[];
  pathA: BranchPath;
  pathB: BranchPath;
  verdict: VerdictData;
  twistSuggestions?: {
    id: string;
    label: string;
    prompt: string;
    impactSummary: string;
  }[];
}

export type AppPhase = 'home' | 'debate' | 'fork' | 'verdict';

export interface ApiSettings {
  nebiusApiKey: string;
  tavilyApiKey: string;
  model: string;
  demoMode: boolean;
  soundEnabled: boolean;
}
