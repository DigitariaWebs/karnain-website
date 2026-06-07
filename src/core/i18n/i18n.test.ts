import { describe, expect, it } from "vitest";
import { defaultLocale, getDictionary, locales } from "./index";

describe("i18n", () => {
  it("defaults to French", () => {
    expect(defaultLocale).toBe("fr");
    expect(locales).toContain("fr");
  });

  it("returns the French dictionary with navigation and section copy", () => {
    const dict = getDictionary();
    expect(dict.nav.items.length).toBeGreaterThan(0);
    expect(dict.hero.primaryCta).toBeTruthy();
    expect(dict.collection.title).toBe("Karnain Addicte");
  });

  it("uses curly apostrophes in user-facing copy (no straight quotes)", () => {
    const dict = getDictionary("fr");
    expect(dict.hero.statement).not.toMatch(/'/);
    expect(dict.story.title).not.toMatch(/'/);
  });
});
