"use client";

import { useCallback, useState } from "react";
import Header from "@/components/Header";
import GameBoard from "@/components/GameBoard";
import Results from "@/components/Results";
import Stats from "@/components/Stats";
import Rules from "@/components/Rules";
import { getRandomPuzzle } from "@/lib/categories";
import { calculatePoints, AnswerResult, calculateTotalScore } from "@/lib/scoring";
import {
  loadPlayerData,
  saveGameResult,
  PlayerData,
  GameRecord,
} from "@/lib/storage";
import { getGameId } from "@/lib/daily";

type Screen = "landing" | "play" | "validating" | "results" | "stats";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [playerData, setPlayerData] = useState<PlayerData>(() => loadPlayerData());
  const [puzzle, setPuzzle] = useState(() => getRandomPuzzle());
  const [showRules, setShowRules] = useState(false);

  const startNewGame = useCallback(() => {
    setPuzzle(getRandomPuzzle());
    setResults([]);
    setScreen("play");
  }, []);

  const handleSubmit = useCallback(
    async (answers: string[]) => {
      setScreen("validating");

      try {
        const payload = puzzle.categories.map((category, i) => ({
          category,
          answer: answers[i] || "",
          letter: puzzle.letter,
        }));

        const res = await fetch("/api/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: payload }),
        });

        const data = await res.json();

        const answerResults: AnswerResult[] = data.results.map(
          (r: { category: string; answer: string; valid: boolean }) => ({
            ...r,
            points: calculatePoints(r.answer, r.valid),
          }),
        );

        setResults(answerResults);

        const record: GameRecord = {
          id: getGameId(),
          date: new Date().toISOString(),
          letter: puzzle.letter,
          categories: puzzle.categories,
          answers,
          results: answerResults,
          totalScore: calculateTotalScore(answerResults),
        };

        const updated = saveGameResult(record);
        setPlayerData(updated);
        setScreen("results");
      } catch {
        const fallbackResults: AnswerResult[] = puzzle.categories.map(
          (category, i) => ({
            category,
            answer: answers[i] || "",
            valid: (answers[i] || "").trim().length >= 2,
            points: calculatePoints(
              answers[i] || "",
              (answers[i] || "").trim().length >= 2,
            ),
          }),
        );
        setResults(fallbackResults);

        const record: GameRecord = {
          id: getGameId(),
          date: new Date().toISOString(),
          letter: puzzle.letter,
          categories: puzzle.categories,
          answers,
          results: fallbackResults,
          totalScore: calculateTotalScore(fallbackResults),
        };

        const updated = saveGameResult(record);
        setPlayerData(updated);
        setScreen("results");
      }
    },
    [puzzle],
  );

  return (
    <div className="flex min-h-dvh flex-col no-overscroll">
      <div className="safe-top" />
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {screen === "landing" && (
          <div className="flex flex-col items-center gap-6 py-6 sm:gap-8 sm:py-8">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm tracking-widest text-cream/50 uppercase">
                Ready to play?
              </p>
            </div>
            <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto">
              <button
                onClick={startNewGame}
                className="w-full rounded-xl bg-accent px-8 py-3.5 font-serif text-lg font-semibold text-navy transition-all active:scale-[0.98]"
              >
                Play
              </button>
              <button
                onClick={() => setShowRules(true)}
                className="w-full rounded-xl border border-white/10 px-8 py-3 font-serif text-lg text-cream/70 transition-all hover:bg-white/5 active:scale-[0.98]"
              >
                How to Play
              </button>
            </div>
            <div className="flex flex-col items-center gap-2 text-cream/40">
              {playerData.games.length > 0 && (
                <>
                  <p className="text-sm">
                    Games played: {playerData.games.length} &middot; Total:{" "}
                    {playerData.totalScore} pts
                  </p>
                  <button
                    onClick={() => setScreen("stats")}
                    className="text-sm text-accent/70 underline-offset-2 hover:text-accent hover:underline"
                  >
                    View Stats
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {screen === "play" && (
          <GameBoard
            letter={puzzle.letter}
            categories={puzzle.categories}
            onSubmit={handleSubmit}
          />
        )}

        {screen === "validating" && (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            <p className="text-cream/50">Validating your answers...</p>
          </div>
        )}

        {screen === "results" && (
          <Results
            results={results}
            onViewStats={() => setScreen("stats")}
            onPlayAgain={startNewGame}
          />
        )}

        {screen === "stats" && (
          <Stats
            data={playerData}
            onBack={() => setScreen("landing")}
            onPlayAgain={startNewGame}
          />
        )}
      </main>
      <div className="safe-bottom" />
      {showRules && <Rules onClose={() => setShowRules(false)} />}
    </div>
  );
}
