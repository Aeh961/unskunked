import shellfishSnapshot from "@/data/snapshots/wdfw-shellfish-sources.json";
import { shellfishLocations, shellfishSpecies } from "@/src/data/shellfish";
import { waterbodies } from "@/src/data/waterbodies";

export type WdfwSnapshotSource = {
  id: string;
  title: string;
  sourceUrl: string;
  snapshotDate: string;
  importedDate: string;
  lastVerifiedDate: string;
  activityTypes: string[];
};

export type WdfwSnapshotManifest = {
  version: string;
  dataLastUpdated: string;
  sources: WdfwSnapshotSource[];
};

export const wdfwSnapshotManifest = shellfishSnapshot as WdfwSnapshotManifest;

export function getImportReadinessReport() {
  const officialWaterbodies = waterbodies.filter((water) => water.waterbodyId && water.source && water.lastUpdated);
  return {
    dataLastUpdated: wdfwSnapshotManifest.dataLastUpdated,
    sourceCount: wdfwSnapshotManifest.sources.length,
    waterbodyCount: officialWaterbodies.length,
    shellfishLocationCount: shellfishLocations.length,
    shellfishSpeciesCount: shellfishSpecies.length,
    missingSourceWaterbodies: waterbodies.filter((water) => !water.waterbodyId || !water.source || !water.lastUpdated).map((water) => water.name)
  };
}

export function validateSnapshotManifest(manifest: WdfwSnapshotManifest = wdfwSnapshotManifest) {
  return manifest.sources.every((source) =>
    source.sourceUrl.includes("wdfw.wa.gov") &&
    source.snapshotDate.length >= 7 &&
    source.importedDate.length >= 7 &&
    source.lastVerifiedDate.length >= 7
  );
}
