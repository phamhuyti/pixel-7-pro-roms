import { liveRoms } from "./roms";
import type { NeedId } from "@/data/types";
import type { Recommendation } from "@/lib/recommend";

const weights: Record<NeedId, Partial<Record<string, number>>> = {
  security: {
    grapheneos: 6,
    calyxos: 3,
    "stock-pixel": 2,
    iodeos: 2,
    lineageos: 1,
  },
  banking: {
    "stock-pixel": 6,
    grapheneos: 2,
  },
  camera: {
    "stock-pixel": 6,
    "evolution-x": 3,
    "infinity-x": 3,
    crdroid: 2,
    lineageos: 1,
  },
  degoogle: {
    calyxos: 5,
    iodeos: 5,
    grapheneos: 4,
    "e-os": 3,
    lineageos: 2,
  },
  customize: {
    crdroid: 5,
    "evolution-x": 4,
    "infinity-x": 3,
    lineageos: 2,
  },
};

const reasonCopy: Record<NeedId, Record<string, string>> = {
  security: {
    grapheneos: "Hardening và khóa verified boot mạnh nhất trên Pixel.",
    calyxos: "Có thể khóa bootloader, vá A16 còn sống, ít hardening hơn Graphene.",
    "stock-pixel": "Firmware Google đầy đủ — kém harden nhưng chuỗi cập nhật gốc.",
    iodeos: "Fork Lineage có chặn tracker; không harden như Graphene.",
    lineageos: "AOSP sạch, official — bảo mật ở mức “không bloat”, không harden.",
  },
  banking: {
    "stock-pixel": "Play Integrity và Wallet gần như chỉ ổn trên stock.",
    grapheneos: "Sandbox Play + compatibility mode; vẫn thua stock, hơn ROM mở bootloader.",
  },
  camera: {
    "stock-pixel": "Pixel Camera và Photos nguyên bản.",
    "evolution-x": "Hướng Pixel + GApps, gần camera stock hơn AOSP trần.",
    "infinity-x": "Changelog nhấn full Pixel experience.",
    crdroid: "Vendor HAL Pixel; không phải Magic Editor gốc.",
    lineageos: "Camera vendor thường chạy; tính năng Google tùy GApps.",
  },
  degoogle: {
    calyxos: "microG + flasher official.",
    iodeos: "microG và chặn quảng cáo sẵn.",
    grapheneos: "Có thể không cài Play, hoặc Play trong sandbox.",
    "e-os": "Hệ sinh thái /e/ — đang ở community A15.",
    lineageos: "Vanilla, GApps không bắt buộc.",
  },
  customize: {
    crdroid: "Nhiều tweak UI nhất trong nhóm còn weekly.",
    "evolution-x": "Theme / extra features, gần Pixel.",
    "infinity-x": "Pixel-like, tùy biến vừa.",
    lineageos: "Một ít extra Lineage, không phải rice ROM.",
  },
};

export function recommendRoms(needs: NeedId[]): Recommendation[] {
  if (needs.length === 0) return [];

  const scored = liveRoms.map((rom) => {
    let score = 0;
    const reasons: string[] = [];
    for (const need of needs) {
      const points = weights[need][rom.slug] ?? 0;
      if (points > 0) {
        score += points;
        const reason = reasonCopy[need][rom.slug];
        if (reason) reasons.push(reason);
      }
    }
    return { rom, score, reasons };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.rom.name.localeCompare(b.rom.name))
    .slice(0, 4);
}

export const defaultCompareSlugs = [
  "stock-pixel",
  "grapheneos",
  "lineageos",
  "evolution-x",
];
