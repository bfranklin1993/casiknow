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
  { action: "H", label: "HIT", key: "H" },
  { action: "S", label: "STAND", key: "S" },
  { action: "D", label: "DOUBLE", key: "D" },
  { action: "P", label: "SPLIT", key: "P" },
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
        <div className="text-xs text-white/50 tracking-[2px] mb-3">
          DEALER SHOWS
        </div>
        <div className="inline-flex gap-3">
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
      <div className="text-center mb-8">
        <div className="text-xs text-white/50 tracking-[2px] mb-3">
          YOUR HAND
        </div>
        <div className="inline-flex gap-3 mb-4">
          {playerCards.map((card, i) => (
            <PlayingCard key={i} card={card} />
          ))}
        </div>
        {/* Hand total — prominent */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-bold text-white">
            {isSoft && playerTotal <= 21 ? "SOFT " : ""}{playerTotal}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 flex-wrap mb-3">
        {ACTIONS.map(({ action, label, key }) => {
          const isDisabled =
            disabled ||
            (action === "P" && !canSplit);
          return (
            <button
              key={action}
              onClick={() => !isDisabled && onAction(action)}
              disabled={isDisabled}
              className={`text-base px-8 py-4 border-2 font-bold tracking-[2px] transition-colors min-w-[100px] ${
                isDisabled
                  ? "bg-black/20 text-white/30 border-white/10 cursor-not-allowed"
                  : "bg-black/40 text-white border-white/30 hover:bg-black/60 hover:border-white/60"
              }`}
            >
              <span className="block">{label}</span>
              <span className="block text-xs font-normal text-white/40 mt-0.5 tracking-normal">
                [{key}]
              </span>
            </button>
          );
        })}
        {canSurrender && (
          <button
            onClick={() => !disabled && onAction("Rh")}
            disabled={disabled}
            className={`text-base px-8 py-4 border-2 font-bold tracking-[2px] transition-colors min-w-[100px] ${
              disabled
                ? "bg-black/20 text-white/30 border-white/10 cursor-not-allowed"
                : "bg-black/40 text-white border-white/30 hover:bg-black/60 hover:border-white/60"
            }`}
          >
            <span className="block">SURRENDER</span>
            <span className="block text-xs font-normal text-white/40 mt-0.5 tracking-normal">
              [R]
            </span>
          </button>
        )}
      </div>

      {/* Keyboard hint */}
      <div className="text-center text-xs text-white/30 tracking-[1px]">
        PRESS ANY KEY AFTER FEEDBACK TO DEAL NEXT HAND
      </div>
    </div>
  );
}
