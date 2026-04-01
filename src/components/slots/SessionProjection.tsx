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
      <div className="text-xs text-ck-accent tracking-[1px] mb-4">
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
      <div className="text-xs text-ck-text-muted mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
