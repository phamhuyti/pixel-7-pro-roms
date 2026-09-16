export const LINEAGE_DEVICE = "cheetah" as const;
export const LINEAGE_DEVICE_NAME = "Pixel 7 Pro";

export const LINEAGE_BUILDS_API =
  `https://download.lineageos.org/api/v2/devices/${LINEAGE_DEVICE}/builds` as const;

export const LINEAGE_BUILDS_API_PROXY = "/api/lineage/cheetah/builds" as const;

/** Same-origin streaming proxy — mirror CDN has no CORS for the browser. */
export const LINEAGE_FILE_PROXY_PREFIX =
  "/api/lineage/cheetah/file" as const;

export function lineageFileProxyPath(filename: string): string {
  return `${LINEAGE_FILE_PROXY_PREFIX}/${encodeURIComponent(filename)}`;
}

export const LINEAGE_DOWNLOADS_PAGE =
  `https://download.lineageos.org/devices/${LINEAGE_DEVICE}/builds` as const;

/** Partition images required by the LineageOS cheetah wiki before recovery. */
export const FLASH_IMAGE_NAMES = [
  "boot.img",
  "dtbo.img",
  "vendor_kernel_boot.img",
  "vendor_boot.img",
] as const;

export type FlashImageName = (typeof FLASH_IMAGE_NAMES)[number];

export type LineageBuildFile = {
  filename: string;
  url: string;
  sha256: string;
  size: number;
};

export type LineageBuild = {
  date: string;
  version: string;
  type: string;
  files: LineageBuildFile[];
};

export type ResolvedRelease = {
  date: string;
  version: string;
  rom: LineageBuildFile;
  images: Record<FlashImageName, LineageBuildFile>;
};
