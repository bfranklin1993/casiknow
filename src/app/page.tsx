import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CasiKnow — Know the House. Beat the Odds.",
};

const TOOLS = [
  { href: "/house-edge", label: "HOUSE EDGE", desc: "Every casino bet ranked by what it actually costs you." },
  { href: "/slots", label: "SLOTS", desc: "Your bankroll + your goals → what to play and how to bet." },
  { href: "/blackjack", label: "BLACKJACK", desc: "Practice basic strategy until it's automatic." },
  { href: "/craps", label: "CRAPS", desc: "Interactive table guide + bankroll-based strategies." },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-ck-accent font-bold text-3xl tracking-[4px] mb-2">CASIKNOW</h1>
      <p className="text-ck-text-secondary text-xs tracking-[2px] mb-16">KNOW THE HOUSE. BEAT THE ODDS.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {TOOLS.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="border border-ck-border p-6 hover:border-ck-accent transition-colors group"
          >
            <div className="text-sm font-bold tracking-[2px] text-ck-text-primary group-hover:text-ck-accent mb-2">{label}</div>
            <div className="text-xs text-ck-text-secondary leading-relaxed">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
