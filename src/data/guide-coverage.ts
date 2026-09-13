import { flashGuideSlugs } from "./flash";
import { rootGuides } from "./root";
import { switchGuides } from "./switch-rom";

/** Living flash slugs must also have switch + root pages. */
export function assertLivingGuideCoverage() {
  const missing: string[] = [];
  for (const slug of flashGuideSlugs) {
    if (!rootGuides[slug]) missing.push(`root:${slug}`);
    if (!switchGuides[slug]) missing.push(`switch:${slug}`);
  }
  if (missing.length > 0) {
    throw new Error(`Thiếu guide cho ROM còn sống: ${missing.join(", ")}`);
  }
}
