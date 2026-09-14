import type { NeedId } from "../types";
import type { Recommendation } from "@/lib/recommend";
import { roms } from "./roms";

const weights: Record<NeedId, Partial<Record<string, number>>> = {
  security: {
    "stock-vivo": 4,
  },
  banking: {
    "stock-vivo": 6,
  },
  camera: {
    "stock-vivo": 6,
  },
  degoogle: {},
  customize: {},
};

const reasonCopy: Record<NeedId, Record<string, string>> = {
  security: {
    "stock-vivo":
      "OTA hãng + bootloader khóa là lựa chọn bảo mật thực tế duy nhất trên máy này — không có Graphene/Calyx.",
  },
  banking: {
    "stock-vivo": "Funtouch stock là chỗ app ngân hàng/Wallet ít bị chặn nhất trên V40 Lite.",
  },
  camera: {
    "stock-vivo": "Camera vivo / Aura chỉ có trên stock — không có ROM thay thế trong catalog.",
  },
  degoogle: {},
  customize: {},
};

export const defaultCompareSlugs = ["stock-vivo"];

const recommendPool = roms.filter((rom) => rom.status !== "discontinued");

export function recommendV40Lite(needs: NeedId[]): Recommendation[] {
  if (needs.length === 0) return [];

  const wantsUnsupported = needs.some(
    (need) => need === "degoogle" || need === "customize",
  );

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
    if (wantsUnsupported && rom.slug === "stock-vivo" && score === 0) {
      score = 1;
      reasons.push(
        "Không có ROM deGoogle/tùy biến trên máy này — stock là lựa chọn còn lại trong catalog.",
      );
    }
    return { rom, score, reasons };
  });
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.rom.name.localeCompare(b.rom.name))
    .slice(0, 4);
}
