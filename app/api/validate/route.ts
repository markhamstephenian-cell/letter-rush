import { NextRequest, NextResponse } from "next/server";

interface ValidationRequest {
  answers: { category: string; answer: string; letter: string }[];
}

async function checkWikipedia(term: string): Promise<boolean> {
  if (!term.trim()) return false;
  try {
    const encoded = encodeURIComponent(term.trim());
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&srlimit=3&format=json&origin=*`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const data = await res.json();
    const results = data?.query?.search;
    if (!results || results.length === 0) return false;

    // Check if any result title closely matches
    const normalizedTerm = term.trim().toLowerCase();
    return results.some((r: { title: string }) => {
      const title = r.title.toLowerCase();
      return (
        title === normalizedTerm ||
        title.includes(normalizedTerm) ||
        normalizedTerm.includes(title)
      );
    });
  } catch {
    return false;
  }
}

async function checkDatamuse(term: string): Promise<boolean> {
  if (!term.trim()) return false;
  try {
    const encoded = encodeURIComponent(term.trim());
    const url = `https://api.datamuse.com/words?sp=${encoded}&max=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const data = await res.json();
    return (
      Array.isArray(data) &&
      data.length > 0 &&
      data[0].word.toLowerCase() === term.trim().toLowerCase()
    );
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

  // Check Wikipedia first, then Datamuse as fallback
  const wikiValid = await checkWikipedia(trimmed);
  if (wikiValid) return true;

  // For certain categories, also try with category context
  const categorySearches = [
    `${trimmed} ${category}`,
    trimmed,
  ];

  for (const searchTerm of categorySearches) {
    const wikiContextValid = await checkWikipedia(searchTerm);
    if (wikiContextValid) return true;
  }

  const datamuseValid = await checkDatamuse(trimmed);
  return datamuseValid;
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
