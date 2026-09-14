import type { FlashGuide, RootGuide, SwitchGuide } from "@/data/types";

export function assertGuideCoverage(
  flashGuides: Record<string, FlashGuide>,
  rootGuides: Record<string, RootGuide>,
  switchGuides: Record<string, SwitchGuide>,
) {
  const missing: string[] = [];
  for (const slug of Object.keys(flashGuides)) {
    if (!rootGuides[slug]) missing.push(`root:${slug}`);
    if (!switchGuides[slug]) missing.push(`switch:${slug}`);
  }
  if (missing.length > 0) {
    throw new Error(`Thiếu guide: ${missing.join(", ")}`);
  }
}
