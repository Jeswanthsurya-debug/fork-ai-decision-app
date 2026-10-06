# Fork — The AI Decision Brancher
### Nebius × NVIDIA Global AI Hackathon Submission
**Track:** Personal AI / Best Apps and Agents  
**Reasoning Engine:** NVIDIA Nemotron on Nebius Token Factory  
**Ground Truth Provider:** Tavily Search API  
**Design Ethos:** Apple + Linear + Teenage Engineering (Calm, dark, typographic, generous space, glowing path)

---

## ✦ Key Capabilities & Design Updates

1. **Precision Query Parsing**:
   - Splits on whole words `vs`, `vs.`, `or`, or `versus`.
   - Cleans leading question prefixes and strips all stray punctuation (no residual periods from `vs.`).
   - Automatically capitalizes the first letter of each branch:
     - Input: `"Job offer vs. my own startup"`
     - Option A: `"Job offer"`
     - Option B: `"My own startup"`

2. **Semantic Option Profiling (Objective Outcomes)**:
   - Evaluates each option based on its true characteristics rather than arbitrary position:
     - **Job offer**: Steady income (`$17,500/mo`), low risk (`+$84k saved`), slower growth (`+6% raise`).
     - **Startup**: No income at first (`$0 income`), high risk (`3.4 mo runway`), high upside (`100% equity`).
     - If the order is reversed, the traits accurately follow the actual option.

3. **Ultra-Minimal, Visual Branching Path**:
   - Removed bulky cards; the central hero is the glowing branching tree.
   - A single luminous trunk draws upward and splits into two curved bezier branches:
     - **Option A (NVIDIA Green `#76B900`)**
     - **Option B (Soft Violet `#8B7CFF`)**
   - Each branch displays three milestone dots (**1 month**, **6 months**, **1 year**) with just **one short line of text and one number**.
   - Extra metrics and details are accessible via a clean, expandable **Details** link.

4. **Sentence Case & Refined Typography**:
   - Headlines set in **Instrument Serif**; body text in **Inter**.
   - Replaced all-caps monospace labels with calm, human sentence case across all screens.

5. **The Verdict**:
   - The weaker branch fades to **15% opacity**, while the winning branch brightens and pulses.
   - A circular confidence ring counts up smoothly.
   - The verdict headline reveals word by word.
   - Three clear, minimal lines:
     - **Why**
     - **Biggest risk**
     - **This week**

---

## ✦ Tech Stack

- **React 19 + TypeScript + Vite + Tailwind CSS**
- **Framer Motion** for 60fps spring physics and path-drawing animations
- **Web Audio API** for tactile Teenage Engineering sound synthesis (can be muted with `M` or the header toggle)
- **Demo Mode** enabled by default for instantaneous zero-key testing
- **API Settings Modal** for custom Nebius Token Factory & Tavily API keys
