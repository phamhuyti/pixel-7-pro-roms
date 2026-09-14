"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import {
  bootlockLabels,
  googleLabels,
  groupLabels,
  statusLabels,
} from "@/data/labels";
import type { GoogleStack, RomGroup, RomStatus } from "@/data/types";
import type { CatalogFilters } from "@/lib/filter";
import { emptyFilters } from "@/lib/filter";

const statusOptions: RomStatus[] = [
  "stock",
  "active",
  "stale",
  "discontinued",
];
const groupOptions: RomGroup[] = [
  "baseline",
  "privacy",
  "clean",
  "degoogle",
  "feature",
];
const googleOptions: GoogleStack[] = [
  "stock",
  "sandboxed-play",
  "microg",
  "gapps",
  "optional-gapps",
  "none",
];

export function CatalogFiltersBar({
  filters,
  onChange,
  resultCount,
  androidFilters,
}: {
  filters: CatalogFilters;
  onChange: (next: CatalogFilters) => void;
  resultCount: number;
  androidFilters: { value: string; label: string }[];
}) {
  function toggleStatus(status: RomStatus) {
    const statuses = filters.statuses.includes(status)
      ? filters.statuses.filter((item) => item !== status)
      : [...filters.statuses, status];
    onChange({ ...filters, statuses });
  }

  function toggleGroup(group: RomGroup) {
    const groups = filters.groups.includes(group)
      ? filters.groups.filter((item) => item !== group)
      : [...filters.groups, group];
    onChange({ ...filters, groups });
  }

  const dirty =
    filters.query !== "" ||
    filters.statuses.length > 0 ||
    filters.groups.length > 0 ||
    filters.android !== "all" ||
    filters.google !== "all" ||
    filters.bootlock !== "all";

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          value={filters.query}
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
          placeholder="Tìm ROM, ví dụ Graphene, microG, weekly…"
          aria-label="Tìm ROM"
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:max-w-sm dark:bg-input/30"
        />
        <Select
          value={filters.google}
          onValueChange={(value) => {
            if (value)
              onChange({
                ...filters,
                google: value as CatalogFilters["google"],
              });
          }}
        >
          <SelectTrigger className="w-full lg:w-52" aria-label="Lọc Google">
            <SelectValue>
              {filters.google === "all"
                ? "Mọi kiểu Google"
                : googleLabels[filters.google]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi kiểu Google</SelectItem>
            {googleOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {googleLabels[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.bootlock}
          onValueChange={(value) => {
            if (value)
              onChange({
                ...filters,
                bootlock: value as CatalogFilters["bootlock"],
              });
          }}
        >
          <SelectTrigger className="w-full lg:w-52" aria-label="Lọc bootloader">
            <SelectValue>
              {filters.bootlock === "all"
                ? "Mọi bootloader"
                : bootlockLabels[filters.bootlock]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi bootloader</SelectItem>
            <SelectItem value="stock-locked">
              {bootlockLabels["stock-locked"]}
            </SelectItem>
            <SelectItem value="can-relock">
              {bootlockLabels["can-relock"]}
            </SelectItem>
            <SelectItem value="unlocked-only">
              {bootlockLabels["unlocked-only"]}
            </SelectItem>
          </SelectContent>
        </Select>
        {dirty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(emptyFilters)}
          >
            Xóa lọc
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {statusOptions.map((status) => (
          <Toggle
            key={status}
            variant="outline"
            size="sm"
            pressed={filters.statuses.includes(status)}
            onPressedChange={() => toggleStatus(status)}
          >
            {statusLabels[status]}
          </Toggle>
        ))}
        <span className="mx-1 hidden h-7 w-px bg-border sm:block" />
        {androidFilters
          .filter((option) => option.value !== "all")
          .map((option) => (
            <Toggle
              key={option.value}
              variant="outline"
              size="sm"
              pressed={filters.android === option.value}
              onPressedChange={(pressed) =>
                onChange({
                  ...filters,
                  android: pressed
                    ? option.value
                    : "all",
                })
              }
            >
              {option.label}
            </Toggle>
          ))}
        <span className="mx-1 hidden h-7 w-px bg-border sm:block" />
        {groupOptions.map((group) => (
          <Toggle
            key={group}
            variant="outline"
            size="sm"
            pressed={filters.groups.includes(group)}
            onPressedChange={() => toggleGroup(group)}
          >
            {groupLabels[group]}
          </Toggle>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{resultCount} ROM khớp lọc</p>
    </div>
  );
}
