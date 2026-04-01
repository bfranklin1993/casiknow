"use client";

import { useState } from "react";
import { type SlotGoal } from "@/lib/calculations";

interface SlotInputsProps {
  bankroll: number;
  hours: number;
  goal: SlotGoal;
  onBankrollChange: (v: number) => void;
  onHoursChange: (v: number) => void;
  onGoalChange: (v: SlotGoal) => void;
}

const BANKROLL_PRESETS = [200, 500, 1000, 2000, 5000];
const TIME_OPTIONS = [1, 2, 4, 6, 8];

const GOALS: { value: SlotGoal; label: string; description: string }[] = [
  {
    value: "playtime",
    label: "MAX PLAY TIME",
    description: "Stretch your bankroll as long as possible",
  },
  {
    value: "bighit",
    label: "BEST SHOT AT BIG HIT",
    description: "Higher risk, higher reward potential",
  },
  {
    value: "comps",
    label: "MAXIMIZE COMPS",
    description: "Get the most value back from the casino",
  },
];

export default function SlotInputs({
  bankroll,
  hours,
  goal,
  onBankrollChange,
  onHoursChange,
  onGoalChange,
}: SlotInputsProps) {
  const [customBankroll, setCustomBankroll] = useState("");
  const isPreset = BANKROLL_PRESETS.includes(bankroll);

  function handleCustomBankroll(val: string) {
    setCustomBankroll(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed >= 100) {
      onBankrollChange(parsed);
    }
  }

  function handlePresetClick(preset: number) {
    setCustomBankroll("");
    onBankrollChange(preset);
  }

  return (
    <div className="bg-ck-bg-secondary border-b border-ck-border-subtle px-7 py-8">
      <div className="text-xs text-ck-text-muted tracking-[1px] mb-6">
        YOUR SESSION
      </div>

      {/* Bankroll */}
      <div className="mb-7">
        <div className="text-xs text-ck-text-secondary mb-3 tracking-[1px]">
          BANKROLL
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {BANKROLL_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={`px-5 py-3 text-sm font-bold tracking-[1px] transition-colors min-w-[72px] ${
                bankroll === preset && !customBankroll
                  ? "bg-ck-accent text-ck-bg"
                  : "bg-ck-border-subtle text-ck-text-secondary hover:text-ck-text-primary hover:bg-ck-border"
              }`}
            >
              ${preset.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="flex items-center bg-ck-border-subtle px-3.5 py-2.5 max-w-[180px]">
          <span className="text-ck-text-muted text-base mr-1">$</span>
          <input
            type="number"
            min={100}
            max={50000}
            step={100}
            placeholder="Custom"
            value={customBankroll}
            onChange={(e) => handleCustomBankroll(e.target.value)}
            className="bg-transparent text-ck-accent text-base w-full outline-none placeholder:text-ck-text-faint"
          />
        </div>
      </div>

      {/* Time */}
      <div className="mb-7">
        <div className="text-xs text-ck-text-secondary mb-3 tracking-[1px]">
          SESSION LENGTH
        </div>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((h) => (
            <button
              key={h}
              onClick={() => onHoursChange(h)}
              className={`px-5 py-3 text-sm font-bold tracking-[1px] transition-colors ${
                hours === h
                  ? "bg-ck-accent text-ck-bg"
                  : "bg-ck-border-subtle text-ck-text-secondary hover:text-ck-text-primary hover:bg-ck-border"
              }`}
            >
              {h}HR
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <div className="text-xs text-ck-text-secondary mb-3 tracking-[1px]">
          GOAL
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {GOALS.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => onGoalChange(value)}
              className={`text-left px-5 py-4 border transition-colors ${
                goal === value
                  ? "border-ck-accent bg-ck-bg-tertiary"
                  : "border-ck-border-subtle bg-ck-bg hover:border-ck-border hover:bg-ck-bg-tertiary"
              }`}
            >
              <div
                className={`text-xs font-bold tracking-[1px] mb-1.5 ${
                  goal === value ? "text-ck-accent" : "text-ck-text-secondary"
                }`}
              >
                {label}
              </div>
              <div className="text-xs text-ck-text-muted leading-relaxed">
                {description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
