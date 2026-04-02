"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  SLOT_GAMES,
  VOLATILITY_ORDER,
  type CategoryFilter,
  type SortOption,
} from "@/data/slot-games";
import GameCard from "@/components/slots/GameCard";

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "classic", label: "CLASSIC" },
  { value: "video", label: "VIDEO" },
  { value: "progressive", label: "PROGRESSIVE" },
  { value: "megaways", label: "MEGAWAYS" },
  { value: "branded", label: "BRANDED" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "POPULARITY" },
  { value: "rtp", label: "RTP" },
  { value: "volatility", label: "VOLATILITY" },
];

export default function SlotGamesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortOption>("popularity");

  const filtered = useMemo(() => {
    let games = [...SLOT_GAMES];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      games = games.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.manufacturer.toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      games = games.filter((g) => g.category === category);
    }

    switch (sort) {
      case "popularity":
        games.sort((a, b) => b.popularity - a.popularity);
        break;
      case "rtp":
        games.sort((a, b) => b.rtpRange[1] - a.rtpRange[1]);
        break;
      case "volatility":
        games.sort(
          (a, b) => VOLATILITY_ORDER[a.volatility] - VOLATILITY_ORDER[b.volatility]
        );
        break;
    }

    return games;
  }, [search, category, sort]);

  return (
    <div className="bg-ck-bg -mx-6 -mt-8">
      {/* Header */}
      <div className="border-b border-ck-border px-7 py-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-ck-accent tracking-[3px]">
              VEGAS STRIP SLOT GUIDE
            </h1>
            <span className="text-xs text-ck-text-dim">
              {SLOT_GAMES.length} GAMES — REAL RTP RANGES
            </span>
          </div>
          {/* Tab nav */}
          <div className="flex items-center gap-0">
            <Link
              href="/slots"
              className="px-4 py-2 text-xs tracking-[1px] border border-ck-border-subtle text-ck-text-muted hover:text-ck-text-secondary hover:border-ck-border transition-colors"
            >
              OPTIMIZER
            </Link>
            <div className="px-4 py-2 text-xs tracking-[1px] border border-ck-accent bg-ck-bg-tertiary text-ck-accent">
              GAME GUIDE
            </div>
          </div>
        </div>
      </div>

      {/* Strip intro note */}
      <div className="border-b border-ck-border-subtle px-7 py-4 bg-ck-bg-secondary">
        <p className="text-sm text-ck-text-secondary leading-relaxed">
          These are the most common slot machines you&apos;ll find on the Las Vegas Strip — what they pay, how they play, and where to find them.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="border-b border-ck-border-subtle px-7 py-5 bg-ck-bg-secondary">
        {/* Search */}
        <div className="mb-4">
          <div className="flex items-center bg-ck-border-subtle px-3.5 py-2.5 max-w-sm">
            <span className="text-ck-text-faint text-sm mr-2 tracking-[1px]">
              SEARCH
            </span>
            <input
              type="text"
              placeholder="Game name or manufacturer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-ck-text-primary text-sm w-full outline-none placeholder:text-ck-text-faint"
            />
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`px-3 py-1.5 text-xs font-bold tracking-[1px] transition-colors ${
                category === value
                  ? "bg-ck-accent text-ck-bg"
                  : "bg-ck-border-subtle text-ck-text-muted hover:text-ck-text-secondary hover:bg-ck-border"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-ck-text-faint tracking-[1px]">SORT BY</span>
          {SORT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSort(value)}
              className={`px-3 py-1.5 text-xs font-bold tracking-[1px] transition-colors border ${
                sort === value
                  ? "border-ck-accent text-ck-accent bg-ck-bg-tertiary"
                  : "border-ck-border-subtle text-ck-text-muted hover:border-ck-border hover:text-ck-text-secondary"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="text-xs text-ck-text-faint ml-2">
            {filtered.length} GAME{filtered.length !== 1 ? "S" : ""}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-7 py-3 border-b border-ck-border-subtle bg-ck-bg-secondary">
        <p className="text-xs text-ck-text-faint leading-relaxed">
          RTP ranges are manufacturer-stated theoretical returns. Individual machines are configured by the casino within these ranges. Actual RTP varies by property and configuration.
        </p>
      </div>

      {/* Game Grid */}
      <div className="px-7 py-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-ck-text-muted text-sm tracking-[1px]">
              NO GAMES MATCH YOUR SEARCH
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
