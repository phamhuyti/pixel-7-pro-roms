import { Button } from "@/components/ui/button";
import { SNAPSHOT_LABEL } from "@/data/labels";
import {
  discontinuedRomsOf,
  liveRomsOf,
  staleRomsOf,
} from "@/data/registry";
import type { DeviceCatalog } from "@/data/types";
import { pathsFor } from "@/lib/paths";
import Link from "next/link";

export function Hero({ catalog }: { catalog: DeviceCatalog }) {
  const paths = pathsFor(catalog.id);
  const liveCustom = liveRomsOf(catalog).filter((rom) => !rom.isStock).length;
  const stale = staleRomsOf(catalog).length;
  const dead = discontinuedRomsOf(catalog).length;

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.45_0.08_175/0.18),transparent_50%),radial-gradient(ellipse_at_bottom_left,oklch(0.4_0.06_250/0.16),transparent_45%)]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-5">
          <p className="font-mono text-xs tracking-[0.18em] text-teal-300 uppercase">
            {catalog.name} · {catalog.codename}
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {catalog.heroTitle}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {catalog.heroLede}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button render={<Link href={paths.install} />}>
              Unlock và flash
            </Button>
            {catalog.id === "pixel-7-pro" && (
              <Button variant="secondary" render={<Link href={paths.lineageWeb} />}>
                Auto-flash LineageOS
              </Button>
            )}
            <Button variant="outline" render={<Link href="/" />}>
              Đổi máy
            </Button>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-3 sm:gap-4">
          <Stat value={String(liveCustom)} label="ROM custom còn sống" />
          <Stat
            value={String(stale)}
            label={dead > 0 ? "Cần kiểm tra" : "Stale"}
          />
          <Stat value={SNAPSHOT_LABEL.split(",")[0]} label="Ngày snapshot" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 px-3 py-3 sm:px-4">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-heading text-lg font-semibold tracking-tight whitespace-nowrap sm:text-xl">
        {value}
      </dd>
    </div>
  );
}
