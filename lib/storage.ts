import { AnswerResult } from "./scoring";

export interface GameRecord {
  date: string;
  letter: string;
  categories: string[];
  answers: string[];
  results: AnswerResult[];
  totalScore: number;
}

export interface PlayerData {
  games: GameRecord[];
  currentStreak: number;
  maxStreak: number;
  totalScore: number;
}

const STORAGE_KEY = "letter-rush-data";

function getDefaultData(): PlayerData {
  return { games: [], currentStreak: 0, maxStreak: 0, totalScore: 0 };
}

export function loadPlayerData(): PlayerData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return JSON.parse(raw) as PlayerData;
  } catch {
    return getDefaultData();
  }
}

export function saveGameResult(record: GameRecord): PlayerData {
  const data = loadPlayerData();

  // Don't save duplicate games for the same day
  if (data.games.some((g) => g.date === record.date)) return data;

  data.games.push(record);
  data.totalScore += record.totalScore;

  // Calculate streak
  const sorted = [...data.games].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i].date);
    const prev = new Date(sorted[i + 1].date);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diff) === 1) {
      streak++;
    } else {
      break;
    }
  }
  data.currentStreak = streak;
  data.maxStreak = Math.max(data.maxStreak, streak);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function hasPlayedToday(dateStr: string): boolean {
  const data = loadPlayerData();
  return data.games.some((g) => g.date === dateStr);
}

export function getTodayGame(dateStr: string): GameRecord | undefined {
  const data = loadPlayerData();
  return data.games.find((g) => g.date === dateStr);
}
