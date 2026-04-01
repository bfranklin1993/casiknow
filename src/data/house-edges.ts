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
  if (pct === 0) return "NONE";
  if (pct <= 0.5) return "VERY LOW";
  if (pct <= 1.5) return "LOW";
  if (pct <= 3) return "MODERATE";
  if (pct <= 5) return "ABOVE AVG";
  if (pct <= 10) return "HIGH";
  if (pct <= 15) return "VERY HIGH";
  return "EXTREME";
}
