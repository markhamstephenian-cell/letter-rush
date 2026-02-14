import { getDailyRandom } from "./daily";

export const ALL_CATEGORIES = [
  "Town",
  "State",
  "Country",
  "Capital City",
  "Girl's Name",
  "Boy's Name",
  "Article of Clothing",
  "Animal",
  "Food/Dish",
  "Movie",
  "Book",
  "Historical Figure",
  "Body of Water",
  "Musical Instrument",
  "Profession",
  "Plant/Flower",
  "Sport",
  "Brand",
  "Language",
  "Mythological Figure",
  "Song Title",
  "TV Show",
  "Scientific Term",
  "Board Game",
] as const;

// Letters excluding rare ones (Q, X, Z) for better gameplay
const LETTERS = "ABCDEFGHIJKLMNOPRSTUVW".split("");

export function getDailyPuzzle(date?: Date) {
  const rand = getDailyRandom(date);

  const letterIndex = Math.floor(rand() * LETTERS.length);
  const letter = LETTERS[letterIndex];

  // Shuffle and pick 6 categories
  const shuffled = [...ALL_CATEGORIES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const categories = shuffled.slice(0, 6);

  return { letter, categories };
}
