import { DecisionScenario, Milestone } from '../types/decision';
import { synthesizeDynamicScenario, parseDecisionQuery } from '../data/scenarios';

const NEBIUS_ENDPOINT = 'https://api.studio.nebius.ai/v1/chat/completions';
const TAVILY_ENDPOINT = 'https://api.tavily.com/search';

export interface GenerateOptions {
  query: string;
  nebiusApiKey?: string;
  tavilyApiKey?: string;
  model?: string;
}

export interface ApiSearchCitation {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace('www.', '');
  } catch {
    return 'web-source.org';
  }
}

export async function searchTavily(query: string, apiKey?: string): Promise<ApiSearchCitation[]> {
  const key = apiKey || (import.meta.env.VITE_TAVILY_API_KEY as string | undefined);
  if (!key) {
    return [];
  }

  try {
    const res = await fetch(TAVILY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: key,
        query: `${query} real data statistics benchmarks salary costs`,
        search_depth: 'basic',
        include_domains: [],
        max_results: 5,
      }),
    });

    if (!res.ok) {
      console.warn('Tavily search status not OK:', res.status);
      return [];
    }

    const data = await res.json();
    if (data && Array.isArray(data.results)) {
      return data.results.map((r: { title?: string; url?: string; content?: string }) => ({
        title: r.title || 'Market citation',
        url: r.url || 'https://market-data.org',
        snippet: r.content || '',
        domain: extractDomain(r.url || 'https://market-data.org'),
      }));
    }
  } catch (err) {
    console.warn('Tavily search fallback:', err);
  }

  return [];
}

function normalizeMilestone(raw: Partial<Milestone> | undefined, defaultShort: string, defaultMetric: string, timeframe: string): Milestone {
  return {
    timeframe,
    shortText: raw?.shortText || raw?.headline?.slice(0, 36) || defaultShort,
    metricValue: raw?.metricValue || raw?.metrics?.[0]?.value || defaultMetric,
    headline: raw?.headline || defaultShort,
    summary: raw?.summary || 'Projected outcome along this branch.',
    metrics: raw?.metrics || [{ label: 'Metric', value: defaultMetric, change: 'Stable', isPositive: true }],
    keyMoment: raw?.keyMoment || 'Inflection point on this trajectory.',
  };
}

export async function generateDecisionReasoning(
  query: string,
  nebiusKey?: string,
  tavilyKey?: string,
  model: string = 'nvidia/nemotron-4-340b-instruct'
): Promise<DecisionScenario> {
  const key = nebiusKey || (import.meta.env.VITE_NEBIUS_API_KEY as string | undefined);

  if (!key) {
    return synthesizeDynamicScenario(query);
  }

  const { optionA, optionB } = parseDecisionQuery(query);
  const citations = await searchTavily(query, tavilyKey);
  const contextData = citations.length > 0 
    ? `Real-world data search findings:\n${citations.map(c => `- ${c.domain}: ${c.snippet.slice(0, 150)}`).join('\n')}`
    : 'No live search context provided.';

  const systemPrompt = `You are Fork, an ultra-rational decision engine powered by NVIDIA Nemotron on Nebius Token Factory.
User dilemma: "${query}"
Option A: "${optionA}"
Option B: "${optionB}"
Analyze both options accurately based on what they actually are (e.g. if one is a job offer, describe steady income and lower risk; if one is a startup, describe no initial income, high risk, and high upside).
Output ONLY valid JSON matching this schema:
{
  "pathA_name": "${optionA}",
  "pathB_name": "${optionB}",
  "pathA_subtitle": "1-line description of Option A reality",
  "pathB_subtitle": "1-line description of Option B reality",
  "arguments": [
    {"persona": "optimist", "name": "The Optimist", "title": "Asymmetric upside", "color": "#76B900", "argument": "string", "citations": [{"label": "string", "value": "string", "domain": "source.com"}]},
    {"persona": "skeptic", "name": "The Skeptic", "title": "Vulnerability analysis", "color": "#FF5C5C", "argument": "string", "citations": [{"label": "string", "value": "string", "domain": "source.com"}]},
    {"persona": "realist", "name": "The Realist", "title": "Capital & runway", "color": "#38BDF8", "argument": "string", "citations": [{"label": "string", "value": "string", "domain": "source.com"}]},
    {"persona": "future_you", "name": "Future You", "title": "5-year horizon", "color": "#C084FC", "argument": "string", "citations": [{"label": "string", "value": "string", "domain": "source.com"}]}
  ],
  "pathA": {
    "milestones": {
      "oneMonth": {"shortText": "1 short line", "metricValue": "1 number e.g. $17,500/mo", "headline": "string", "summary": "string"},
      "sixMonths": {"shortText": "1 short line", "metricValue": "1 number e.g. +$84k", "headline": "string", "summary": "string"},
      "oneYear": {"shortText": "1 short line", "metricValue": "1 number e.g. +6% raise", "headline": "string", "summary": "string"}
    }
  },
  "pathB": {
    "milestones": {
      "oneMonth": {"shortText": "1 short line", "metricValue": "1 number e.g. $0 income", "headline": "string", "summary": "string"},
      "sixMonths": {"shortText": "1 short line", "metricValue": "1 number e.g. 3.4 mo runway", "headline": "string", "summary": "string"},
      "oneYear": {"shortText": "1 short line", "metricValue": "1 number e.g. 100% equity", "headline": "string", "summary": "string"}
    }
  },
  "verdict": {
    "headline": "Direct actionable verdict",
    "confidence": 86,
    "why": "1-2 sentence core reason",
    "biggestRisk": "Single biggest risk",
    "firstStep": "First action this week"
  }
}`;

  try {
    const response = await fetch(NEBIUS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: model,
        temperature: 0.35,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Dilemma: ${query}\nOption A: ${optionA}\nOption B: ${optionB}\nContext:\n${contextData}` },
        ],
      }),
    });

    if (!response.ok) {
      console.warn('Nebius API response not ok, using dynamic synthesis');
      return synthesizeDynamicScenario(query);
    }

    const jsonRes = await response.json();
    const content = jsonRes.choices?.[0]?.message?.content;
    if (!content) {
      return synthesizeDynamicScenario(query);
    }

    const parsed = JSON.parse(content);

    const msA = {
      oneMonth: normalizeMilestone(parsed.pathA?.milestones?.oneMonth, 'Initial transition', '+85% velocity', '1 month'),
      sixMonths: normalizeMilestone(parsed.pathA?.milestones?.sixMonths, 'Compounding traction', '+140% gain', '6 months'),
      oneYear: normalizeMilestone(parsed.pathA?.milestones?.oneYear, 'Enduring leverage', 'Peak agency', '1 year'),
    };

    const msB = {
      oneMonth: normalizeMilestone(parsed.pathB?.milestones?.oneMonth, 'Initial steps', 'Stable floor', '1 month'),
      sixMonths: normalizeMilestone(parsed.pathB?.milestones?.sixMonths, 'Opportunity cost', 'Flat delta', '6 months'),
      oneYear: normalizeMilestone(parsed.pathB?.milestones?.oneYear, 'Safe continuity', '75% curiosity', '1 year'),
    };

    return {
      id: `ai-${Date.now()}`,
      query,
      category: 'AI synthesis',
      pathA_name: parsed.pathA_name || optionA,
      pathB_name: parsed.pathB_name || optionB,
      arguments: parsed.arguments || [],
      pathA: {
        id: 'pathA',
        title: parsed.pathA_name || optionA,
        subtitle: parsed.pathA_subtitle || 'Higher agency path',
        color: '#76B900',
        glowColor: 'rgba(118, 185, 0, 0.45)',
        isWinner: true,
        score: 86,
        milestones: msA,
      },
      pathB: {
        id: 'pathB',
        title: parsed.pathB_name || optionB,
        subtitle: parsed.pathB_subtitle || 'Alternative path',
        color: '#8B7CFF',
        glowColor: 'rgba(139, 124, 255, 0.4)',
        isWinner: false,
        score: 63,
        milestones: msB,
      },
      verdict: {
        winningPathId: 'pathA',
        headline: parsed.verdict?.headline || 'Choose the path of asymmetric optionality.',
        confidence: parsed.verdict?.confidence || 85,
        why: parsed.verdict?.why || 'Higher optionality with constrained downside.',
        biggestRisk: parsed.verdict?.biggestRisk || 'Inertia and loss of execution urgency.',
        firstStep: parsed.verdict?.firstStep || 'Take one low-risk commitment step this week.',
      },
    };
  } catch (err) {
    console.error('Nebius call failed, gracefully using synthesis:', err);
    return synthesizeDynamicScenario(query);
  }
}
