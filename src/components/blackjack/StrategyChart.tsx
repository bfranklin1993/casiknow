"use client";

import { useState } from "react";
import {
  DEALER_CARDS,
  HARD_CHART_6D_S17_DAS,
  SOFT_CHART_6D_S17_DAS,
  PAIRS_CHART_6D_S17_DAS,
  ACTION_COLORS,
  type Action,
} from "@/data/blackjack-strategy";

type ChartTab = "hard" | "soft" | "pairs";

interface StrategyChartProps {
  highlightRow?: number | null;
  highlightCol?: number | null;
  activeTab?: ChartTab;
}

const HARD_ROW_LABELS = [
  "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17",
  "18", "19", "20", "21",
];
const SOFT_ROW_LABELS = ["A,2", "A,3", "A,4", "A,5", "A,6", "A,7", "A,8", "A,9"];
const PAIR_ROW_LABELS = [
  "2,2", "3,3", "4,4", "5,5", "6,6", "7,7", "8,8", "9,9", "T,T", "A,A",
];

export default function StrategyChart({
  highlightRow,
  highlightCol,
  activeTab: initialTab,
}: StrategyChartProps) {
  const [tab, setTab] = useState<ChartTab>(initialTab || "hard");

  const chart =
    tab === "hard"
      ? HARD_CHART_6D_S17_DAS
      : tab === "soft"
        ? SOFT_CHART_6D_S17_DAS
        : PAIRS_CHART_6D_S17_DAS;

  const rowLabels =
    tab === "hard"
      ? HARD_ROW_LABELS
      : tab === "soft"
        ? SOFT_ROW_LABELS
        : PAIR_ROW_LABELS;

  return (
    <div className="border-t border-ck-border-subtle px-7 py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] text-ck-accent tracking-[1px]">
          STRATEGY CHART — 6 DECK, S17, DAS
        </div>
        <div className="flex gap-1.5">
          {(["hard", "soft", "pairs"] as ChartTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] px-2.5 py-1 tracking-[1px] ${
                tab === t
                  ? "bg-ck-accent text-ck-bg font-bold"
                  : "bg-ck-border-subtle text-ck-text-secondary"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px] text-center">
          <thead>
            <tr>
              <th className="py-1.5 px-1 text-left text-ck-text-muted font-normal text-[10px]">
                YOU ╲ DEALER
              </th>
              {DEALER_CARDS.map((d, i) => (
                <th
                  key={d}
                  className={`py-1.5 w-8 font-normal ${
                    highlightCol === i
                      ? "text-ck-accent font-bold"
                      : "text-ck-text-secondary"
                  }`}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`border-b border-ck-bg-tertiary ${
                  highlightRow === rowIdx ? "bg-[#1f1f1a]" : ""
                }`}
              >
                <td
                  className={`py-1.5 px-1 text-left ${
                    highlightRow === rowIdx
                      ? "text-ck-accent font-bold"
                      : "text-ck-text-secondary"
                  }`}
                >
                  {rowLabels[rowIdx]}
                  {highlightRow === rowIdx ? " ◀" : ""}
                </td>
                {row.map((action, colIdx) => {
                  const isHighlight =
                    highlightRow === rowIdx && highlightCol === colIdx;
                  const colorClass = ACTION_COLORS[action as Action] || "text-ck-text-secondary";
                  return (
                    <td
                      key={colIdx}
                      className={`py-1.5 ${colorClass} ${
                        isHighlight ? "font-bold underline" : ""
                      }`}
                    >
                      {action}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-ck-text-faint mt-2">
        S = STAND · H = HIT · D = DOUBLE · P = SPLIT · R = SURRENDER · HIGHLIGHTED
        = CURRENT HAND
      </div>
    </div>
  );
}
