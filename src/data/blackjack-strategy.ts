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
