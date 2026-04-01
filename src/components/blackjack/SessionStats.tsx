interface MissedHand {
  label: string;
  correct: number;
  total: number;
}

interface SessionStatsProps {
  hands: number;
  correct: number;
  streak: number;
  mostMissed: MissedHand[];
}

export default function SessionStats({
  hands,
  correct,
  streak,
  mostMissed,
}: SessionStatsProps) {
  const accuracy = hands > 0 ? Math.round((correct / hands) * 100) : 0;

  return (
    <div className="bg-ck-bg-secondary border-t border-ck-border-subtle px-7 py-5 flex justify-between items-start flex-wrap gap-4">
      <div className="flex gap-6">
        <div>
          <div className="text-[10px] text-ck-text-muted tracking-[1px]">
            HANDS
          </div>
          <div className="text-lg font-bold text-ck-text-primary">{hands}</div>
        </div>
        <div>
          <div className="text-[10px] text-ck-text-muted tracking-[1px]">
            ACCURACY
          </div>
          <div className={`text-lg font-bold ${accuracy >= 80 ? "text-ck-good" : accuracy >= 60 ? "text-ck-caution" : "text-ck-bad"}`}>
            {accuracy}%
          </div>
        </div>
        <div>
          <div className="text-[10px] text-ck-text-muted tracking-[1px]">
            STREAK
          </div>
          <div className="text-lg font-bold text-ck-accent">{streak}</div>
        </div>
      </div>
      {mostMissed.length > 0 && (
        <div>
          <div className="text-[10px] text-ck-text-muted tracking-[1px] mb-1">
            MOST MISSED
          </div>
          {mostMissed.slice(0, 3).map((m) => (
            <div key={m.label} className="text-xs text-ck-bad">
              {m.label} ({m.correct}/{m.total})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
