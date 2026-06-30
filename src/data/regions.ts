export type RegionId = "washington" | "oregon" | "idaho" | "california";

export type Region = {
  id: RegionId;
  name: string;
  status: "Mocked" | "Placeholder";
  note: string;
};

export const regions: Region[] = [
  {
    id: "washington",
    name: "Washington",
    status: "Mocked",
    note: "Washington has full local demo water, fish, and regulation scaffolding."
  },
  {
    id: "oregon",
    name: "Oregon",
    status: "Placeholder",
    note: "Demo-only placeholder. Official Oregon data is not connected yet."
  },
  {
    id: "idaho",
    name: "Idaho",
    status: "Placeholder",
    note: "Demo-only placeholder. Official Idaho data is not connected yet."
  },
  {
    id: "california",
    name: "California",
    status: "Placeholder",
    note: "Demo-only placeholder. Official California data is not connected yet."
  }
];
