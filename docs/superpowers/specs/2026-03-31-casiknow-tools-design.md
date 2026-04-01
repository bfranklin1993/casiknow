# CasiKnow — Casino Strategy Tools Design Spec

## Overview

CasiKnow is a free, ad-supported website for recreational casino gamblers who want to play smarter. The MVP is four interactive tools that surface real casino math in a way that's immediately useful — both for trip planning at home and decision-making on the casino floor.

**Brand positioning:** Like a smart friend who knows the math. Helpful, direct, no BS.

**Design language:** Sportsbook board aesthetic — amber on dark, monospace typography, data-dense. Vegas DNA without the cheese. Credibility through restraint, not decoration.

**Stack:** Next.js on Vercel. All math runs client-side — no backend, no database, no user accounts.

## Design System

### Visual Identity

- **Color palette:**
  - Background: `#1a1a17` (warm dark)
  - Secondary bg: `#151512`, `#222`
  - Accent: `#f5c542` (amber/gold)
  - Good: `#4ade80` (green)
  - Caution: `#eab308` (yellow)
  - Bad: `#ef4444` (red)
  - Text primary: `#ddd`
  - Text secondary: `#999`, `#888`
  - Text muted: `#666`, `#555`
  - Borders: `#333`, `#2a2a24`
- **Typography:** Monospace throughout (`Courier New`, monospace stack). All-caps for labels and headers with letter-spacing.
- **Borders:** No border-radius. Sharp edges. Minimal box shadows.
- **Data display:** Tables are the primary component. Color-coded values (green/yellow/red) for at-a-glance quality assessment.
- **Interaction pattern:** Click/tap to expand rows for detail. Filters as pill-style toggles. Inputs as inline editable fields.
- **Rating system:** Star ratings (★★★★☆) for quick assessment, plus text verdicts (GREAT, GOOD, OK, MEH, BAD, SUCKER, WORST).

### Responsive Design

All tools must work well on both desktop and mobile. Users will access these both at home (trip planning) and on the casino floor (phone). Tables should scroll horizontally on mobile. Inputs should be touch-friendly.

### Content Tone

- Plain English explanations — "bet with the shooter" not "contract bet on the pass line"
- Every number sourced and verifiable
- Estimates clearly labeled as estimates with ranges, not false precision
- Tips and recommendations backed by math, not opinion

## Data Sourcing (Critical — Must Complete Before UI)

All data must be sourced from verifiable, authoritative references:

- **Table game house edges:** Mathematically provable. Source from published combinatorial analysis (Wizard of Odds methodology, Griffin's Theory of Blackjack, etc.)
- **Blackjack basic strategy charts:** Published optimal play tables adjusted for specific rule combinations. Source from well-established strategy engines.
- **Slot RTP by denomination:** Nevada Gaming Control Board monthly reports (publicly available). Label as Nevada averages with appropriate caveats.
- **Spins/hands per hour:** Industry-accepted averages with ranges. Source from gaming industry publications.
- **Comp rates:** Widely-accepted ranges with explicit "estimated" labeling. Note that actual comp rates vary by casino, tier status, and other factors.

Any value that cannot be verified gets labeled with its source and confidence level. No made-up numbers.

## Tool 1: House Edge Comparison

**Route:** `/house-edge`

**Purpose:** The definitive reference for every casino bet ranked by what it actually costs you. The foundation tool — establishes the data model and design patterns used by the other tools.

### Features

1. **Master table of all bets**
   - Columns: Game, Bet/Rules, House Edge, EV/Hour, Rating
   - Sortable by any column
   - Click any row to expand with plain-English explanation

2. **Game filters**
   - Pill-style filter bar: All, Blackjack, Craps, Roulette, Baccarat, Slots, Video Poker, Other
   - Active filter highlighted in amber

3. **Adjustable parameters**
   - Average bet amount (default $25)
   - Hands/spins per hour (default varies by game, user can override)
   - EV/Hour recalculates live as parameters change

4. **Rule variations inline**
   - Blackjack: 3:2 vs 6:5, S17 vs H17, DAS, surrender, deck count
   - Roulette: single zero vs double zero vs triple zero
   - Each variation is its own row with its own edge

5. **Expanded row detail**
   - Amber left-border callout box
   - Plain-English explanation of what the bet is
   - Why the edge is what it is
   - Practical tip (e.g., "If only 6:5 tables are available, you're better off playing craps pass line")

### Data Model

```
{
  game: string,        // "BLACKJACK", "CRAPS", etc.
  bet: string,         // "Basic Strategy"
  rules: string,       // "3:2 · S17 · DAS"
  edge: number,        // 0.0028
  handsPerHour: number, // 60
  description: string, // Plain-English explanation
  tip: string,         // Practical advice
  source: string       // Citation
}
```

## Tool 2: Slot Math Optimizer

**Route:** `/slots`

**Purpose:** Answer the question every slot player has: "Given my bankroll and goals, what should I play and how should I bet?"

### Features

1. **Three inputs**
   - Bankroll ($100–$10,000, slider or direct input)
   - Session time (1–8 hours)
   - Goal: Max Play Time / Best Shot at Big Hit / Maximize Comps

2. **Primary recommendation**
   - "Play this, not this" — clear side-by-side comparison
   - Recommended denomination and bet size
   - Plain-English explanation of why

3. **Session projection**
   - Spins per hour (based on typical play speed)
   - Total amount wagered over the session
   - Expected loss (edge × total wagered)
   - Bust probability (chance of losing entire bankroll before session ends)

4. **Comp value estimate**
   - Theoretical loss
   - Estimated comp return (range, e.g., 25–40% of theo)
   - Net cost after comps
   - Labeled as estimated — actual rates vary by casino

5. **Full denomination comparison table**
   - All denominations side-by-side
   - Columns: Denomination, Bet, RTP, Expected Loss, Bust Risk, Big Hit Potential
   - Recommended row highlighted

6. **Goal changes the recommendation**
   - "Max Play Time" favors lower variance, lower bet
   - "Big Hit" favors higher denomination (better RTP, higher top-pay frequency relative to bet)
   - "Maximize Comps" favors higher coin-in (more total wagered)

### Data Sources

- RTP by denomination: Nevada Gaming Control Board monthly slot statistics
- Spins per hour: ~500-700 (use 600 default with note)
- Comp rates: Industry ranges, clearly labeled as estimates

## Tool 3: Blackjack Strategy Trainer

**Route:** `/blackjack`

**Purpose:** Practice basic strategy until it's automatic. Adjusts for the specific table rules you're playing.

### Features

1. **Rule configuration**
   - Payout: 3:2 or 6:5
   - Dealer: S17 or H17
   - Decks: 1, 2, 6, or 8
   - Double After Split: on/off
   - Surrender: off/late
   - Strategy chart recalculates when rules change

2. **Card dealing area**
   - Green felt background
   - Dealer shows one card up, one face down
   - Player's hand shown with total
   - Cards should look realistic — proper proportions, corner indices, suit styling, subtle shadows (not flat rectangles)

3. **Action buttons**
   - Hit, Stand, Double, Split (Split grayed out when not applicable)
   - Keyboard shortcuts for desktop (H, S, D, P)

4. **Instant feedback on wrong answers**
   - Red callout: "You chose: HIT"
   - Green: "Correct play: STAND"
   - Explanation: why the correct play is correct, with the math (e.g., "Hitting gives you a 58% chance of busting. Standing loses 54% of the time, but hitting loses 58%. Less bad = correct play.")

5. **Session statistics**
   - Hands played
   - Accuracy percentage
   - Current streak
   - Most-missed hands (weakest spots to focus on)

6. **Strategy chart (always visible)**
   - Three tabs: Hard Totals, Soft Totals, Pairs
   - Color-coded: S=Stand (green), H=Hit (red), D=Double (blue), P=Split (purple), R=Surrender (gray)
   - Current hand highlighted on the chart
   - Chart adjusts automatically when rule config changes

### Data Sources

- Basic strategy tables sourced from published optimal play calculations for each rule combination
- Probabilities for feedback explanations derived from combinatorial analysis

## Tool 4: Craps Strategy Guide

**Route:** `/craps`

**Purpose:** Demystify the craps table and give bankroll-specific betting strategies.

### Features

1. **Two modes (tab toggle)**
   - **Learn:** Interactive table diagram — tap any bet area for explanation
   - **Strategy:** Bankroll-based betting recommendations

2. **Learn Mode — Interactive table**
   - Top-down representation of a craps table layout
   - Every bet area is tappable
   - House edge shown on each bet area (color-coded green/yellow/red)
   - Tapping a bet opens an explanation panel:
     - What the bet is (plain English)
     - House edge
     - Hourly cost at a given bet size
     - Pro tip
   - Table rendering should look good — proper felt green, proportions, clear labeling. This needs real visual design attention, not just boxes.

3. **Strategy Mode — Bankroll-based recommendations**
   - Three tiers:
     - **Conservative ($200–500):** Pass Line + 1x odds, 1 come bet max, skip all props
     - **Recommended ($500–1500):** Pass Line + 2x odds, 2 come bets + odds, skip all props
     - **Aggressive ($1500+):** Pass Line + 3-4-5x odds, 2 come bets + max odds, Place 6 & 8
   - Each tier shows: combined effective edge, hourly cost at $25
   - Recommended tier highlighted

4. **All bets ranked**
   - Every craps bet in a sortable table
   - Columns: Bet, Edge, Verdict
   - Verdicts: ALWAYS, GREAT, GOOD, OK, MEH, BAD, SUCKER, WORST

### Data Sources

- All craps probabilities are exact (derived from dice combinatorics)
- Strategy recommendations based on published optimal craps play

## What's NOT in MVP

- No user accounts or login
- No backend or database
- No comp calculator (future tool)
- No live table conditions (future app)
- No card counting features
- No real-money anything
- No video poker strategy (future tool)

## SEO Considerations

Each tool page should target high-intent search queries:
- `/house-edge` → "best bets at casino", "house edge by game", "casino game odds"
- `/slots` → "best way to play slot machines", "slot denomination strategy", "slot machine odds"
- `/blackjack` → "blackjack basic strategy", "blackjack strategy trainer", "when to hit or stand"
- `/craps` → "how to play craps", "craps strategy", "best craps bets"

Each page needs proper meta tags, structured data, and content that serves both the tool user and the search engine. Implementation details in the plan.

## Navigation

Simple top nav: CASIKNOW logo/wordmark (left) + tool links (right):
- HOUSE EDGE
- SLOTS
- BLACKJACK
- CRAPS

Mobile: hamburger or bottom tab bar.

Homepage (`/`) is a simple index page: CasiKnow wordmark, one-line tagline ("Know the house. Beat the odds."), and four links to the tools. No hero image, no marketing copy, no elaborate design. The tools are the product.

## Disclaimer

Every page includes a footer disclaimer: CasiKnow provides mathematical analysis and strategy information for educational purposes. We are not responsible for gambling losses. All data represents theoretical expectations — actual results vary. If gambling is causing problems, call 1-800-522-4700.
