import { v50Catalog } from "@/data/lg-v50/catalog";
import { pixelCatalog } from "@/data/pixel-7-pro/catalog";
import { recommendV50 } from "@/data/lg-v50/recommend";
import { recommendRoms as recommendPixel } from "@/data/pixel-7-pro/recommend";
import type { DeviceCatalog, DeviceId, NeedId } from "@/data/types";
import { assertGuideCoverage } from "@/lib/guide-coverage";
import type { Recommendation } from "@/lib/recommend";

export const deviceIds = ["pixel-7-pro", "lg-v50"] as const;

export const catalogs: Record<DeviceId, DeviceCatalog> = {
  "pixel-7-pro": pixelCatalog,
  "lg-v50": v50Catalog,
};

export const deviceList = deviceIds.map((id) => catalogs[id]);

export function isDeviceId(value: string | undefined): value is DeviceId {
  return value === "pixel-7-pro" || value === "lg-v50";
}

export function getCatalog(id: string): DeviceCatalog | undefined {
  if (!isDeviceId(id)) return undefined;
  const catalog = catalogs[id];
  assertGuideCoverage(
    catalog.flashGuides,
    catalog.rootGuides,
    catalog.switchGuides,
  );
  return catalog;
}

export function requireCatalog(id: string): DeviceCatalog {
  const catalog = getCatalog(id);
  if (!catalog) {
    throw new Error(`Unknown device: ${id}`);
  }
  return catalog;
}

export function liveRomsOf(catalog: DeviceCatalog) {
  return catalog.roms.filter(
    (rom) => rom.status === "stock" || rom.status === "active",
  );
}

export function staleRomsOf(catalog: DeviceCatalog) {
  return catalog.roms.filter((rom) => rom.status === "stale");
}

export function discontinuedRomsOf(catalog: DeviceCatalog) {
  return catalog.roms.filter((rom) => rom.status === "discontinued");
}

export function getRom(catalog: DeviceCatalog, slug: string) {
  return catalog.roms.find((rom) => rom.slug === slug);
}

export function getFlashGuide(catalog: DeviceCatalog, slug: string) {
  return catalog.flashGuides[slug];
}

export function flashableRomsOf(catalog: DeviceCatalog) {
  return catalog.roms.filter((rom) => catalog.flashGuides[rom.slug]);
}

export function recommendFor(
  catalog: DeviceCatalog,
  needs: NeedId[],
): Recommendation[] {
  if (catalog.id === "lg-v50") return recommendV50(needs);
  return recommendPixel(needs);
}
