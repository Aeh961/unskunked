const VALID_WATER_TYPES = new Set(["Lake", "River", "Saltwater", "Park", "Pier"]);
const VALID_ACCESS_TYPES = new Set(["Shore", "Boat", "Pier", "Beach", "Bank"]);
const VALID_ACTIVITY_TYPES = new Set(["fishing", "clamming", "crabbing"]);

function slugify(name) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Validates and normalizes one raw import record (as produced by the research pass) into
 * the shape generate.mjs needs. Returns { record } on success or { error } on rejection -
 * invalid records are dropped and reported, never silently coerced into something fake.
 */
export function normalizeImportRecord(raw, regionId) {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const county = typeof raw.county === "string" ? raw.county.trim() : "";
  const city = typeof raw.city === "string" ? raw.city.trim() : county;
  const waterType = raw.waterType;
  const latitude = Number(raw.latitude);
  const longitude = Number(raw.longitude);
  const sourceUrl = typeof raw.sourceUrl === "string" ? raw.sourceUrl.trim() : "";

  if (!name) return { error: "missing name" };
  if (!VALID_WATER_TYPES.has(waterType)) return { error: `invalid waterType "${waterType}" for ${name}` };
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return { error: `invalid latitude for ${name}` };
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return { error: `invalid longitude for ${name}` };
  if (!sourceUrl) return { error: `missing sourceUrl for ${name}` };
  // Reject obvious low-quality/crowdsourced sources; everything else is trusted at this
  // stage since a research pass already fetched the page and recorded a sourceOrganization -
  // government sites don't all share one domain pattern (city .com sites, county .us sites,
  // state .gov sites, agency-specific domains all show up legitimately).
  if (/wikipedia\.org|blogspot\.|pinterest\.|facebook\.com|tripadvisor\.|yelp\.com|reddit\.com|instagram\.com/i.test(sourceUrl)) {
    return { error: `sourceUrl for ${name} looks like a crowdsourced/social source, not authoritative: ${sourceUrl}` };
  }

  const accessType = VALID_ACCESS_TYPES.has(raw.accessType) ? raw.accessType : undefined;
  // The app's ActivityType is fishing/clamming/crabbing only - a source describing this as
  // e.g. a general "boating" access point doesn't mean the app should invent an unsupported
  // activity value, so anything outside the known set is dropped rather than passed through.
  const rawActivities = Array.isArray(raw.activities) ? raw.activities.filter((item) => VALID_ACTIVITY_TYPES.has(item)) : [];
  const activities = rawActivities.length > 0 ? rawActivities : ["fishing"];
  const verificationStatus = raw.verificationStatus === "verified" || raw.verificationStatus === "needs-verification"
    ? raw.verificationStatus
    : "imported";

  return {
    record: {
      id: slugify(name),
      name,
      county: county || undefined,
      city: city || undefined,
      waterType,
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
      accessType,
      activities,
      sourceUrl,
      sourceOrganization: typeof raw.sourceOrganization === "string" ? raw.sourceOrganization.trim() : undefined,
      verificationStatus,
      lastUpdated: typeof raw.lastUpdated === "string" ? raw.lastUpdated.trim() : undefined,
      notes: typeof raw.notes === "string" ? raw.notes.trim() : undefined
    }
  };
}
