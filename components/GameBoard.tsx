"use client";

import { useCallback, useRef, useState } from "react";
import Timer from "./Timer";

interface GameBoardProps {
  letter: string;
  categories: string[];
  onSubmit: (answers: string[]) => void;
}

export default function GameBoard({
  letter,
  categories,
  onSubmit,
}: GameBoardProps) {
  const [answers, setAnswers] = useState<string[]>(
    new Array(categories.length).fill(""),
  );
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = useCallback(() => {
    setRunning(false);
    onSubmit(answers);
  }, [answers, onSubmit]);

  const handleStart = () => {
    setStarted(true);
    setRunning(true);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < categories.length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        handleSubmit();
      }
    }
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 sm:gap-8 sm:py-12">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm tracking-widest text-cream/50 uppercase">
            Your Letter
          </p>
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-accent/30 bg-accent/10 sm:h-28 sm:w-28">
            <span className="font-serif text-5xl font-bold text-accent sm:text-6xl">
              {letter}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 px-2">
          <p className="text-cream/70 text-center max-w-sm text-sm sm:text-base">
            Fill in a word starting with <strong className="text-accent">{letter}</strong> for
            each category. You have 60 seconds.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-cream/60 sm:px-3 sm:text-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={handleStart}
          className="mt-2 rounded-xl bg-accent px-8 py-3.5 font-serif text-lg font-semibold text-navy transition-all hover:bg-accent/90 active:scale-95 sm:mt-4"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4 sm:gap-6 sm:py-6">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 sm:h-16 sm:w-16">
          <span className="font-serif text-2xl font-bold text-accent sm:text-3xl">
            {letter}
          </span>
        </div>
        <Timer duration={60} running={running} onComplete={handleSubmit} />
      </div>

      <div className="w-full max-w-md space-y-2 sm:space-y-3">
        {categories.map((category, i) => (
          <div key={category}>
            <label className="mb-0.5 block text-[11px] font-medium tracking-wider text-cream/40 uppercase sm:mb-1 sm:text-xs">
              {category}
            </label>
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              placeholder={`${letter}...`}
              disabled={!running}
              autoComplete="off"
              autoCapitalize="words"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint={i < categories.length - 1 ? "next" : "done"}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-[16px] text-cream placeholder-cream/20 transition-all focus:border-accent/50 focus:bg-white/8 focus:ring-1 focus:ring-accent/30 focus:outline-none disabled:opacity-50 sm:px-4 sm:py-3"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!running}
        className="mt-1 w-full max-w-md rounded-xl bg-accent px-8 py-3.5 font-serif text-lg font-semibold text-navy transition-all active:scale-[0.98] disabled:opacity-50 sm:mt-2 sm:w-auto"
      >
        Submit Answers
      </button>
    </div>
  );
}
