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
