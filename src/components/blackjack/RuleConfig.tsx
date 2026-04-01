"use client";

import { type RuleSet } from "@/data/blackjack-strategy";

interface RuleConfigProps {
  rules: RuleSet;
  onChange: (rules: RuleSet) => void;
}

export default function RuleConfig({ rules, onChange }: RuleConfigProps) {
  const toggle = <K extends keyof RuleSet>(key: K, options: RuleSet[K][]) => (
    <div className="flex gap-1.5">
      {options.map((opt) => (
        <button
          key={String(opt)}
          onClick={() => onChange({ ...rules, [key]: opt })}
          className={`text-xs px-2.5 py-1 transition-colors ${
            rules[key] === opt
              ? "bg-ck-accent text-ck-bg font-bold"
              : "bg-ck-border-subtle text-ck-text-secondary"
          }`}
        >
          {String(opt).toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="border-b border-ck-border px-7 py-4">
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-ck-text-muted">PAYOUT</span>
          {toggle("payout", ["3:2", "6:5"])}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ck-text-muted">DEALER</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onChange({ ...rules, dealerHitsSoft17: false })}
              className={`text-xs px-2.5 py-1 ${
                !rules.dealerHitsSoft17
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary"
              }`}
            >
              S17
            </button>
            <button
              onClick={() => onChange({ ...rules, dealerHitsSoft17: true })}
              className={`text-xs px-2.5 py-1 ${
                rules.dealerHitsSoft17
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary"
              }`}
            >
              H17
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ck-text-muted">DECKS</span>
          {toggle("decks", [1, 2, 6, 8])}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ck-text-muted">DAS</span>
          <button
            onClick={() =>
              onChange({ ...rules, doubleAfterSplit: !rules.doubleAfterSplit })
            }
            className={`text-xs px-2.5 py-1 ${
              rules.doubleAfterSplit
                ? "bg-ck-good text-ck-bg font-bold"
                : "bg-ck-border-subtle text-ck-text-secondary"
            }`}
          >
            {rules.doubleAfterSplit ? "ON" : "OFF"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ck-text-muted">SURRENDER</span>
          {toggle("surrender", ["none", "late"])}
        </div>
      </div>
    </div>
  );
}
