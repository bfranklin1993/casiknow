# CasiKnow Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build four interactive casino strategy tools (House Edge Comparison, Slot Math Optimizer, Blackjack Strategy Trainer, Craps Strategy Guide) as a Next.js app with a sportsbook board design aesthetic.

**Architecture:** Static Next.js site with all math running client-side. Data lives in TypeScript files (no database). Each tool is a route with its own page component composed of focused sub-components. Shared design system via Tailwind CSS with custom theme tokens.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, deployed on Vercel.

**Spec:** `docs/superpowers/specs/2026-03-31-casiknow-tools-design.md`

---

## File Structure

```
casiknow/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout: Nav + Footer + meta
│   │   ├── page.tsx                   # Homepage: wordmark + tool links
│   │   ├── globals.css                # Tailwind imports + design tokens
│   │   ├── house-edge/
│   │   │   └── page.tsx               # House Edge tool (server component, SEO meta)
│   │   ├── slots/
│   │   │   └── page.tsx               # Slot Optimizer page
│   │   ├── blackjack/
│   │   │   └── page.tsx               # Blackjack Trainer page
│   │   └── craps/
│   │       └── page.tsx               # Craps Guide page
│   ├── components/
│   │   ├── Nav.tsx                    # Top navigation bar
│   │   ├── Footer.tsx                 # Disclaimer + footer
│   │   ├── FilterPills.tsx            # Reusable pill-style filter bar
│   │   ├── SettingsBar.tsx            # Reusable adjustable parameter bar
│   │   ├── ExpandableRow.tsx          # Reusable expandable detail row
│   │   ├── StarRating.tsx             # ★★★★☆ component
│   │   ├── EdgeBadge.tsx              # Color-coded edge value display
│   │   ├── house-edge/
│   │   │   └── HouseEdgeTable.tsx     # Main interactive table + filters + settings
│   │   ├── slots/
│   │   │   ├── SlotInputs.tsx         # Bankroll, time, goal inputs
│   │   │   ├── SlotRecommendation.tsx # "Play this, not this" + why
│   │   │   ├── SessionProjection.tsx  # Spins, wagered, loss, bust risk
│   │   │   ├── CompValue.tsx          # Theo loss, comp back, net cost
│   │   │   └── DenomTable.tsx         # All denominations compared
│   │   ├── blackjack/
│   │   │   ├── RuleConfig.tsx         # Table rule toggles
│   │   │   ├── PlayingCard.tsx        # Realistic card rendering
│   │   │   ├── DealArea.tsx           # Felt + dealer/player hands + actions
│   │   │   ├── Feedback.tsx           # Right/wrong explanation callout
│   │   │   ├── SessionStats.tsx       # Hands, accuracy, streak, weak spots
│   │   │   └── StrategyChart.tsx      # Hard/soft/pairs tabbed chart
│   │   └── craps/
│   │       ├── CrapsTableDiagram.tsx  # Interactive SVG table layout
│   │       ├── BetDetail.tsx          # Expanded bet explanation panel
│   │       ├── StrategyTiers.tsx      # Conservative/recommended/aggressive
│   │       └── CrapsBetsRanked.tsx    # All bets ranked table
│   ├── data/
│   │   ├── house-edges.ts            # All casino bets with edges, descriptions, tips
│   │   ├── slot-math.ts              # RTP by denomination, variance data
│   │   ├── blackjack-strategy.ts     # Strategy charts for all rule combos
│   │   └── craps-bets.ts             # All craps bets with edges, descriptions
│   └── lib/
│       ├── calculations.ts           # EV/hr, bust probability, comp estimates
│       └── blackjack-engine.ts       # Deck, dealing, hand evaluation, action validation
├── public/
│   └── favicon.ico
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## Task 1: Project Scaffolding + Design System

**Files:**
- Create: `package.json`, `tailwind.config.ts`, `next.config.ts`, `tsconfig.json`
- Create: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `src/components/Nav.tsx`, `src/components/Footer.tsx`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/brianfranklin/Documents/casiknow
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Accept defaults. This scaffolds the project with Next.js 15, TypeScript, Tailwind, App Router.

- [ ] **Step 2: Configure Tailwind theme with design tokens**

Replace the contents of `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ck: {
          bg: "#1a1a17",
          "bg-secondary": "#151512",
          "bg-tertiary": "#222222",
          accent: "#f5c542",
          good: "#4ade80",
          caution: "#eab308",
          bad: "#ef4444",
          "text-primary": "#dddddd",
          "text-secondary": "#999999",
          "text-muted": "#666666",
          "text-dim": "#555555",
          "text-faint": "#444444",
          border: "#333333",
          "border-subtle": "#2a2a24",
          felt: "#1b5e20",
        },
      },
      fontFamily: {
        mono: ['"Courier New"', "Courier", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Set up global styles**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-ck-bg text-ck-text-primary font-mono antialiased;
  }

  /* Scrollbar styling for dark theme */
  ::-webkit-scrollbar {
    @apply w-2 h-2;
  }
  ::-webkit-scrollbar-track {
    @apply bg-ck-bg;
  }
  ::-webkit-scrollbar-thumb {
    @apply bg-ck-border;
  }
}
```

- [ ] **Step 4: Create Nav component**

Create `src/components/Nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/house-edge", label: "HOUSE EDGE" },
  { href: "/slots", label: "SLOTS" },
  { href: "/blackjack", label: "BLACKJACK" },
  { href: "/craps", label: "CRAPS" },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-ck-border px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-ck-accent font-bold text-lg tracking-[3px]"
        >
          CASIKNOW
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-6">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs tracking-[1px] transition-colors ${
                pathname === href
                  ? "text-ck-accent border-b border-ck-accent pb-0.5"
                  : "text-ck-text-secondary hover:text-ck-text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-ck-text-secondary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="text-lg">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 pb-2">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-xs tracking-[1px] ${
                pathname === href
                  ? "text-ck-accent"
                  : "text-ck-text-secondary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 5: Create Footer component**

Create `src/components/Footer.tsx`:

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-ck-border-subtle mt-16 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] text-ck-text-faint leading-relaxed tracking-wide">
          CasiKnow provides mathematical analysis and strategy information for
          educational purposes. We are not responsible for gambling losses. All
          data represents theoretical expectations — actual results vary. If
          gambling is causing problems, call 1-800-522-4700.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Create root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | CasiKnow",
    default: "CasiKnow — Know the House. Beat the Odds.",
  },
  description:
    "Free casino strategy tools. House edge comparison, slot math optimizer, blackjack trainer, and craps guide — all backed by real math.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Create homepage**

Replace `src/app/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CasiKnow — Know the House. Beat the Odds.",
};

const TOOLS = [
  {
    href: "/house-edge",
    label: "HOUSE EDGE",
    desc: "Every casino bet ranked by what it actually costs you.",
  },
  {
    href: "/slots",
    label: "SLOTS",
    desc: "Your bankroll + your goals → what to play and how to bet.",
  },
  {
    href: "/blackjack",
    label: "BLACKJACK",
    desc: "Practice basic strategy until it's automatic.",
  },
  {
    href: "/craps",
    label: "CRAPS",
    desc: "Interactive table guide + bankroll-based strategies.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-ck-accent font-bold text-3xl tracking-[4px] mb-2">
        CASIKNOW
      </h1>
      <p className="text-ck-text-secondary text-xs tracking-[2px] mb-16">
        KNOW THE HOUSE. BEAT THE ODDS.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {TOOLS.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="border border-ck-border p-6 hover:border-ck-accent transition-colors group"
          >
            <div className="text-sm font-bold tracking-[2px] text-ck-text-primary group-hover:text-ck-accent mb-2">
              {label}
            </div>
            <div className="text-xs text-ck-text-secondary leading-relaxed">
              {desc}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Verify dev server runs**

```bash
cd /Users/brianfranklin/Documents/casiknow && npm run dev
```

Open http://localhost:3000. Verify: dark background, amber CASIKNOW wordmark, four tool link cards, nav bar, footer with disclaimer.

- [ ] **Step 9: Commit**

```bash
git init
echo "node_modules\n.next\n.env*\n.superpowers" > .gitignore
git add -A
git commit -m "feat: scaffold CasiKnow with Next.js, Tailwind, design system, nav, footer"
```

---

## Task 2: Shared UI Components

**Files:**
- Create: `src/components/FilterPills.tsx`
- Create: `src/components/SettingsBar.tsx`
- Create: `src/components/ExpandableRow.tsx`
- Create: `src/components/StarRating.tsx`
- Create: `src/components/EdgeBadge.tsx`

- [ ] **Step 1: Create FilterPills component**

Create `src/components/FilterPills.tsx`:

```tsx
"use client";

interface FilterPillsProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export default function FilterPills({
  options,
  selected,
  onChange,
}: FilterPillsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`text-[11px] tracking-[1px] px-3 py-1.5 transition-colors ${
            selected === option
              ? "bg-ck-accent text-ck-bg font-bold"
              : "bg-ck-border-subtle text-ck-text-secondary hover:text-ck-text-primary"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create SettingsBar component**

Create `src/components/SettingsBar.tsx`:

```tsx
"use client";

interface Setting {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "number" | "select";
  options?: string[];
}

interface SettingsBarProps {
  settings: Setting[];
}

export default function SettingsBar({ settings }: SettingsBarProps) {
  return (
    <div className="bg-ck-bg-secondary border-b border-ck-border-subtle px-7 py-3 flex gap-6 items-center flex-wrap">
      {settings.map((setting) => (
        <div key={setting.label} className="flex items-center gap-2">
          <span className="text-[10px] text-ck-text-muted tracking-[1px]">
            {setting.label}
          </span>
          {setting.type === "select" && setting.options ? (
            <select
              value={setting.value}
              onChange={(e) => setting.onChange(e.target.value)}
              className="bg-ck-border-subtle text-ck-accent text-[13px] px-2.5 py-0.5 appearance-none cursor-pointer"
            >
              {setting.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              value={setting.value}
              onChange={(e) => setting.onChange(e.target.value)}
              className="bg-ck-border-subtle text-ck-accent text-[13px] px-2.5 py-0.5 w-20 outline-none"
            />
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create StarRating component**

Create `src/components/StarRating.tsx`:

```tsx
interface StarRatingProps {
  rating: 1 | 2 | 3 | 4 | 5;
}

const STARS = ["★", "★", "★", "★", "★"];

export default function StarRating({ rating }: StarRatingProps) {
  return (
    <span className="text-ck-accent text-xs tracking-wider">
      {STARS.map((star, i) => (
        <span key={i} className={i < rating ? "" : "opacity-30"}>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
```

- [ ] **Step 4: Create EdgeBadge component**

Create `src/components/EdgeBadge.tsx`:

```tsx
interface EdgeBadgeProps {
  edge: number; // e.g., 0.0028 for 0.28%
  format?: "percent" | "raw";
}

export default function EdgeBadge({ edge, format = "percent" }: EdgeBadgeProps) {
  const pct = edge * 100;
  const color =
    pct <= 1.5
      ? "text-ck-good"
      : pct <= 4
        ? "text-ck-caution"
        : "text-ck-bad";

  const display = format === "percent" ? `${pct.toFixed(2)}%` : edge.toString();

  return <span className={`${color} font-bold`}>{display}</span>;
}
```

- [ ] **Step 5: Create ExpandableRow component**

Create `src/components/ExpandableRow.tsx`:

```tsx
"use client";

import { useState } from "react";

interface ExpandableRowProps {
  title: string;
  children: React.ReactNode;
}

export default function ExpandableRow({ title, children }: ExpandableRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border-l-[3px] ${
        open ? "border-ck-accent bg-ck-bg-tertiary" : "border-transparent"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-3 text-[11px] text-ck-accent tracking-[1px] hover:bg-ck-bg-tertiary transition-colors"
      >
        {open ? "▼" : "▶"} {title}
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs text-ck-text-secondary leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/FilterPills.tsx src/components/SettingsBar.tsx src/components/StarRating.tsx src/components/EdgeBadge.tsx src/components/ExpandableRow.tsx
git commit -m "feat: add shared UI components (FilterPills, SettingsBar, StarRating, EdgeBadge, ExpandableRow)"
```

---

## Task 3: Data Research & Sourcing — House Edge Database

**Files:**
- Create: `src/data/house-edges.ts`

**CRITICAL:** All numbers in this file must be verified against authoritative sources before the site goes live. The values below are sourced from published combinatorial analysis (Wizard of Odds, Griffin's Theory of Blackjack, Scarne's New Complete Guide to Gambling). Any value that cannot be mathematically proven is labeled with a source note.

- [ ] **Step 1: Research and compile house edge data**

Use web search to verify the following against the Wizard of Odds website, Nevada Gaming Control Board reports, and published gambling mathematics texts. Cross-reference at least two sources per value.

Key sources to check:
- Wizard of Odds house edge tables (wizardofodds.com)
- Nevada Gaming Control Board monthly reports (gaming.nv.gov) for slot RTP
- Published mathematical analyses for table game edges

- [ ] **Step 2: Create house edge data file**

Create `src/data/house-edges.ts`:

```ts
export interface CasinoBet {
  id: string;
  game: string;
  bet: string;
  rules: string;
  edge: number; // decimal, e.g., 0.0028 for 0.28%
  handsPerHour: number;
  description: string;
  tip: string;
  source: string;
}

export type GameCategory =
  | "ALL"
  | "BLACKJACK"
  | "CRAPS"
  | "ROULETTE"
  | "BACCARAT"
  | "SLOTS"
  | "VIDEO POKER"
  | "OTHER";

export const GAME_CATEGORIES: GameCategory[] = [
  "ALL",
  "BLACKJACK",
  "CRAPS",
  "ROULETTE",
  "BACCARAT",
  "SLOTS",
  "VIDEO POKER",
  "OTHER",
];

// All edges sourced from published combinatorial analysis.
// Table game edges are mathematically exact.
// Slot RTP ranges from Nevada Gaming Control Board monthly reports.
// Hands/spins per hour are industry-accepted averages.
export const HOUSE_EDGE_DATA: CasinoBet[] = [
  // --- BLACKJACK ---
  {
    id: "bj-3to2-s17-das-6d",
    game: "BLACKJACK",
    bet: "Basic Strategy",
    rules: "3:2 · S17 · DAS · 6 deck",
    edge: 0.0028,
    handsPerHour: 60,
    description:
      "Playing perfect basic strategy at a 6-deck table where the dealer stands on soft 17 and double after split is allowed. This is the best standard blackjack game commonly found.",
    tip: "Look for tables with these rules — they're the gold standard. Always check the felt for the payout (3:2 vs 6:5) before sitting down.",
    source: "Combinatorial analysis (Griffin, Wong)",
  },
  {
    id: "bj-3to2-h17-das-6d",
    game: "BLACKJACK",
    bet: "Basic Strategy",
    rules: "3:2 · H17 · DAS · 6 deck",
    edge: 0.0046,
    handsPerHour: 60,
    description:
      "Same as above but the dealer hits on soft 17. This adds about 0.2% to the house edge compared to S17.",
    tip: "H17 is worse for the player. If both S17 and H17 tables are available at the same minimum, always choose S17.",
    source: "Combinatorial analysis (Griffin, Wong)",
  },
  {
    id: "bj-6to5-s17-das-6d",
    game: "BLACKJACK",
    bet: "Basic Strategy",
    rules: "6:5 · S17 · DAS · 6 deck",
    edge: 0.0183,
    handsPerHour: 60,
    description:
      "The 6:5 payout on natural blackjack adds +1.39% to the house edge vs 3:2. This is the single biggest rule change to watch for.",
    tip: "Avoid 6:5 blackjack. At $25/hand, the 6:5 payout costs you an extra $20.85/hr compared to 3:2. You're better off playing craps.",
    source: "Combinatorial analysis — 6:5 adds ~1.39% vs 3:2",
  },
  {
    id: "bj-3to2-s17-das-1d",
    game: "BLACKJACK",
    bet: "Basic Strategy",
    rules: "3:2 · S17 · DAS · 1 deck",
    edge: 0.0015,
    handsPerHour: 60,
    description:
      "Single-deck blackjack with good rules is the best game available. Fewer decks mean more blackjacks and better doubling opportunities.",
    tip: "Single-deck 3:2 games are rare on the Strip. Check downtown Las Vegas or off-strip casinos.",
    source: "Combinatorial analysis (Griffin)",
  },
  {
    id: "bj-3to2-s17-das-2d",
    game: "BLACKJACK",
    bet: "Basic Strategy",
    rules: "3:2 · S17 · DAS · 2 deck",
    edge: 0.0021,
    handsPerHour: 60,
    description:
      "Two-deck blackjack with good rules. Slightly higher edge than single deck but still excellent.",
    tip: "Two-deck games are a solid choice when available. Better than 6 or 8 deck with the same rules.",
    source: "Combinatorial analysis",
  },
  {
    id: "bj-3to2-s17-das-8d",
    game: "BLACKJACK",
    bet: "Basic Strategy",
    rules: "3:2 · S17 · DAS · 8 deck",
    edge: 0.0031,
    handsPerHour: 60,
    description:
      "Eight-deck shoe game. Marginally worse than 6 deck but the difference is minimal.",
    tip: "Don't stress about 6 vs 8 deck — the difference is only 0.03%. Focus on 3:2 payout and S17.",
    source: "Combinatorial analysis",
  },

  // --- CRAPS ---
  {
    id: "craps-pass",
    game: "CRAPS",
    bet: "Pass Line",
    rules: "",
    edge: 0.0141,
    handsPerHour: 48,
    description:
      "Bet with the shooter. Wins on 7 or 11 on the come-out roll. Loses on 2, 3, or 12. Any other number becomes 'the point' — wins if the point rolls again before a 7.",
    tip: "Always back your pass line bet with odds. Odds bets have 0% house edge — the only truly fair bet in the casino.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-dont-pass",
    game: "CRAPS",
    bet: "Don't Pass / Don't Come",
    rules: "",
    edge: 0.0106,
    handsPerHour: 48,
    description:
      "Bet against the shooter. Slightly better odds than the pass line, but you'll be betting against the table — some players don't like the social aspect.",
    tip: "Mathematically the best line bet on the table. If you don't mind 'wrong' betting, this saves you money.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-come",
    game: "CRAPS",
    bet: "Come",
    rules: "",
    edge: 0.0141,
    handsPerHour: 48,
    description:
      "Same as the pass line but placed after the come-out roll. Lets you have multiple points working at once.",
    tip: "Come bets with odds are the core of smart craps play. 2-3 come bets with odds is a solid strategy.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-dont-come",
    game: "CRAPS",
    bet: "Don't Come",
    rules: "",
    edge: 0.0106,
    handsPerHour: 48,
    description:
      "Same as Don't Pass but placed after the come-out. Bet against the current point being made.",
    tip: "Combine with Don't Pass for a full 'dark side' strategy at the lowest possible edge.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-odds",
    game: "CRAPS",
    bet: "Odds (behind Pass/Come)",
    rules: "",
    edge: 0.0,
    handsPerHour: 48,
    description:
      "The only bet in the casino with zero house edge. Paid at true odds. Available after a point is established, placed behind your pass/come bet.",
    tip: "Always take maximum odds. This is free money in the sense that the casino has no mathematical advantage. The more you bet on odds vs the line, the lower your effective edge.",
    source: "Dice combinatorics (exact — true odds payout)",
  },
  {
    id: "craps-place-6",
    game: "CRAPS",
    bet: "Place 6 or 8",
    rules: "",
    edge: 0.0152,
    handsPerHour: 48,
    description:
      "Bet that a 6 (or 8) will roll before a 7. Pays 7:6, so always bet in multiples of $6.",
    tip: "The only place bet worth making. Place 6 and Place 8 have a reasonable 1.52% edge. All other place bets are significantly worse.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-place-5",
    game: "CRAPS",
    bet: "Place 5 or 9",
    rules: "",
    edge: 0.04,
    handsPerHour: 48,
    description:
      "Bet that a 5 (or 9) will roll before a 7. Pays 7:5.",
    tip: "At 4% edge, this is marginal. Place 6/8 is significantly better. Use come bets with odds to cover 5 and 9 instead.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-place-4",
    game: "CRAPS",
    bet: "Place 4 or 10",
    rules: "",
    edge: 0.0667,
    handsPerHour: 48,
    description:
      "Bet that a 4 (or 10) will roll before a 7. Pays 9:5.",
    tip: "Bad bet. Buy the 4 or 10 instead (5% vig) for a lower edge, or better yet, use come bets with odds.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-field",
    game: "CRAPS",
    bet: "Field",
    rules: "2x on 2, 2x on 12",
    edge: 0.0556,
    handsPerHour: 48,
    description:
      "One-roll bet that wins on 2, 3, 4, 9, 10, 11, or 12. Pays even money except 2 and 12 pay double.",
    tip: "Some casinos pay 3x on the 12 (or 2), which drops the edge to 2.78%. Check the felt before betting.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-field-3x",
    game: "CRAPS",
    bet: "Field",
    rules: "2x on 2, 3x on 12",
    edge: 0.0278,
    handsPerHour: 48,
    description:
      "Field bet at a table that pays triple on the 12 (or 2). This significantly improves the odds.",
    tip: "At 2.78%, the triple field is a decent one-roll bet. Still not as good as pass/come with odds, but acceptable for action.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-hard-6-8",
    game: "CRAPS",
    bet: "Hard 6 / Hard 8",
    rules: "",
    edge: 0.0909,
    handsPerHour: 48,
    description:
      "Bet that a 6 (or 8) will be rolled as a pair (3-3 or 4-4) before a 7 or any other way of making that number.",
    tip: "Sucker bet. The 9.09% edge means you're paying $6.82/hr per $25 bet just on this one wager. Skip it.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-hard-4-10",
    game: "CRAPS",
    bet: "Hard 4 / Hard 10",
    rules: "",
    edge: 0.1111,
    handsPerHour: 48,
    description:
      "Bet that a 4 (or 10) will be rolled as a pair (2-2 or 5-5) before a 7 or any other way.",
    tip: "Even worse than hard 6/8. At 11.11% edge, this is one of the worst bets on the table.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-any-7",
    game: "CRAPS",
    bet: "Any 7",
    rules: "",
    edge: 0.1667,
    handsPerHour: 48,
    description:
      "One-roll bet that the next roll will be a 7. Pays 4:1.",
    tip: "The worst bet on the craps table. 16.67% house edge. Never make this bet.",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "craps-any-craps",
    game: "CRAPS",
    bet: "Any Craps",
    rules: "",
    edge: 0.1111,
    handsPerHour: 48,
    description:
      "One-roll bet that the next roll will be 2, 3, or 12. Pays 7:1.",
    tip: "11.11% edge. Sometimes used as 'insurance' on a come-out roll, but mathematically it always costs you.",
    source: "Dice combinatorics (exact)",
  },

  // --- ROULETTE ---
  {
    id: "roulette-single-zero",
    game: "ROULETTE",
    bet: "Any Bet",
    rules: "Single zero (European)",
    edge: 0.027,
    handsPerHour: 35,
    description:
      "European roulette with one zero. All bets (straight, split, street, corner, etc.) have the same 2.70% edge.",
    tip: "Always choose single zero over double zero if available. It cuts the house edge nearly in half.",
    source: "Mathematical — 1/37 for single zero",
  },
  {
    id: "roulette-double-zero",
    game: "ROULETTE",
    bet: "Any Bet",
    rules: "Double zero (American)",
    edge: 0.0526,
    handsPerHour: 35,
    description:
      "American roulette with 0 and 00. All bets have 5.26% edge except the five-number bet (0-00-1-2-3) which is worse.",
    tip: "If only double-zero tables are available, consider playing craps or blackjack instead — much better odds.",
    source: "Mathematical — 2/38 for double zero",
  },
  {
    id: "roulette-five-number",
    game: "ROULETTE",
    bet: "Five Number (0-00-1-2-3)",
    rules: "Double zero only",
    edge: 0.0789,
    handsPerHour: 35,
    description:
      "The worst bet on the roulette table. Only available on double-zero wheels. Covers 0, 00, 1, 2, and 3.",
    tip: "Never make this bet. It's the only roulette bet with a higher edge than the standard 5.26%.",
    source: "Mathematical — 3/38",
  },
  {
    id: "roulette-triple-zero",
    game: "ROULETTE",
    bet: "Any Bet",
    rules: "Triple zero",
    edge: 0.0769,
    handsPerHour: 35,
    description:
      "Some casinos now have triple-zero (0, 00, 000) roulette wheels. The house edge is 7.69% on all bets.",
    tip: "Walk away. Triple-zero roulette is one of the worst games on the casino floor.",
    source: "Mathematical — 3/39",
  },

  // --- BACCARAT ---
  {
    id: "baccarat-banker",
    game: "BACCARAT",
    bet: "Banker",
    rules: "5% commission",
    edge: 0.0106,
    handsPerHour: 72,
    description:
      "Bet on the banker hand to win. Pays even money minus 5% commission on wins. The commission is what gives the casino its edge.",
    tip: "Banker is the best bet in baccarat. The 5% commission makes it feel worse than it is, but the math favors it.",
    source: "Combinatorial analysis (8-deck shoe)",
  },
  {
    id: "baccarat-player",
    game: "BACCARAT",
    bet: "Player",
    rules: "",
    edge: 0.0124,
    handsPerHour: 72,
    description:
      "Bet on the player hand to win. Pays even money, no commission.",
    tip: "Slightly worse than banker but no commission makes it simpler. Both are excellent bets.",
    source: "Combinatorial analysis (8-deck shoe)",
  },
  {
    id: "baccarat-tie",
    game: "BACCARAT",
    bet: "Tie",
    rules: "",
    edge: 0.1436,
    handsPerHour: 72,
    description:
      "Bet that the banker and player hands will tie. Pays 8:1 (or 9:1 at some casinos).",
    tip: "Classic sucker bet. At 14.36% edge, the tie bet is one of the worst wagers in the casino despite the tempting 8:1 payout.",
    source: "Combinatorial analysis (8-deck shoe, 8:1 payout)",
  },

  // --- SLOTS (ranges from Nevada Gaming Control Board) ---
  {
    id: "slots-penny",
    game: "SLOTS",
    bet: "Penny Slots",
    rules: "$0.01 denomination",
    edge: 0.12,
    handsPerHour: 600,
    description:
      "Penny slots typically return 85-92% (8-15% house edge). The low denomination allows casinos to keep a higher percentage. Nevada average is approximately 88%.",
    tip: "Penny slots have the worst RTP of any denomination. The low per-spin cost is deceptive — at 600 spins/hr, the hourly cost adds up fast.",
    source: "Nevada Gaming Control Board — statewide penny slot avg ~88% RTP",
  },
  {
    id: "slots-nickel",
    game: "SLOTS",
    bet: "Nickel Slots",
    rules: "$0.05 denomination",
    edge: 0.08,
    handsPerHour: 600,
    description:
      "Nickel slots return around 90-93%. Better than penny slots but still on the lower end.",
    tip: "A step up from pennies, but consider going to quarter or dollar machines for meaningfully better returns.",
    source: "Nevada Gaming Control Board — nickel slot avg ~92% RTP",
  },
  {
    id: "slots-quarter",
    game: "SLOTS",
    bet: "Quarter Slots",
    rules: "$0.25 denomination",
    edge: 0.055,
    handsPerHour: 600,
    description:
      "Quarter slots return around 93-95%. A solid middle ground between cost per spin and return percentage.",
    tip: "Quarter machines are a reasonable compromise if dollar machines are too rich for your bankroll.",
    source: "Nevada Gaming Control Board — quarter slot avg ~94.5% RTP",
  },
  {
    id: "slots-dollar",
    game: "SLOTS",
    bet: "Dollar Slots",
    rules: "$1.00 denomination",
    edge: 0.04,
    handsPerHour: 600,
    description:
      "Dollar slots return around 95-97%. Significantly better than penny or nickel machines.",
    tip: "Best widely-available slot denomination. If your bankroll can handle it, dollar machines give you the best return.",
    source: "Nevada Gaming Control Board — dollar slot avg ~96% RTP",
  },
  {
    id: "slots-five-dollar",
    game: "SLOTS",
    bet: "$5 Slots",
    rules: "$5.00 denomination",
    edge: 0.025,
    handsPerHour: 600,
    description:
      "High-denomination slots return around 97-98%. Best RTP available but requires a larger bankroll.",
    tip: "If you have the bankroll, $5 machines offer the best slot odds. But the higher bet per spin means faster bankroll swings.",
    source: "Nevada Gaming Control Board — $5+ slot avg ~97.5% RTP",
  },

  // --- VIDEO POKER ---
  {
    id: "vp-jacks-9-6",
    game: "VIDEO POKER",
    bet: "Jacks or Better",
    rules: "9/6 full pay",
    edge: 0.0046,
    handsPerHour: 400,
    description:
      "Full-pay Jacks or Better (9 credits for full house, 6 for flush) with optimal strategy. One of the best games in the casino.",
    tip: "9/6 machines are getting rare, especially on the Strip. Check the pay table before playing — 8/5 and 7/5 machines look the same but have much higher edges.",
    source: "Combinatorial analysis — 99.54% RTP with optimal play",
  },
  {
    id: "vp-jacks-8-5",
    game: "VIDEO POKER",
    bet: "Jacks or Better",
    rules: "8/5 short pay",
    edge: 0.0274,
    handsPerHour: 400,
    description:
      "Short-pay Jacks or Better. The reduced full house payout (8 vs 9) adds 2.28% to the house edge.",
    tip: "Always check the pay table. The full house payout is the key number — 9 is full pay, 8 or lower is short pay.",
    source: "Combinatorial analysis — 97.26% RTP with optimal play",
  },
  {
    id: "vp-deuces-wild-full",
    game: "VIDEO POKER",
    bet: "Deuces Wild",
    rules: "Full pay (NSUD)",
    edge: 0.0024,
    handsPerHour: 400,
    description:
      "Full-pay Deuces Wild returns 100.76% with perfect play — one of the few casino games with a positive expected value for the player.",
    tip: "This is the holy grail of video poker. Full-pay Deuces Wild machines actually favor the player. Extremely rare but worth seeking out.",
    source: "Combinatorial analysis — 100.76% RTP (player advantage)",
  },

  // --- OTHER ---
  {
    id: "big-six-1",
    game: "OTHER",
    bet: "Big Six Wheel",
    rules: "$1 spot",
    edge: 0.1111,
    handsPerHour: 20,
    description:
      "The Big Six wheel (or Wheel of Fortune) is a carnival-style game. The $1 spot pays even money.",
    tip: "One of the worst games in the casino. The Big Six wheel exists because it looks fun and requires no skill. Walk past it.",
    source: "Mathematical — exact based on wheel layout",
  },
  {
    id: "big-six-20",
    game: "OTHER",
    bet: "Big Six Wheel",
    rules: "$20 spot",
    edge: 0.2222,
    handsPerHour: 20,
    description:
      "The $20 spot on the Big Six wheel has a 22.22% house edge — one of the worst bets in any casino.",
    tip: "At 22.22% edge, you lose $1 of every $4.50 wagered. There is no strategic way to play this game.",
    source: "Mathematical — exact based on wheel layout",
  },
];

// Helper to get rating (1-5 stars) from edge
export function edgeToRating(edge: number): 1 | 2 | 3 | 4 | 5 {
  const pct = edge * 100;
  if (pct <= 0.5) return 5;
  if (pct <= 1.5) return 4;
  if (pct <= 3) return 3;
  if (pct <= 6) return 2;
  return 1;
}

// Helper to get text verdict
export function edgeToVerdict(edge: number): string {
  const pct = edge * 100;
  if (pct === 0) return "ALWAYS";
  if (pct <= 0.5) return "GREAT";
  if (pct <= 1.5) return "GOOD";
  if (pct <= 3) return "OK";
  if (pct <= 5) return "MEH";
  if (pct <= 10) return "BAD";
  if (pct <= 15) return "SUCKER";
  return "WORST";
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/house-edges.ts
git commit -m "feat: add house edge database with sourced data for all casino bets"
```

---

## Task 4: Data — Slot Math & Calculations

**Files:**
- Create: `src/data/slot-math.ts`
- Create: `src/lib/calculations.ts`

- [ ] **Step 1: Create slot math data**

Create `src/data/slot-math.ts`:

```ts
export interface DenominationData {
  denomination: number;
  label: string;
  avgRtp: number; // decimal, e.g., 0.88
  rtpRange: [number, number]; // e.g., [0.85, 0.92]
  volatility: "low" | "medium" | "high";
  source: string;
}

// RTP data sourced from Nevada Gaming Control Board monthly reports
// Values are statewide averages — individual machines vary
export const DENOMINATION_DATA: DenominationData[] = [
  {
    denomination: 0.01,
    label: "$0.01",
    avgRtp: 0.88,
    rtpRange: [0.85, 0.92],
    volatility: "high",
    source: "Nevada Gaming Control Board — penny slot statewide avg",
  },
  {
    denomination: 0.05,
    label: "$0.05",
    avgRtp: 0.92,
    rtpRange: [0.9, 0.93],
    volatility: "medium",
    source: "Nevada Gaming Control Board — nickel slot statewide avg",
  },
  {
    denomination: 0.25,
    label: "$0.25",
    avgRtp: 0.945,
    rtpRange: [0.93, 0.95],
    volatility: "medium",
    source: "Nevada Gaming Control Board — quarter slot statewide avg",
  },
  {
    denomination: 1.0,
    label: "$1.00",
    avgRtp: 0.96,
    rtpRange: [0.95, 0.97],
    volatility: "medium",
    source: "Nevada Gaming Control Board — dollar slot statewide avg",
  },
  {
    denomination: 5.0,
    label: "$5.00",
    avgRtp: 0.975,
    rtpRange: [0.97, 0.98],
    volatility: "low",
    source: "Nevada Gaming Control Board — $5+ slot statewide avg",
  },
];

export const DEFAULT_SPINS_PER_HOUR = 600;
export const SPINS_PER_HOUR_NOTE =
  "Based on ~10 spins/minute average play speed. Actual speed varies by player.";

export const COMP_RATE_RANGE: [number, number] = [0.001, 0.003];
export const COMP_RATE_NOTE =
  "Slot comp rates typically range 0.1%-0.3% of coin-in. Actual rates vary by casino, tier status, and property.";
```

- [ ] **Step 2: Create calculations library**

Create `src/lib/calculations.ts`:

```ts
import { DenominationData, COMP_RATE_RANGE } from "@/data/slot-math";

export type SlotGoal = "playtime" | "bighit" | "comps";

/**
 * Calculate expected value per hour.
 * @param betSize - dollars per bet
 * @param edge - house edge as decimal (e.g., 0.05 for 5%)
 * @param handsPerHour - bets per hour
 */
export function evPerHour(
  betSize: number,
  edge: number,
  handsPerHour: number
): number {
  return -(betSize * edge * handsPerHour);
}

/**
 * Calculate total amount wagered in a session.
 */
export function totalWagered(
  betSize: number,
  spinsPerHour: number,
  hours: number
): number {
  return betSize * spinsPerHour * hours;
}

/**
 * Calculate expected loss for a session.
 */
export function expectedLoss(totalWagered: number, edge: number): number {
  return totalWagered * edge;
}

/**
 * Estimate bust probability using a simplified normal approximation.
 * For slots, we use a standard deviation multiplier based on volatility.
 *
 * This is an approximation — actual bust probability depends on the specific
 * game's paytable and variance, which we don't have per-machine.
 */
export function bustProbability(
  bankroll: number,
  betSize: number,
  spinsPerHour: number,
  hours: number,
  rtp: number
): number {
  const totalSpins = spinsPerHour * hours;
  const expectedReturn = betSize * totalSpins * rtp;
  const expectedBankroll = bankroll - betSize * totalSpins + expectedReturn;

  // Standard deviation for slots is roughly 5-15x bet per spin
  // We use 8x as a reasonable middle estimate
  const sdPerSpin = betSize * 8;
  const sdTotal = sdPerSpin * Math.sqrt(totalSpins);

  if (sdTotal === 0) return 0;

  // Probability that bankroll hits 0 at any point during play
  // Using simplified Gambler's Ruin approximation
  const z = bankroll / sdTotal;
  // Normal CDF approximation
  const p = 1 - normalCdf(z);
  return Math.min(Math.max(p, 0), 1);
}

/**
 * Normal CDF approximation (Abramowitz and Stegun)
 */
function normalCdf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Estimate comp value range for a session.
 */
export function compValueRange(totalWagered: number): [number, number] {
  return [
    totalWagered * COMP_RATE_RANGE[0],
    totalWagered * COMP_RATE_RANGE[1],
  ];
}

/**
 * Determine the recommended denomination for a given goal.
 */
export function recommendDenomination(
  bankroll: number,
  hours: number,
  goal: SlotGoal,
  denominations: DenominationData[],
  spinsPerHour: number
): DenominationData {
  // Filter out denominations where min bet > bankroll / 100
  // (need at least 100 spins worth of bankroll)
  const viable = denominations.filter(
    (d) => d.denomination * 3 <= bankroll / 100
  );

  if (viable.length === 0) return denominations[0];

  switch (goal) {
    case "playtime":
      // Lowest variance + lowest bet = most play time
      // Favor lower denominations for survival
      return viable[0];

    case "bighit":
      // Highest denomination the bankroll can support
      // Higher denom = better RTP + higher top-pay relative to bet
      return viable[viable.length - 1];

    case "comps":
      // Maximize total coin-in
      // Higher bet = more coin-in = more comp value
      // But must survive the session, so pick highest viable
      return viable[viable.length - 1];

    default:
      return viable[Math.floor(viable.length / 2)];
  }
}

/**
 * Determine the "not this" denomination for contrast.
 * For "bighit" and "comps" goals, show the lowest denomination.
 * For "playtime" goal, show the highest denomination.
 */
export function antiRecommendation(
  goal: SlotGoal,
  denominations: DenominationData[]
): DenominationData {
  switch (goal) {
    case "playtime":
      return denominations[denominations.length - 1];
    case "bighit":
    case "comps":
      return denominations[0];
    default:
      return denominations[0];
  }
}

/**
 * Get the default credits per spin for a denomination.
 * Most modern slots default to 3 credits.
 */
export function defaultBetSize(denomination: number): number {
  return denomination * 3;
}

/**
 * Get explanation text for why a recommendation was made.
 */
export function recommendationReason(
  goal: SlotGoal,
  recommended: DenominationData,
  antiRec: DenominationData
): string {
  const recRtpPct = (recommended.avgRtp * 100).toFixed(0);
  const antiRtpPct = (antiRec.avgRtp * 100).toFixed(0);

  switch (goal) {
    case "bighit":
      return `Higher denomination = higher RTP. A ${recommended.label} slot typically returns ${recRtpPct}% vs ${antiRtpPct}% for ${antiRec.label} slots. Same bet amount, but the ${recommended.label} machine keeps less per spin. Higher denomination machines also have higher top-pay frequency relative to bet size.`;
    case "playtime":
      return `Lower denomination at minimum bet gives you the most spins per dollar. Even though ${antiRec.label} machines have better RTP (${antiRtpPct}% vs ${recRtpPct}%), the higher bet per spin burns through your bankroll faster.`;
    case "comps":
      return `Higher denomination = higher coin-in = more comp value. A ${recommended.label} machine at 3 credits generates more total action than ${antiRec.label} machines, which means more theoretical loss for the casino to comp back to you.`;
    default:
      return "";
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/slot-math.ts src/lib/calculations.ts
git commit -m "feat: add slot math data and calculation library"
```

---

## Task 5: Data — Blackjack Strategy & Engine

**Files:**
- Create: `src/data/blackjack-strategy.ts`
- Create: `src/lib/blackjack-engine.ts`

- [ ] **Step 1: Create blackjack strategy data**

Create `src/data/blackjack-strategy.ts`:

```ts
export interface RuleSet {
  payout: "3:2" | "6:5";
  dealerHitsSoft17: boolean;
  decks: 1 | 2 | 6 | 8;
  doubleAfterSplit: boolean;
  surrender: "none" | "late";
}

// Action codes
export type Action = "H" | "S" | "D" | "Ds" | "P" | "Rh" | "Rs" | "Rp";
// H = Hit, S = Stand, D = Double (hit if not allowed)
// P = Split, Rh = Surrender (hit if not allowed)
// Rs = Surrender (stand if not allowed), Rp = Surrender (split if not allowed)

export const ACTION_LABELS: Record<Action, string> = {
  H: "Hit",
  S: "Stand",
  D: "Double",
  Ds: "Double/Stand",
  P: "Split",
  Rh: "Surrender/Hit",
  Rs: "Surrender/Stand",
  Rp: "Surrender/Split",
};

export const ACTION_COLORS: Record<Action, string> = {
  H: "text-ck-bad",
  S: "text-ck-good",
  D: "text-blue-400",
  Ds: "text-blue-400",
  P: "text-purple-400",
  Rh: "text-gray-400",
  Rs: "text-gray-400",
  Rp: "text-gray-400",
};

// Dealer upcards: 2-9, 10 (T), A
export const DEALER_CARDS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "A"];

/**
 * Strategy charts for the most common rule set:
 * 6-deck, S17, DAS, no surrender, 3:2
 *
 * Charts are indexed as: chart[playerRow][dealerColIndex]
 * Dealer columns: 2,3,4,5,6,7,8,9,T,A
 *
 * Source: Published basic strategy tables from combinatorial analysis.
 * These will need to be verified and potentially adjusted for other rule sets.
 */

// Hard totals: rows are player totals 5-21
// Index 0 = hard 5, index 1 = hard 6, ..., index 16 = hard 21
export const HARD_CHART_6D_S17_DAS: Action[][] = [
  // Hard 5:  2    3    4    5    6    7    8    9    T    A
  /*  5 */ ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
  /*  6 */ ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
  /*  7 */ ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
  /*  8 */ ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
  /*  9 */ ["H", "D", "D", "D", "D", "H", "H", "H", "H", "H"],
  /* 10 */ ["D", "D", "D", "D", "D", "D", "D", "D", "H", "H"],
  /* 11 */ ["D", "D", "D", "D", "D", "D", "D", "D", "D", "D"],
  /* 12 */ ["H", "H", "S", "S", "S", "H", "H", "H", "H", "H"],
  /* 13 */ ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
  /* 14 */ ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
  /* 15 */ ["S", "S", "S", "S", "S", "H", "H", "H", "Rh", "Rh"],
  /* 16 */ ["S", "S", "S", "S", "S", "H", "H", "Rh", "Rh", "Rh"],
  /* 17 */ ["S", "S", "S", "S", "S", "S", "S", "S", "S", "Rs"],
  /* 18 */ ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
  /* 19 */ ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
  /* 20 */ ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
  /* 21 */ ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
];

// Soft totals: rows are A+2 through A+9 (soft 13 through soft 20)
export const SOFT_CHART_6D_S17_DAS: Action[][] = [
  // Soft:   2    3    4    5    6    7    8    9    T    A
  /* A,2 */ ["H", "H", "H", "D", "D", "H", "H", "H", "H", "H"],
  /* A,3 */ ["H", "H", "H", "D", "D", "H", "H", "H", "H", "H"],
  /* A,4 */ ["H", "H", "D", "D", "D", "H", "H", "H", "H", "H"],
  /* A,5 */ ["H", "H", "D", "D", "D", "H", "H", "H", "H", "H"],
  /* A,6 */ ["H", "D", "D", "D", "D", "H", "H", "H", "H", "H"],
  /* A,7 */ ["Ds","Ds","Ds","Ds","Ds","S", "S", "H", "H", "H"],
  /* A,8 */ ["S", "S", "S", "S", "D", "S", "S", "S", "S", "S"],
  /* A,9 */ ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
] as Action[][];
// Note: "Ds" in A,7 = Double if allowed, otherwise Stand. We'll handle this
// by mapping Ds -> D in code when double is available, S otherwise.

// Pairs: rows are 2,2 through A,A
export const PAIRS_CHART_6D_S17_DAS: Action[][] = [
  // Pair:   2    3    4    5    6    7    8    9    T    A
  /* 2,2 */ ["P", "P", "P", "P", "P", "P", "H", "H", "H", "H"],
  /* 3,3 */ ["P", "P", "P", "P", "P", "P", "H", "H", "H", "H"],
  /* 4,4 */ ["H", "H", "H", "P", "P", "H", "H", "H", "H", "H"],
  /* 5,5 */ ["D", "D", "D", "D", "D", "D", "D", "D", "H", "H"],
  /* 6,6 */ ["P", "P", "P", "P", "P", "H", "H", "H", "H", "H"],
  /* 7,7 */ ["P", "P", "P", "P", "P", "P", "H", "H", "H", "H"],
  /* 8,8 */ ["P", "P", "P", "P", "P", "P", "P", "P", "P", "Rp"],
  /* 9,9 */ ["P", "P", "P", "P", "P", "S", "P", "P", "S", "S"],
  /* T,T */ ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
  /* A,A */ ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
];

/**
 * Look up the correct action for a given hand.
 */
export function getCorrectAction(
  playerTotal: number,
  isSoft: boolean,
  isPair: boolean,
  pairValue: number | null,
  dealerUpcard: string,
  rules: RuleSet
): Action {
  const dealerIdx = DEALER_CARDS.indexOf(dealerUpcard);
  if (dealerIdx === -1) return "S";

  // For MVP, we use the 6D S17 DAS charts as the base
  // and make adjustments for other rule sets
  // Full rule-specific charts would be added in a future update

  let action: Action;

  if (isPair && pairValue !== null) {
    const pairIdx = pairValue === 1 ? 9 : pairValue - 2;
    if (pairIdx >= 0 && pairIdx < PAIRS_CHART_6D_S17_DAS.length) {
      action = PAIRS_CHART_6D_S17_DAS[pairIdx][dealerIdx];
    } else {
      action = "H";
    }
  } else if (isSoft) {
    // Soft total: A+X where X is the non-ace card value
    // soft 13 (A+2) = index 0, soft 20 (A+9) = index 7
    const softIdx = playerTotal - 13;
    if (softIdx >= 0 && softIdx < SOFT_CHART_6D_S17_DAS.length) {
      action = SOFT_CHART_6D_S17_DAS[softIdx][dealerIdx];
    } else {
      action = playerTotal >= 19 ? "S" : "H";
    }
  } else {
    // Hard total
    const hardIdx = playerTotal - 5;
    if (hardIdx >= 0 && hardIdx < HARD_CHART_6D_S17_DAS.length) {
      action = HARD_CHART_6D_S17_DAS[hardIdx][dealerIdx];
    } else if (playerTotal <= 4) {
      action = "H";
    } else {
      action = "S";
    }
  }

  // Handle surrender: if surrender not allowed, fall back
  if (rules.surrender === "none") {
    if (action === "Rh") return "H";
    if (action === "Rs") return "S";
    if (action === "Rp") return "P";
  }

  return action;
}

/**
 * Get a plain-English explanation for why an action is correct.
 */
export function getActionExplanation(
  playerTotal: number,
  isSoft: boolean,
  dealerUpcard: string,
  correctAction: Action,
  chosenAction: Action
): string {
  // These are common scenarios with explanations
  // A more complete set would be sourced from published strategy guides

  if (correctAction === chosenAction) {
    return "Correct! That's the optimal play.";
  }

  if (!isSoft && playerTotal >= 12 && playerTotal <= 16) {
    const dealerVal =
      dealerUpcard === "A" ? 11 : dealerUpcard === "T" ? 10 : parseInt(dealerUpcard);
    if (dealerVal >= 7 && correctAction === "H") {
      return `With ${playerTotal} vs dealer ${dealerUpcard}, the dealer is likely to make a strong hand. Hitting risks busting, but standing almost certainly loses. Hitting is the less-bad option.`;
    }
    if (dealerVal <= 6 && correctAction === "S") {
      return `With ${playerTotal} vs dealer ${dealerUpcard}, the dealer must hit and has a good chance of busting. Standing lets the dealer make the mistake.`;
    }
  }

  if (correctAction === "D") {
    return `Doubling is correct because you have a strong position against the dealer's ${dealerUpcard}. You get exactly one more card, but the expected value of doubling your bet here outweighs the risk.`;
  }

  if (correctAction === "P") {
    return `Splitting is correct because playing two hands from this position gives you a better expected value than playing one hand.`;
  }

  if (correctAction === "Rh" || correctAction === "Rs") {
    return `Surrender is correct here — giving up half your bet is better than playing out a hand you'll lose more than 50% of the time against dealer ${dealerUpcard}.`;
  }

  return `The correct play is ${ACTION_LABELS[correctAction]}. This has a higher expected value than ${ACTION_LABELS[chosenAction]} in this situation.`;
}
```

- [ ] **Step 2: Create blackjack engine**

Create `src/lib/blackjack-engine.ts`:

```ts
export interface Card {
  rank: string; // "2"-"9", "T", "J", "Q", "K", "A"
  suit: "♠" | "♥" | "♦" | "♣";
  value: number; // 2-11 (Ace = 11)
}

export interface Hand {
  cards: Card[];
  total: number;
  isSoft: boolean;
  isBust: boolean;
  isPair: boolean;
  pairValue: number | null; // value of the pair card (for strategy lookup)
}

const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const SUITS: Card["suit"][] = ["♠", "♥", "♦", "♣"];

function rankToValue(rank: string): number {
  if (rank === "A") return 11;
  if (["T", "J", "Q", "K"].includes(rank)) return 10;
  return parseInt(rank);
}

/**
 * Create a shuffled deck (or shoe).
 */
export function createShoe(numDecks: number): Card[] {
  const cards: Card[] = [];
  for (let d = 0; d < numDecks; d++) {
    for (const rank of RANKS) {
      for (const suit of SUITS) {
        cards.push({ rank, suit, value: rankToValue(rank) });
      }
    }
  }
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/**
 * Evaluate a hand: calculate total, soft status, bust status.
 */
export function evaluateHand(cards: Card[]): Hand {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    total += card.value;
    if (card.rank === "A") aces++;
  }

  // Reduce aces from 11 to 1 as needed
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  const isSoft = aces > 0 && total <= 21;
  const isBust = total > 21;

  // Check for pair (only on initial 2-card hand)
  let isPair = false;
  let pairValue: number | null = null;
  if (cards.length === 2) {
    const v1 = cards[0].rank === "A" ? 1 : rankToValue(cards[0].rank);
    const v2 = cards[1].rank === "A" ? 1 : rankToValue(cards[1].rank);
    if (v1 === v2) {
      isPair = true;
      pairValue = v1;
    }
  }

  return { cards, total, isSoft, isBust, isPair, pairValue };
}

/**
 * Deal a new hand for the trainer.
 * Returns dealer upcard + hole card, and player's 2-card hand.
 */
export function dealHand(shoe: Card[]): {
  dealerCards: Card[];
  playerCards: Card[];
  remainingShoe: Card[];
} {
  if (shoe.length < 10) {
    // Reshuffle if shoe is low
    shoe = createShoe(6);
  }

  const remaining = [...shoe];
  const playerCards = [remaining.pop()!, remaining.pop()!];
  const dealerCards = [remaining.pop()!, remaining.pop()!];

  return {
    dealerCards,
    playerCards,
    remainingShoe: remaining,
  };
}

/**
 * Get the display string for a card's upcard (for strategy lookup).
 * Face cards map to "T", Ace to "A".
 */
export function cardToStrategyKey(card: Card): string {
  if (["T", "J", "Q", "K"].includes(card.rank)) return "T";
  return card.rank;
}

/**
 * Get display rank for a card (show J, Q, K instead of T).
 */
export function displayRank(card: Card): string {
  return card.rank === "T" ? "10" : card.rank;
}

/**
 * Check if a card is red (hearts or diamonds).
 */
export function isRedCard(card: Card): boolean {
  return card.suit === "♥" || card.suit === "♦";
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/blackjack-strategy.ts src/lib/blackjack-engine.ts
git commit -m "feat: add blackjack strategy charts and card engine"
```

---

## Task 6: Data — Craps Bets

**Files:**
- Create: `src/data/craps-bets.ts`

- [ ] **Step 1: Create craps bet data**

Create `src/data/craps-bets.ts`:

```ts
export interface CrapsBet {
  id: string;
  name: string;
  edge: number; // decimal
  payout: string; // e.g., "1:1", "7:6"
  description: string;
  howItWorks: string;
  tip: string;
  category: "line" | "odds" | "place" | "prop" | "field";
  source: string;
}

export interface CrapsStrategy {
  name: string;
  tier: "conservative" | "recommended" | "aggressive";
  bankrollRange: string;
  bets: string[];
  effectiveEdge: number; // combined effective edge
  description: string;
}

// All edges are exact — derived from dice combinatorics (36 possible outcomes)
export const CRAPS_BETS: CrapsBet[] = [
  {
    id: "odds",
    name: "Odds (behind Pass/Come)",
    edge: 0.0,
    payout: "True odds (varies by point)",
    description:
      "The only bet in the casino with zero house edge. Paid at true odds.",
    howItWorks:
      "After a point is established, you can place an additional bet behind your pass or come bet. This bet is paid at true odds: 2:1 on 4/10, 3:2 on 5/9, 6:5 on 6/8.",
    tip: "Always take maximum odds. Every dollar on odds at 0% edge dilutes the 1.41% edge on your line bet. With 3-4-5x odds, your effective edge drops to ~0.37%.",
    category: "odds",
    source: "Dice combinatorics (exact — true odds payout)",
  },
  {
    id: "dont-pass",
    name: "Don't Pass / Don't Come",
    edge: 0.0106,
    payout: "1:1",
    description:
      "Bet against the shooter. Slightly better edge than the pass line.",
    howItWorks:
      "Opposite of pass line. Wins on come-out 2 or 3, loses on 7 or 11, pushes on 12 (bar). After a point, wins if 7 rolls before the point.",
    tip: "Mathematically the best line bet. Some players avoid it because betting against the table feels antisocial, but the math doesn't care about feelings.",
    category: "line",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "pass",
    name: "Pass Line / Come",
    edge: 0.0141,
    payout: "1:1",
    description:
      "The fundamental craps bet. Bet with the shooter.",
    howItWorks:
      "Come-out roll: wins on 7 or 11, loses on 2, 3, or 12. Any other number (4, 5, 6, 8, 9, 10) becomes the point. Wins if the point rolls again before a 7.",
    tip: "The pass line is where most players start and it's a great bet. Always back it with odds to lower your effective edge.",
    category: "line",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "place-6",
    name: "Place 6 or 8",
    edge: 0.0152,
    payout: "7:6",
    description:
      "Bet that a 6 (or 8) will roll before a 7.",
    howItWorks:
      "A standing bet that wins when 6 (or 8) is rolled and loses when 7 is rolled. Pays 7:6, so always bet in multiples of $6.",
    tip: "The only place bet worth making. All other place bets (4, 5, 9, 10) have significantly higher edges.",
    category: "place",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "field-3x",
    name: "Field (triple on 12)",
    edge: 0.0278,
    payout: "1:1 (2x on 2, 3x on 12)",
    description:
      "One-roll bet. Wins on 2, 3, 4, 9, 10, 11, 12. Triple payout on 12 brings the edge down to 2.78%.",
    howItWorks:
      "Bet wins on the next roll if it's 2, 3, 4, 9, 10, 11, or 12. Even money on most, double on 2, triple on 12.",
    tip: "Check the felt — if the 12 pays 3x, the field is a decent one-roll bet at 2.78%. If it only pays 2x, the edge jumps to 5.56%.",
    category: "field",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "field-2x",
    name: "Field (double on 12)",
    edge: 0.0556,
    payout: "1:1 (2x on 2 and 12)",
    description:
      "Same field bet but with only double payout on 12. Significantly worse than the triple version.",
    howItWorks:
      "Same as triple field, but 12 only pays 2:1 instead of 3:1.",
    tip: "At 5.56%, this is not a good bet. Look for tables that pay triple on the 12, or skip the field entirely.",
    category: "field",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "place-5",
    name: "Place 5 or 9",
    edge: 0.04,
    payout: "7:5",
    description:
      "Bet that a 5 (or 9) will roll before a 7. Bet in multiples of $5.",
    howItWorks:
      "Standing bet. Wins when 5 (or 9) rolls, loses when 7 rolls. Pays 7:5.",
    tip: "At 4% edge, this is marginal. You're better off using come bets with odds to cover these numbers.",
    category: "place",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "place-4",
    name: "Place 4 or 10",
    edge: 0.0667,
    payout: "9:5",
    description:
      "Bet that a 4 (or 10) will roll before a 7. Bet in multiples of $5.",
    howItWorks:
      "Standing bet. Wins when 4 (or 10) rolls, loses when 7 rolls. Pays 9:5.",
    tip: "Bad bet at 6.67%. If you want action on 4 or 10, buy the number instead (5% commission) for a lower effective edge.",
    category: "place",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "hard-6-8",
    name: "Hard 6 / Hard 8",
    edge: 0.0909,
    payout: "9:1",
    description:
      "Bet that 6 (or 8) will be rolled as a pair (3-3 or 4-4) before a 7 or any other combination of that number.",
    howItWorks:
      "Wins only on the exact pair (3+3 for hard 6, 4+4 for hard 8). Loses on 7 or any 'easy' way (e.g., 2+4, 1+5 for 6).",
    tip: "Sucker bet. 9.09% edge means the casino keeps about $9 of every $100 you wager here.",
    category: "prop",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "hard-4-10",
    name: "Hard 4 / Hard 10",
    edge: 0.1111,
    payout: "7:1",
    description:
      "Bet that 4 (or 10) will be rolled as a pair (2-2 or 5-5) before a 7 or easy way.",
    howItWorks:
      "Wins only on 2+2 (hard 4) or 5+5 (hard 10). Loses on 7 or any other way to make the number.",
    tip: "Worse than hard 6/8. At 11.11% edge, avoid this bet entirely.",
    category: "prop",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "any-craps",
    name: "Any Craps (2, 3, or 12)",
    edge: 0.1111,
    payout: "7:1",
    description:
      "One-roll bet that the next roll will be 2, 3, or 12.",
    howItWorks:
      "Wins if next roll is 2, 3, or 12 (4 ways out of 36). Pays 7:1.",
    tip: "Sometimes pitched as 'insurance' for your come-out bet. It's not — it's an 11.11% tax on your superstition.",
    category: "prop",
    source: "Dice combinatorics (exact)",
  },
  {
    id: "any-7",
    name: "Any 7",
    edge: 0.1667,
    payout: "4:1",
    description:
      "One-roll bet that the next roll will be a 7. The worst bet on the table.",
    howItWorks:
      "Wins on any 7 (6 ways out of 36). Pays 4:1. True odds are 5:1.",
    tip: "The absolute worst bet on the craps table at 16.67%. Never make this bet under any circumstances.",
    category: "prop",
    source: "Dice combinatorics (exact)",
  },
];

export const CRAPS_STRATEGIES: CrapsStrategy[] = [
  {
    name: "CONSERVATIVE",
    tier: "conservative",
    bankrollRange: "$200–500",
    bets: ["Pass Line + 1x odds", "1 Come bet max", "Skip all props"],
    effectiveEdge: 0.0085,
    description:
      "Minimal exposure. One line bet backed with single odds, one come bet for extra action. Low hourly cost, long sessions.",
  },
  {
    name: "RECOMMENDED",
    tier: "recommended",
    bankrollRange: "$500–1500",
    bets: ["Pass Line + 2x odds", "2 Come bets + odds", "Skip all props"],
    effectiveEdge: 0.0061,
    description:
      "The sweet spot for most recreational players. Multiple points working with odds on each. Good action with a low effective edge.",
  },
  {
    name: "AGGRESSIVE",
    tier: "aggressive",
    bankrollRange: "$1500+",
    bets: [
      "Pass Line + 3-4-5x odds",
      "2 Come bets + max odds",
      "Place 6 & 8 only",
    ],
    effectiveEdge: 0.0037,
    description:
      "Maximum odds dilute the line bet edge as much as possible. Place 6 and 8 for additional action at a low 1.52% edge. Higher bankroll required due to variance.",
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/craps-bets.ts
git commit -m "feat: add craps bet data and strategy tiers"
```

---

## Task 7: House Edge Comparison Tool

**Files:**
- Create: `src/components/house-edge/HouseEdgeTable.tsx`
- Create: `src/app/house-edge/page.tsx`

- [ ] **Step 1: Create HouseEdgeTable component**

Create `src/components/house-edge/HouseEdgeTable.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import {
  HOUSE_EDGE_DATA,
  GAME_CATEGORIES,
  type GameCategory,
  type CasinoBet,
  edgeToRating,
} from "@/data/house-edges";
import FilterPills from "@/components/FilterPills";
import StarRating from "@/components/StarRating";
import EdgeBadge from "@/components/EdgeBadge";
import { evPerHour } from "@/lib/calculations";

type SortField = "edge" | "evPerHour" | "rating" | "game";
type SortDir = "asc" | "desc";

export default function HouseEdgeTable() {
  const [filter, setFilter] = useState<GameCategory>("ALL");
  const [avgBet, setAvgBet] = useState(25);
  const [sortField, setSortField] = useState<SortField>("edge");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data =
      filter === "ALL"
        ? HOUSE_EDGE_DATA
        : HOUSE_EDGE_DATA.filter((d) => d.game === filter);

    data = [...data].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "edge":
          cmp = a.edge - b.edge;
          break;
        case "evPerHour":
          cmp =
            evPerHour(avgBet, a.edge, a.handsPerHour) -
            evPerHour(avgBet, b.edge, b.handsPerHour);
          break;
        case "rating":
          cmp = edgeToRating(b.edge) - edgeToRating(a.edge);
          break;
        case "game":
          cmp = a.game.localeCompare(b.game);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [filter, sortField, sortDir, avgBet]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="bg-ck-bg">
      {/* Header */}
      <div className="border-b border-ck-border px-7 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-base font-bold text-ck-accent tracking-[3px]">
            HOUSE EDGE COMPARISON
          </h1>
          <span className="text-[11px] text-ck-text-dim">
            {filtered.length} BETS · {new Set(filtered.map((d) => d.game)).size}{" "}
            GAMES
          </span>
        </div>
        <FilterPills
          options={GAME_CATEGORIES as unknown as string[]}
          selected={filter}
          onChange={(v) => setFilter(v as GameCategory)}
        />
      </div>

      {/* Settings */}
      <div className="bg-ck-bg-secondary border-b border-ck-border-subtle px-7 py-3 flex gap-6 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ck-text-muted tracking-[1px]">
            AVG BET
          </span>
          <div className="flex items-center bg-ck-border-subtle px-2.5 py-0.5">
            <span className="text-ck-text-muted text-[13px]">$</span>
            <input
              type="number"
              min={1}
              max={10000}
              value={avgBet}
              onChange={(e) => setAvgBet(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-transparent text-ck-accent text-[13px] w-16 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ck-text-muted tracking-[1px]">
            SORT BY
          </span>
          <button
            onClick={() => toggleSort("edge")}
            className={`text-[13px] px-2.5 py-0.5 ${
              sortField === "edge"
                ? "bg-ck-accent text-ck-bg font-bold"
                : "bg-ck-border-subtle text-ck-text-secondary"
            }`}
          >
            EDGE{sortIndicator("edge")}
          </button>
          <button
            onClick={() => toggleSort("evPerHour")}
            className={`text-[13px] px-2.5 py-0.5 ${
              sortField === "evPerHour"
                ? "bg-ck-accent text-ck-bg font-bold"
                : "bg-ck-border-subtle text-ck-text-secondary"
            }`}
          >
            EV/HR{sortIndicator("evPerHour")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ck-border">
              <th className="text-left px-7 py-2.5 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                GAME
              </th>
              <th className="text-left px-2 py-2.5 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                BET / RULES
              </th>
              <th className="text-right px-2 py-2.5 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                EDGE
              </th>
              <th className="text-right px-2 py-2.5 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                EV/HR
              </th>
              <th className="text-right px-7 py-2.5 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                RATING
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bet) => (
              <BetRow
                key={bet.id}
                bet={bet}
                avgBet={avgBet}
                isExpanded={expandedId === bet.id}
                onToggle={() =>
                  setExpandedId(expandedId === bet.id ? null : bet.id)
                }
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-7 py-4 text-right">
        <span className="text-[10px] text-ck-text-faint">
          CLICK ANY ROW FOR DETAILS · ALL EDGES SOURCED & VERIFIED
        </span>
      </div>
    </div>
  );
}

function BetRow({
  bet,
  avgBet,
  isExpanded,
  onToggle,
}: {
  bet: CasinoBet;
  avgBet: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ev = evPerHour(avgBet, bet.edge, bet.handsPerHour);
  const rating = edgeToRating(bet.edge);

  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-b border-ck-bg-tertiary cursor-pointer hover:bg-ck-bg-tertiary transition-colors ${
          isExpanded ? "bg-[#1f1f1a]" : ""
        }`}
      >
        <td className="px-7 py-2.5 text-ck-text-secondary">{bet.game}</td>
        <td className="px-2 py-2.5 text-ck-text-primary">
          {bet.bet}
          {bet.rules && (
            <span className="text-ck-text-muted"> · {bet.rules}</span>
          )}
        </td>
        <td className="text-right px-2 py-2.5">
          <EdgeBadge edge={bet.edge} />
        </td>
        <td className="text-right px-2 py-2.5 text-ck-text-secondary">
          {ev === 0 ? "$0.00" : `−$${Math.abs(ev).toFixed(2)}`}
        </td>
        <td className="text-right px-7 py-2.5">
          <StarRating rating={rating} />
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className="p-0">
            <div className="mx-7 my-0 bg-ck-bg-tertiary border-l-[3px] border-ck-accent px-5 py-4">
              <div className="text-[11px] text-ck-accent tracking-[1px] mb-2">
                ▼ {bet.game} · {bet.bet}
                {bet.rules ? ` · ${bet.rules}` : ""}
              </div>
              <div className="text-xs text-ck-text-secondary leading-relaxed space-y-2">
                <p>{bet.description}</p>
                <p className="text-ck-text-secondary">
                  <span className="text-ck-text-muted">TIP:</span> {bet.tip}
                </p>
                <p className="text-[10px] text-ck-text-faint">
                  Source: {bet.source}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
```

- [ ] **Step 2: Create House Edge page**

Create `src/app/house-edge/page.tsx`:

```tsx
import type { Metadata } from "next";
import HouseEdgeTable from "@/components/house-edge/HouseEdgeTable";

export const metadata: Metadata = {
  title: "House Edge Comparison — Every Casino Bet Ranked",
  description:
    "Compare house edge for every casino bet: blackjack, craps, roulette, baccarat, slots, video poker. See what each bet actually costs you per hour.",
};

export default function HouseEdgePage() {
  return <HouseEdgeTable />;
}
```

- [ ] **Step 3: Verify the page renders**

```bash
cd /Users/brianfranklin/Documents/casiknow && npm run dev
```

Open http://localhost:3000/house-edge. Verify: filters work, sorting works, rows expand, EV/HR recalculates when bet amount changes, color coding is correct.

- [ ] **Step 4: Commit**

```bash
git add src/components/house-edge/ src/app/house-edge/
git commit -m "feat: add House Edge Comparison tool with filters, sorting, expandable rows"
```

---

## Task 8: Slot Math Optimizer Tool

**Files:**
- Create: `src/components/slots/SlotInputs.tsx`
- Create: `src/components/slots/SlotRecommendation.tsx`
- Create: `src/components/slots/SessionProjection.tsx`
- Create: `src/components/slots/CompValue.tsx`
- Create: `src/components/slots/DenomTable.tsx`
- Create: `src/app/slots/page.tsx`

- [ ] **Step 1: Create SlotInputs component**

Create `src/components/slots/SlotInputs.tsx`:

```tsx
"use client";

import { type SlotGoal } from "@/lib/calculations";

interface SlotInputsProps {
  bankroll: number;
  hours: number;
  goal: SlotGoal;
  onBankrollChange: (v: number) => void;
  onHoursChange: (v: number) => void;
  onGoalChange: (v: SlotGoal) => void;
}

const GOALS: { value: SlotGoal; label: string }[] = [
  { value: "playtime", label: "MAX PLAY TIME" },
  { value: "bighit", label: "BEST SHOT AT BIG HIT" },
  { value: "comps", label: "MAXIMIZE COMPS" },
];

export default function SlotInputs({
  bankroll,
  hours,
  goal,
  onBankrollChange,
  onHoursChange,
  onGoalChange,
}: SlotInputsProps) {
  return (
    <div className="bg-ck-bg-secondary border-b border-ck-border-subtle px-7 py-6">
      <div className="text-[10px] text-ck-text-muted tracking-[1px] mb-4">
        YOUR SESSION
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="text-[10px] text-ck-text-secondary mb-1.5">
            BANKROLL
          </div>
          <div className="flex items-center bg-ck-border-subtle px-3.5 py-2.5">
            <span className="text-ck-text-muted text-lg mr-1">$</span>
            <input
              type="number"
              min={100}
              max={10000}
              step={100}
              value={bankroll}
              onChange={(e) =>
                onBankrollChange(Math.max(100, parseInt(e.target.value) || 100))
              }
              className="bg-transparent text-ck-accent text-lg w-full outline-none"
            />
          </div>
        </div>
        <div>
          <div className="text-[10px] text-ck-text-secondary mb-1.5">
            TIME (HOURS)
          </div>
          <div className="bg-ck-border-subtle px-3.5 py-2.5">
            <input
              type="number"
              min={1}
              max={8}
              value={hours}
              onChange={(e) =>
                onHoursChange(
                  Math.min(8, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
              className="bg-transparent text-ck-accent text-lg w-full outline-none"
            />
          </div>
        </div>
        <div>
          <div className="text-[10px] text-ck-text-secondary mb-1.5">GOAL</div>
          <div className="flex flex-col gap-1">
            {GOALS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onGoalChange(value)}
                className={`text-left px-3 py-1.5 text-[11px] transition-colors ${
                  goal === value
                    ? "bg-ck-accent text-ck-bg font-bold"
                    : "bg-ck-border-subtle text-ck-text-secondary hover:text-ck-text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create SlotRecommendation component**

Create `src/components/slots/SlotRecommendation.tsx`:

```tsx
import { type DenominationData } from "@/data/slot-math";
import {
  type SlotGoal,
  defaultBetSize,
  recommendationReason,
} from "@/lib/calculations";

interface SlotRecommendationProps {
  recommended: DenominationData;
  antiRec: DenominationData;
  goal: SlotGoal;
}

export default function SlotRecommendation({
  recommended,
  antiRec,
  goal,
}: SlotRecommendationProps) {
  const recBet = defaultBetSize(recommended.denomination);
  const antiBet = defaultBetSize(antiRec.denomination);
  const reason = recommendationReason(goal, recommended, antiRec);

  return (
    <div className="px-7 py-6 border-b border-ck-border-subtle">
      <div className="text-[10px] text-ck-accent tracking-[1px] mb-4">
        ▶ RECOMMENDATION
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="border border-ck-border p-5">
          <div className="text-[10px] text-ck-text-muted tracking-[1px] mb-2">
            PLAY THIS
          </div>
          <div className="text-2xl text-ck-accent font-bold">
            {recommended.label} DENOM
          </div>
          <div className="text-sm text-ck-text-primary mt-1">
            ${recBet.toFixed(2)} / spin
          </div>
          <div className="text-[11px] text-ck-text-secondary mt-2">
            3 credits × {recommended.label}
          </div>
        </div>
        <div className="border border-ck-border p-5">
          <div className="text-[10px] text-ck-text-muted tracking-[1px] mb-2">
            NOT THIS
          </div>
          <div className="text-2xl text-ck-bad font-bold">
            {antiRec.label} DENOM
          </div>
          <div className="text-sm text-ck-text-primary mt-1">
            ${antiBet.toFixed(2)} / spin
          </div>
          <div className="text-[11px] text-ck-text-secondary mt-2">
            {Math.round(antiBet / antiRec.denomination)} credits × {antiRec.label}
          </div>
        </div>
      </div>

      <div className="bg-ck-bg-tertiary border-l-[3px] border-ck-accent px-5 py-4">
        <div className="text-[11px] text-ck-accent tracking-[1px] mb-2">
          WHY
        </div>
        <div className="text-xs text-ck-text-secondary leading-relaxed">
          {reason}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create SessionProjection component**

Create `src/components/slots/SessionProjection.tsx`:

```tsx
import { type DenominationData, DEFAULT_SPINS_PER_HOUR } from "@/data/slot-math";
import {
  defaultBetSize,
  totalWagered,
  expectedLoss,
  bustProbability,
} from "@/lib/calculations";

interface SessionProjectionProps {
  recommended: DenominationData;
  bankroll: number;
  hours: number;
}

export default function SessionProjection({
  recommended,
  bankroll,
  hours,
}: SessionProjectionProps) {
  const bet = defaultBetSize(recommended.denomination);
  const spins = DEFAULT_SPINS_PER_HOUR;
  const wagered = totalWagered(bet, spins, hours);
  const edge = 1 - recommended.avgRtp;
  const loss = expectedLoss(wagered, edge);
  const bust = bustProbability(bankroll, bet, spins, hours, recommended.avgRtp);

  return (
    <div className="px-7 py-6 border-b border-ck-border-subtle">
      <div className="text-[10px] text-ck-accent tracking-[1px] mb-4">
        SESSION PROJECTION
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="SPINS/HR" value={spins.toLocaleString()} />
        <StatBox
          label="TOTAL WAGERED"
          value={`$${wagered.toLocaleString()}`}
        />
        <StatBox
          label="EXPECTED LOSS"
          value={`−$${Math.round(loss).toLocaleString()}`}
          color="text-ck-bad"
        />
        <StatBox
          label="BUST RISK"
          value={`${Math.round(bust * 100)}%`}
          color={bust > 0.5 ? "text-ck-bad" : bust > 0.3 ? "text-ck-caution" : "text-ck-good"}
        />
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color = "text-ck-text-primary",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-ck-text-muted mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
```

- [ ] **Step 4: Create CompValue component**

Create `src/components/slots/CompValue.tsx`:

```tsx
import { type DenominationData, DEFAULT_SPINS_PER_HOUR, COMP_RATE_NOTE } from "@/data/slot-math";
import {
  defaultBetSize,
  totalWagered,
  expectedLoss,
  compValueRange,
} from "@/lib/calculations";

interface CompValueProps {
  recommended: DenominationData;
  bankroll: number;
  hours: number;
}

export default function CompValue({
  recommended,
  bankroll,
  hours,
}: CompValueProps) {
  const bet = defaultBetSize(recommended.denomination);
  const wagered = totalWagered(bet, DEFAULT_SPINS_PER_HOUR, hours);
  const edge = 1 - recommended.avgRtp;
  const loss = expectedLoss(wagered, edge);
  const [compLow, compHigh] = compValueRange(wagered);
  const netLow = loss - compHigh;
  const netHigh = loss - compLow;

  return (
    <div className="px-7 py-6 border-b border-ck-border-subtle">
      <div className="text-[10px] text-ck-accent tracking-[1px] mb-4">
        COMP VALUE
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-ck-bg-tertiary p-3.5 text-center">
          <div className="text-[10px] text-ck-text-muted mb-1">THEO LOSS</div>
          <div className="text-lg font-bold text-ck-text-primary">
            ${Math.round(loss).toLocaleString()}
          </div>
        </div>
        <div className="bg-ck-bg-tertiary p-3.5 text-center">
          <div className="text-[10px] text-ck-text-muted mb-1">
            EST. COMP BACK
          </div>
          <div className="text-lg font-bold text-ck-good">
            ${Math.round(compLow)}–{Math.round(compHigh)}
          </div>
          <div className="text-[10px] text-ck-text-secondary mt-0.5">
            0.1–0.3% OF COIN-IN
          </div>
        </div>
        <div className="bg-ck-bg-tertiary p-3.5 text-center">
          <div className="text-[10px] text-ck-text-muted mb-1">NET COST</div>
          <div className="text-lg font-bold text-ck-caution">
            ${Math.round(netLow)}–{Math.round(netHigh)}
          </div>
          <div className="text-[10px] text-ck-text-secondary mt-0.5">
            AFTER COMPS
          </div>
        </div>
      </div>
      <div className="text-[10px] text-ck-text-faint mt-3">
        {COMP_RATE_NOTE}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create DenomTable component**

Create `src/components/slots/DenomTable.tsx`:

```tsx
import {
  type DenominationData,
  DEFAULT_SPINS_PER_HOUR,
} from "@/data/slot-math";
import {
  defaultBetSize,
  totalWagered,
  expectedLoss,
  bustProbability,
} from "@/lib/calculations";
import EdgeBadge from "@/components/EdgeBadge";

interface DenomTableProps {
  denominations: DenominationData[];
  recommendedDenom: number;
  bankroll: number;
  hours: number;
}

export default function DenomTable({
  denominations,
  recommendedDenom,
  bankroll,
  hours,
}: DenomTableProps) {
  return (
    <div className="px-7 py-6">
      <div className="text-[10px] text-ck-accent tracking-[1px] mb-3">
        ALL OPTIONS COMPARED
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ck-border">
              <th className="text-left py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                DENOM
              </th>
              <th className="text-right py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                BET
              </th>
              <th className="text-right py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                RTP
              </th>
              <th className="text-right py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                EXP LOSS
              </th>
              <th className="text-right py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                BUST
              </th>
              <th className="text-right py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                BIG HIT
              </th>
            </tr>
          </thead>
          <tbody>
            {denominations.map((d) => {
              const bet = defaultBetSize(d.denomination);
              const edge = 1 - d.avgRtp;
              const wagered = totalWagered(bet, DEFAULT_SPINS_PER_HOUR, hours);
              const loss = expectedLoss(wagered, edge);
              const bust = bustProbability(
                bankroll,
                bet,
                DEFAULT_SPINS_PER_HOUR,
                hours,
                d.avgRtp
              );
              const isRec = d.denomination === recommendedDenom;
              const bigHit =
                d.avgRtp >= 0.96 ? "HIGH" : d.avgRtp >= 0.93 ? "MED" : "LOW";

              return (
                <tr
                  key={d.denomination}
                  className={`border-b border-ck-bg-tertiary ${
                    isRec ? "bg-[#1f1f1a]" : ""
                  }`}
                >
                  <td className={`py-2 ${isRec ? "text-ck-accent font-bold" : "text-ck-text-primary"}`}>
                    {d.label}
                    {isRec ? " ◀" : ""}
                  </td>
                  <td className="text-right py-2 text-ck-text-secondary">
                    ${bet.toFixed(2)}
                  </td>
                  <td className="text-right py-2">
                    <EdgeBadge edge={edge} format="percent" />
                  </td>
                  <td className="text-right py-2">
                    <span className={edge <= 0.04 ? "text-ck-good font-bold" : edge <= 0.06 ? "text-ck-caution" : "text-ck-bad"}>
                      −${Math.round(loss).toLocaleString()}
                    </span>
                  </td>
                  <td className="text-right py-2">
                    <span className={bust <= 0.4 ? "text-ck-good font-bold" : bust <= 0.6 ? "text-ck-caution" : "text-ck-bad"}>
                      {Math.round(bust * 100)}%
                    </span>
                  </td>
                  <td className="text-right py-2">
                    <span className={bigHit === "HIGH" ? "text-ck-good font-bold" : "text-ck-text-secondary"}>
                      {bigHit}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-[10px] text-ck-text-faint mt-3 text-right">
        RTP VALUES ARE NEVADA STATEWIDE AVERAGES · INDIVIDUAL MACHINES VARY
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create Slot Optimizer page**

Create `src/app/slots/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import {
  DENOMINATION_DATA,
  DEFAULT_SPINS_PER_HOUR,
} from "@/data/slot-math";
import {
  type SlotGoal,
  recommendDenomination,
  antiRecommendation,
} from "@/lib/calculations";
import SlotInputs from "@/components/slots/SlotInputs";
import SlotRecommendation from "@/components/slots/SlotRecommendation";
import SessionProjection from "@/components/slots/SessionProjection";
import CompValue from "@/components/slots/CompValue";
import DenomTable from "@/components/slots/DenomTable";

export default function SlotsPage() {
  const [bankroll, setBankroll] = useState(500);
  const [hours, setHours] = useState(4);
  const [goal, setGoal] = useState<SlotGoal>("bighit");

  const recommended = recommendDenomination(
    bankroll,
    hours,
    goal,
    DENOMINATION_DATA,
    DEFAULT_SPINS_PER_HOUR
  );
  const antiRec = antiRecommendation(goal, DENOMINATION_DATA);

  return (
    <div className="bg-ck-bg -mx-6 -mt-8">
      {/* Header */}
      <div className="border-b border-ck-border px-7 py-6">
        <h1 className="text-base font-bold text-ck-accent tracking-[3px]">
          SLOT OPTIMIZER
        </h1>
        <span className="text-[11px] text-ck-text-dim">FIND YOUR EDGE</span>
      </div>

      <SlotInputs
        bankroll={bankroll}
        hours={hours}
        goal={goal}
        onBankrollChange={setBankroll}
        onHoursChange={setHours}
        onGoalChange={setGoal}
      />
      <SlotRecommendation
        recommended={recommended}
        antiRec={antiRec}
        goal={goal}
      />
      <SessionProjection
        recommended={recommended}
        bankroll={bankroll}
        hours={hours}
      />
      <CompValue recommended={recommended} bankroll={bankroll} hours={hours} />
      <DenomTable
        denominations={DENOMINATION_DATA}
        recommendedDenom={recommended.denomination}
        bankroll={bankroll}
        hours={hours}
      />
    </div>
  );
}
```

Note: Since this is a client component with `useState`, we need to handle metadata separately. Add a `layout.tsx` for SEO:

Create `src/app/slots/layout.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slot Math Optimizer — Best Way to Play Slots",
  description:
    "Enter your bankroll and goals to find the optimal slot denomination and bet size. RTP data from Nevada Gaming Control Board.",
};

export default function SlotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 7: Verify the page renders**

```bash
cd /Users/brianfranklin/Documents/casiknow && npm run dev
```

Open http://localhost:3000/slots. Verify: inputs change recommendation, session projection updates, comp values calculate, denomination table highlights the recommended row.

- [ ] **Step 8: Commit**

```bash
git add src/components/slots/ src/app/slots/
git commit -m "feat: add Slot Math Optimizer with bankroll inputs, recommendations, projections"
```

---

## Task 9: Blackjack Strategy Trainer

**Files:**
- Create: `src/components/blackjack/RuleConfig.tsx`
- Create: `src/components/blackjack/PlayingCard.tsx`
- Create: `src/components/blackjack/DealArea.tsx`
- Create: `src/components/blackjack/Feedback.tsx`
- Create: `src/components/blackjack/SessionStats.tsx`
- Create: `src/components/blackjack/StrategyChart.tsx`
- Create: `src/app/blackjack/page.tsx`
- Create: `src/app/blackjack/layout.tsx`

This is the most complex tool. The key components are:

1. **PlayingCard** — Realistic card rendering (proper proportions, corner indices, suit colors, shadows)
2. **DealArea** — Green felt with dealer/player hands and action buttons
3. **StrategyChart** — Tabbed chart (hard/soft/pairs) with current hand highlighted

- [ ] **Step 1: Create PlayingCard component**

Create `src/components/blackjack/PlayingCard.tsx`:

```tsx
import { type Card, displayRank, isRedCard } from "@/lib/blackjack-engine";

interface PlayingCardProps {
  card: Card;
  faceDown?: boolean;
}

export default function PlayingCard({ card, faceDown = false }: PlayingCardProps) {
  if (faceDown) {
    return (
      <div className="w-16 h-[92px] rounded-md bg-gradient-to-br from-blue-900 to-blue-800 shadow-lg flex items-center justify-center border border-blue-700">
        <div className="w-10 h-14 border border-blue-600/30 rounded-sm" />
      </div>
    );
  }

  const color = isRedCard(card) ? "text-red-600" : "text-gray-900";
  const rank = displayRank(card);

  return (
    <div className="w-16 h-[92px] rounded-md bg-white shadow-lg flex flex-col justify-between p-1.5 border border-gray-200 relative">
      {/* Top-left index */}
      <div className={`${color} leading-none`}>
        <div className="text-sm font-bold">{rank}</div>
        <div className="text-xs -mt-0.5">{card.suit}</div>
      </div>

      {/* Center suit */}
      <div className={`${color} text-2xl text-center absolute inset-0 flex items-center justify-center`}>
        {card.suit}
      </div>

      {/* Bottom-right index (rotated) */}
      <div className={`${color} leading-none self-end rotate-180`}>
        <div className="text-sm font-bold">{rank}</div>
        <div className="text-xs -mt-0.5">{card.suit}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create RuleConfig component**

Create `src/components/blackjack/RuleConfig.tsx`:

```tsx
"use client";

import { type RuleSet } from "@/data/blackjack-strategy";

interface RuleConfigProps {
  rules: RuleSet;
  onChange: (rules: RuleSet) => void;
}

export default function RuleConfig({ rules, onChange }: RuleConfigProps) {
  const toggle = <K extends keyof RuleSet>(key: K, options: RuleSet[K][]) => (
    <div className="flex gap-1.5">
      {options.map((opt) => (
        <button
          key={String(opt)}
          onClick={() => onChange({ ...rules, [key]: opt })}
          className={`text-[11px] px-2.5 py-1 transition-colors ${
            rules[key] === opt
              ? "bg-ck-accent text-ck-bg font-bold"
              : "bg-ck-border-subtle text-ck-text-secondary"
          }`}
        >
          {String(opt).toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="border-b border-ck-border px-7 py-4">
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ck-text-muted">PAYOUT</span>
          {toggle("payout", ["3:2", "6:5"])}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ck-text-muted">DEALER</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onChange({ ...rules, dealerHitsSoft17: false })}
              className={`text-[11px] px-2.5 py-1 ${
                !rules.dealerHitsSoft17
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary"
              }`}
            >
              S17
            </button>
            <button
              onClick={() => onChange({ ...rules, dealerHitsSoft17: true })}
              className={`text-[11px] px-2.5 py-1 ${
                rules.dealerHitsSoft17
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary"
              }`}
            >
              H17
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ck-text-muted">DECKS</span>
          {toggle("decks", [1, 2, 6, 8])}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ck-text-muted">DAS</span>
          <button
            onClick={() =>
              onChange({ ...rules, doubleAfterSplit: !rules.doubleAfterSplit })
            }
            className={`text-[11px] px-2.5 py-1 ${
              rules.doubleAfterSplit
                ? "bg-ck-good text-ck-bg font-bold"
                : "bg-ck-border-subtle text-ck-text-secondary"
            }`}
          >
            {rules.doubleAfterSplit ? "ON" : "OFF"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ck-text-muted">SURRENDER</span>
          {toggle("surrender", ["none", "late"])}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Feedback component**

Create `src/components/blackjack/Feedback.tsx`:

```tsx
import { type Action, ACTION_LABELS } from "@/data/blackjack-strategy";

interface FeedbackProps {
  correct: boolean;
  chosenAction: Action;
  correctAction: Action;
  explanation: string;
}

export default function Feedback({
  correct,
  chosenAction,
  correctAction,
  explanation,
}: FeedbackProps) {
  if (correct) {
    return (
      <div className="px-7 py-4 bg-[#1a2a1a] border-l-[3px] border-ck-good">
        <div className="text-xs text-ck-good font-bold">
          ✓ CORRECT: {ACTION_LABELS[correctAction].toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <div className="px-7 py-4 bg-[#2a1a1a] border-l-[3px] border-ck-bad">
      <div className="text-xs text-ck-bad mb-1">
        ✗ YOU CHOSE: {ACTION_LABELS[chosenAction].toUpperCase()}
      </div>
      <div className="text-sm text-ck-good mb-2">
        CORRECT PLAY: {ACTION_LABELS[correctAction].toUpperCase()}
      </div>
      <div className="text-xs text-ck-text-secondary leading-relaxed">
        {explanation}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create SessionStats component**

Create `src/components/blackjack/SessionStats.tsx`:

```tsx
interface MissedHand {
  label: string;
  correct: number;
  total: number;
}

interface SessionStatsProps {
  hands: number;
  correct: number;
  streak: number;
  mostMissed: MissedHand[];
}

export default function SessionStats({
  hands,
  correct,
  streak,
  mostMissed,
}: SessionStatsProps) {
  const accuracy = hands > 0 ? Math.round((correct / hands) * 100) : 0;

  return (
    <div className="bg-ck-bg-secondary border-t border-ck-border-subtle px-7 py-5 flex justify-between items-start flex-wrap gap-4">
      <div className="flex gap-6">
        <div>
          <div className="text-[10px] text-ck-text-muted tracking-[1px]">
            HANDS
          </div>
          <div className="text-lg font-bold text-ck-text-primary">{hands}</div>
        </div>
        <div>
          <div className="text-[10px] text-ck-text-muted tracking-[1px]">
            ACCURACY
          </div>
          <div className={`text-lg font-bold ${accuracy >= 80 ? "text-ck-good" : accuracy >= 60 ? "text-ck-caution" : "text-ck-bad"}`}>
            {accuracy}%
          </div>
        </div>
        <div>
          <div className="text-[10px] text-ck-text-muted tracking-[1px]">
            STREAK
          </div>
          <div className="text-lg font-bold text-ck-accent">{streak}</div>
        </div>
      </div>
      {mostMissed.length > 0 && (
        <div>
          <div className="text-[10px] text-ck-text-muted tracking-[1px] mb-1">
            MOST MISSED
          </div>
          {mostMissed.slice(0, 3).map((m) => (
            <div key={m.label} className="text-xs text-ck-bad">
              {m.label} ({m.correct}/{m.total})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create StrategyChart component**

Create `src/components/blackjack/StrategyChart.tsx`:

```tsx
"use client";

import { useState } from "react";
import {
  DEALER_CARDS,
  HARD_CHART_6D_S17_DAS,
  SOFT_CHART_6D_S17_DAS,
  PAIRS_CHART_6D_S17_DAS,
  ACTION_COLORS,
  type Action,
} from "@/data/blackjack-strategy";

type ChartTab = "hard" | "soft" | "pairs";

interface StrategyChartProps {
  highlightRow?: number | null; // row index to highlight
  highlightCol?: number | null; // dealer column index
  activeTab?: ChartTab;
}

const HARD_ROW_LABELS = [
  "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17",
  "18", "19", "20", "21",
];
const SOFT_ROW_LABELS = ["A,2", "A,3", "A,4", "A,5", "A,6", "A,7", "A,8", "A,9"];
const PAIR_ROW_LABELS = [
  "2,2", "3,3", "4,4", "5,5", "6,6", "7,7", "8,8", "9,9", "T,T", "A,A",
];

export default function StrategyChart({
  highlightRow,
  highlightCol,
  activeTab: initialTab,
}: StrategyChartProps) {
  const [tab, setTab] = useState<ChartTab>(initialTab || "hard");

  const chart =
    tab === "hard"
      ? HARD_CHART_6D_S17_DAS
      : tab === "soft"
        ? SOFT_CHART_6D_S17_DAS
        : PAIRS_CHART_6D_S17_DAS;

  const rowLabels =
    tab === "hard"
      ? HARD_ROW_LABELS
      : tab === "soft"
        ? SOFT_ROW_LABELS
        : PAIR_ROW_LABELS;

  return (
    <div className="border-t border-ck-border-subtle px-7 py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] text-ck-accent tracking-[1px]">
          STRATEGY CHART — 6 DECK, S17, DAS
        </div>
        <div className="flex gap-1.5">
          {(["hard", "soft", "pairs"] as ChartTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] px-2.5 py-1 tracking-[1px] ${
                tab === t
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px] text-center">
          <thead>
            <tr>
              <th className="py-1.5 px-1 text-left text-ck-text-muted font-normal text-[10px]">
                YOU ╲ DEALER
              </th>
              {DEALER_CARDS.map((d, i) => (
                <th
                  key={d}
                  className={`py-1.5 w-8 font-normal ${
                    highlightCol === i
                      ? "text-ck-accent font-bold"
                      : "text-ck-text-secondary"
                  }`}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`border-b border-ck-bg-tertiary ${
                  highlightRow === rowIdx ? "bg-[#1f1f1a]" : ""
                }`}
              >
                <td
                  className={`py-1.5 px-1 text-left ${
                    highlightRow === rowIdx
                      ? "text-ck-accent font-bold"
                      : "text-ck-text-secondary"
                  }`}
                >
                  {rowLabels[rowIdx]}
                  {highlightRow === rowIdx ? " ◀" : ""}
                </td>
                {row.map((action, colIdx) => {
                  const isHighlight =
                    highlightRow === rowIdx && highlightCol === colIdx;
                  const colorClass = ACTION_COLORS[action as Action] || "text-ck-text-secondary";
                  return (
                    <td
                      key={colIdx}
                      className={`py-1.5 ${colorClass} ${
                        isHighlight ? "font-bold underline" : ""
                      }`}
                    >
                      {action}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-ck-text-faint mt-2">
        S = STAND · H = HIT · D = DOUBLE · P = SPLIT · R = SURRENDER · HIGHLIGHTED
        = CURRENT HAND
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create DealArea component**

Create `src/components/blackjack/DealArea.tsx`:

```tsx
"use client";

import { type Card } from "@/lib/blackjack-engine";
import { type Action } from "@/data/blackjack-strategy";
import PlayingCard from "./PlayingCard";

interface DealAreaProps {
  dealerCards: Card[];
  playerCards: Card[];
  playerTotal: number;
  isSoft: boolean;
  canSplit: boolean;
  canSurrender: boolean;
  showDealerHole: boolean;
  onAction: (action: Action) => void;
  disabled: boolean;
}

const ACTIONS: { action: Action; label: string; key: string }[] = [
  { action: "H", label: "HIT", key: "h" },
  { action: "S", label: "STAND", key: "s" },
  { action: "D", label: "DOUBLE", key: "d" },
  { action: "P", label: "SPLIT", key: "p" },
];

export default function DealArea({
  dealerCards,
  playerCards,
  playerTotal,
  isSoft,
  canSplit,
  canSurrender,
  showDealerHole,
  onAction,
  disabled,
}: DealAreaProps) {
  const dealerDisplay = showDealerHole
    ? dealerCards
        .map((c) => c.value)
        .reduce((a, b) => a + b, 0)
        .toString()
    : dealerCards[0]?.value.toString() || "";

  return (
    <div className="bg-ck-felt py-10 px-7">
      {/* Dealer */}
      <div className="text-center mb-10">
        <div className="text-[10px] text-white/50 tracking-[2px] mb-3">
          DEALER SHOWS
        </div>
        <div className="inline-flex gap-2">
          {dealerCards.map((card, i) => (
            <PlayingCard
              key={i}
              card={card}
              faceDown={i === 1 && !showDealerHole}
            />
          ))}
        </div>
      </div>

      {/* Player */}
      <div className="text-center mb-6">
        <div className="text-[10px] text-white/50 tracking-[2px] mb-3">
          YOUR HAND — {isSoft ? "SOFT " : ""}
          {playerTotal}
        </div>
        <div className="inline-flex gap-2">
          {playerCards.map((card, i) => (
            <PlayingCard key={i} card={card} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-2">
        {ACTIONS.map(({ action, label }) => {
          const isDisabled =
            disabled ||
            (action === "P" && !canSplit) ||
            (action === "Rh" && !canSurrender);
          return (
            <button
              key={action}
              onClick={() => !isDisabled && onAction(action)}
              disabled={isDisabled}
              className={`text-[13px] px-6 py-3 border font-bold tracking-[1px] transition-colors ${
                isDisabled
                  ? "bg-black/20 text-white/30 border-white/10 cursor-not-allowed"
                  : "bg-black/40 text-white border-white/20 hover:bg-black/60"
              }`}
            >
              {label}
            </button>
          );
        })}
        {canSurrender && (
          <button
            onClick={() => !disabled && onAction("Rh")}
            disabled={disabled}
            className={`text-[13px] px-6 py-3 border font-bold tracking-[1px] transition-colors ${
              disabled
                ? "bg-black/20 text-white/30 border-white/10 cursor-not-allowed"
                : "bg-black/40 text-white border-white/20 hover:bg-black/60"
            }`}
          >
            SURRENDER
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create Blackjack page (main game logic)**

Create `src/app/blackjack/page.tsx`:

```tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import {
  type RuleSet,
  type Action,
  DEALER_CARDS,
  getCorrectAction,
  getActionExplanation,
} from "@/data/blackjack-strategy";
import {
  createShoe,
  dealHand,
  evaluateHand,
  cardToStrategyKey,
  type Card,
} from "@/lib/blackjack-engine";
import RuleConfig from "@/components/blackjack/RuleConfig";
import DealArea from "@/components/blackjack/DealArea";
import Feedback from "@/components/blackjack/Feedback";
import SessionStats from "@/components/blackjack/SessionStats";
import StrategyChart from "@/components/blackjack/StrategyChart";

interface HandRecord {
  key: string; // e.g., "hard-15-vs-T"
  correct: boolean;
}

export default function BlackjackPage() {
  const [rules, setRules] = useState<RuleSet>({
    payout: "3:2",
    dealerHitsSoft17: false,
    decks: 6,
    doubleAfterSplit: true,
    surrender: "none",
  });

  const [shoe, setShoe] = useState<Card[]>(() => createShoe(6));
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    chosen: Action;
    correctAction: Action;
    explanation: string;
  } | null>(null);
  const [records, setRecords] = useState<HandRecord[]>([]);
  const [streak, setStreak] = useState(0);

  const deal = useCallback(() => {
    const { dealerCards: dc, playerCards: pc, remainingShoe } = dealHand(shoe);
    setDealerCards(dc);
    setPlayerCards(pc);
    setShoe(remainingShoe);
    setFeedback(null);
  }, [shoe]);

  // Deal first hand on mount
  useEffect(() => {
    deal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (feedback) {
        // Any key deals next hand after feedback
        deal();
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "h") handleAction("H");
      if (key === "s") handleAction("S");
      if (key === "d") handleAction("D");
      if (key === "p") handleAction("P");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, dealerCards, playerCards, rules]);

  const playerHand = evaluateHand(playerCards);
  const dealerUpcard = dealerCards[0] ? cardToStrategyKey(dealerCards[0]) : "2";

  const correctAction = getCorrectAction(
    playerHand.total,
    playerHand.isSoft,
    playerHand.isPair,
    playerHand.pairValue,
    dealerUpcard,
    rules
  );

  const handleAction = (chosen: Action) => {
    if (feedback) return;

    const isCorrect = chosen === correctAction;
    const explanation = getActionExplanation(
      playerHand.total,
      playerHand.isSoft,
      dealerUpcard,
      correctAction,
      chosen
    );

    setFeedback({
      correct: isCorrect,
      chosen,
      correctAction,
      explanation,
    });

    const handKey = `${playerHand.isSoft ? "soft" : playerHand.isPair ? "pair" : "hard"}-${playerHand.total}-vs-${dealerUpcard}`;
    setRecords((prev) => [...prev, { key: handKey, correct: isCorrect }]);
    setStreak((prev) => (isCorrect ? prev + 1 : 0));

    // Auto-advance after a short delay
    setTimeout(() => deal(), isCorrect ? 1200 : 3000);
  };

  // Calculate chart highlight position
  let chartHighlightRow: number | null = null;
  let chartTab: "hard" | "soft" | "pairs" = "hard";

  if (playerHand.isPair && playerHand.pairValue !== null) {
    chartTab = "pairs";
    chartHighlightRow = playerHand.pairValue === 1 ? 9 : playerHand.pairValue - 2;
  } else if (playerHand.isSoft) {
    chartTab = "soft";
    chartHighlightRow = playerHand.total - 13;
  } else {
    chartTab = "hard";
    chartHighlightRow = playerHand.total - 5;
  }

  const chartHighlightCol = DEALER_CARDS.indexOf(dealerUpcard);

  // Calculate most missed
  const handMap = new Map<string, { correct: number; total: number }>();
  for (const r of records) {
    const entry = handMap.get(r.key) || { correct: 0, total: 0 };
    entry.total++;
    if (r.correct) entry.correct++;
    handMap.set(r.key, entry);
  }
  const mostMissed = Array.from(handMap.entries())
    .filter(([, v]) => v.correct < v.total)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .slice(0, 3)
    .map(([label, v]) => ({ label, ...v }));

  const totalCorrect = records.filter((r) => r.correct).length;

  return (
    <div className="bg-ck-bg -mx-6 -mt-8">
      {/* Header */}
      <div className="border-b border-ck-border px-7 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-bold text-ck-accent tracking-[3px]">
            BLACKJACK TRAINER
          </h1>
          <span className="text-[11px] text-ck-text-dim">BASIC STRATEGY</span>
        </div>
      </div>

      <RuleConfig rules={rules} onChange={setRules} />
      <DealArea
        dealerCards={dealerCards}
        playerCards={playerCards}
        playerTotal={playerHand.total}
        isSoft={playerHand.isSoft}
        canSplit={playerHand.isPair}
        canSurrender={rules.surrender !== "none"}
        showDealerHole={false}
        onAction={handleAction}
        disabled={!!feedback}
      />
      {feedback && (
        <Feedback
          correct={feedback.correct}
          chosenAction={feedback.chosen}
          correctAction={feedback.correctAction}
          explanation={feedback.explanation}
        />
      )}
      <SessionStats
        hands={records.length}
        correct={totalCorrect}
        streak={streak}
        mostMissed={mostMissed}
      />
      <StrategyChart
        highlightRow={chartHighlightRow}
        highlightCol={chartHighlightCol}
        activeTab={chartTab}
      />
    </div>
  );
}
```

Create `src/app/blackjack/layout.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blackjack Strategy Trainer — Practice Basic Strategy",
  description:
    "Practice blackjack basic strategy with instant feedback. Adjusts for table rules: 3:2 vs 6:5, S17/H17, deck count, DAS, surrender.",
};

export default function BlackjackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 8: Verify the page renders**

```bash
cd /Users/brianfranklin/Documents/casiknow && npm run dev
```

Open http://localhost:3000/blackjack. Verify: cards deal, actions respond, feedback shows, stats track, strategy chart highlights current hand, rule toggles work.

- [ ] **Step 9: Commit**

```bash
git add src/components/blackjack/ src/app/blackjack/
git commit -m "feat: add Blackjack Strategy Trainer with card dealing, feedback, stats, strategy chart"
```

---

## Task 10: Craps Strategy Guide

**Files:**
- Create: `src/components/craps/CrapsTableDiagram.tsx`
- Create: `src/components/craps/BetDetail.tsx`
- Create: `src/components/craps/StrategyTiers.tsx`
- Create: `src/components/craps/CrapsBetsRanked.tsx`
- Create: `src/app/craps/page.tsx`
- Create: `src/app/craps/layout.tsx`

- [ ] **Step 1: Create BetDetail component**

Create `src/components/craps/BetDetail.tsx`:

```tsx
import { type CrapsBet } from "@/data/craps-bets";
import EdgeBadge from "@/components/EdgeBadge";

interface BetDetailProps {
  bet: CrapsBet;
  avgBet?: number;
}

export default function BetDetail({ bet, avgBet = 25 }: BetDetailProps) {
  const hourlyCost = bet.edge * avgBet * 48; // ~48 decisions/hr at craps

  return (
    <div className="bg-ck-bg-tertiary border-l-[3px] border-ck-accent px-5 py-4">
      <div className="text-xs text-ck-accent tracking-[1px] mb-2.5">
        ▼ {bet.name.toUpperCase()}
      </div>
      <div className="text-xs text-ck-text-secondary leading-relaxed space-y-2">
        <div>
          <span className="text-ck-text-primary font-bold">What it is: </span>
          {bet.description}
        </div>
        <div>
          <span className="text-ck-text-primary font-bold">How it works: </span>
          {bet.howItWorks}
        </div>
        <div>
          <span className="text-ck-text-primary font-bold">House edge: </span>
          <EdgeBadge edge={bet.edge} />
          {bet.payout && (
            <span className="text-ck-text-muted"> · Pays {bet.payout}</span>
          )}
        </div>
        {bet.edge > 0 && (
          <div>
            <span className="text-ck-text-primary font-bold">At ${avgBet}: </span>
            Costs about{" "}
            <span className="text-ck-caution">
              ${hourlyCost.toFixed(2)}/hr
            </span>
          </div>
        )}
        <div>
          <span className="text-ck-text-muted">TIP: </span>
          {bet.tip}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create CrapsTableDiagram component (SVG-based)**

Create `src/components/craps/CrapsTableDiagram.tsx`:

```tsx
"use client";

import { CRAPS_BETS, type CrapsBet } from "@/data/craps-bets";

interface CrapsTableDiagramProps {
  selectedBetId: string | null;
  onSelectBet: (id: string) => void;
}

function edgeColor(edge: number): string {
  if (edge === 0) return "#4ade80";
  if (edge <= 0.015) return "#4ade80";
  if (edge <= 0.04) return "#eab308";
  return "#ef4444";
}

interface BetZone {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  edge: number;
}

const ZONES: BetZone[] = [
  { id: "dont-pass", label: "DON'T PASS", sublabel: "BAR ⚅⚅", x: 10, y: 10, w: 280, h: 50, edge: 0.0106 },
  { id: "dont-come", label: "DON'T COME", sublabel: "", x: 300, y: 10, w: 280, h: 50, edge: 0.0106 },
  // Number boxes
  { id: "place-4", label: "4", sublabel: "9:5", x: 10, y: 70, w: 90, h: 60, edge: 0.0667 },
  { id: "place-5", label: "5", sublabel: "7:5", x: 105, y: 70, w: 90, h: 60, edge: 0.04 },
  { id: "place-6", label: "6", sublabel: "7:6", x: 200, y: 70, w: 90, h: 60, edge: 0.0152 },
  { id: "place-6", label: "8", sublabel: "7:6", x: 295, y: 70, w: 90, h: 60, edge: 0.0152 },
  { id: "place-5", label: "9", sublabel: "7:5", x: 390, y: 70, w: 90, h: 60, edge: 0.04 },
  { id: "place-4", label: "10", sublabel: "9:5", x: 485, y: 70, w: 90, h: 60, edge: 0.0667 },
  // Come
  { id: "come", label: "COME", sublabel: "", x: 10, y: 140, w: 380, h: 50, edge: 0.0141 },
  // Field
  { id: "field-3x", label: "FIELD", sublabel: "2,3,4,9,10,11,12", x: 400, y: 140, w: 180, h: 50, edge: 0.0278 },
  // Pass Line
  { id: "pass", label: "PASS LINE", sublabel: "", x: 10, y: 200, w: 570, h: 55, edge: 0.0141 },
  // Props
  { id: "hard-6-8", label: "HARD 6/8", sublabel: "9.09%", x: 10, y: 268, w: 138, h: 40, edge: 0.0909 },
  { id: "hard-4-10", label: "HARD 4/10", sublabel: "11.11%", x: 153, y: 268, w: 138, h: 40, edge: 0.1111 },
  { id: "any-7", label: "ANY 7", sublabel: "16.67%", x: 296, y: 268, w: 138, h: 40, edge: 0.1667 },
  { id: "any-craps", label: "ANY CRAPS", sublabel: "11.11%", x: 439, y: 268, w: 141, h: 40, edge: 0.1111 },
];

export default function CrapsTableDiagram({
  selectedBetId,
  onSelectBet,
}: CrapsTableDiagramProps) {
  return (
    <div className="bg-ck-felt p-6">
      <svg
        viewBox="0 0 590 320"
        className="w-full max-w-2xl mx-auto"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        {/* Table border */}
        <rect
          x="2"
          y="2"
          width="586"
          height="316"
          rx="8"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />
        <rect
          x="6"
          y="6"
          width="578"
          height="308"
          rx="6"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />

        {/* Bet zones */}
        {ZONES.map((zone, i) => {
          const isSelected = selectedBetId === zone.id;
          const color = edgeColor(zone.edge);
          return (
            <g
              key={`${zone.id}-${i}`}
              onClick={() => onSelectBet(zone.id)}
              className="cursor-pointer"
            >
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                fill={
                  zone.edge > 0.08
                    ? "rgba(239,68,68,0.12)"
                    : zone.id === "pass"
                      ? "rgba(245,197,66,0.12)"
                      : "rgba(255,255,255,0.06)"
                }
                stroke={
                  isSelected
                    ? "#f5c542"
                    : zone.id === "pass"
                      ? "rgba(245,197,66,0.3)"
                      : zone.edge > 0.08
                        ? "rgba(239,68,68,0.3)"
                        : "rgba(255,255,255,0.15)"
                }
                strokeWidth={isSelected ? 2 : 1}
                rx="2"
              />
              <text
                x={zone.x + zone.w / 2}
                y={zone.y + (zone.sublabel ? zone.h / 2 - 4 : zone.h / 2 + 1)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={zone.id === "pass" ? "#f5c542" : "#fff"}
                fontSize={zone.h > 50 ? 13 : 11}
                fontWeight="bold"
                letterSpacing="1"
              >
                {zone.label}
              </text>
              {zone.sublabel && (
                <text
                  x={zone.x + zone.w / 2}
                  y={zone.y + zone.h / 2 + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize={8}
                >
                  {zone.sublabel}
                </text>
              )}
              {/* Edge label */}
              <text
                x={zone.x + zone.w - 6}
                y={zone.y + 12}
                textAnchor="end"
                fill={color}
                fontSize={8}
              >
                {(zone.edge * 100).toFixed(2)}%
              </text>
            </g>
          );
        })}
      </svg>
      <div className="text-[10px] text-white/30 text-center mt-3">
        TAP ANY BET TO LEARN MORE
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create StrategyTiers component**

Create `src/components/craps/StrategyTiers.tsx`:

```tsx
import { CRAPS_STRATEGIES } from "@/data/craps-bets";

interface StrategyTiersProps {
  avgBet?: number;
}

export default function StrategyTiers({ avgBet = 25 }: StrategyTiersProps) {
  return (
    <div className="px-7 py-6 border-t border-ck-border-subtle">
      <div className="text-[10px] text-ck-accent tracking-[1px] mb-4">
        STRATEGY MODE — BY BANKROLL
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CRAPS_STRATEGIES.map((strat) => {
          const hourly = strat.effectiveEdge * avgBet * 48;
          const isRec = strat.tier === "recommended";
          return (
            <div
              key={strat.tier}
              className={`border p-4 ${
                isRec
                  ? "border-ck-accent bg-[#1f1f1a]"
                  : "border-ck-border"
              }`}
            >
              <div
                className={`text-[10px] tracking-[1px] mb-2.5 ${
                  isRec
                    ? "text-ck-accent"
                    : strat.tier === "conservative"
                      ? "text-ck-good"
                      : "text-ck-caution"
                }`}
              >
                {strat.name}
              </div>
              <div className="text-[10px] text-ck-text-secondary mb-1">
                BANKROLL: {strat.bankrollRange}
              </div>
              <div className="text-[11px] text-ck-text-primary leading-relaxed mb-3">
                {strat.bets.map((b) => (
                  <div key={b}>→ {b}</div>
                ))}
              </div>
              <div className="text-[10px] text-ck-good">
                EDGE: {(strat.effectiveEdge * 100).toFixed(2)}%
              </div>
              <div className="text-[10px] text-ck-text-secondary">
                ~${hourly.toFixed(2)}/hr @ ${avgBet}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create CrapsBetsRanked component**

Create `src/components/craps/CrapsBetsRanked.tsx`:

```tsx
import { CRAPS_BETS } from "@/data/craps-bets";
import { edgeToVerdict } from "@/data/house-edges";
import EdgeBadge from "@/components/EdgeBadge";

export default function CrapsBetsRanked() {
  const sorted = [...CRAPS_BETS].sort((a, b) => a.edge - b.edge);

  return (
    <div className="px-7 py-6 border-t border-ck-border-subtle">
      <div className="text-[10px] text-ck-accent tracking-[1px] mb-3">
        ALL CRAPS BETS RANKED
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ck-border">
              <th className="text-left py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                BET
              </th>
              <th className="text-right py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                EDGE
              </th>
              <th className="text-right py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                VERDICT
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((bet) => {
              const verdict = edgeToVerdict(bet.edge);
              const verdictColor =
                bet.edge === 0
                  ? "text-ck-good"
                  : bet.edge <= 0.015
                    ? "text-ck-good"
                    : bet.edge <= 0.04
                      ? "text-ck-caution"
                      : "text-ck-bad";
              return (
                <tr
                  key={bet.id}
                  className="border-b border-ck-bg-tertiary"
                >
                  <td className="py-2 text-ck-text-primary">{bet.name}</td>
                  <td className="text-right py-2">
                    <EdgeBadge edge={bet.edge} />
                  </td>
                  <td className={`text-right py-2 ${verdictColor}`}>
                    {verdict}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create Craps page**

Create `src/app/craps/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { CRAPS_BETS } from "@/data/craps-bets";
import CrapsTableDiagram from "@/components/craps/CrapsTableDiagram";
import BetDetail from "@/components/craps/BetDetail";
import StrategyTiers from "@/components/craps/StrategyTiers";
import CrapsBetsRanked from "@/components/craps/CrapsBetsRanked";

type Mode = "learn" | "strategy";

export default function CrapsPage() {
  const [mode, setMode] = useState<Mode>("learn");
  const [selectedBetId, setSelectedBetId] = useState<string | null>(null);

  const selectedBet = CRAPS_BETS.find((b) => b.id === selectedBetId) || null;

  return (
    <div className="bg-ck-bg -mx-6 -mt-8">
      {/* Header */}
      <div className="border-b border-ck-border px-7 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-bold text-ck-accent tracking-[3px]">
            CRAPS GUIDE
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("learn")}
              className={`text-[11px] px-3 py-1.5 tracking-[1px] ${
                mode === "learn"
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary"
              }`}
            >
              LEARN
            </button>
            <button
              onClick={() => setMode("strategy")}
              className={`text-[11px] px-3 py-1.5 tracking-[1px] ${
                mode === "strategy"
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary"
              }`}
            >
              STRATEGY
            </button>
          </div>
        </div>
      </div>

      {mode === "learn" ? (
        <>
          <CrapsTableDiagram
            selectedBetId={selectedBetId}
            onSelectBet={setSelectedBetId}
          />
          {selectedBet && <BetDetail bet={selectedBet} />}
        </>
      ) : (
        <StrategyTiers />
      )}

      <CrapsBetsRanked />
    </div>
  );
}
```

Create `src/app/craps/layout.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Craps Strategy Guide — Learn Every Bet on the Table",
  description:
    "Interactive craps table guide. Tap any bet to learn the math. Get bankroll-based strategy recommendations. All odds are exact.",
};

export default function CrapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 6: Verify the page renders**

```bash
cd /Users/brianfranklin/Documents/casiknow && npm run dev
```

Open http://localhost:3000/craps. Verify: Learn/Strategy toggle works, tapping bet zones shows detail panel, strategy tiers display, all bets ranked table renders.

- [ ] **Step 7: Commit**

```bash
git add src/components/craps/ src/app/craps/
git commit -m "feat: add Craps Strategy Guide with interactive table, bet details, strategy tiers"
```

---

## Task 11: Polish & Verification

**Files:**
- Modify: Various — fixing build errors, responsive issues, and visual polish

- [ ] **Step 1: Run build and fix any TypeScript errors**

```bash
cd /Users/brianfranklin/Documents/casiknow && npm run build
```

Fix any type errors, missing imports, or build failures.

- [ ] **Step 2: Test all routes**

Verify each route loads and is functional:
- http://localhost:3000 — Homepage with 4 tool links
- http://localhost:3000/house-edge — Filters, sorting, expand rows, adjust bet
- http://localhost:3000/slots — Change inputs, recommendation updates
- http://localhost:3000/blackjack — Deal, pick action, feedback, stats track
- http://localhost:3000/craps — Learn/Strategy modes, bet detail panel

- [ ] **Step 3: Test mobile responsiveness**

Use browser dev tools to check each page at 375px width (iPhone SE). Verify:
- Nav hamburger menu works
- Tables scroll horizontally
- Inputs are touch-sized
- No horizontal overflow

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: build errors and responsive polish"
```

---

## Task 12: Deploy to Vercel

- [ ] **Step 1: Initialize git repo and push**

```bash
cd /Users/brianfranklin/Documents/casiknow
git remote add origin <github-repo-url>
git push -u origin main
```

Note: Create the GitHub repo first (`gh repo create casiknow --public`), then push. User must approve push.

- [ ] **Step 2: Connect to Vercel**

```bash
npx vercel --prod
```

Or connect via Vercel dashboard. The default Next.js settings should work out of the box.

- [ ] **Step 3: Verify production deployment**

Check all 4 tool routes load and function correctly on the production URL.

- [ ] **Step 4: Commit Vercel config if needed**

```bash
git add vercel.json
git commit -m "chore: add Vercel deployment config"
```
