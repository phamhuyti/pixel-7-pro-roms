import type { DeviceId } from "@/data/types";

export function pathsFor(device: DeviceId) {
  const base = `/${device}`;
  return {
    base,
    home: base,
    install: `${base}/cai-dat`,
    unlock: `${base}/cai-dat/unlock-bootloader`,
    switchRom: `${base}/cai-dat/tu-custom-rom`,
    root: `${base}/cai-dat/root`,
    hotspot6ghz: `${base}/cai-dat/hotspot-6ghz`,
    lineageWeb: `${base}/cai-dat/lineageos/web`,
    rom: (slug: string) => `${base}/roms/${slug}`,
    flash: (slug: string) => `${base}/cai-dat/${slug}`,
  };
}

export type DevicePaths = ReturnType<typeof pathsFor>;
