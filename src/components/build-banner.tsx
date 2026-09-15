import { BUILD_SHA, BUILD_TIME, formatBuildMark } from "@/lib/build-info";

/** Visible on every page so a Docker/next rebuild is obvious (stale image vs new). */
export function BuildBanner() {
  const label = formatBuildMark(BUILD_SHA, BUILD_TIME);
  return (
    <div className="border-b border-border/80 bg-muted/40">
      <p
        id="web-build-mark"
        title="Mốc rebuild: đổi sau mỗi docker compose build hoặc next build. Hard refresh nếu vẫn thấy bản cũ."
        className="mx-auto max-w-6xl truncate px-4 py-1 font-mono text-[11px] text-teal-300/90 sm:px-6"
      >
        {label}
      </p>
    </div>
  );
}
