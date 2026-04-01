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

export default function SlotRecommendation({
  recommended,
  antiRec,
  goal,
}: SlotRecommendationProps) {
  const recBet = defaultBetSize(recommended.denomination);
  const antiBet = defaultBetSize(antiRec.denomination);
  const reason = recommendationReason(goal, recommended, antiRec);

  return (
    <div className="px-7 py-6 border-b border-ck-border-subtle">
      <div className="text-[10px] text-ck-accent tracking-[1px] mb-4">
        ▶ RECOMMENDATION
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="border border-ck-border p-5">
          <div className="text-[10px] text-ck-text-muted tracking-[1px] mb-2">
            PLAY THIS
          </div>
          <div className="text-2xl text-ck-accent font-bold">
            {recommended.label} DENOM
          </div>
          <div className="text-sm text-ck-text-primary mt-1">
            ${recBet.toFixed(2)} / spin
          </div>
          <div className="text-[11px] text-ck-text-secondary mt-2">
            3 credits × {recommended.label}
          </div>
        </div>
        <div className="border border-ck-border p-5">
          <div className="text-[10px] text-ck-text-muted tracking-[1px] mb-2">
            NOT THIS
          </div>
          <div className="text-2xl text-ck-bad font-bold">
            {antiRec.label} DENOM
          </div>
          <div className="text-sm text-ck-text-primary mt-1">
            ${antiBet.toFixed(2)} / spin
          </div>
          <div className="text-[11px] text-ck-text-secondary mt-2">
            {Math.round(antiBet / antiRec.denomination)} credits × {antiRec.label}
          </div>
        </div>
      </div>

      <div className="bg-ck-bg-tertiary border-l-[3px] border-ck-accent px-5 py-4">
        <div className="text-[11px] text-ck-accent tracking-[1px] mb-2">
          WHY
        </div>
        <div className="text-xs text-ck-text-secondary leading-relaxed">
          {reason}
        </div>
      </div>
    </div>
  );
}
