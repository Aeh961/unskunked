export type RegionId = "washington" | "florida" | "ronneby" | "oregon" | "idaho" | "california";

export type Region = {
  id: RegionId;
  name: string;
  country: "US" | "SE";
  status: "Mocked" | "Placeholder";
  note: string;
};

export const regions: Region[] = [
  {
    id: "washington",
    name: "Washington",
    country: "US",
    status: "Mocked",
    note: "Washington has full local demo water, fish, and regulation scaffolding."
  },
  {
    id: "florida",
    name: "Florida",
    country: "US",
    status: "Mocked",
    note: "Florida has local demo freshwater, saltwater, and pier scaffolding."
  },
  {
    id: "ronneby",
    name: "Ronneby, Sweden",
    country: "SE",
    status: "Mocked",
    note: "Ronneby has local demo river, lake, and Baltic coastal scaffolding, structured so more Swedish municipalities can be added later."
  },
  {
    id: "oregon",
    name: "Oregon",
    country: "US",
    status: "Placeholder",
    note: "Demo-only placeholder. Official Oregon data is not connected yet."
  },
  {
    id: "idaho",
    name: "Idaho",
    country: "US",
    status: "Placeholder",
    note: "Demo-only placeholder. Official Idaho data is not connected yet."
  },
  {
    id: "california",
    name: "California",
    country: "US",
    status: "Placeholder",
    note: "Demo-only placeholder. Official California data is not connected yet."
  }
];

export function getRegion(id: RegionId): Region {
  return regions.find((region) => region.id === id) ?? regions[0];
}
