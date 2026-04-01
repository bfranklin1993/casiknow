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
