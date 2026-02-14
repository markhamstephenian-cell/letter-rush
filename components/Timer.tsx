"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  running: boolean;
  onComplete: () => void;
}

export default function Timer({ duration, running, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          onComplete();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, timeLeft, onComplete]);

  const progress = timeLeft / duration;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const isUrgent = timeLeft <= 10;

  return (
    <div className="relative flex flex-col items-center gap-1">
      <svg width="84" height="84" className="rotate-[-90deg] sm:w-[100px] sm:h-[100px]" viewBox="0 0 84 84">
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="5"
        />
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke={isUrgent ? "#ef4444" : "#d4a574"}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-xl font-bold sm:text-2xl ${isUrgent ? "text-red-400 animate-pulse" : "text-cream"}`}
      >
        {timeLeft}
      </span>
    </div>
  );
}
