import { type Card, displayRank, isRedCard } from "@/lib/blackjack-engine";

interface PlayingCardProps {
  card: Card;
  faceDown?: boolean;
}

export default function PlayingCard({ card, faceDown = false }: PlayingCardProps) {
  if (faceDown) {
    return (
      <div className="w-20 h-28 rounded-[4px] shadow-lg border border-blue-700 overflow-hidden" style={{ background: "#1a3a6a" }}>
        {/* Crosshatch pattern via repeating linear gradient */}
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 8px)",
          }}
        />
      </div>
    );
  }

  const isRed = isRedCard(card);
  const color = isRed ? "#dc2626" : "#111827";
  const rank = displayRank(card);

  return (
    <div
      className="w-20 h-28 rounded-[4px] bg-white shadow-md border border-gray-200 relative select-none"
      style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)" }}
    >
      {/* Top-left index */}
      <div
        className="absolute top-1.5 left-1.5 leading-none font-bold"
        style={{ color }}
      >
        <div className="text-sm leading-none">{rank}</div>
        <div className="text-xs leading-none mt-0.5">{card.suit}</div>
      </div>

      {/* Center — large rank + suit */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-0.5"
        style={{ color }}
      >
        <div className="text-3xl font-bold leading-none">{rank}</div>
        <div className="text-2xl leading-none">{card.suit}</div>
      </div>

      {/* Bottom-right index (rotated 180°) */}
      <div
        className="absolute bottom-1.5 right-1.5 leading-none font-bold rotate-180"
        style={{ color }}
      >
        <div className="text-sm leading-none">{rank}</div>
        <div className="text-xs leading-none mt-0.5">{card.suit}</div>
      </div>
    </div>
  );
}
