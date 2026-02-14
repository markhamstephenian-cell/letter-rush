import { AnswerResult } from "./scoring";

export interface GameRecord {
  id: string;
  date: string;
  letter: string;
  categories: string[];
  answers: string[];
  results: AnswerResult[];
  totalScore: number;
}

export interface PlayerData {
  games: GameRecord[];
  totalScore: number;
}

const STORAGE_KEY = "letter-rush-data";

function getDefaultData(): PlayerData {
  return { games: [], totalScore: 0 };
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

  data.games.push(record);
  data.totalScore += record.totalScore;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}
