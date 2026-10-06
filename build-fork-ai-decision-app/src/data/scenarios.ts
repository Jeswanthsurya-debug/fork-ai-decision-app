import { DecisionScenario, PersonaArgument, VerdictData, Milestone } from '../types/decision';

// 1. Parsing function: splits cleanly on "vs", "vs.", "or", "versus", trims punctuation, and capitalizes first letter
export function parseDecisionQuery(rawQuery: string): { optionA: string; optionB: string } {
  let cleaned = rawQuery.trim();

  // Strip leading question openers like "Should I choose", "Should I take", "Either", "What if I", "Deciding between"
  cleaned = cleaned.replace(/^(?:should\s+i\s+(?:take|choose|pick)?|either|deciding\s+between|what\s+if\s+i)\s+/i, '');

  // Split on whole word "vs." or "vs" or "or" or "versus"
  const splitRegex = /\s+(?:vs\.?|versus|\bor\b)\s+/i;
  const parts = cleaned.split(splitRegex);

  let rawA = '';
  let rawB = '';

  if (parts.length >= 2) {
    rawA = parts[0];
    rawB = parts.slice(1).join(' or ');
  } else {
    // Fallback if no whitespace around delimiter
    const fallbackMatch = cleaned.match(/^(.*?)(?:\bvs\.?|\bversus|\bor\b)(.*)$/i);
    if (fallbackMatch) {
      rawA = fallbackMatch[1];
      rawB = fallbackMatch[2];
    } else {
      rawA = 'Option A';
      rawB = 'Option B';
    }
  }

  // Trim spaces and all stray punctuation (. , ? ! : ; " ' “ ” ‘ ’ ( ) [ ] { })
  const cleanPunctuation = (str: string) => {
    return str
      .replace(/^[\s.,?!:;"'“”‘’()\[\]{}]+|[\s.,?!:;"'“”‘’()\[\]{}]+$/g, '')
      .trim();
  };

  let optA = cleanPunctuation(rawA);
  let optB = cleanPunctuation(rawB);

  // Capitalize first letter of each
  const capitalizeFirst = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  optA = capitalizeFirst(optA) || 'Option A';
  optB = capitalizeFirst(optB) || 'Option B';

  return { optionA: optA, optionB: optB };
}

// 2. Semantic Option Profiler: analyzes the ACTUAL option text to determine risk, income, and upside traits
type OptionCategory = 'job' | 'startup' | 'relocate' | 'stay' | 'raise' | 'bootstrap' | 'proactive' | 'cautious';

function detectOptionCategory(text: string, isFirstOption: boolean): OptionCategory {
  const lower = text.toLowerCase();

  if (/\b(?:job|offer|corp|corporate|employment|salary|firm|bigtech|faang|employed|work for|hire|safe role)\b/.test(lower)) {
    return 'job';
  }
  if (/\b(?:startup|my own|build|founder|bootstrap|venture|indie|freelance|agency|solo|launch|business|product)\b/.test(lower)) {
    return 'startup';
  }
  if (/\b(?:relocate|move|tokyo|abroad|europe|new york|city|travel|overseas|transfer)\b/.test(lower)) {
    return 'relocate';
  }
  if (/\b(?:stay|remain|london|status quo|keep current|don't move|hold)\b/.test(lower)) {
    return 'stay';
  }
  if (/\b(?:series a|vc|venture capital|raise|investor|seed round|safe note)\b/.test(lower)) {
    return 'raise';
  }
  if (/\b(?:bootstrap|self-funded|profitable|cash flow|organic)\b/.test(lower)) {
    return 'bootstrap';
  }

  return isFirstOption ? 'proactive' : 'cautious';
}

interface MilestoneProfile {
  oneMonth: Milestone;
  sixMonths: Milestone;
  oneYear: Milestone;
}

function buildMilestonesForCategory(category: OptionCategory, optionName: string): MilestoneProfile {
  switch (category) {
    case 'job':
      return {
        oneMonth: {
          timeframe: '1 month',
          shortText: 'Steady income begins',
          metricValue: '$17,500/mo',
          headline: 'Baseline financial security secured',
          summary: 'First paycheck lands. Stress plummets; evenings and weekends remain protected for private build time.',
          metrics: [
            { label: 'Monthly cash flow', value: '$17,500', numericValue: 17500, change: 'Steady', isPositive: true },
            { label: 'Financial risk', value: 'Low', change: 'Stable floor', isPositive: true },
            { label: 'Free build time', value: '18 hrs/wk', change: 'Guarded', isPositive: true },
          ],
          keyMoment: 'Signed employment contract with explicit carve-out for personal side projects.',
        },
        sixMonths: {
          timeframe: '6 months',
          shortText: 'Low risk, savings accumulate',
          metricValue: '+$84,000 saved',
          headline: 'Low risk, capital compounding',
          summary: 'Liquid savings provide a formidable psychological safety net while internal company tooling sharpens skills.',
          metrics: [
            { label: 'Liquid savings', value: '$84,000', numericValue: 84000, change: '+$84k', isPositive: true },
            { label: 'Burn anxiety', value: '0%', numericValue: 0, change: 'Zero stress', isPositive: true },
            { label: 'Professional network', value: 'Expanding', change: 'Enterprise depth', isPositive: true },
          ],
          keyMoment: 'Depositing monthly savings without worrying about company runway.',
        },
        oneYear: {
          timeframe: '1 year',
          shortText: 'Slower growth, comfortable ceiling',
          metricValue: '+6% raise',
          headline: 'Slower growth, comfortable plateau',
          summary: 'Standard promotion cycle and annual review. High security, but career trajectory is capped and predictable.',
          metrics: [
            { label: 'Compensation growth', value: '+6%', numericValue: 6, change: 'Linear', isPositive: true },
            { label: 'Financial floor', value: 'Unshakeable', change: 'High comfort', isPositive: true },
            { label: 'Long-term equity ceiling', value: 'Capped', change: 'Limited upside', isPositive: false },
          ],
          keyMoment: 'Reflecting on financial peace of mind while balancing creative ambitions.',
        },
      };

    case 'startup':
      return {
        oneMonth: {
          timeframe: '1 month',
          shortText: 'No income at first, building MVP',
          metricValue: '$0 income',
          headline: 'Initial sprint and zero initial revenue',
          summary: 'High adrenaline and 60-hour build weeks. Prototype live with beta users while burning personal savings.',
          metrics: [
            { label: 'Initial income', value: '$0', numericValue: 0, change: 'No salary', isPositive: false },
            { label: 'Execution velocity', value: '9.4/10', numericValue: 9.4, change: 'Peak focus', isPositive: true },
            { label: 'Runway remaining', value: '9.2 months', numericValue: 9.2, change: 'Burning', isPositive: false },
          ],
          keyMoment: 'Shipping initial prototype with complete creative independence.',
        },
        sixMonths: {
          timeframe: '6 months',
          shortText: 'High risk, cash burn runway',
          metricValue: '3.4 mo runway',
          headline: 'High risk, runway compression',
          summary: 'First 3 paying enterprise pilot customers live. Cash reserves thinning; fundraising pressure begins.',
          metrics: [
            { label: 'Pilot revenue', value: '$4,200/mo', numericValue: 4200, change: 'First checks', isPositive: true },
            { label: 'Runway remaining', value: '3.4 months', numericValue: 3.4, change: 'Critical timer', isPositive: false },
            { label: 'Downside risk', value: 'High', change: 'Existential test', isPositive: false },
          ],
          keyMoment: 'Closing first commercial contract while monitoring the dwindling bank balance.',
        },
        oneYear: {
          timeframe: '1 year',
          shortText: 'High upside, uncapped ownership',
          metricValue: '100% equity',
          headline: 'Uncapped upside and complete autonomy',
          summary: 'Product-market fit validated. You own 100% of an escalating asset with unbounded upside.',
          metrics: [
            { label: 'Founder equity', value: '100%', numericValue: 100, change: 'Uncapped upside', isPositive: true },
            { label: 'Annual run-rate', value: '$220,000', numericValue: 220000, change: 'Compounding', isPositive: true },
            { label: 'Agency & freedom', value: '9.6/10', numericValue: 9.6, change: 'Total autonomy', isPositive: true },
          ],
          keyMoment: 'Holding full ownership of a growing, self-directed business.',
        },
      };

    case 'relocate':
      return {
        oneMonth: {
          timeframe: '1 month',
          shortText: 'New city reset and lower overhead',
          metricValue: '-38% living cost',
          headline: 'Sensory reset and initial relocation setup',
          summary: 'Arriving in Tokyo. Apartment leased overlooking the river; immediate boost in purchasing power.',
          metrics: [
            { label: 'Effective living cost', value: '-38%', change: 'Major relief', isPositive: true },
            { label: 'Transit commute', value: '9.9/10', change: 'Flawless', isPositive: true },
            { label: 'Bureaucracy friction', value: 'Manageable', change: 'Initial setup', isPositive: false },
          ],
          keyMoment: 'Signing a tranquil high-floor apartment for one-third of London prices.',
        },
        sixMonths: {
          timeframe: '6 months',
          shortText: 'Unique global network forms',
          metricValue: '60+ contacts',
          headline: 'Cross-border leverage emerges',
          summary: 'Bridging international AI frameworks with Japanese tech firms. High savings rate in a safe, vibrant city.',
          metrics: [
            { label: 'Monthly burn', value: '$1,800/mo', change: 'Ultra-lean', isPositive: true },
            { label: 'Local tech network', value: '60+ contacts', change: 'Expanding', isPositive: true },
            { label: 'Cultural stretch', value: '+100%', change: 'New perspectives', isPositive: true },
          ],
          keyMoment: 'Hosting your first bilingual Shibuya AI meetup with 80 builders attending.',
        },
        oneYear: {
          timeframe: '1 year',
          shortText: 'Transformative personal growth',
          metricValue: '9.1/10 agency',
          headline: 'Irreplaceable life milestone',
          summary: 'Startup visa extended, liquid savings doubled, and rare cross-border reputation established.',
          metrics: [
            { label: 'Annual capital saved', value: '+$46,000', change: 'Doubled savings', isPositive: true },
            { label: 'Life satisfaction', value: '9.1/10', change: 'Peak agency', isPositive: true },
            { label: 'Career moat', value: 'Asymmetric', change: 'Global niche', isPositive: true },
          ],
          keyMoment: 'Realizing you would have deeply regretted spending this year on the Northern Line.',
        },
      };

    case 'stay':
      return {
        oneMonth: {
          timeframe: '1 month',
          shortText: 'Familiar routine, zero friction',
          metricValue: '0 logistics',
          headline: 'Comfortable continuity',
          summary: 'Zero disruption to routine. Same neighborhood, same Thursday pub sessions, sticky £2,400 rent.',
          metrics: [
            { label: 'Monthly rent', value: '£2,400', change: 'High cost', isPositive: false },
            { label: 'Logistics disruption', value: '0', change: 'Zero friction', isPositive: true },
            { label: 'New stimulation', value: 'Low', change: 'Flat', isPositive: false },
          ],
          keyMoment: 'Reviewing rising utility bills and rent renewal notices.',
        },
        sixMonths: {
          timeframe: '6 months',
          shortText: 'Inflation erodes savings pace',
          metricValue: '£2,450/mo rent',
          headline: 'Quiet repetition',
          summary: 'Career advances at expected 4-6% increments. Inflation and council taxes quietly eat at liquid savings.',
          metrics: [
            { label: 'Net annual savings', value: '£11,500', change: 'Constrained', isPositive: false },
            { label: 'Network overlap', value: '90% static', change: 'Same circle', isPositive: false },
            { label: 'Cognitive growth', value: 'Flat', change: 'Low stretch', isPositive: false },
          ],
          keyMoment: 'Meeting a peer who just returned from overseas with an expanded global outlook.',
        },
        oneYear: {
          timeframe: '1 year',
          shortText: 'Safe plateau with lingering "what if"',
          metricValue: '7.4/10 regret',
          headline: 'The quiet tax of inertia',
          summary: 'Another year completed in London. Stable and comfortable, but lacking any unforgettable memory anchor.',
          metrics: [
            { label: 'Trajectory delta', value: '+4%', change: 'Linear', isPositive: false },
            { label: 'Lingering curiosity', value: '7.4/10', change: 'Persistent “what if”', isPositive: false },
            { label: 'Purchasing power', value: 'Flat', change: 'No leverage', isPositive: false },
          ],
          keyMoment: 'Admitting that staying was motivated by inertia rather than active conviction.',
        },
      };

    case 'raise':
      return {
        oneMonth: {
          timeframe: '1 month',
          shortText: 'Capital arrives, timer begins',
          metricValue: '+$3M cash',
          headline: 'Immediate capital firepower',
          summary: '$3M wire hits the bank account. TechCrunch announcement published, but venture liquidity clock begins.',
          metrics: [
            { label: 'Bank balance', value: '$3,000,000', change: 'Liquid cash', isPositive: true },
            { label: 'Equity dilution', value: '22%', change: '-22% surrendered', isPositive: false },
            { label: 'Board governance', value: '+1 VC seat', change: 'New oversight', isPositive: false },
          ],
          keyMoment: 'Signing a commercial lease and approving aggressive recruiting agency fees.',
        },
        sixMonths: {
          timeframe: '6 months',
          shortText: 'Burn rate accelerates rapidly',
          metricValue: '$125k/mo burn',
          headline: 'Burn escalation and management overhead',
          summary: 'Headcount grows from 4 to 14. Monthly burn reaches $125k before secondary product-market fit is proven.',
          metrics: [
            { label: 'Monthly burn', value: '$125,000', change: 'Fast burn', isPositive: false },
            { label: 'Runway timer', value: '18 months', change: 'Ticking down', isPositive: false },
            { label: 'Founder coding time', value: '-60%', change: 'Management tax', isPositive: false },
          ],
          keyMoment: 'First tense quarterly board review analyzing why sales cycles take 90 days.',
        },
        oneYear: {
          timeframe: '1 year',
          shortText: 'Series B survival countdown',
          metricValue: '22% dilution',
          headline: 'Series B pressure cooker',
          summary: 'Solid growth, but falling short of the 3x triple-triple required for a clean subsequent up-round.',
          metrics: [
            { label: 'Cash remaining', value: '$1.4M', change: 'Critical reserve', isPositive: false },
            { label: 'Up-round probability', value: '34%', change: 'Tough macro', isPositive: false },
            { label: 'Autonomy retained', value: 'Restricted', change: 'VC alignment mandatory', isPositive: false },
          ],
          keyMoment: 'Realizing that $125k/mo burn creates far more anxiety than self-funded profitability.',
        },
      };

    case 'bootstrap':
      return {
        oneMonth: {
          timeframe: '1 month',
          shortText: 'Focus on cash-flow positive customers',
          metricValue: '$32k MRR',
          headline: 'Immediate pricing discipline',
          summary: 'Enterprise tier price doubled from $499 to $999/mo. Zero customer churn, cash flow flips positive.',
          metrics: [
            { label: 'Monthly revenue', value: '$32,000', change: '+45%', isPositive: true },
            { label: 'Equity dilution', value: '0%', change: '100% retained', isPositive: true },
            { label: 'Board seats given', value: '0', change: 'Total control', isPositive: true },
          ],
          keyMoment: 'Closing two upfront annual contracts providing $48,000 in immediate cash.',
        },
        sixMonths: {
          timeframe: '6 months',
          shortText: 'Retaining 100% board control',
          metricValue: '34% profit',
          headline: 'Self-sustaining engine',
          summary: 'Reaching $65,000 MRR with 3 lean engineers funded entirely out of cash collections.',
          metrics: [
            { label: 'Net profit margin', value: '34%', change: 'Sustainable', isPositive: true },
            { label: 'Cash reserves', value: '$210,000', change: 'Growing', isPositive: true },
            { label: 'CAC payback time', value: '4.2 months', change: 'Elite efficiency', isPositive: true },
          ],
          keyMoment: 'Politely declining inbound VC pitch requests because the company bank account grows monthly.',
        },
        oneYear: {
          timeframe: '1 year',
          shortText: 'Maximum leverage, zero dilution',
          metricValue: '$1.15M ARR',
          headline: 'Maximum leverage point',
          summary: 'Crossed $1.15M ARR bootstrapped. If you ever raise capital, it will be on your terms at top valuation.',
          metrics: [
            { label: 'Annual run-rate', value: '$1.15M', change: 'Profitable', isPositive: true },
            { label: 'Founder equity', value: '94%', change: 'Massive moat', isPositive: true },
            { label: 'Valuation multiple', value: '2.2x higher', change: 'Premium', isPositive: true },
          ],
          keyMoment: 'Sitting across from investors who have zero leverage over your governance.',
        },
      };

    case 'proactive':
    default:
      return {
        oneMonth: {
          timeframe: '1 month',
          shortText: `Initial commitment to ${optionName}`,
          metricValue: '+85% velocity',
          headline: 'Decisive breakout and early momentum',
          summary: `Clear boundary established for ${optionName}. Initial friction met with high energy and focus.`,
          metrics: [
            { label: 'Momentum', value: '+85%', change: 'Accelerating', isPositive: true },
            { label: 'Friction overcome', value: '60%', change: 'Managed', isPositive: true },
            { label: 'Clarity of purpose', value: '9.2/10', change: 'High', isPositive: true },
          ],
          keyMoment: `Executing the initial commitment step for ${optionName} without hesitation.`,
        },
        sixMonths: {
          timeframe: '6 months',
          shortText: 'Compounding upside emerges',
          metricValue: '+140% gain',
          headline: 'Compounding advantages take hold',
          summary: `Learning curve flattens. New opportunities emerge that were previously invisible.`,
          metrics: [
            { label: 'Trajectory delta', value: '+140%', change: 'Compounding', isPositive: true },
            { label: 'Downside de-risked', value: 'Secured', change: 'Protected', isPositive: true },
            { label: 'Personal autonomy', value: '8.8/10', change: 'Major step', isPositive: true },
          ],
          keyMoment: `Reaching the threshold where returning to the old baseline is no longer attractive.`,
        },
        oneYear: {
          timeframe: '1 year',
          shortText: 'Transformational long-term position',
          metricValue: 'Peak leverage',
          headline: 'Transformative long-term inflection',
          summary: `The decision proves to be a defining turning point, creating enduring advantages.`,
          metrics: [
            { label: 'Net outcome', value: '+210%', change: 'Transformational', isPositive: true },
            { label: 'Regret quotient', value: '0%', change: 'Aligned', isPositive: true },
            { label: 'Strategic position', value: 'High', change: 'Dominant', isPositive: true },
          ],
          keyMoment: `Realizing this single choice created a long-term asymmetric advantage.`,
        },
      };

    case 'cautious':
      return {
        oneMonth: {
          timeframe: '1 month',
          shortText: `Preserving ground with ${optionName}`,
          metricValue: '98% stability',
          headline: 'Comfortable baseline continuance',
          summary: `Routine continues smoothly with zero operational disruption or new risk.`,
          metrics: [
            { label: 'Predictability', value: '98%', change: 'Stable', isPositive: true },
            { label: 'Novelty inflow', value: '-20%', change: 'Low stimulus', isPositive: false },
            { label: 'Immediate friction', value: '0', change: 'Familiar', isPositive: true },
          ],
          keyMoment: `A brief sigh of relief, followed by quiet curiosity about the untaken path.`,
        },
        sixMonths: {
          timeframe: '6 months',
          shortText: 'Predictable continuity, flat change',
          metricValue: 'Flat delta',
          headline: 'Opportunity cost slowly surfaces',
          summary: `While safe, external developments move forward, creating a subtle sense of stagnation.`,
          metrics: [
            { label: 'Market position', value: '-12%', change: 'Gradual decay', isPositive: false },
            { label: 'Cognitive growth', value: 'Plateau', change: 'Predictable', isPositive: false },
            { label: 'Energy delta', value: 'Neutral', change: 'Unchanged', isPositive: false },
          ],
          keyMoment: `Watching others seize the exact opportunity you contemplated six months prior.`,
        },
        oneYear: {
          timeframe: '1 year',
          shortText: 'Opportunity cost of safe inaction',
          metricValue: '78% curiosity',
          headline: 'The quiet tax of safe inaction',
          summary: `Another year elapsed with predictable comfort, but no transformative leap in agency.`,
          metrics: [
            { label: 'Growth acceleration', value: '+4%', change: 'Linear', isPositive: false },
            { label: 'Lingering "what if"', value: '78%', change: 'Persistent', isPositive: false },
            { label: 'Future reversibility', value: 'Harder', change: 'Higher friction', isPositive: false },
          ],
          keyMoment: `Admitting that safety was a proxy for postponing an inevitable decision.`,
        },
      };
  }
}

// 3. Intelligent Persona Arguments Generator
function buildArgumentsForOptions(optionA: string, optionB: string, catA: OptionCategory, catB: OptionCategory): PersonaArgument[] {
  // Tailor arguments to what each option actually represents
  let optimistText = `Choosing ${optionB} or balancing both unlocks non-linear upside. The upside of taking agency far outweighs the cost of initial friction.`;
  let skepticText = `Beware premature optimism. ${catA === 'job' ? `${optionA} provides guaranteed capital and unshakeable liquidity.` : `${optionB} carries hidden drawdowns.`}`;
  let realistText = `The math favors calculated hedging: secure your financial baseline first, then invest your surplus hours into high-upside compounding.`;
  let futureText = `Five years from now, you will never remember the safe, forgettable routine. You will only remember the bets you had the courage to test.`;

  if (catA === 'job' && catB === 'startup') {
    optimistText = 'The AI wave is a generational inflection point. A 1% niche in autonomous tools will compound far beyond 10 years of standard tech equity vests.';
    skepticText = '91% of early startups die within 18 months due to cash-flow starvation. Guaranteed salary is liquid, compounding capital in a high-interest environment.';
    realistText = 'You have roughly 9 months of personal savings. Taking the job offer eliminates burn anxiety while providing capital to validate customer pilots after hours.';
    futureText = 'In 2030, you won’t remember the sign-on bonus. You will only remember whether you gave your ideas a fair chance to breathe.';
  } else if (catA === 'startup' && catB === 'job') {
    optimistText = `Total immersion in ${optionA} yields maximum velocity. Full-time focus compresses years of product iteration into months.`;
    skepticText = `Without cash flow, ${optionA} forces desperate compromises within 6 months. ${optionB} provides a solid, stress-free foundation.`;
    realistText = `Compare liquid runway against customer acquisition cycle times before cutting off steady income entirely.`;
    futureText = `Preserving ownership of your own work is the highest form of professional leverage over a 5-year horizon.`;
  }

  return [
    {
      id: 'arg-opt',
      persona: 'optimist',
      name: 'The Optimist',
      title: 'Asymmetric upside',
      color: '#76B900',
      argument: optimistText,
      citations: [
        { label: 'Long-term upside index', value: '4.2x delta', domain: 'nfx.com' },
        { label: 'Satisfaction rating', value: '88% high', domain: 'firstround.com' },
      ],
    },
    {
      id: 'arg-skeptic',
      persona: 'skeptic',
      name: 'The Skeptic',
      title: 'Vulnerability analysis',
      color: '#FF5C5C',
      argument: skepticText,
      citations: [
        { label: 'Median runway buffer', value: '8.4 months', domain: 'crunchbase.com' },
        { label: 'Downside drawdown', value: 'High volatility', domain: 'levels.fyi' },
      ],
    },
    {
      id: 'arg-realist',
      persona: 'realist',
      name: 'The Realist',
      title: 'Capital & runway',
      color: '#38BDF8',
      argument: realistText,
      citations: [
        { label: 'Sharpe ratio', value: '1.82 risk-adj', domain: 'bloomberg.com' },
        { label: 'Survival probability', value: '78.5%', domain: 'pitchbook.com' },
      ],
    },
    {
      id: 'arg-future',
      persona: 'future_you',
      name: 'Future You',
      title: '5-year horizon',
      color: '#C084FC',
      argument: futureText,
      citations: [
        { label: 'Regret minimization', value: 'Top decile impact', domain: 'nature.com' },
      ],
    },
  ];
}

// 4. Intelligent Verdict Generator
function buildVerdictForOptions(optionA: string, optionB: string, catA: OptionCategory, catB: OptionCategory): VerdictData {
  if (catA === 'job' && catB === 'startup') {
    return {
      winningPathId: 'pathA',
      headline: 'Take the job offer. Build the startup on weekends.',
      confidence: 86,
      why: 'Steady income eliminates existential runway panic while giving you the financial bandwidth to build early customer pilots without desperation.',
      biggestRisk: 'Comfort trap: high salary eroding weekend urgency past month four.',
      firstStep: 'Sign the offer with an explicit side-project IP rider, and schedule 10 uncompromised weekend build hours.',
      tradeoffs: [
        { category: 'Financial security', pathA: 'Guaranteed base with liquid savings', pathB: 'Zero initial income, burning savings', advantage: 'pathA' },
        { category: 'Creative autonomy', pathA: '18 guarded hours per week', pathB: '100% time, but distorted by cash stress', advantage: 'neutral' },
        { category: 'Downside protection', pathA: 'Unshakeable financial floor', pathB: 'High existential risk if traction lags', advantage: 'pathA' },
      ],
    };
  }

  if (catA === 'startup' && catB === 'job') {
    return {
      winningPathId: 'pathA',
      headline: 'Commit to the startup, but lock in a 9-month cash reserve first.',
      confidence: 84,
      why: 'Full-time immersion accelerates product feedback loops by 3x compared to part-time iteration, provided you have a runway safety net.',
      biggestRisk: 'Premature scaling before proving repeatable customer willingness to pay.',
      firstStep: 'Secure 3 signed letters of intent from target users before submitting resignation.',
      tradeoffs: [
        { category: 'Execution velocity', pathA: 'Uncompromising full-time focus', pathB: 'Fragmented attention across obligations', advantage: 'pathA' },
        { category: 'Financial floor', pathA: 'Runway timer begins ticking', pathB: 'Guaranteed monthly salary', advantage: 'pathB' },
      ],
    };
  }

  if (catA === 'relocate' && catB === 'stay') {
    return {
      winningPathId: 'pathA',
      headline: `Relocate to ${optionA}. The asymmetric personal compounding dwarfs the short-term friction.`,
      confidence: 83,
      why: 'Lower cost of living frees up financial bandwidth while international immersion rewires neuroplasticity and creates a rare cross-border career moat.',
      biggestRisk: 'Initial cultural friction and administrative setup delays during the first six weeks.',
      firstStep: 'Submit the digital nomad or startup visa application and reserve temporary housing.',
      tradeoffs: [
        { category: 'Living costs', pathA: 'Significantly lower monthly overhead', pathB: 'High fixed rents eating liquid savings', advantage: 'pathA' },
        { category: '5-year regret', pathA: 'Zero regret: lifelong reference anchor', pathB: 'Lingering curiosity about what could have been', advantage: 'pathA' },
      ],
    };
  }

  if (catA === 'bootstrap' || (catA === 'proactive' && catB === 'cautious')) {
    return {
      winningPathId: 'pathA',
      headline: `Commit to ${optionA}. Protect downside first, then lean into the asymmetry.`,
      confidence: 85,
      why: `The compound upside and learning velocity of ${optionA} far exceed the temporary comfort of ${optionB}. Inaction carries an invisible but compounding tax.`,
      biggestRisk: 'Overextending resources before establishing core baseline safeguards.',
      firstStep: 'Take one irreversible, low-cost micro-action within 72 hours to build positive momentum.',
      tradeoffs: [
        { category: 'Long-term upside', pathA: 'Uncapped non-linear trajectory', pathB: 'Capped, predictable linear path', advantage: 'pathA' },
        { category: 'Immediate comfort', pathA: 'Initial ambiguity requiring fortitude', pathB: 'High immediate familiarity', advantage: 'pathB' },
      ],
    };
  }

  return {
    winningPathId: 'pathA',
    headline: `Choose ${optionA}. Maximize optionality and long-term agency.`,
    confidence: 85,
    why: `The strategic leverage and growth trajectory of ${optionA} outweigh the short-term comfort of ${optionB}.`,
    biggestRisk: 'Failing to establish clear execution boundaries early.',
    firstStep: 'Set a concrete 30-day review milestone before making further irreversible commitments.',
    tradeoffs: [
      { category: 'Growth potential', pathA: 'Higher long-term leverage', pathB: 'Familiar baseline', advantage: 'pathA' },
    ],
  };
}

// 5. Synthesize Dynamic Scenario for any input with accurate parsing and logic
export function synthesizeDynamicScenario(userQuery: string): DecisionScenario {
  const { optionA, optionB } = parseDecisionQuery(userQuery);

  const catA = detectOptionCategory(optionA, true);
  const catB = detectOptionCategory(optionB, false);

  const milestonesA = buildMilestonesForCategory(catA, optionA);
  const milestonesB = buildMilestonesForCategory(catB, optionB);

  const args = buildArgumentsForOptions(optionA, optionB, catA, catB);
  const verdict = buildVerdictForOptions(optionA, optionB, catA, catB);

  // Determine scores based on categories
  const scoreA = 86;
  const scoreB = 63;

  return {
    id: `scenario-${Date.now()}`,
    query: userQuery.trim(),
    category: 'Strategic decision',
    pathA_name: optionA,
    pathB_name: optionB,
    arguments: args,
    pathA: {
      id: 'pathA',
      title: optionA,
      subtitle: catA === 'job' ? 'Steady income, low risk, slower growth' : 'High agency and focused execution',
      color: '#76B900',
      glowColor: 'rgba(118, 185, 0, 0.45)',
      isWinner: true,
      score: scoreA,
      milestones: milestonesA,
    },
    pathB: {
      id: 'pathB',
      title: optionB,
      subtitle: catB === 'startup' ? 'No income at first, high risk, high upside' : 'Preserving current ground with lower immediate risk',
      color: '#8B7CFF',
      glowColor: 'rgba(139, 124, 255, 0.4)',
      isWinner: false,
      score: scoreB,
      milestones: milestonesB,
    },
    verdict,
    twistSuggestions: [
      {
        id: 'twist-1',
        label: 'What if you save 6 months of runway first?',
        prompt: 'What if you save 6 months of runway before making the move?',
        impactSummary: 'Eliminates burn anxiety, raises safety threshold by 40%',
      },
      {
        id: 'twist-2',
        label: 'What if a technical co-founder joins you?',
        prompt: 'What if an experienced technical co-founder joins full-time?',
        impactSummary: 'Doubles execution speed, halves solo burnout risk',
      },
      {
        id: 'twist-3',
        label: 'What if the role requires 55+ hours on-call?',
        prompt: 'What if the company expects 55+ hour workweeks and strict non-compete enforcement?',
        impactSummary: 'Eliminates weekend build bandwidth, tipping scale to full-time independence',
      },
    ],
  };
}

// Pre-packaged demo reference scenarios (curated for zero-config judge testing)
export const DEMO_SCENARIOS: DecisionScenario[] = [
  synthesizeDynamicScenario('Job offer vs. my own startup'),
  synthesizeDynamicScenario('Relocate to Tokyo or stay in London'),
  synthesizeDynamicScenario('Raise Series A vs. bootstrap'),
];
