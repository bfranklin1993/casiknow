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
