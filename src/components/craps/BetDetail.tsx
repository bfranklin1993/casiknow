import { type CrapsBet } from "@/data/craps-bets";
import EdgeBadge from "@/components/EdgeBadge";

interface BetDetailProps {
  bet: CrapsBet;
  avgBet?: number;
}

export default function BetDetail({ bet, avgBet = 25 }: BetDetailProps) {
  const hourlyCost = bet.edge * avgBet * 48; // ~48 decisions/hr at craps

  return (
    <div className="bg-ck-bg-tertiary border-l-[3px] border-ck-accent px-5 py-4">
      <div className="text-xs text-ck-accent tracking-[1px] mb-2.5">
        ▼ {bet.name.toUpperCase()}
      </div>
      <div className="text-xs text-ck-text-secondary leading-relaxed space-y-2">
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
