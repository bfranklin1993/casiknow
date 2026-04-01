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
      <div className="text-xs text-ck-accent tracking-[1px] mb-3">
        ALL OPTIONS COMPARED
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ck-border">
              <th className="text-left py-2 text-xs text-ck-text-muted font-normal tracking-[1px]">
                DENOM
              </th>
              <th className="text-right py-2 text-xs text-ck-text-muted font-normal tracking-[1px]">
                BET
              </th>
              <th className="text-right py-2 text-xs text-ck-text-muted font-normal tracking-[1px]">
                RTP
              </th>
              <th className="text-right py-2 text-xs text-ck-text-muted font-normal tracking-[1px]">
                EXP LOSS
              </th>
              <th className="text-right py-2 text-xs text-ck-text-muted font-normal tracking-[1px]">
                BUST
              </th>
              <th className="text-right py-2 text-xs text-ck-text-muted font-normal tracking-[1px]">
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
      <div className="text-xs text-ck-text-faint mt-3 text-right">
        RTP VALUES ARE NEVADA STATEWIDE AVERAGES · INDIVIDUAL MACHINES VARY
      </div>
    </div>
  );
}
