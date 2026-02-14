"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import GameBoard from "@/components/GameBoard";
import Results from "@/components/Results";
import Stats from "@/components/Stats";
import { getDailyPuzzle } from "@/lib/categories";
import { calculatePoints, AnswerResult, calculateTotalScore } from "@/lib/scoring";
import {
  loadPlayerData,
  saveGameResult,
  hasPlayedToday,
  getTodayGame,
  PlayerData,
  GameRecord,
} from "@/lib/storage";
import { getTodayDateString, getOffsetDate } from "@/lib/daily";

type Screen = "landing" | "play" | "validating" | "results" | "stats";

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const searchParams = useSearchParams();
  const dayOffset = parseInt(searchParams.get("day") || "0", 10) || 0;

  const [screen, setScreen] = useState<Screen>("landing");
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [todayGame, setTodayGame] = useState<GameRecord | null>(null);

  const simulatedDate = useMemo(() => getOffsetDate(dayOffset), [dayOffset]);
  const dateStr = useMemo(() => {
    if (dayOffset === 0) return getTodayDateString();
    const d = simulatedDate;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, [dayOffset, simulatedDate]);
  const puzzle = useMemo(() => getDailyPuzzle(simulatedDate), [simulatedDate]);

  useEffect(() => {
    const data = loadPlayerData();
    setPlayerData(data);
    const existing = getTodayGame(dateStr);
    if (existing) {
      setTodayGame(existing);
      setResults(existing.results);
    } else {
      setTodayGame(null);
      setResults([]);
    }
    setScreen("landing");
  }, [dateStr]);

  const played = hasPlayedToday(dateStr);

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
          date: dateStr,
          letter: puzzle.letter,
          categories: puzzle.categories,
          answers,
          results: answerResults,
          totalScore: calculateTotalScore(answerResults),
        };

        const updated = saveGameResult(record);
        setPlayerData(updated);
        setTodayGame(record);
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
          date: dateStr,
          letter: puzzle.letter,
          categories: puzzle.categories,
          answers,
          results: fallbackResults,
          totalScore: calculateTotalScore(fallbackResults),
        };

        const updated = saveGameResult(record);
        setPlayerData(updated);
        setTodayGame(record);
        setScreen("results");
      }
    },
    [dateStr, puzzle],
  );

  return (
    <div className="flex min-h-dvh flex-col no-overscroll">
      <div className="safe-top" />
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {dayOffset !== 0 && (
          <div className="mb-4 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-center text-sm text-accent/70">
            Test mode &middot; Day {dayOffset} &middot; {dateStr}
          </div>
        )}

        {screen === "landing" && (
          <div className="flex flex-col items-center gap-6 py-6 sm:gap-8 sm:py-8">
            {played && todayGame ? (
              <>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm tracking-widest text-cream/50 uppercase">
                    {dayOffset ? "Puzzle" : "Today\u2019s Puzzle"} Complete
                  </p>
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-accent/30 bg-accent/10">
                    <span className="font-serif text-4xl font-bold text-accent">
                      {puzzle.letter}
                    </span>
                  </div>
                  <p className="font-serif text-3xl font-bold text-accent">
                    {todayGame.totalScore} pts
                  </p>
                  <p className="text-sm text-cream/40">
                    {todayGame.results.filter((r) => r.valid).length}/
                    {todayGame.results.length} correct
                  </p>
                </div>
                <button
                  onClick={() => {
                    setResults(todayGame.results);
                    setScreen("results");
                  }}
                  className="w-full max-w-xs rounded-xl border border-white/10 px-6 py-3 text-cream/70 transition-all active:bg-white/5 sm:w-auto"
                >
                  View Results
                </button>
                <button
                  onClick={() => setScreen("stats")}
                  className="w-full max-w-xs rounded-xl border border-white/10 px-6 py-3 text-cream/70 transition-all active:bg-white/5 sm:w-auto"
                >
                  View Stats
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm tracking-widest text-cream/50 uppercase">
                    Ready to play?
                  </p>
                </div>
                <button
                  onClick={() => setScreen("play")}
                  className="w-full max-w-xs rounded-xl bg-accent px-8 py-3.5 font-serif text-lg font-semibold text-navy transition-all active:scale-[0.98] sm:w-auto"
                >
                  {dayOffset ? "Play This Puzzle" : "Play Today\u2019s Puzzle"}
                </button>
                {playerData && playerData.games.length > 0 && (
                  <div className="flex flex-col items-center gap-2 text-cream/40">
                    <p className="text-sm">
                      Streak: {playerData.currentStreak} day
                      {playerData.currentStreak !== 1 ? "s" : ""} &middot;
                      Total: {playerData.totalScore} pts
                    </p>
                    <button
                      onClick={() => setScreen("stats")}
                      className="text-sm text-accent/70 hover:text-accent underline-offset-2 hover:underline"
                    >
                      View Stats
                    </button>
                  </div>
                )}
              </>
            )}
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
          />
        )}

        {screen === "stats" && playerData && (
          <Stats data={playerData} onBack={() => setScreen("landing")} />
        )}
      </main>
      <div className="safe-bottom" />
    </div>
  );
}
