import { describe, it, expect } from "vitest";
import { validateAnswer } from "../validate";
import type { CategoryKey } from "../types";

function expectCorrect(category: CategoryKey, answer: string, letter: string) {
  const result = validateAnswer(category, answer, letter);
  expect(result.isCorrect).toBe(true);
  return result;
}

function expectIncorrect(category: CategoryKey, answer: string, letter: string) {
  const result = validateAnswer(category, answer, letter);
  expect(result.isCorrect).toBe(false);
  return result;
}

// ── Required passing examples from spec ─────────────────────────────────────

describe("required passing examples", () => {
  it("Jordan is a country starting with J", () => {
    const r = expectCorrect("Country", "Jordan", "J");
    expect(r.reason).toContain("country");
  });

  it("Japan is a country starting with J", () => {
    expectCorrect("Country", "Japan", "J");
  });

  it("Jaguar is a brand starting with J", () => {
    expectCorrect("Brand", "Jaguar", "J");
  });

  it("Jerusalem is a capital city starting with J", () => {
    expectCorrect("Capital City", "Jerusalem", "J");
  });

  it("Jordan River is a body of water starting with J", () => {
    expectCorrect("Body of Water", "Jordan River", "J");
  });

  it("Jack is a boy's name starting with J", () => {
    expectCorrect("Boy's Name", "Jack", "J");
  });
});

// ── Required failing examples from spec ─────────────────────────────────────

describe("required failing examples", () => {
  it("Jacksonville is not a country", () => {
    const r = expectIncorrect("Country", "Jacksonville", "J");
    expect(r.reason).toContain("not a recognized country");
  });

  it("Jacksonville is not a capital city", () => {
    expectIncorrect("Capital City", "Jacksonville", "J");
  });

  it("Jordan with letter K fails (wrong letter)", () => {
    const r = expectIncorrect("Country", "Jordan", "K");
    expect(r.reason).toContain("does not start with K");
  });

  it("Jacket is not a movie (unless in dataset)", () => {
    expectIncorrect("Movie", "Jacket", "J");
  });
});

// ── Country ─────────────────────────────────────────────────────────────────

describe("Country", () => {
  it("accepts standard countries", () => {
    expectCorrect("Country", "France", "F");
    expectCorrect("Country", "Germany", "G");
    expectCorrect("Country", "Brazil", "B");
  });

  it("accepts aliases", () => {
    expectCorrect("Country", "America", "A");
    expectCorrect("Country", "Britain", "B");
    expectCorrect("Country", "Holland", "H");
  });

  it("is case-insensitive", () => {
    expectCorrect("Country", "JAPAN", "J");
    expectCorrect("Country", "jApAn", "J");
  });
});

// ── Capital City ────────────────────────────────────────────────────────────

describe("Capital City", () => {
  it("accepts capitals", () => {
    expectCorrect("Capital City", "Tokyo", "T");
    expectCorrect("Capital City", "Paris", "P");
    expectCorrect("Capital City", "Berlin", "B");
  });

  it("accepts multi-word capitals", () => {
    expectCorrect("Capital City", "Buenos Aires", "B");
    expectCorrect("Capital City", "New Delhi", "N");
  });
});

// ── State ───────────────────────────────────────────────────────────────────

describe("State", () => {
  it("accepts US states", () => {
    expectCorrect("State", "California", "C");
    expectCorrect("State", "Texas", "T");
    expectCorrect("State", "New York", "N");
  });
});

// ── Body of Water ───────────────────────────────────────────────────────────

describe("Body of Water", () => {
  it("accepts rivers", () => {
    expectCorrect("Body of Water", "Nile", "N");
    expectCorrect("Body of Water", "Amazon River", "A");
    expectCorrect("Body of Water", "Thames", "T");
  });

  it("accepts article-stripped names", () => {
    expectCorrect("Body of Water", "The Pacific", "P");
    expectCorrect("Body of Water", "The Nile", "N");
  });

  it("accepts lakes", () => {
    expectCorrect("Body of Water", "Lake Superior", "L");
  });

  it("accepts oceans and seas", () => {
    expectCorrect("Body of Water", "Pacific Ocean", "P");
    expectCorrect("Body of Water", "Mediterranean Sea", "M");
  });
});

// ── Names ───────────────────────────────────────────────────────────────────

describe("Boy's Name", () => {
  it("accepts common names", () => {
    expectCorrect("Boy's Name", "Jack", "J");
    expectCorrect("Boy's Name", "William", "W");
    expectCorrect("Boy's Name", "Alexander", "A");
  });
});

describe("Girl's Name", () => {
  it("accepts common names", () => {
    expectCorrect("Girl's Name", "Julia", "J");
    expectCorrect("Girl's Name", "Sophia", "S");
    expectCorrect("Girl's Name", "Emma", "E");
  });

  it("accepts unisex names", () => {
    expectCorrect("Girl's Name", "Jordan", "J");
    expectCorrect("Girl's Name", "Riley", "R");
  });
});

// ── Brand ───────────────────────────────────────────────────────────────────

describe("Brand", () => {
  it("accepts major brands", () => {
    expectCorrect("Brand", "Apple", "A");
    expectCorrect("Brand", "Nike", "N");
    expectCorrect("Brand", "Toyota", "T");
  });

  it("accepts automotive brands", () => {
    expectCorrect("Brand", "Jaguar", "J");
    expectCorrect("Brand", "Ferrari", "F");
    expectCorrect("Brand", "BMW", "B");
  });

  it("accepts aliases", () => {
    expectCorrect("Brand", "Coke", "C");
    expectCorrect("Brand", "Chevy", "C");
  });
});

// ── Movie ───────────────────────────────────────────────────────────────────

describe("Movie", () => {
  it("accepts well-known movies", () => {
    expectCorrect("Movie", "Jaws", "J");
    expectCorrect("Movie", "Titanic", "T");
    expectCorrect("Movie", "Avatar", "A");
  });

  it("handles article-insensitive matching", () => {
    expectCorrect("Movie", "The Matrix", "M");
    expectCorrect("Movie", "The Godfather", "G");
  });
});

// ── Animal ──────────────────────────────────────────────────────────────────

describe("Animal", () => {
  it("accepts animals", () => {
    expectCorrect("Animal", "Jaguar", "J");
    expectCorrect("Animal", "Eagle", "E");
    expectCorrect("Animal", "Bear", "B");
  });
});

// ── Fish ────────────────────────────────────────────────────────────────────

describe("Fish", () => {
  it("accepts fish", () => {
    expectCorrect("Fish", "Salmon", "S");
    expectCorrect("Fish", "Trout", "T");
    expectCorrect("Fish", "Bass", "B");
  });
});

// ── Vegetable ───────────────────────────────────────────────────────────────

describe("Vegetable", () => {
  it("accepts vegetables", () => {
    expectCorrect("Vegetable", "Carrot", "C");
    expectCorrect("Vegetable", "Broccoli", "B");
    expectCorrect("Vegetable", "Spinach", "S");
  });
});

// ── Edge cases ──────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("handles whitespace normalization", () => {
    expectCorrect("Country", "  Jordan  ", "J");
    expectCorrect("Country", "  japan ", "J");
  });

  it("handles unicode/accents", () => {
    expectCorrect("Capital City", "São Tomé", "S");
  });

  it("rejects empty answers", () => {
    const r = expectIncorrect("Country", "", "J");
    expect(r.reason).toBe("No answer provided");
  });

  it("rejects single character answers", () => {
    expectIncorrect("Country", "J", "J");
  });

  it("wrong letter with valid category answer gives clear reason", () => {
    const r = validateAnswer("Capital City", "Tokyo", "B");
    expect(r.isCorrect).toBe(false);
    expect(r.reason).toContain("does not start with B");
  });

  it("fuzzy matches minor typos", () => {
    // "Japn" is close to "Japan"
    const r = validateAnswer("Country", "Japn", "J");
    // Should fuzzy match
    expect(r.isCorrect).toBe(true);
    expect(r.confidence).toBe("low");
  });

  it("does not fuzzy match unrelated words", () => {
    // "Jazz" is not close to any country
    expectIncorrect("Country", "Jazz", "J");
  });
});

// ── Plural normalization ────────────────────────────────────────────────────

describe("plural normalization", () => {
  it("accepts singular when plural is in dataset", () => {
    // "brussels sprouts" is in vegetables, "brussels sprout" singular too
    expectCorrect("Vegetable", "Brussels Sprout", "B");
  });
});

// ── All other categories basic smoke test ───────────────────────────────────

describe("category smoke tests", () => {
  const cases: [CategoryKey, string, string][] = [
    ["Town", "Austin", "A"],
    ["Sport", "Tennis", "T"],
    ["Language", "French", "F"],
    ["Profession", "Doctor", "D"],
    ["Plant/Flower", "Rose", "R"],
    ["Musical Instrument", "Piano", "P"],
    ["Historical Figure", "Napoleon", "N"],
    ["Mythological Figure", "Zeus", "Z"],
    ["TV Show", "Friends", "F"],
    ["Song Title", "Imagine", "I"],
    ["Scientific Term", "Atom", "A"],
    ["Board Game", "Chess", "C"],
    ["Book", "Dracula", "D"],
    ["Article of Clothing", "Jacket", "J"],
    ["Food/Dish", "Pizza", "P"],
  ];

  for (const [cat, answer, letter] of cases) {
    it(`${cat}: "${answer}" starting with ${letter}`, () => {
      expectCorrect(cat, answer, letter);
    });
  }
});

// ── Reason messages ─────────────────────────────────────────────────────────

describe("reason messages", () => {
  it("accepted answers show category label", () => {
    const r = validateAnswer("Country", "Jordan", "J");
    expect(r.reason).toMatch(/Accepted as country/i);
  });

  it("rejected wrong-letter answers explain why", () => {
    const r = validateAnswer("Country", "Jordan", "K");
    expect(r.reason).toMatch(/does not start with K/i);
  });

  it("rejected wrong-category answers explain why", () => {
    const r = validateAnswer("Country", "Jacksonville", "J");
    expect(r.reason).toMatch(/not a recognized country/i);
  });
});
