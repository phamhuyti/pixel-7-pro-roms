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
    lineageWeb: `${base}/cai-dat/lineageos/web`,
    rom: (slug: string) => `${base}/roms/${slug}`,
    flash: (slug: string) => `${base}/cai-dat/${slug}`,
  };
}

export type DevicePaths = ReturnType<typeof pathsFor>;
