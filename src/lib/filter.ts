import { googleLabels, groupLabels } from "@/data/labels";
import type { GoogleStack, Rom, RomGroup, RomStatus } from "@/data/types";

export type CatalogFilters = {
  query: string;
  statuses: RomStatus[];
  groups: RomGroup[];
  android: "all" | "16" | "15" | "older";
  google: GoogleStack | "all";
  bootlock: "all" | "can-relock" | "unlocked-only" | "stock-locked";
};

export const emptyFilters: CatalogFilters = {
  query: "",
  statuses: [],
  groups: [],
  android: "all",
  google: "all",
  bootlock: "all",
};

export function filterRoms(roms: Rom[], filters: CatalogFilters): Rom[] {
  const q = filters.query.trim().toLowerCase();

  return roms.filter((rom) => {
    if (q) {
      const hay = [
        rom.name,
        rom.shortName,
        rom.tagline,
        rom.summary,
        rom.versionLabel,
        rom.buildLabel,
        googleLabels[rom.google],
        groupLabels[rom.group],
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.statuses.length > 0 && !filters.statuses.includes(rom.status)) {
      return false;
    }
    if (filters.groups.length > 0 && !filters.groups.includes(rom.group)) {
      return false;
    }
    if (filters.android === "16" && rom.androidVersion !== 16) return false;
    if (filters.android === "15" && rom.androidVersion !== 15) return false;
    if (filters.android === "older" && rom.androidVersion >= 15) return false;
    if (filters.google !== "all" && rom.google !== filters.google) return false;
    if (filters.bootlock !== "all" && rom.bootlock !== filters.bootlock) {
      return false;
    }
    return true;
  });
}
