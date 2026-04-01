import { type DenominationData } from "@/data/slot-math";
import {
  type SlotGoal,
  defaultBetSize,
  recommendationReason,
} from "@/lib/calculations";

interface SlotRecommendationProps {
  recommended: DenominationData;
  antiRec: DenominationData;
  goal: SlotGoal;
}

const POPULAR_GAMES: { name: string; denoms: string; notes?: string }[] = [
  { name: "Buffalo Gold", denoms: "$0.01–$0.05" },
  { name: "Lightning Link", denoms: "$0.01–$0.05" },
  { name: "Double Diamond", denoms: "$1.00" },
  { name: "Blazing 7s", denoms: "$1.00–$5.00" },
  { name: "Wheel of Fortune", denoms: "$0.25–$1.00" },
  { name: "Quick Hit", denoms: "$0.01–$0.25" },
  { name: "Triple Diamond", denoms: "$1.00–$5.00" },
  { name: "Fu Dai Lian Lian", denoms: "$0.01–$0.05" },
];

export default function SlotRecommendation({
  recommended,
  antiRec,
  goal,
}: SlotRecommendationProps) {
  const recBet = defaultBetSize(recommended.denomination);
  const antiBet = defaultBetSize(antiRec.denomination);
  const reason = recommendationReason(goal, recommended, antiRec);

  return (
    <div className="px-7 py-8 border-b border-ck-border-subtle">
      <div className="text-xs text-ck-accent tracking-[1px] mb-6">
        ▶ RECOMMENDATION
      </div>

      {/* Play This / Not This */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="border-2 border-ck-accent bg-ck-bg-tertiary p-6">
          <div className="text-xs text-ck-text-muted tracking-[2px] mb-3">
            PLAY THIS
          </div>
          <div className="text-3xl text-ck-accent font-bold tracking-wide mb-2">
            {recommended.label}
          </div>
          <div className="text-base text-ck-text-primary font-semibold">
            ${recBet.toFixed(2)} / spin
          </div>
          <div className="text-xs text-ck-text-secondary mt-2">
            3 credits × {recommended.label}
          </div>
        </div>
        <div className="border border-ck-border p-6">
          <div className="text-xs text-ck-text-muted tracking-[2px] mb-3">
            NOT THIS
          </div>
          <div className="text-3xl text-ck-bad font-bold tracking-wide mb-2">
            {antiRec.label}
          </div>
          <div className="text-base text-ck-text-secondary">
            ${antiBet.toFixed(2)} / spin
          </div>
          <div className="text-xs text-ck-text-secondary mt-2">
            {Math.round(antiBet / antiRec.denomination)} credits × {antiRec.label}
          </div>
        </div>
      </div>

      {/* Why */}
      <div className="bg-ck-bg-tertiary border-l-[3px] border-ck-accent px-5 py-4 mb-8">
        <div className="text-xs text-ck-accent tracking-[1px] mb-2">WHY</div>
        <div className="text-sm text-ck-text-secondary leading-relaxed">
          {reason}
        </div>
      </div>

      {/* Popular Games */}
      <div>
        <div className="text-xs text-ck-accent tracking-[1px] mb-1">
          POPULAR GAMES
        </div>
        <div className="text-xs text-ck-text-faint tracking-[1px] mb-4">
          EXAMPLE MACHINES — DENOMINATIONS VARY BY CASINO
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {POPULAR_GAMES.map((game) => (
            <div
              key={game.name}
              className="bg-ck-bg-tertiary border border-ck-border-subtle px-4 py-3"
            >
              <div className="text-xs font-bold text-ck-text-primary mb-1">
                {game.name}
              </div>
              <div className="text-xs text-ck-text-muted">{game.denoms}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
