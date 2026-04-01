export interface Card {
  rank: string; // "2"-"9", "T", "J", "Q", "K", "A"
  suit: "♠" | "♥" | "♦" | "♣";
  value: number; // 2-11 (Ace = 11)
}

export interface Hand {
  cards: Card[];
  total: number;
  isSoft: boolean;
  isBust: boolean;
  isPair: boolean;
  pairValue: number | null; // value of the pair card (for strategy lookup)
}

const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const SUITS: Card["suit"][] = ["♠", "♥", "♦", "♣"];

function rankToValue(rank: string): number {
  if (rank === "A") return 11;
  if (["T", "J", "Q", "K"].includes(rank)) return 10;
  return parseInt(rank);
}

/**
 * Create a shuffled deck (or shoe).
 */
export function createShoe(numDecks: number): Card[] {
  const cards: Card[] = [];
  for (let d = 0; d < numDecks; d++) {
    for (const rank of RANKS) {
      for (const suit of SUITS) {
        cards.push({ rank, suit, value: rankToValue(rank) });
      }
    }
  }
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/**
 * Evaluate a hand: calculate total, soft status, bust status.
 */
export function evaluateHand(cards: Card[]): Hand {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    total += card.value;
    if (card.rank === "A") aces++;
  }

  // Reduce aces from 11 to 1 as needed
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  const isSoft = aces > 0 && total <= 21;
  const isBust = total > 21;

  // Check for pair (only on initial 2-card hand)
  let isPair = false;
  let pairValue: number | null = null;
  if (cards.length === 2) {
    const v1 = cards[0].rank === "A" ? 1 : rankToValue(cards[0].rank);
    const v2 = cards[1].rank === "A" ? 1 : rankToValue(cards[1].rank);
    if (v1 === v2) {
      isPair = true;
      pairValue = v1;
    }
  }

  return { cards, total, isSoft, isBust, isPair, pairValue };
}

/**
 * Deal a new hand for the trainer.
 * Returns dealer upcard + hole card, and player's 2-card hand.
 */
export function dealHand(shoe: Card[]): {
  dealerCards: Card[];
  playerCards: Card[];
  remainingShoe: Card[];
} {
  if (shoe.length < 10) {
    // Reshuffle if shoe is low
    shoe = createShoe(6);
  }

  const remaining = [...shoe];
  const playerCards = [remaining.pop()!, remaining.pop()!];
  const dealerCards = [remaining.pop()!, remaining.pop()!];

  return {
    dealerCards,
    playerCards,
    remainingShoe: remaining,
  };
}

/**
 * Get the display string for a card's upcard (for strategy lookup).
 * Face cards map to "T", Ace to "A".
 */
export function cardToStrategyKey(card: Card): string {
  if (["T", "J", "Q", "K"].includes(card.rank)) return "T";
  return card.rank;
}

/**
 * Get display rank for a card (show J, Q, K instead of T).
 */
export function displayRank(card: Card): string {
  return card.rank === "T" ? "10" : card.rank;
}

/**
 * Check if a card is red (hearts or diamonds).
 */
export function isRedCard(card: Card): boolean {
  return card.suit === "♥" || card.suit === "♦";
}
