import { type CrapsBet } from "@/data/craps-bets";
import EdgeBadge from "@/components/EdgeBadge";

interface BetDetailProps {
  bet: CrapsBet;
  avgBet?: number;
}

function getVerdict(edge: number): { label: string; color: string; bg: string; border: string } {
  if (edge === 0) return { label: "NO HOUSE EDGE", color: "#4ade80", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.4)" };
  if (edge <= 0.015) return { label: "LOW HOUSE EDGE", color: "#4ade80", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.4)" };
  if (edge <= 0.04) return { label: "MODERATE HOUSE EDGE", color: "#eab308", bg: "rgba(234,179,8,0.10)", border: "rgba(234,179,8,0.35)" };
  return { label: "HIGH HOUSE EDGE", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)" };
}

export default function BetDetail({ bet, avgBet = 25 }: BetDetailProps) {
  const hourlyCost = bet.edge * avgBet * 48; // ~48 decisions/hr at craps
  const verdict = getVerdict(bet.edge);

  return (
    <div className="bg-ck-bg-tertiary border-l-[3px] border-ck-accent px-5 py-4">
      {/* Verdict — leads the panel */}
      <div
        className="flex items-center justify-between mb-3 px-3 py-2 rounded"
        style={{ background: verdict.bg, border: `1px solid ${verdict.border}` }}
      >
        <div className="text-base font-bold tracking-wide" style={{ color: verdict.color }}>
          {verdict.label}
        </div>
        <div className="text-xs text-ck-text-muted font-mono">
          {bet.name.toUpperCase()}
        </div>
      </div>

      <div className="text-sm text-ck-text-secondary leading-relaxed space-y-2">
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
