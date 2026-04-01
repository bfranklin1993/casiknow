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
