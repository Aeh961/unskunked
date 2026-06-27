export function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

export function searchByFields<T>(items: T[], query: string, fields: Array<(item: T) => string | string[]>) {
  const needle = normalizeSearch(query);
  if (!needle) return items;

  return items.filter((item) =>
    fields.some((field) => {
      const value = field(item);
      const values = Array.isArray(value) ? value : [value];
      return values.some((entry) => normalizeSearch(entry).includes(needle));
    })
  );
}
