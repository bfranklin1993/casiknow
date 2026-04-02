"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DENOMINATION_DATA,
  DEFAULT_SPINS_PER_HOUR,
} from "@/data/slot-math";
import {
  type SlotGoal,
  recommendDenomination,
  antiRecommendation,
} from "@/lib/calculations";
import SlotInputs from "@/components/slots/SlotInputs";
import SlotRecommendation from "@/components/slots/SlotRecommendation";
import SessionProjection from "@/components/slots/SessionProjection";
import CompValue from "@/components/slots/CompValue";
import DenomTable from "@/components/slots/DenomTable";

export default function SlotsPage() {
  const [bankroll, setBankroll] = useState(500);
  const [hours, setHours] = useState(4);
  const [goal, setGoal] = useState<SlotGoal>("bighit");

  const recommended = recommendDenomination(
    bankroll,
    hours,
    goal,
    DENOMINATION_DATA,
    DEFAULT_SPINS_PER_HOUR
  );
  const antiRec = antiRecommendation(goal, DENOMINATION_DATA);

  return (
    <div className="bg-ck-bg -mx-6 -mt-8">
      {/* Header */}
      <div className="border-b border-ck-border px-7 py-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-ck-accent tracking-[3px]">
              SLOT OPTIMIZER
            </h1>
            <span className="text-xs text-ck-text-dim">FIND YOUR EDGE</span>
          </div>
          {/* Tab nav */}
          <div className="flex items-center gap-0">
            <div className="px-4 py-2 text-xs tracking-[1px] border border-ck-accent bg-ck-bg-tertiary text-ck-accent">
              OPTIMIZER
            </div>
            <Link
              href="/slots/games"
              className="px-4 py-2 text-xs tracking-[1px] border border-ck-border-subtle text-ck-text-muted hover:text-ck-text-secondary hover:border-ck-border transition-colors"
            >
              GAME GUIDE
            </Link>
          </div>
        </div>
      </div>

      <SlotInputs
        bankroll={bankroll}
        hours={hours}
        goal={goal}
        onBankrollChange={setBankroll}
        onHoursChange={setHours}
        onGoalChange={setGoal}
      />
      <SlotRecommendation
        recommended={recommended}
        antiRec={antiRec}
        goal={goal}
      />
      <SessionProjection
        recommended={recommended}
        bankroll={bankroll}
        hours={hours}
      />
      <CompValue recommended={recommended} bankroll={bankroll} hours={hours} />
      <DenomTable
        denominations={DENOMINATION_DATA}
        recommendedDenom={recommended.denomination}
        bankroll={bankroll}
        hours={hours}
      />
    </div>
  );
}
