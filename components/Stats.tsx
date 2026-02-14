"use client";

import { PlayerData } from "@/lib/storage";

interface StatsProps {
  data: PlayerData;
  onBack: () => void;
  onPlayAgain: () => void;
}

export default function Stats({ data, onBack, onPlayAgain }: StatsProps) {
  const avgScore =
    data.games.length > 0
      ? Math.round(data.totalScore / data.games.length)
      : 0;

  const recentGames = [...data.games]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <h2 className="font-serif text-2xl font-bold text-cream">Statistics</h2>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Played", value: data.games.length },
          { label: "Total Score", value: data.totalScore },
          { label: "Avg Score", value: avgScore },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 px-4 py-4"
          >
            <span className="font-serif text-3xl font-bold text-accent">
              {value}
            </span>
            <span className="mt-1 text-xs text-cream/40 tracking-wider uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>

      {recentGames.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="mb-3 text-sm font-medium tracking-wider text-cream/40 uppercase">
            Recent Games
          </h3>
          <div className="space-y-2">
            {recentGames.map((game) => (
              <div
                key={game.date}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/3 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-cream/70">{game.date}</p>
                  <p className="text-xs text-cream/30">
                    Letter: {game.letter} &middot;{" "}
                    {game.results.filter((r) => r.valid).length}/
                    {game.results.length} correct
                  </p>
                </div>
                <span className="font-serif text-xl font-bold text-accent">
                  {game.totalScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onPlayAgain}
          className="rounded-xl bg-accent px-8 py-3 font-serif text-lg font-semibold text-navy transition-all active:scale-[0.98]"
        >
          Play Again
        </button>
        <button
          onClick={onBack}
          className="rounded-xl border border-white/10 px-8 py-3 font-serif text-lg text-cream/70 transition-all hover:bg-white/5"
        >
          Back
        </button>
      </div>
    </div>
  );
}
