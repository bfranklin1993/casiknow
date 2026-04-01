"use client";

import { useState, useCallback, useEffect } from "react";
import {
  type RuleSet,
  type Action,
  DEALER_CARDS,
  getCorrectAction,
  getActionExplanation,
} from "@/data/blackjack-strategy";
import {
  createShoe,
  dealHand,
  evaluateHand,
  cardToStrategyKey,
  type Card,
} from "@/lib/blackjack-engine";
import RuleConfig from "@/components/blackjack/RuleConfig";
import DealArea from "@/components/blackjack/DealArea";
import Feedback from "@/components/blackjack/Feedback";
import SessionStats from "@/components/blackjack/SessionStats";
import StrategyChart from "@/components/blackjack/StrategyChart";

interface HandRecord {
  key: string;
  correct: boolean;
}

export default function BlackjackPage() {
  const [rules, setRules] = useState<RuleSet>({
    payout: "3:2",
    dealerHitsSoft17: false,
    decks: 6,
    doubleAfterSplit: true,
    surrender: "none",
  });

  const [shoe, setShoe] = useState<Card[]>(() => createShoe(6));
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    chosen: Action;
    correctAction: Action;
    explanation: string;
  } | null>(null);
  const [records, setRecords] = useState<HandRecord[]>([]);
  const [streak, setStreak] = useState(0);

  const deal = useCallback(() => {
    const { dealerCards: dc, playerCards: pc, remainingShoe } = dealHand(shoe);
    setDealerCards(dc);
    setPlayerCards(pc);
    setShoe(remainingShoe);
    setFeedback(null);
  }, [shoe]);

  // Deal first hand on mount
  useEffect(() => {
    deal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (feedback) {
        deal();
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "h") handleAction("H");
      if (key === "s") handleAction("S");
      if (key === "d") handleAction("D");
      if (key === "p") handleAction("P");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, dealerCards, playerCards, rules]);

  const playerHand = evaluateHand(playerCards);
  const dealerUpcard = dealerCards[0] ? cardToStrategyKey(dealerCards[0]) : "2";

  const correctAction = getCorrectAction(
    playerHand.total,
    playerHand.isSoft,
    playerHand.isPair,
    playerHand.pairValue,
    dealerUpcard,
    rules
  );

  const handleAction = (chosen: Action) => {
    if (feedback) return;

    const isCorrect = chosen === correctAction;
    const explanation = getActionExplanation(
      playerHand.total,
      playerHand.isSoft,
      dealerUpcard,
      correctAction,
      chosen
    );

    setFeedback({
      correct: isCorrect,
      chosen,
      correctAction,
      explanation,
    });

    const handKey = `${playerHand.isSoft ? "soft" : playerHand.isPair ? "pair" : "hard"}-${playerHand.total}-vs-${dealerUpcard}`;
    setRecords((prev) => [...prev, { key: handKey, correct: isCorrect }]);
    setStreak((prev) => (isCorrect ? prev + 1 : 0));

    // Auto-advance after a short delay
    setTimeout(() => deal(), isCorrect ? 1200 : 3000);
  };

  // Calculate chart highlight position
  let chartHighlightRow: number | null = null;
  let chartTab: "hard" | "soft" | "pairs" = "hard";

  if (playerHand.isPair && playerHand.pairValue !== null) {
    chartTab = "pairs";
    chartHighlightRow = playerHand.pairValue === 1 ? 9 : playerHand.pairValue - 2;
  } else if (playerHand.isSoft) {
    chartTab = "soft";
    chartHighlightRow = playerHand.total - 13;
  } else {
    chartTab = "hard";
    chartHighlightRow = playerHand.total - 5;
  }

  const chartHighlightCol = DEALER_CARDS.indexOf(dealerUpcard);

  // Calculate most missed
  const handMap = new Map<string, { correct: number; total: number }>();
  for (const r of records) {
    const entry = handMap.get(r.key) || { correct: 0, total: 0 };
    entry.total++;
    if (r.correct) entry.correct++;
    handMap.set(r.key, entry);
  }
  const mostMissed = Array.from(handMap.entries())
    .filter(([, v]) => v.correct < v.total)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .slice(0, 3)
    .map(([label, v]) => ({ label, ...v }));

  const totalCorrect = records.filter((r) => r.correct).length;

  return (
    <div className="bg-ck-bg -mx-6 -mt-8">
      {/* Header */}
      <div className="border-b border-ck-border px-7 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-ck-accent tracking-[3px]">
            BLACKJACK TRAINER
          </h1>
          <span className="text-xs text-ck-text-dim">BASIC STRATEGY</span>
        </div>
      </div>

      <RuleConfig rules={rules} onChange={setRules} />
      <DealArea
        dealerCards={dealerCards}
        playerCards={playerCards}
        playerTotal={playerHand.total}
        isSoft={playerHand.isSoft}
        canSplit={playerHand.isPair}
        canSurrender={rules.surrender !== "none"}
        showDealerHole={false}
        onAction={handleAction}
        disabled={!!feedback}
      />
      {feedback && (
        <Feedback
          correct={feedback.correct}
          chosenAction={feedback.chosen}
          correctAction={feedback.correctAction}
          explanation={feedback.explanation}
        />
      )}
      <SessionStats
        hands={records.length}
        correct={totalCorrect}
        streak={streak}
        mostMissed={mostMissed}
      />
      <StrategyChart
        highlightRow={chartHighlightRow}
        highlightCol={chartHighlightCol}
        activeTab={chartTab}
      />
    </div>
  );
}
