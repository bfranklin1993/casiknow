"use client";

import { type SlotGoal } from "@/lib/calculations";

interface SlotInputsProps {
  bankroll: number;
  hours: number;
  goal: SlotGoal;
  onBankrollChange: (v: number) => void;
  onHoursChange: (v: number) => void;
  onGoalChange: (v: SlotGoal) => void;
}

const GOALS: { value: SlotGoal; label: string }[] = [
  { value: "playtime", label: "MAX PLAY TIME" },
  { value: "bighit", label: "BEST SHOT AT BIG HIT" },
  { value: "comps", label: "MAXIMIZE COMPS" },
];

export default function SlotInputs({
  bankroll,
  hours,
  goal,
  onBankrollChange,
  onHoursChange,
  onGoalChange,
}: SlotInputsProps) {
  return (
    <div className="bg-ck-bg-secondary border-b border-ck-border-subtle px-7 py-6">
      <div className="text-[10px] text-ck-text-muted tracking-[1px] mb-4">
        YOUR SESSION
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="text-[10px] text-ck-text-secondary mb-1.5">
            BANKROLL
          </div>
          <div className="flex items-center bg-ck-border-subtle px-3.5 py-2.5">
            <span className="text-ck-text-muted text-lg mr-1">$</span>
            <input
              type="number"
              min={100}
              max={10000}
              step={100}
              value={bankroll}
              onChange={(e) =>
                onBankrollChange(Math.max(100, parseInt(e.target.value) || 100))
              }
              className="bg-transparent text-ck-accent text-lg w-full outline-none"
            />
          </div>
        </div>
        <div>
          <div className="text-[10px] text-ck-text-secondary mb-1.5">
            TIME (HOURS)
          </div>
          <div className="bg-ck-border-subtle px-3.5 py-2.5">
            <input
              type="number"
              min={1}
              max={8}
              value={hours}
              onChange={(e) =>
                onHoursChange(
                  Math.min(8, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
              className="bg-transparent text-ck-accent text-lg w-full outline-none"
            />
          </div>
        </div>
        <div>
          <div className="text-[10px] text-ck-text-secondary mb-1.5">GOAL</div>
          <div className="flex flex-col gap-1">
            {GOALS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onGoalChange(value)}
                className={`text-left px-3 py-1.5 text-[11px] transition-colors ${
                  goal === value
                    ? "bg-ck-accent text-ck-bg font-bold"
                    : "bg-ck-border-subtle text-ck-text-secondary hover:text-ck-text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
