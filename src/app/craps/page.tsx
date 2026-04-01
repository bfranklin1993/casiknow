"use client";

import { useState } from "react";
import { CRAPS_BETS } from "@/data/craps-bets";
import CrapsTableDiagram from "@/components/craps/CrapsTableDiagram";
import BetDetail from "@/components/craps/BetDetail";
import StrategyTiers from "@/components/craps/StrategyTiers";
import CrapsBetsRanked from "@/components/craps/CrapsBetsRanked";

type Mode = "learn" | "strategy";

export default function CrapsPage() {
  const [mode, setMode] = useState<Mode>("learn");
  const [selectedBetId, setSelectedBetId] = useState<string | null>(null);

  const selectedBet = CRAPS_BETS.find((b) => b.id === selectedBetId) || null;

  return (
    <div className="bg-ck-bg -mx-6 -mt-8">
      {/* Header */}
      <div className="border-b border-ck-border px-7 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-ck-accent tracking-[3px]">
            CRAPS GUIDE
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("learn")}
              className={`text-xs px-3 py-1.5 tracking-[1px] ${
                mode === "learn"
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary"
              }`}
            >
              LEARN
            </button>
            <button
              onClick={() => setMode("strategy")}
              className={`text-xs px-3 py-1.5 tracking-[1px] ${
                mode === "strategy"
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary"
              }`}
            >
              STRATEGY
            </button>
          </div>
        </div>
      </div>

      {mode === "learn" ? (
        <>
          <CrapsTableDiagram
            selectedBetId={selectedBetId}
            onSelectBet={setSelectedBetId}
          />
          {selectedBet && <BetDetail bet={selectedBet} />}
        </>
      ) : (
        <StrategyTiers />
      )}

      <CrapsBetsRanked />
    </div>
  );
}
