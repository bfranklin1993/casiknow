"use client";

import { type Card } from "@/lib/blackjack-engine";
import { type Action } from "@/data/blackjack-strategy";
import PlayingCard from "./PlayingCard";

interface DealAreaProps {
  dealerCards: Card[];
  playerCards: Card[];
  playerTotal: number;
  isSoft: boolean;
  canSplit: boolean;
  canSurrender: boolean;
  showDealerHole: boolean;
  onAction: (action: Action) => void;
  disabled: boolean;
}

const ACTIONS: { action: Action; label: string; key: string }[] = [
  { action: "H", label: "HIT", key: "h" },
  { action: "S", label: "STAND", key: "s" },
  { action: "D", label: "DOUBLE", key: "d" },
  { action: "P", label: "SPLIT", key: "p" },
];

export default function DealArea({
  dealerCards,
  playerCards,
  playerTotal,
  isSoft,
  canSplit,
  canSurrender,
  showDealerHole,
  onAction,
  disabled,
}: DealAreaProps) {
  return (
    <div className="bg-ck-felt py-10 px-7">
      {/* Dealer */}
      <div className="text-center mb-10">
        <div className="text-[10px] text-white/50 tracking-[2px] mb-3">
          DEALER SHOWS
        </div>
        <div className="inline-flex gap-2">
          {dealerCards.map((card, i) => (
            <PlayingCard
              key={i}
              card={card}
              faceDown={i === 1 && !showDealerHole}
            />
          ))}
        </div>
      </div>

      {/* Player */}
      <div className="text-center mb-6">
        <div className="text-[10px] text-white/50 tracking-[2px] mb-3">
          YOUR HAND — {isSoft ? "SOFT " : ""}
          {playerTotal}
        </div>
        <div className="inline-flex gap-2">
          {playerCards.map((card, i) => (
            <PlayingCard key={i} card={card} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-2 flex-wrap">
        {ACTIONS.map(({ action, label }) => {
          const isDisabled =
            disabled ||
            (action === "P" && !canSplit);
          return (
            <button
              key={action}
              onClick={() => !isDisabled && onAction(action)}
              disabled={isDisabled}
              className={`text-[13px] px-6 py-3 border font-bold tracking-[1px] transition-colors ${
                isDisabled
                  ? "bg-black/20 text-white/30 border-white/10 cursor-not-allowed"
                  : "bg-black/40 text-white border-white/20 hover:bg-black/60"
              }`}
            >
              {label}
            </button>
          );
        })}
        {canSurrender && (
          <button
            onClick={() => !disabled && onAction("Rh")}
            disabled={disabled}
            className={`text-[13px] px-6 py-3 border font-bold tracking-[1px] transition-colors ${
              disabled
                ? "bg-black/20 text-white/30 border-white/10 cursor-not-allowed"
                : "bg-black/40 text-white border-white/20 hover:bg-black/60"
            }`}
          >
            SURRENDER
          </button>
        )}
      </div>
    </div>
  );
}
