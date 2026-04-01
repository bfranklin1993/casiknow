"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/house-edge", label: "HOUSE EDGE" },
  { href: "/slots", label: "SLOTS" },
  { href: "/blackjack", label: "BLACKJACK" },
  { href: "/craps", label: "CRAPS" },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-ck-border px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-ck-accent font-bold text-lg tracking-[3px]">
          CASIKNOW
        </Link>
        <div className="hidden md:flex gap-6">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm tracking-[1px] transition-colors ${
                pathname === href
                  ? "text-ck-accent border-b border-ck-accent pb-0.5"
                  : "text-ck-text-secondary hover:text-ck-text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <button
          className="md:hidden text-ck-text-secondary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="text-lg">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 pb-2">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm tracking-[1px] ${
                pathname === href ? "text-ck-accent" : "text-ck-text-secondary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
