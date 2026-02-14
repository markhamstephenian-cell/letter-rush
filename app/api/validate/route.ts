import { NextRequest, NextResponse } from "next/server";

interface ValidationRequest {
  answers: { category: string; answer: string; letter: string }[];
}

// Keywords that Wikipedia article content/categories should contain for each game category
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Town: ["town", "city", "village", "municipality", "settlement", "populated place", "census-designated"],
  State: ["state", "province", "region", "territory", "subdivision", "administrative"],
  Country: ["country", "sovereign", "nation", "republic", "kingdom", "state in"],
  "Capital City": ["capital", "seat of government", "capital city"],
  "Girl's Name": ["given name", "feminine", "female name", "woman", "actress", "singer"],
  "Boy's Name": ["given name", "masculine", "male name", "man", "actor", "footballer"],
  "Article of Clothing": ["clothing", "garment", "worn", "fashion", "apparel", "fabric", "textile", "dress", "wear"],
  Animal: ["animal", "species", "mammal", "bird", "fish", "reptile", "insect", "genus", "family", "amphibian", "invertebrate"],
  "Food/Dish": ["food", "dish", "cuisine", "recipe", "ingredient", "cooking", "bread", "dessert", "soup", "sauce", "meat", "vegetable", "fruit"],
  Movie: ["film", "movie", "directed", "starring", "box office", "screenplay"],
  Book: ["book", "novel", "author", "written by", "published", "literature", "novella"],
  "Historical Figure": ["historian", "emperor", "king", "queen", "president", "leader", "general", "politician", "revolutionary", "explorer", "conqueror", "born", "died", "reign", "century", "war", "battle", "founder", "statesman", "philosopher"],
  "Body of Water": ["river", "lake", "ocean", "sea", "bay", "gulf", "strait", "creek", "reservoir", "waterway", "tributary"],
  "Musical Instrument": ["instrument", "musical", "played", "string", "woodwind", "brass", "percussion", "keyboard"],
  Profession: ["profession", "occupation", "career", "job", "worker", "specialist", "practitioner", "person who", "responsible for", "trained", "expert", "professional"],
  "Plant/Flower": ["plant", "flower", "species", "genus", "botanical", "herb", "tree", "shrub", "flora", "blossom"],
  Sport: ["sport", "game", "competition", "tournament", "championship", "played", "athlete", "olympic", "team sport", "race", "racing", "marathon", "athletics", "league", "match", "event"],
  Brand: ["brand", "company", "corporation", "founded", "manufacturer", "trademark", "subsidiary", "products"],
  Language: ["language", "spoken", "dialect", "lingua", "speakers", "linguistic"],
  "Mythological Figure": ["mythology", "myth", "god", "goddess", "deity", "legend", "mythical", "folklore", "pantheon"],
  "Song Title": ["song", "single", "track", "recorded", "album", "music", "billboard", "chart"],
  "TV Show": ["television", "tv series", "tv show", "sitcom", "drama", "episodes", "season", "aired", "network", "streaming"],
  "Scientific Term": ["science", "scientific", "theory", "biology", "chemistry", "physics", "cell", "molecule", "process", "phenomenon", "medical", "organism", "compound", "element", "equation", "hypothesis", "genetic", "quantum", "atomic"],
  "Board Game": ["board game", "game", "players", "dice", "cards", "tabletop", "strategy game", "parlor", "designed by", "published by", "gameplay"],
};

async function wikiSearchSnippets(
  term: string,
): Promise<{ title: string; snippet: string }[]> {
  if (!term.trim()) return [];
  try {
    const encoded = encodeURIComponent(term.trim());
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&srlimit=3&format=json&origin=*`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.query?.search ?? [];
  } catch {
    return [];
  }
}

async function wikiPageCategories(title: string): Promise<string[]> {
  try {
    const encoded = encodeURIComponent(title);
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=categories&cllimit=20&format=json&origin=*`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return [];
    const page = Object.values(pages)[0] as { categories?: { title: string }[] };
    return (page.categories ?? []).map((c) => c.title.toLowerCase());
  } catch {
    return [];
  }
}

async function wikiPageExtract(title: string): Promise<string> {
  try {
    const encoded = encodeURIComponent(title);
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=extracts&exintro=1&explaintext=1&exsentences=3&format=json&origin=*`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return "";
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return "";
    const page = Object.values(pages)[0] as { extract?: string };
    return (page.extract ?? "").toLowerCase();
  } catch {
    return "";
  }
}

function titleMatches(searchTitle: string, term: string): boolean {
  const t = searchTitle.toLowerCase();
  const s = term.toLowerCase();
  return t === s || t.startsWith(s + " ") || t.startsWith(s + ",") || t.includes("(" + s + ")");
}

function textMatchesCategory(
  text: string,
  categories: string[],
  gameCategory: string,
): boolean {
  const keywords = CATEGORY_KEYWORDS[gameCategory];
  if (!keywords) return false;

  const combined = (text + " " + categories.join(" ")).toLowerCase();
  return keywords.some((kw) => combined.includes(kw));
}

async function checkDatamuse(
  term: string,
  category: string,
): Promise<boolean> {
  if (!term.trim()) return false;

  // Datamuse is only useful as fallback for common dictionary words
  // Restrict to categories where a plain word lookup makes sense
  const datamuseCategories = [
    "Animal",
    "Food/Dish",
    "Article of Clothing",
    "Plant/Flower",
    "Musical Instrument",
    "Sport",
    "Profession",
    "Scientific Term",
  ];
  if (!datamuseCategories.includes(category)) return false;

  try {
    const encoded = encodeURIComponent(term.trim());
    const url = `https://api.datamuse.com/words?sp=${encoded}&max=1&md=d`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return false;
    if (data[0].word.toLowerCase() !== term.trim().toLowerCase()) return false;

    // Check if definition relates to the category
    const defs: string[] = data[0].defs ?? [];
    const keywords = CATEGORY_KEYWORDS[category];
    if (!keywords || defs.length === 0) return false;

    const defText = defs.join(" ").toLowerCase();
    return keywords.some((kw) => defText.includes(kw));
  } catch {
    return false;
  }
}

async function validateAnswer(
  answer: string,
  category: string,
  letter: string,
): Promise<boolean> {
  const trimmed = answer.trim();
  if (!trimmed) return false;

  // Must start with the correct letter
  if (trimmed[0].toUpperCase() !== letter.toUpperCase()) return false;

  // Must be at least 2 characters
  if (trimmed.length < 2) return false;

  // Search Wikipedia
  const results = await wikiSearchSnippets(trimmed);
  if (results.length === 0) {
    // No Wikipedia results - try Datamuse for common words
    return checkDatamuse(trimmed, category);
  }

  // Find a result whose title closely matches our answer
  const matched = results.find((r) => titleMatches(r.title, trimmed));
  if (!matched) {
    // Try with category context search
    const contextResults = await wikiSearchSnippets(`${trimmed} ${category}`);
    const contextMatched = contextResults.find((r) =>
      titleMatches(r.title, trimmed),
    );
    if (!contextMatched) {
      return checkDatamuse(trimmed, category);
    }

    // Verify category relevance from snippet, page extract, and wiki categories
    const [extract, wikiCats] = await Promise.all([
      wikiPageExtract(contextMatched.title),
      wikiPageCategories(contextMatched.title),
    ]);
    const snippetText = contextMatched.snippet.replace(/<[^>]*>/g, "").toLowerCase();
    return textMatchesCategory(
      snippetText + " " + extract,
      wikiCats,
      category,
    );
  }

  // We have a title match - now verify it fits the category
  const snippetText = matched.snippet.replace(/<[^>]*>/g, "").toLowerCase();

  // Fetch page extract and categories for deeper verification
  const [extract, wikiCats] = await Promise.all([
    wikiPageExtract(matched.title),
    wikiPageCategories(matched.title),
  ]);

  return textMatchesCategory(
    snippetText + " " + extract,
    wikiCats,
    category,
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidationRequest = await request.json();

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const results = await Promise.all(
      body.answers.map(async ({ category, answer, letter }) => {
        const valid = await validateAnswer(answer, category, letter);
        return { category, answer, valid };
      }),
    );

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 500 },
    );
  }
}
