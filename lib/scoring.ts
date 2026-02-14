export interface AnswerResult {
  category: string;
  answer: string;
  valid: boolean;
  points: number;
}

export function calculatePoints(answer: string, valid: boolean): number {
  if (!valid || !answer.trim()) return 0;
  const base = 10;
  const lengthBonus = Math.max(0, answer.trim().length - 3);
  return base + lengthBonus;
}

export function calculateTotalScore(results: AnswerResult[]): number {
  const baseTotal = results.reduce((sum, r) => sum + r.points, 0);
  const allCorrect = results.length === 6 && results.every((r) => r.valid);
  return baseTotal + (allCorrect ? 20 : 0);
}

export function getAllCorrectBonus(results: AnswerResult[]): number {
  const allCorrect = results.length === 6 && results.every((r) => r.valid);
  return allCorrect ? 20 : 0;
}
