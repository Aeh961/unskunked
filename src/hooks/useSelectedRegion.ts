import { useEffect, useState } from "react";
import { RegionId } from "@/src/data/regions";
import { getSelectedRegion } from "@/src/utils/localStore";
import { getOfficialLinkProvider } from "@/src/services/officialLinks";

export function useSelectedRegion() {
  const [region, setRegion] = useState<RegionId>("washington");

  useEffect(() => {
    getSelectedRegion().then(setRegion);
  }, []);

  const officialLinkProvider = getOfficialLinkProvider(region);

  return { region, officialLinkProvider };
}
