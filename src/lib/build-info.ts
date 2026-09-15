/** Baked at `next build` / `next dev` start via next.config.ts. */
export const BUILD_SHA = process.env.NEXT_PUBLIC_BUILD_SHA?.trim() || "unknown";
export const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME?.trim() || "";

export function formatBuildMark(sha: string, iso: string): string {
  const id = sha || "unknown";
  if (!iso) return `bản web ${id}`;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return `bản web ${id}`;
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
  return `bản web ${id} · ${stamp}`;
}

export const BUILD_MARK = formatBuildMark(BUILD_SHA, BUILD_TIME);
