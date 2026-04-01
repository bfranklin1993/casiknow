import { type Card, displayRank, isRedCard } from "@/lib/blackjack-engine";

interface PlayingCardProps {
  card: Card;
  faceDown?: boolean;
}

export default function PlayingCard({ card, faceDown = false }: PlayingCardProps) {
  if (faceDown) {
    return (
      <div className="w-16 h-[92px] rounded-md bg-gradient-to-br from-blue-900 to-blue-800 shadow-lg flex items-center justify-center border border-blue-700">
        <div className="w-10 h-14 border border-blue-600/30 rounded-sm" />
      </div>
    );
  }

  const color = isRedCard(card) ? "text-red-600" : "text-gray-900";
  const rank = displayRank(card);

  return (
    <div className="w-16 h-[92px] rounded-md bg-white shadow-lg flex flex-col justify-between p-1.5 border border-gray-200 relative">
      {/* Top-left index */}
      <div className={`${color} leading-none`}>
        <div className="text-sm font-bold">{rank}</div>
        <div className="text-xs -mt-0.5">{card.suit}</div>
      </div>

      {/* Center suit */}
      <div className={`${color} text-2xl text-center absolute inset-0 flex items-center justify-center`}>
        {card.suit}
      </div>

      {/* Bottom-right index (rotated) */}
      <div className={`${color} leading-none self-end rotate-180`}>
        <div className="text-sm font-bold">{rank}</div>
        <div className="text-xs -mt-0.5">{card.suit}</div>
      </div>
    </div>
  );
}
