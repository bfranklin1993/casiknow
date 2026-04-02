"use client";

import { useState } from "react";
import {
  type SlotGame,
  VOLATILITY_LABELS,
  VOLATILITY_COLORS,
} from "@/data/slot-games";

interface GameCardProps {
  game: SlotGame;
}

export default function GameCard({ game }: GameCardProps) {
  const [expanded, setExpanded] = useState(false);

  const rtpLow = (game.rtpRange[0] * 100).toFixed(2);
  const rtpHigh = (game.rtpRange[1] * 100).toFixed(2);
  const volLabel = VOLATILITY_LABELS[game.volatility];
  const volColor = VOLATILITY_COLORS[game.volatility];

  return (
    <div
      className={`border bg-ck-bg-tertiary transition-all cursor-pointer group ${
        expanded
          ? "border-ck-accent"
          : "border-ck-border-subtle hover:border-ck-border hover:bg-ck-bg"
      }`}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Card Header */}
      <div className="px-5 py-4">
        <div className="flex items-start gap-4 mb-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-ck-bg border border-ck-border-subtle text-3xl leading-none rounded-sm">
            {game.icon}
          </div>

          {/* Name + manufacturer + volatility */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="text-base font-bold text-ck-text-primary leading-tight">
                {game.name}
              </div>
              <div
                className={`flex-shrink-0 border px-2 py-0.5 text-xs font-bold tracking-[1px] ${volColor}`}
              >
                {volLabel}
              </div>
            </div>
            <div className="text-xs text-ck-text-muted tracking-[1px]">
              {game.manufacturer.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-ck-text-faint tracking-[1px] mb-0.5">
              RTP RANGE
            </div>
            <div className="text-sm font-bold text-ck-accent">
              {rtpLow}%–{rtpHigh}%
            </div>
          </div>
          <div>
            <div className="text-xs text-ck-text-faint tracking-[1px] mb-0.5">
              DENOMINATION
            </div>
            <div className="text-sm text-ck-text-secondary">{game.typicalDenomination}</div>
          </div>
        </div>

        {/* Strip Presence */}
        <div className="border-l-2 border-ck-border pl-3 mb-3">
          <div className="text-xs text-ck-text-faint tracking-[1px] mb-0.5">
            ON THE STRIP
          </div>
          <div className="text-xs text-ck-text-secondary leading-relaxed">
            {game.stripPresence}
          </div>
        </div>

        {/* Expand indicator */}
        <div className="flex items-center gap-1">
          <div className="text-xs text-ck-text-faint tracking-[1px] group-hover:text-ck-text-muted transition-colors">
            {expanded ? "▲ LESS" : "▼ FULL DETAILS"}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div
          className="border-t border-ck-border-subtle px-5 py-4 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Description */}
          <div>
            <div className="text-xs text-ck-accent tracking-[1px] mb-1.5">ABOUT</div>
            <p className="text-xs text-ck-text-secondary leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Tip */}
          <div className="bg-ck-bg border-l-[3px] border-ck-accent px-4 py-3">
            <div className="text-xs text-ck-accent tracking-[1px] mb-1">TIP</div>
            <p className="text-xs text-ck-text-secondary leading-relaxed">{game.tip}</p>
          </div>

          {/* Bonus Features */}
          <div>
            <div className="text-xs text-ck-accent tracking-[1px] mb-2">
              BONUS FEATURES
            </div>
            <div className="flex flex-wrap gap-1.5">
              {game.bonusFeatures.map((feature) => (
                <span
                  key={feature}
                  className="text-xs border border-ck-border-subtle px-2 py-0.5 text-ck-text-muted"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* More stats */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="text-xs text-ck-text-faint tracking-[1px] mb-0.5">
                PAYLINES
              </div>
              <div className="text-xs text-ck-text-secondary">{game.paylines}</div>
            </div>
            <div>
              <div className="text-xs text-ck-text-faint tracking-[1px] mb-0.5">
                MAX BET
              </div>
              <div className="text-xs text-ck-text-secondary">{game.maxBet}</div>
            </div>
            <div>
              <div className="text-xs text-ck-text-faint tracking-[1px] mb-0.5">
                RTP SOURCE
              </div>
              <div className="text-xs text-ck-text-muted">{game.rtpSource}</div>
            </div>
            <div>
              <div className="text-xs text-ck-text-faint tracking-[1px] mb-0.5">
                TYPE
              </div>
              <div className="text-xs text-ck-text-muted tracking-[1px]">
                {game.category.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
