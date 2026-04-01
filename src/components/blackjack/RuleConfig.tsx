"use client";

import { type RuleSet } from "@/data/blackjack-strategy";

interface RuleConfigProps {
  rules: RuleSet;
  onChange: (rules: RuleSet) => void;
}

export default function RuleConfig({ rules, onChange }: RuleConfigProps) {
  const toggle = <K extends keyof RuleSet>(key: K, options: RuleSet[K][]) => (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={String(opt)}
          onClick={() => onChange({ ...rules, [key]: opt })}
          className={`text-xs px-3 py-1.5 transition-colors font-semibold tracking-[0.5px] ${
            rules[key] === opt
              ? "bg-ck-accent text-ck-bg font-bold"
              : "bg-ck-border-subtle text-ck-text-secondary hover:text-ck-text-primary"
          }`}
        >
          {String(opt).toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="border-b border-ck-border px-7 py-4">
      <div className="flex gap-5 flex-wrap items-center mb-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-ck-text-muted tracking-[1px]">PAYOUT</span>
          {toggle("payout", ["3:2", "6:5"])}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-ck-text-muted tracking-[1px]">DEALER</span>
          <div className="flex gap-2">
            <button
              onClick={() => onChange({ ...rules, dealerHitsSoft17: false })}
              className={`text-xs px-3 py-1.5 font-semibold tracking-[0.5px] transition-colors ${
                !rules.dealerHitsSoft17
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary hover:text-ck-text-primary"
              }`}
            >
              STANDS SOFT 17
            </button>
            <button
              onClick={() => onChange({ ...rules, dealerHitsSoft17: true })}
              className={`text-xs px-3 py-1.5 font-semibold tracking-[0.5px] transition-colors ${
                rules.dealerHitsSoft17
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary hover:text-ck-text-primary"
              }`}
            >
              HITS SOFT 17
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-ck-text-muted tracking-[1px]">DECKS</span>
          {toggle("decks", [1, 2, 6, 8])}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-ck-text-muted tracking-[1px]">DOUBLE AFTER SPLIT</span>
          <button
            onClick={() =>
              onChange({ ...rules, doubleAfterSplit: !rules.doubleAfterSplit })
            }
            className={`text-xs px-3 py-1.5 font-semibold tracking-[0.5px] transition-colors ${
              rules.doubleAfterSplit
                ? "bg-ck-good text-ck-bg font-bold"
                : "bg-ck-border-subtle text-ck-text-secondary hover:text-ck-text-primary"
            }`}
          >
            {rules.doubleAfterSplit ? "ON" : "OFF"}
          </button>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-ck-text-muted tracking-[1px]">SURRENDER</span>
          {toggle("surrender", ["none", "late"])}
        </div>
      </div>
      <div className="text-xs text-ck-text-faint mt-1">
        These match the rules printed on the felt at your table. If unsure, the defaults are the most common.
      </div>
    </div>
  );
}
