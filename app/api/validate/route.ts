import { NextRequest, NextResponse } from "next/server";

interface ValidationRequest {
  answers: { category: string; answer: string; letter: string }[];
}

// Keywords that Wikipedia article content/categories should contain for each game category
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Town: ["town", "city", "village", "municipality", "settlement", "populated place", "census-designated", "population", "county seat", "borough", "hamlet", "unincorporated"],
  State: ["state", "province", "region", "territory", "subdivision", "administrative", "u.s. state", "federal subject"],
  Country: ["country", "sovereign", "nation", "republic", "kingdom", "state in", "member state", "independent"],
  "Capital City": ["capital", "seat of government", "capital city", "capital of", "capital and largest"],
  "Girl's Name": ["given name", "feminine", "female name", "female given", "name of", "first name", "forename", "hypocorism", "diminutive"],
  "Boy's Name": ["given name", "masculine", "male name", "male given", "name of", "first name", "forename", "hypocorism", "diminutive"],
  "Article of Clothing": ["clothing", "garment", "worn", "fashion", "apparel", "fabric", "textile", "dress", "wear", "footwear", "headwear", "outerwear"],
  Animal: ["animal", "species", "mammal", "bird", "fish", "reptile", "insect", "genus", "family", "amphibian", "invertebrate", "predator", "prey", "habitat"],
  "Food/Dish": ["food", "dish", "cuisine", "recipe", "ingredient", "cooking", "bread", "dessert", "soup", "sauce", "meat", "vegetable", "fruit", "pastry", "baked", "eaten", "meal"],
  Movie: ["film", "movie", "directed", "starring", "box office", "screenplay", "released"],
  Book: ["book", "novel", "author", "written by", "published", "literature", "novella", "memoir", "nonfiction"],
  "Historical Figure": ["historian", "emperor", "king", "queen", "president", "leader", "general", "politician", "revolutionary", "explorer", "conqueror", "born", "died", "reign", "century", "war", "battle", "founder", "statesman", "philosopher"],
  "Body of Water": ["river", "lake", "ocean", "sea", "bay", "gulf", "strait", "creek", "reservoir", "waterway", "tributary", "flows", "basin", "estuary"],
  "Musical Instrument": ["instrument", "musical", "played", "string", "woodwind", "brass", "percussion", "keyboard", "plucked", "bowed"],
  Profession: ["profession", "occupation", "career", "job", "worker", "specialist", "practitioner", "person who", "responsible for", "trained", "expert", "professional"],
  "Plant/Flower": ["plant", "flower", "species", "genus", "botanical", "herb", "tree", "shrub", "flora", "blossom", "perennial", "annual", "cultivar", "bloom"],
  Sport: ["sport", "game", "competition", "tournament", "championship", "played", "athlete", "olympic", "team sport", "race", "racing", "marathon", "athletics", "league", "match", "event"],
  Brand: ["brand", "company", "corporation", "founded", "manufacturer", "trademark", "subsidiary", "products", "headquartered", "multinational"],
  Language: ["language", "spoken", "dialect", "lingua", "speakers", "linguistic", "official language", "native"],
  "Mythological Figure": ["mythology", "myth", "god", "goddess", "deity", "legend", "mythical", "folklore", "pantheon", "demigod", "hero", "titan"],
  "Song Title": ["song", "single", "track", "recorded", "album", "music", "billboard", "chart", "written by", "performed by", "lyrics"],
  "TV Show": ["television", "tv series", "tv show", "sitcom", "drama", "episodes", "season", "aired", "network", "streaming", "premiered", "created by"],
  "Scientific Term": ["science", "scientific", "theory", "biology", "chemistry", "physics", "cell", "molecule", "process", "phenomenon", "medical", "organism", "compound", "element", "equation", "hypothesis", "genetic", "quantum", "atomic"],
  "Board Game": ["board game", "game", "players", "dice", "cards", "tabletop", "strategy game", "parlor", "designed by", "published by", "gameplay"],
};

// For name categories, also try searching for the "(name)" Wikipedia article directly
const NAME_CATEGORIES = ["Girl's Name", "Boy's Name"];

// Categories where a Wikipedia search with "(category)" suffix helps find the right article
const CATEGORY_SEARCH_SUFFIXES: Record<string, string[]> = {
  "Girl's Name": ["name", "given name"],
  "Boy's Name": ["name", "given name"],
  "Capital City": ["city"],
  "Body of Water": ["river", "lake"],
  "Musical Instrument": ["instrument"],
  "TV Show": ["TV series"],
  Movie: ["film"],
  "Board Game": ["board game"],
  "Song Title": ["song"],
};

async function wikiSearchSnippets(
  term: string,
): Promise<{ title: string; snippet: string }[]> {
  if (!term.trim()) return [];
  try {
    const encoded = encodeURIComponent(term.trim());
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&srlimit=5&format=json&origin=*`;
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
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=extracts&exintro=1&explaintext=1&exsentences=5&format=json&origin=*`;
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
  return (
    t === s ||
    t === s + " (name)" ||
    t === s + " (given name)" ||
    t.startsWith(s + " ") ||
    t.startsWith(s + ",") ||
    t.startsWith(s + "(") ||
    t.includes("(" + s + ")")
  );
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

    const defs: string[] = data[0].defs ?? [];
    const keywords = CATEGORY_KEYWORDS[category];
    if (!keywords || defs.length === 0) return false;

    const defText = defs.join(" ").toLowerCase();
    return keywords.some((kw) => defText.includes(kw));
  } catch {
    return false;
  }
}

async function tryWikiPage(
  title: string,
  gameCategory: string,
): Promise<boolean> {
  const [extract, wikiCats] = await Promise.all([
    wikiPageExtract(title),
    wikiPageCategories(title),
  ]);
  if (!extract && wikiCats.length === 0) return false;
  return textMatchesCategory(extract, wikiCats, gameCategory);
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

  // Strategy 1: Direct Wikipedia article lookup (e.g. "William (name)" for names)
  if (NAME_CATEGORIES.includes(category)) {
    const namePageValid = await tryWikiPage(`${trimmed} (name)`, category);
    if (namePageValid) return true;
    const givenNameValid = await tryWikiPage(
      `${trimmed} (given name)`,
      category,
    );
    if (givenNameValid) return true;
  }

  // Strategy 2: Search Wikipedia for the term
  const results = await wikiSearchSnippets(trimmed);

  if (results.length > 0) {
    // Check all matching results, not just the first
    for (const result of results) {
      if (!titleMatches(result.title, trimmed)) continue;

      const snippetText = result.snippet.replace(/<[^>]*>/g, "").toLowerCase();

      // Quick check: does the snippet itself contain category keywords?
      const keywords = CATEGORY_KEYWORDS[category];
      if (keywords && keywords.some((kw) => snippetText.includes(kw))) {
        return true;
      }

      // Deeper check: fetch the page extract and categories
      const valid = await tryWikiPage(result.title, category);
      if (valid) return true;
    }
  }

  // Strategy 3: Search with category-specific suffixes
  const suffixes = CATEGORY_SEARCH_SUFFIXES[category] ?? [category];
  for (const suffix of suffixes) {
    const contextResults = await wikiSearchSnippets(`${trimmed} ${suffix}`);
    for (const result of contextResults) {
      if (!titleMatches(result.title, trimmed)) continue;

      const snippetText = result.snippet.replace(/<[^>]*>/g, "").toLowerCase();
      const keywords = CATEGORY_KEYWORDS[category];
      if (keywords && keywords.some((kw) => snippetText.includes(kw))) {
        return true;
      }

      const valid = await tryWikiPage(result.title, category);
      if (valid) return true;
    }
  }

  // Strategy 4: Datamuse fallback for common dictionary words
  return checkDatamuse(trimmed, category);
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
