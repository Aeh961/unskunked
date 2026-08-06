function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function coordKey(latitude, longitude) {
  return `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
}

/**
 * Drops records that duplicate an existing curated entry (by name) or duplicate each other
 * (by name or by rounded coordinates, ~110m). Keeps the first occurrence, which matters
 * when a batch has near-duplicate entries pulled from more than one source page.
 */
export function dedupeRecords(records, existingNames) {
  const existingNormalized = new Set(existingNames.map(normalizeName));
  const seenNames = new Set();
  const seenCoords = new Set();
  const kept = [];
  const droppedAgainstExisting = [];
  const droppedInternal = [];

  for (const record of records) {
    const nameKey = normalizeName(record.name);
    const coordinateKey = coordKey(record.latitude, record.longitude);

    if (existingNormalized.has(nameKey)) {
      droppedAgainstExisting.push(record.name);
      continue;
    }
    if (seenNames.has(nameKey) || seenCoords.has(coordinateKey)) {
      droppedInternal.push(record.name);
      continue;
    }
    seenNames.add(nameKey);
    seenCoords.add(coordinateKey);
    kept.push(record);
  }

  return { kept, droppedAgainstExisting, droppedInternal };
}
