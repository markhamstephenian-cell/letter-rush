/**
 * Normalize user input for comparison:
 * - trim whitespace
 * - lowercase
 * - normalize unicode/accents
 * - remove surrounding punctuation
 * - collapse repeated spaces
 */
export function normalizeAnswer(input: string): string {
  return input
    // normalize unicode (NFD) then strip combining diacritical marks
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // lowercase
    .toLowerCase()
    // strip curly quotes, backticks, and smart quotes
    .replace(/[\u2018\u2019\u201A\u201B''`]/g, "")
    // replace non-alphanumeric (except spaces and hyphens) with space
    .replace(/[^a-z0-9 \-]/g, " ")
    // collapse spaces
    .replace(/\s+/g, " ")
    // trim
    .trim();
}

/** Strip leading articles ("the", "a", "an") for article-insensitive matching */
export function stripLeadingArticle(input: string): string {
  return input.replace(/^(the|a|an)\s+/i, "");
}

/**
 * Simple plural normalization:
 * - strips trailing "s" or "es" for basic singular/plural matching
 * Only used when other strategies fail.
 */
export function toSingular(input: string): string {
  if (input.endsWith("ies") && input.length > 4) {
    return input.slice(0, -3) + "y";
  }
  if (input.endsWith("ves") && input.length > 4) {
    return input.slice(0, -3) + "f";
  }
  if (input.endsWith("ses") || input.endsWith("xes") || input.endsWith("zes") || input.endsWith("ches") || input.endsWith("shes")) {
    return input.slice(0, -2);
  }
  if (input.endsWith("s") && !input.endsWith("ss") && input.length > 2) {
    return input.slice(0, -1);
  }
  return input;
}

/**
 * Conservative fuzzy match: Levenshtein distance <= 1 for short words, <= 2 for longer.
 * Only returns true if there's a clear match — avoids false positives.
 */
export function fuzzyMatch(input: string, candidate: string): boolean {
  if (input === candidate) return true;
  const maxDist = candidate.length <= 5 ? 1 : 2;
  return levenshtein(input, candidate) <= maxDist;
}

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  // Quick reject: if length difference is too large, skip
  if (Math.abs(a.length - b.length) > 2) return 3;

  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}
