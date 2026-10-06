# Fork

**See where each choice leads.**

Fork is an AI decision app. Type a decision like *"Job offer vs. my own startup"* and Fork shows you what each choice looks like after 1 month, 6 months and 1 year, then gives a clear verdict.

Built for the Nebius x NVIDIA Global AI Hackathon.

## The problem

Big decisions are hard because you can't see where each choice leads. Friends give opinions, and chatbots give long paragraphs. Fork gives you a visual path.

## How it works

1. **Debate:** four AI voices (Optimist, Skeptic, Realist, Future You) argue both sides, backed by real data.
2. **The Fork:** one glowing line splits into two paths, with milestones at 1 month, 6 months and 1 year.
3. **Verdict:** the weaker path fades, the stronger one glows. You get a confidence score, the biggest risk and a first step for this week.

## Use cases

- Job offer or startup
- Which laptop to buy
- Move to a new city or stay
- Which college or course to pick

## Tech stack

- React + Vite + Tailwind CSS + Framer Motion
- NVIDIA Nemotron models on Nebius Token Factory (reasoning)
- Tavily API (live web data)
- Demo Mode with mock data, so it runs without API keys

## Getting started

```bash
git clone https://github.com/<your-username>/fork-ai-decision-app.git
cd fork-ai-decision-app
npm install
npm run dev
```

Open the local URL shown in the terminal. Demo Mode works with no setup.

### Live API mode (optional)

Create a `.env` file in the project root:

```
VITE_NEBIUS_API_KEY=your_nebius_key
VITE_TAVILY_API_KEY=your_tavily_key
```

Restart the dev server, then switch on **Live API** in the top bar.

## Demo

Try this input:

```
Job offer vs. my own startup
```

## Roadmap

- Save and compare past decisions
- Share a decision as an image
- Add more personas and custom factors
- Voice input

## Team

Built by Jeswanth Surya.

## License

MIT
