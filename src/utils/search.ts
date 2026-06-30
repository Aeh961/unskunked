export function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

export function searchByFields<T>(items: T[], query: string, fields: Array<(item: T) => string | string[]>) {
  const needle = normalizeSearch(query);
  if (!needle) return items;

  return items
    .map((item) => ({ item, score: scoreSearchItem(item, needle, fields) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item);
}

export function scoreSearchItem<T>(item: T, needle: string, fields: Array<(item: T) => string | string[]>) {
  const tokens = needle.split(/\s+/).filter(Boolean);
  return fields.reduce((score, field) => {
    const value = field(item);
    const values = Array.isArray(value) ? value : [value];
    return score + values.reduce((fieldScore, entry) => {
      const haystack = normalizeSearch(entry);
      if (!haystack) return fieldScore;
      if (haystack === needle) return fieldScore + 100;
      if (haystack.startsWith(needle)) return fieldScore + 60;
      if (haystack.includes(needle)) return fieldScore + 40;
      const tokenScore = tokens.filter((token) => haystack.includes(token) || fuzzyIncludes(haystack, token)).length * 12;
      return fieldScore + tokenScore;
    }, 0);
  }, 0);
}

export function fuzzyIncludes(haystack: string, needle: string) {
  if (needle.length < 3) return false;
  let index = 0;
  for (const char of haystack) {
    if (char === needle[index]) index += 1;
    if (index === needle.length) return true;
  }
  return false;
}
