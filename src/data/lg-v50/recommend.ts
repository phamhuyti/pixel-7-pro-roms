import type { NeedId } from "../types";
import type { Recommendation } from "@/lib/recommend";
import { roms } from "./roms";

const weights: Record<NeedId, Partial<Record<string, number>>> = {
  security: {
    lineageos: 3,
    "lineage-microg": 2,
    "stock-lg": 1,
  },
  banking: {
    "stock-lg": 4,
  },
  camera: {
    "stock-lg": 6,
  },
  degoogle: {
    "lineage-microg": 5,
    lineageos: 3,
  },
  customize: {
    lineageos: 2,
    "lineage-microg": 1,
  },
};

const reasonCopy: Record<NeedId, Record<string, string>> = {
  security: {
    lineageos: "AOSP sạch hơn LG UX hết vá — nhưng official đã dừng, không harden như Graphene.",
    "lineage-microg": "Cùng Lineage 21, có microG; vẫn là bản đóng băng.",
    "stock-lg": "Firmware hãng — hết OTA, chỉ còn là mốc camera/mạng.",
  },
  banking: {
    "stock-lg": "Trên V50, stock A12 cũ vẫn là chỗ app ngân hàng ít “lạ” nhất. Không đảm bảo 2026.",
  },
  camera: {
    "stock-lg": "LG Camera / Dual Screen chỉ ổn trên stock.",
  },
  degoogle: {
    "lineage-microg": "microG sẵn trên zip công khai 05/2026.",
    lineageos: "Vanilla, GApps không bắt buộc.",
  },
  customize: {
    lineageos: "Một ít extra Lineage, không phải rice ROM.",
    "lineage-microg": "Ít tùy biến hơn, thiên deGoogle.",
  },
};

export const defaultCompareSlugs = [
  "stock-lg",
  "lineageos",
  "lineage-microg",
];

const recommendPool = roms.filter((rom) => rom.status !== "discontinued");

export function recommendV50(needs: NeedId[]): Recommendation[] {
  if (needs.length === 0) return [];
  const scored = recommendPool.map((rom) => {
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
