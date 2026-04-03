import { CategoryKey, ValidationResult } from "./types";
import { normalizeAnswer, stripLeadingArticle, toSingular, fuzzyMatch } from "./normalize";
import {
  COUNTRIES, COUNTRY_ALIASES,
  CAPITALS, CAPITAL_ALIASES,
  US_STATES, STATE_ALIASES,
  BODIES_OF_WATER, BODY_OF_WATER_ALIASES,
  BOYS_NAMES,
  GIRLS_NAMES,
  BRANDS, BRAND_ALIASES,
  ANIMALS, ANIMAL_ALIASES,
  FISH, FISH_ALIASES,
  VEGETABLES, VEGETABLE_ALIASES,
  MOVIES, MOVIE_ALIASES,
  CLOTHING_ITEMS,
  BOARD_GAMES,
  BOOKS, BOOK_ALIASES,
  SPORTS,
  TOWNS, TOWN_ALIASES,
  LANGUAGES,
  INSTRUMENTS, INSTRUMENT_ALIASES,
  PROFESSIONS,
  PLANTS_FLOWERS, PLANT_ALIASES,
  FOODS, FOOD_ALIASES,
  HISTORICAL_FIGURES, HISTORICAL_FIGURE_ALIASES,
  MYTHOLOGICAL_FIGURES,
  TV_SHOWS, TV_SHOW_ALIASES,
  SONG_TITLES, SONG_ALIASES,
  SCIENTIFIC_TERMS,
} from "./data";

// ── Category config ────────────────────────────────────────────────────────

interface CategoryConfig {
  dataset: Set<string>;
  aliases?: Record<string, string>;
  /** Strip leading "the"/"a"/"an" before letter-checking and matching */
  articleSensitive?: boolean;
  /** Human-readable label for reasons */
  label: string;
}

const CATEGORY_CONFIG: Record<CategoryKey, CategoryConfig> = {
  "Country":            { dataset: COUNTRIES, aliases: COUNTRY_ALIASES, label: "country" },
  "State":              { dataset: US_STATES, aliases: STATE_ALIASES, label: "US state" },
  "Capital City":       { dataset: CAPITALS, aliases: CAPITAL_ALIASES, label: "capital city" },
  "Town":               { dataset: TOWNS, aliases: TOWN_ALIASES, label: "town/city" },
  "Girl's Name":        { dataset: GIRLS_NAMES, label: "girl's name" },
  "Boy's Name":         { dataset: BOYS_NAMES, label: "boy's name" },
  "Article of Clothing":{ dataset: CLOTHING_ITEMS, label: "article of clothing" },
  "Animal":             { dataset: ANIMALS, aliases: ANIMAL_ALIASES, label: "animal" },
  "Food/Dish":          { dataset: FOODS, aliases: FOOD_ALIASES, label: "food/dish" },
  "Movie":              { dataset: MOVIES, aliases: MOVIE_ALIASES, articleSensitive: true, label: "movie" },
  "Book":               { dataset: BOOKS, aliases: BOOK_ALIASES, articleSensitive: true, label: "book" },
  "Historical Figure":  { dataset: HISTORICAL_FIGURES, aliases: HISTORICAL_FIGURE_ALIASES, label: "historical figure" },
  "Body of Water":      { dataset: BODIES_OF_WATER, aliases: BODY_OF_WATER_ALIASES, articleSensitive: true, label: "body of water" },
  "Musical Instrument": { dataset: INSTRUMENTS, aliases: INSTRUMENT_ALIASES, label: "musical instrument" },
  "Profession":         { dataset: PROFESSIONS, label: "profession" },
  "Plant/Flower":       { dataset: PLANTS_FLOWERS, aliases: PLANT_ALIASES, label: "plant/flower" },
  "Sport":              { dataset: SPORTS, label: "sport" },
  "Brand":              { dataset: BRANDS, aliases: BRAND_ALIASES, label: "brand" },
  "Language":           { dataset: LANGUAGES, label: "language" },
  "Mythological Figure":{ dataset: MYTHOLOGICAL_FIGURES, label: "mythological figure" },
  "Song Title":         { dataset: SONG_TITLES, aliases: SONG_ALIASES, articleSensitive: true, label: "song title" },
  "TV Show":            { dataset: TV_SHOWS, aliases: TV_SHOW_ALIASES, articleSensitive: true, label: "TV show" },
  "Scientific Term":    { dataset: SCIENTIFIC_TERMS, label: "scientific term" },
  "Board Game":         { dataset: BOARD_GAMES, label: "board game" },
  "Fish":               { dataset: FISH, aliases: FISH_ALIASES, label: "fish" },
  "Vegetable":          { dataset: VEGETABLES, aliases: VEGETABLE_ALIASES, label: "vegetable" },
};

// ── Core validation ────────────────────────────────────────────────────────

/**
 * Validate whether an answer belongs to the given category and starts with
 * the required letter. Returns a structured result with reason and confidence.
 */
export function validateAnswer(
  category: CategoryKey,
  answer: string,
  expectedLetter: string,
): ValidationResult {
  const normalized = normalizeAnswer(answer);

  if (!normalized) {
    return {
      isCorrect: false,
      confidence: "high",
      reason: "No answer provided",
      normalizedAnswer: "",
    };
  }

  if (normalized.length < 2) {
    return {
      isCorrect: false,
      confidence: "high",
      reason: "Answer must be at least 2 characters",
      normalizedAnswer: normalized,
    };
  }

  const config = CATEGORY_CONFIG[category];
  if (!config) {
    return {
      isCorrect: false,
      confidence: "high",
      reason: `Unknown category: ${category}`,
      normalizedAnswer: normalized,
    };
  }

  // Determine the effective first letter (strip articles for article-sensitive categories)
  const letterCheckStr = config.articleSensitive
    ? stripLeadingArticle(normalized)
    : normalized;
  const requiredLetter = expectedLetter.toLowerCase();

  if (!letterCheckStr.startsWith(requiredLetter)) {
    // Check if the answer is valid for the category but wrong letter
    const categoryMatch = matchCategory(normalized, config);
    if (categoryMatch) {
      return {
        isCorrect: false,
        confidence: "high",
        matchedValue: categoryMatch.value,
        reason: `Rejected: answer does not start with ${expectedLetter.toUpperCase()}`,
        normalizedAnswer: normalized,
      };
    }
    return {
      isCorrect: false,
      confidence: "high",
      reason: `Rejected: answer does not start with ${expectedLetter.toUpperCase()}`,
      normalizedAnswer: normalized,
    };
  }

  // Try matching against the category
  const match = matchCategory(normalized, config);

  if (match) {
    return {
      isCorrect: true,
      confidence: match.confidence,
      matchedValue: match.value,
      reason: `Accepted as ${config.label}: ${titleCase(match.value)}`,
      normalizedAnswer: normalized,
    };
  }

  return {
    isCorrect: false,
    confidence: "high",
    reason: `Rejected: ${titleCase(normalized)} is not a recognized ${config.label}`,
    normalizedAnswer: normalized,
  };
}

// ── Matching strategy (ordered) ────────────────────────────────────────────

interface MatchResult {
  value: string;
  confidence: "high" | "medium" | "low";
}

function matchCategory(
  normalized: string,
  config: CategoryConfig,
): MatchResult | null {
  const { dataset, aliases, articleSensitive } = config;

  // Strategy a: exact canonical match
  if (dataset.has(normalized)) {
    return { value: normalized, confidence: "high" };
  }

  // Strategy b: alias match
  if (aliases) {
    const aliasTarget = aliases[normalized];
    if (aliasTarget && dataset.has(aliasTarget)) {
      return { value: aliasTarget, confidence: "high" };
    }
    // Also check if the alias key itself is the answer (alias keys are valid too)
    if (aliasTarget) {
      return { value: aliasTarget, confidence: "high" };
    }
  }

  // Strategy c: article-insensitive match
  if (articleSensitive) {
    const stripped = stripLeadingArticle(normalized);
    if (stripped !== normalized) {
      if (dataset.has(stripped)) {
        return { value: stripped, confidence: "high" };
      }
      if (aliases) {
        const aliasTarget = aliases[stripped];
        if (aliasTarget) {
          return { value: aliasTarget, confidence: "high" };
        }
      }
    }
    // Also try adding "the" prefix
    const withThe = "the " + normalized;
    if (dataset.has(withThe)) {
      return { value: withThe, confidence: "high" };
    }
  }

  // Strategy d: singular/plural normalization
  const singular = toSingular(normalized);
  if (singular !== normalized && dataset.has(singular)) {
    return { value: singular, confidence: "high" };
  }
  // Try plural form
  const plural = normalized + "s";
  if (dataset.has(plural)) {
    return { value: plural, confidence: "medium" };
  }

  // Strategy e: conservative fuzzy match
  // Only for answers >= 4 chars to avoid false positives on short words
  if (normalized.length >= 4) {
    for (const candidate of dataset) {
      // Only check candidates starting with the same letter
      if (candidate[0] !== normalized[0]) continue;
      // Skip if length difference is too large
      if (Math.abs(candidate.length - normalized.length) > 2) continue;
      if (fuzzyMatch(normalized, candidate)) {
        return { value: candidate, confidence: "low" };
      }
    }
  }

  return null;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function titleCase(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
