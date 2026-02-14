// Date-seeded pseudo-random number generator
// Ensures all players get the same puzzle each day

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

function dateSeed(date: Date): number {
  const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDailyRandom(date?: Date): () => number {
  const d = date ?? new Date();
  return seededRandom(dateSeed(d));
}

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getOffsetDate(dayOffset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d;
}
