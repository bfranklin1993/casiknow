import { CRAPS_BETS } from "@/data/craps-bets";
import { edgeToVerdict } from "@/data/house-edges";
import EdgeBadge from "@/components/EdgeBadge";

export default function CrapsBetsRanked() {
  const sorted = [...CRAPS_BETS].sort((a, b) => a.edge - b.edge);

  return (
    <div className="px-7 py-6 border-t border-ck-border-subtle">
      <div className="text-[10px] text-ck-accent tracking-[1px] mb-3">
        ALL CRAPS BETS RANKED
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ck-border">
              <th className="text-left py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                BET
              </th>
              <th className="text-right py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                EDGE
              </th>
              <th className="text-right py-2 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                VERDICT
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((bet) => {
              const verdict = edgeToVerdict(bet.edge);
              const verdictColor =
                bet.edge === 0
                  ? "text-ck-good"
                  : bet.edge <= 0.015
                    ? "text-ck-good"
                    : bet.edge <= 0.04
                      ? "text-ck-caution"
                      : "text-ck-bad";
              return (
                <tr
                  key={bet.id}
                  className="border-b border-ck-bg-tertiary"
                >
                  <td className="py-2 text-ck-text-primary">{bet.name}</td>
                  <td className="text-right py-2">
                    <EdgeBadge edge={bet.edge} />
                  </td>
                  <td className={`text-right py-2 ${verdictColor}`}>
                    {verdict}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
