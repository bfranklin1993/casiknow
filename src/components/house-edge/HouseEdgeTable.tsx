"use client";

import { useState, useMemo } from "react";
import {
  HOUSE_EDGE_DATA,
  GAME_CATEGORIES,
  type GameCategory,
  type CasinoBet,
  edgeToRating,
} from "@/data/house-edges";
import FilterPills from "@/components/FilterPills";
import StarRating from "@/components/StarRating";
import EdgeBadge from "@/components/EdgeBadge";
import { evPerHour } from "@/lib/calculations";

type SortField = "edge" | "evPerHour" | "rating" | "game";
type SortDir = "asc" | "desc";

export default function HouseEdgeTable() {
  const [filter, setFilter] = useState<GameCategory>("ALL");
  const [avgBet, setAvgBet] = useState(25);
  const [sortField, setSortField] = useState<SortField>("edge");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data =
      filter === "ALL"
        ? HOUSE_EDGE_DATA
        : HOUSE_EDGE_DATA.filter((d) => d.game === filter);

    data = [...data].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "edge":
          cmp = a.edge - b.edge;
          break;
        case "evPerHour":
          cmp =
            evPerHour(avgBet, a.edge, a.handsPerHour) -
            evPerHour(avgBet, b.edge, b.handsPerHour);
          break;
        case "rating":
          cmp = edgeToRating(b.edge) - edgeToRating(a.edge);
          break;
        case "game":
          cmp = a.game.localeCompare(b.game);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [filter, sortField, sortDir, avgBet]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="bg-ck-bg">
      {/* Header */}
      <div className="border-b border-ck-border px-7 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-base font-bold text-ck-accent tracking-[3px]">
            HOUSE EDGE COMPARISON
          </h1>
          <span className="text-[11px] text-ck-text-dim">
            {filtered.length} BETS · {new Set(filtered.map((d) => d.game)).size}{" "}
            GAMES
          </span>
        </div>
        <FilterPills
          options={GAME_CATEGORIES as unknown as string[]}
          selected={filter}
          onChange={(v) => setFilter(v as GameCategory)}
        />
      </div>

      {/* Settings */}
      <div className="bg-ck-bg-secondary border-b border-ck-border-subtle px-7 py-3 flex gap-6 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ck-text-muted tracking-[1px]">
            AVG BET
          </span>
          <div className="flex items-center bg-ck-border-subtle px-2.5 py-0.5">
            <span className="text-ck-text-muted text-[13px]">$</span>
            <input
              type="number"
              min={1}
              max={10000}
              value={avgBet}
              onChange={(e) => setAvgBet(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-transparent text-ck-accent text-[13px] w-16 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ck-text-muted tracking-[1px]">
            SORT BY
          </span>
          <button
            onClick={() => toggleSort("edge")}
            className={`text-[13px] px-2.5 py-0.5 ${
              sortField === "edge"
                ? "bg-ck-accent text-ck-bg font-bold"
                : "bg-ck-border-subtle text-ck-text-secondary"
            }`}
          >
            EDGE{sortIndicator("edge")}
          </button>
          <button
            onClick={() => toggleSort("evPerHour")}
            className={`text-[13px] px-2.5 py-0.5 ${
              sortField === "evPerHour"
                ? "bg-ck-accent text-ck-bg font-bold"
                : "bg-ck-border-subtle text-ck-text-secondary"
            }`}
          >
            EV/HR{sortIndicator("evPerHour")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ck-border">
              <th className="text-left px-7 py-2.5 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                GAME
              </th>
              <th className="text-left px-2 py-2.5 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                BET / RULES
              </th>
              <th className="text-right px-2 py-2.5 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                EDGE
              </th>
              <th className="text-right px-2 py-2.5 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                EV/HR
              </th>
              <th className="text-right px-7 py-2.5 text-[10px] text-ck-text-muted font-normal tracking-[1px]">
                RATING
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bet) => (
              <BetRow
                key={bet.id}
                bet={bet}
                avgBet={avgBet}
                isExpanded={expandedId === bet.id}
                onToggle={() =>
                  setExpandedId(expandedId === bet.id ? null : bet.id)
                }
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-7 py-4 text-right">
        <span className="text-[10px] text-ck-text-faint">
          CLICK ANY ROW FOR DETAILS · ALL EDGES SOURCED & VERIFIED
        </span>
      </div>
    </div>
  );
}

function BetRow({
  bet,
  avgBet,
  isExpanded,
  onToggle,
}: {
  bet: CasinoBet;
  avgBet: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ev = evPerHour(avgBet, bet.edge, bet.handsPerHour);
  const rating = edgeToRating(bet.edge);

  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-b border-ck-bg-tertiary cursor-pointer hover:bg-ck-bg-tertiary transition-colors ${
          isExpanded ? "bg-[#1f1f1a]" : ""
        }`}
      >
        <td className="px-7 py-2.5 text-ck-text-secondary">{bet.game}</td>
        <td className="px-2 py-2.5 text-ck-text-primary">
          {bet.bet}
          {bet.rules && (
            <span className="text-ck-text-muted"> · {bet.rules}</span>
          )}
        </td>
        <td className="text-right px-2 py-2.5">
          <EdgeBadge edge={bet.edge} />
        </td>
        <td className="text-right px-2 py-2.5 text-ck-text-secondary">
          {ev === 0 ? "$0.00" : `−$${Math.abs(ev).toFixed(2)}`}
        </td>
        <td className="text-right px-7 py-2.5">
          <StarRating rating={rating} />
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className="p-0">
            <div className="mx-7 my-0 bg-ck-bg-tertiary border-l-[3px] border-ck-accent px-5 py-4">
              <div className="text-[11px] text-ck-accent tracking-[1px] mb-2">
                ▼ {bet.game} · {bet.bet}
                {bet.rules ? ` · ${bet.rules}` : ""}
              </div>
              <div className="text-xs text-ck-text-secondary leading-relaxed space-y-2">
                <p>{bet.description}</p>
                <p className="text-ck-text-secondary">
                  <span className="text-ck-text-muted">TIP:</span> {bet.tip}
                </p>
                <p className="text-[10px] text-ck-text-faint">
                  Source: {bet.source}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
