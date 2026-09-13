"use client";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  cadenceLabels,
  googleLabels,
  groupLabels,
} from "@/data/labels";
import type { Rom } from "@/data/types";
import Link from "next/link";

export function RomCard({
  rom,
  selected,
  onToggle,
  canSelect,
}: {
  rom: Rom;
  selected: boolean;
  onToggle: (slug: string) => void;
  canSelect: boolean;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-semibold">
              <Link href={`/roms/${rom.slug}`} className="hover:underline">
                {rom.name}
              </Link>
            </h3>
            <StatusBadge status={rom.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{rom.tagline}</p>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox
            checked={selected}
            disabled={!selected && !canSelect}
            onCheckedChange={() => onToggle(rom.slug)}
            aria-label={`Chọn ${rom.name} để so sánh`}
          />
          So sánh
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="secondary">{rom.versionLabel}</Badge>
        <Badge variant="outline">{groupLabels[rom.group]}</Badge>
        <Badge variant="outline">{googleLabels[rom.google]}</Badge>
        <Badge variant="outline">{cadenceLabels[rom.cadence]}</Badge>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {rom.summary}
      </p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" render={<Link href={`/roms/${rom.slug}`} />}>
          Chi tiết
        </Button>
      </div>
    </article>
  );
}
