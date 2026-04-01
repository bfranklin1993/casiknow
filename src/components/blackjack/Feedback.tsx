import { type Action, ACTION_LABELS } from "@/data/blackjack-strategy";

interface FeedbackProps {
  correct: boolean;
  chosenAction: Action;
  correctAction: Action;
  explanation: string;
}

export default function Feedback({
  correct,
  chosenAction,
  correctAction,
  explanation,
}: FeedbackProps) {
  if (correct) {
    return (
      <div className="px-7 py-4 bg-[#1a2a1a] border-l-[3px] border-ck-good">
        <div className="text-xs text-ck-good font-bold">
          ✓ CORRECT: {ACTION_LABELS[correctAction].toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <div className="px-7 py-4 bg-[#2a1a1a] border-l-[3px] border-ck-bad">
      <div className="text-xs text-ck-bad mb-1">
        ✗ YOU CHOSE: {ACTION_LABELS[chosenAction].toUpperCase()}
      </div>
      <div className="text-sm text-ck-good mb-2">
        CORRECT PLAY: {ACTION_LABELS[correctAction].toUpperCase()}
      </div>
      <div className="text-xs text-ck-text-secondary leading-relaxed">
        {explanation}
      </div>
    </div>
  );
}
