import { describe, it, expect } from "vitest";
import { normalizeAnswer, stripLeadingArticle, toSingular } from "../normalize";

describe("normalizeAnswer", () => {
  it("trims whitespace", () => {
    expect(normalizeAnswer("  hello  ")).toBe("hello");
  });

  it("lowercases", () => {
    expect(normalizeAnswer("JORDAN")).toBe("jordan");
  });

  it("normalizes unicode/accents", () => {
    expect(normalizeAnswer("café")).toBe("cafe");
    expect(normalizeAnswer("naïve")).toBe("naive");
    expect(normalizeAnswer("São Paulo")).toBe("sao paulo");
  });

  it("removes surrounding punctuation", () => {
    expect(normalizeAnswer("hello!")).toBe("hello");
    expect(normalizeAnswer("(test)")).toBe("test");
  });

  it("collapses repeated spaces", () => {
    expect(normalizeAnswer("new   york")).toBe("new york");
  });

  it("strips curly quotes and backticks", () => {
    expect(normalizeAnswer("it's")).toBe("its");
    expect(normalizeAnswer("it\u2019s")).toBe("its");
  });

  it("preserves hyphens", () => {
    expect(normalizeAnswer("Coca-Cola")).toBe("coca-cola");
  });

  it("handles empty input", () => {
    expect(normalizeAnswer("")).toBe("");
    expect(normalizeAnswer("   ")).toBe("");
  });
});

describe("stripLeadingArticle", () => {
  it("strips 'the'", () => {
    expect(stripLeadingArticle("the matrix")).toBe("matrix");
  });

  it("strips 'a'", () => {
    expect(stripLeadingArticle("a beautiful mind")).toBe("beautiful mind");
  });

  it("strips 'an'", () => {
    expect(stripLeadingArticle("an officer")).toBe("officer");
  });

  it("does not strip mid-word", () => {
    expect(stripLeadingArticle("therapy")).toBe("therapy");
    expect(stripLeadingArticle("another one")).toBe("another one");
  });
});

describe("toSingular", () => {
  it("handles regular plurals", () => {
    expect(toSingular("cats")).toBe("cat");
    expect(toSingular("dogs")).toBe("dog");
  });

  it("handles -ies", () => {
    expect(toSingular("berries")).toBe("berry");
  });

  it("handles -ves", () => {
    expect(toSingular("wolves")).toBe("wolf");
  });

  it("handles -es", () => {
    expect(toSingular("boxes")).toBe("box");
    expect(toSingular("churches")).toBe("church");
  });

  it("leaves non-plurals alone", () => {
    expect(toSingular("bass")).toBe("bass");
    expect(toSingular("go")).toBe("go");
  });
});
