"use client";

import { useEffect, useState } from "react";
import { AnswerResult, calculateTotalScore, getAllCorrectBonus } from "@/lib/scoring";

interface ResultsProps {
  results: AnswerResult[];
  onViewStats: () => void;
  onPlayAgain: () => void;
}

export default function Results({ results, onViewStats, onPlayAgain }: ResultsProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showTotal, setShowTotal] = useState(false);

  useEffect(() => {
    if (revealedCount < results.length) {
      const timer = setTimeout(() => setRevealedCount((c) => c + 1), 400);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowTotal(true), 600);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, results.length]);

  const total = calculateTotalScore(results);
  const bonus = getAllCorrectBonus(results);
  const validCount = results.filter((r) => r.valid).length;

  return (
    <div className="flex flex-col items-center gap-4 py-6 sm:gap-6 sm:py-8">
      <h2 className="font-serif text-2xl font-bold text-cream">Results</h2>

      <div className="w-full max-w-md space-y-2 sm:space-y-3">
        {results.map((result, i) => {
          const revealed = i < revealedCount;
          return (
            <div
              key={result.category}
              className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-all duration-500 sm:px-4 sm:py-3 ${
                !revealed
                  ? "border-white/5 bg-white/3 opacity-50"
                  : result.valid
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
              }`}
            >
              <div className="flex-1">
                <p className="text-xs font-medium tracking-wider text-cream/40 uppercase">
                  {result.category}
                </p>
                <p
                  className={`text-lg ${revealed ? (result.valid ? "text-green-300" : "text-red-300 line-through") : "text-cream/30"}`}
                >
                  {result.answer || "(empty)"}
                </p>
              </div>
              {revealed && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-bold ${result.valid ? "text-green-400" : "text-red-400"}`}
                  >
                    {result.valid ? `+${result.points}` : "0"}
                  </span>
                  <span className="text-xl">
                    {result.valid ? "\u2713" : "\u2717"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showTotal && (
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          {bonus > 0 && (
            <p className="text-accent font-semibold">
              All correct bonus: +{bonus}
            </p>
          )}
          <div className="flex flex-col items-center">
            <p className="text-sm text-cream/50">Total Score</p>
            <p className="font-serif text-4xl font-bold text-accent sm:text-5xl">
              {total}
            </p>
            <p className="mt-1 text-sm text-cream/40">
              {validCount}/{results.length} correct
            </p>
          </div>
          <div className="mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={onPlayAgain}
              className="w-full rounded-xl bg-accent px-8 py-3.5 font-serif text-lg font-semibold text-navy transition-all active:scale-[0.98] sm:w-auto"
            >
              Play Again
            </button>
            <button
              onClick={onViewStats}
              className="w-full rounded-xl border border-white/10 px-8 py-3.5 font-serif text-lg text-cream/70 transition-all active:bg-white/5 sm:w-auto"
            >
              View Stats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
