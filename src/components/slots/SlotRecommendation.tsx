import Link from "next/link";
import { type DenominationData } from "@/data/slot-math";
import { getGamesByDenomination, VOLATILITY_LABELS, VOLATILITY_COLORS } from "@/data/slot-games";
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

  const matchedGames = getGamesByDenomination(recommended.label).slice(0, 6);

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

      {/* Popular Games — from real database */}
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <div className="text-xs text-ck-accent tracking-[1px]">
            POPULAR GAMES
          </div>
          <Link
            href="/slots/games"
            className="text-xs text-ck-text-faint tracking-[1px] hover:text-ck-accent transition-colors"
          >
            VIEW ALL GAMES →
          </Link>
        </div>
        <div className="text-xs text-ck-text-faint tracking-[1px] mb-4">
          COMMON ON {recommended.label} FLOORS — DENOMINATIONS VARY BY CASINO
        </div>
        {matchedGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {matchedGames.map((game) => {
              const volLabel = VOLATILITY_LABELS[game.volatility];
              const volColor = VOLATILITY_COLORS[game.volatility];
              return (
                <Link
                  key={game.id}
                  href="/slots/games"
                  className="bg-ck-bg-tertiary border border-ck-border-subtle px-4 py-3 hover:border-ck-border transition-colors block"
                >
                  <div className="text-xs font-bold text-ck-text-primary mb-1 leading-tight">
                    {game.name}
                  </div>
                  <div className="text-xs text-ck-text-faint mb-1.5">
                    {game.manufacturer}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ck-accent font-bold">
                      {(game.rtpRange[0] * 100).toFixed(1)}–{(game.rtpRange[1] * 100).toFixed(1)}%
                    </span>
                    <span className={`text-xs border px-1.5 py-0 ${volColor}`}>
                      {volLabel}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-ck-text-faint">
            No games in database for this denomination.{" "}
            <Link href="/slots/games" className="text-ck-accent hover:underline">
              Browse all games →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
