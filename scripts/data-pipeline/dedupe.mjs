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
 * Drops records that duplicate an existing curated entry by name (a name collision against
 * the hand-curated list is treated as the same real-world water, regardless of minor
 * coordinate drift). Within the import batch itself, a record is only considered a
 * duplicate of another when BOTH the name and the coordinates match (~110m) - matching by
 * name alone would incorrectly merge genuinely distinct same-named waters in different
 * counties (e.g. three different "Clear Lake"s), which is common enough in real WDFW/FWC
 * data that it can't be treated as a dedupe signal on its own.
 */
export function dedupeRecords(records, existingNames) {
  const existingNormalized = new Set(existingNames.map(normalizeName));
  const seenKeys = new Set();
  const kept = [];
  const droppedAgainstExisting = [];
  const droppedInternal = [];

  for (const record of records) {
    const nameKey = normalizeName(record.name);
    const coordinateKey = coordKey(record.latitude, record.longitude);
    const combinedKey = `${nameKey}|${coordinateKey}`;

    if (existingNormalized.has(nameKey)) {
      droppedAgainstExisting.push(record.name);
      continue;
    }
    if (seenKeys.has(combinedKey)) {
      droppedInternal.push(record.name);
      continue;
    }
    seenKeys.add(combinedKey);
    kept.push(record);
  }

  return { kept, droppedAgainstExisting, droppedInternal };
}
