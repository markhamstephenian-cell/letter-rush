// Random puzzle generator - fresh puzzle each game

export function getRandomRng(): () => number {
  return () => Math.random();
}

export function getGameId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
