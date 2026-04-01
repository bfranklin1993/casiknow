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
      <div className="text-xs text-ck-accent tracking-[1px] mb-4">
        COMP VALUE
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-ck-bg-tertiary p-3.5 text-center">
          <div className="text-xs text-ck-text-muted mb-1">THEO LOSS</div>
          <div className="text-lg font-bold text-ck-text-primary">
            ${Math.round(loss).toLocaleString()}
          </div>
        </div>
        <div className="bg-ck-bg-tertiary p-3.5 text-center">
          <div className="text-xs text-ck-text-muted mb-1">
            EST. COMP BACK
          </div>
          <div className="text-lg font-bold text-ck-good">
            ${Math.round(compLow)}–{Math.round(compHigh)}
          </div>
          <div className="text-xs text-ck-text-secondary mt-0.5">
            0.1–0.3% OF COIN-IN
          </div>
        </div>
        <div className="bg-ck-bg-tertiary p-3.5 text-center">
          <div className="text-xs text-ck-text-muted mb-1">NET COST</div>
          <div className="text-lg font-bold text-ck-caution">
            ${Math.round(netLow)}–{Math.round(netHigh)}
          </div>
          <div className="text-xs text-ck-text-secondary mt-0.5">
            AFTER COMPS
          </div>
        </div>
      </div>
      <div className="text-xs text-ck-text-faint mt-3">
        {COMP_RATE_NOTE}
      </div>
    </div>
  );
}
