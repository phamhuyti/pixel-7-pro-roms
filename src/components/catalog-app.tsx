"use client";

import { CatalogFiltersBar } from "@/components/catalog-filters";
import { CompareTable } from "@/components/compare-table";
import { useDevice } from "@/components/device-context";
import { RomCard } from "@/components/rom-card";
import { StatusBadge } from "@/components/status-badge";
import { Wizard } from "@/components/wizard";
import { Button } from "@/components/ui/button";
import { SNAPSHOT_LABEL } from "@/data/labels";
import {
  discontinuedRomsOf,
  liveRomsOf,
  staleRomsOf,
} from "@/data/registry";
import { emptyFilters, filterRoms } from "@/lib/filter";
import { cn } from "cn";
import Link from "next/link";
import { useMemo, useState } from "react";

const MAX_COMPARE = 4;

export function CatalogApp() {
  const { catalog, paths } = useDevice();
  const [filters, setFilters] = useState(emptyFilters);
  const [selected, setSelected] = useState<string[]>(catalog.defaultCompareSlugs);
  const [listTab, setListTab] = useState("cards");

  const liveRoms = liveRomsOf(catalog);
  const staleRoms = staleRomsOf(catalog);
  const discontinuedRoms = discontinuedRomsOf(catalog);

  const filtered = useMemo(
    () => filterRoms(catalog.roms, filters, catalog.androidOlderBelow),
    [catalog.roms, catalog.androidOlderBelow, filters],
  );
  const filteredLive = useMemo(
    () => filterRoms(liveRoms, filters, catalog.androidOlderBelow),
    [liveRoms, catalog.androidOlderBelow, filters],
  );
  const filteredStale = useMemo(
    () => filterRoms(staleRoms, filters, catalog.androidOlderBelow),
    [staleRoms, catalog.androidOlderBelow, filters],
  );
  const filteredDiscontinued = useMemo(
    () => filterRoms(discontinuedRoms, filters, catalog.androidOlderBelow),
    [discontinuedRoms, catalog.androidOlderBelow, filters],
  );
  const selectedRoms = selected
    .map((slug) => catalog.roms.find((rom) => rom.slug === slug))
    .filter((rom) => rom != null);

  function toggleCompare(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }
      if (current.length >= MAX_COMPARE) return current;
      return [...current, slug];
    });
  }

  function applyWizard(slugs: string[]) {
    setSelected(slugs.slice(0, MAX_COMPARE));
    document.getElementById("so-sanh")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <Wizard onApply={applyWizard} />

      <section id="so-sanh" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              So sánh và lọc
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tối đa {MAX_COMPARE} cột. Snapshot {SNAPSHOT_LABEL}. Tick ROM
              trong danh sách bên dưới. Bộ lọc chỉ thu danh sách — bảng so sánh
              giữ các cột đã chọn.
            </p>
          </div>

          <CatalogFiltersBar
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
            androidFilters={catalog.androidFilters}
          />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Đang so sánh:</span>
            {selectedRoms.length === 0 ? (
              <span className="text-sm text-muted-foreground">chưa chọn</span>
            ) : (
              selectedRoms.map((rom) => (
                <Button
                  key={rom.slug}
                  size="xs"
                  variant="secondary"
                  onClick={() => toggleCompare(rom.slug)}
                >
                  {rom.shortName} ×
                </Button>
              ))
            )}
            {selected.length > 0 && (
              <Button size="xs" variant="ghost" onClick={() => setSelected([])}>
                Bỏ hết
              </Button>
            )}
          </div>

          <CompareTable roms={selectedRoms} />

          <div>
            <div
              role="tablist"
              aria-label="Kiểu danh sách ROM"
              className="inline-flex rounded-lg bg-muted p-[3px]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={listTab === "cards"}
                className={cn(
                  "rounded-md px-2.5 py-1 text-sm font-medium",
                  listTab === "cards"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setListTab("cards")}
              >
                Thẻ ROM
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={listTab === "compact"}
                className={cn(
                  "rounded-md px-2.5 py-1 text-sm font-medium",
                  listTab === "compact"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setListTab("compact")}
              >
                Danh sách gọn
              </button>
            </div>
            <div className="mt-4">
              {filtered.length === 0 ? (
                <EmptyFilter />
              ) : listTab === "cards" ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {filtered.map((rom) => (
                    <RomCard
                      key={rom.slug}
                      rom={rom}
                      selected={selected.includes(rom.slug)}
                      onToggle={toggleCompare}
                      canSelect={selected.length < MAX_COMPARE}
                    />
                  ))}
                </div>
              ) : (
                <ul className="divide-y divide-border rounded-xl border border-border bg-card">
                  {filtered.map((rom) => (
                    <li
                      key={rom.slug}
                      className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={paths.rom(rom.slug)}
                            className="font-medium hover:underline"
                          >
                            {rom.name}
                          </Link>
                          <StatusBadge status={rom.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rom.versionLabel} · {rom.buildLabel}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={
                          selected.includes(rom.slug) ? "secondary" : "outline"
                        }
                        disabled={
                          !selected.includes(rom.slug) &&
                          selected.length >= MAX_COMPARE
                        }
                        onClick={() => toggleCompare(rom.slug)}
                      >
                        {selected.includes(rom.slug)
                          ? "Bỏ so sánh"
                          : "Thêm so sánh"}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Nhóm còn duy trì
          </h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            Stock cộng {liveRoms.filter((rom) => !rom.isStock).length} custom
            ROM đang active trong snapshot.
          </p>
          {filteredLive.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Không còn ROM trong nhóm này khớp bộ lọc.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredLive.map((rom) => (
                <Link
                  key={rom.slug}
                  href={paths.rom(rom.slug)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted"
                >
                  {rom.shortName}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Cần kiểm tra / đã dừng maintain
          </h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            Wiki hoặc kho zip còn, nhưng không còn vòng vá đều. Đọc kỹ trước
            khi flash.
          </p>
          {filteredStale.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Không còn ROM trong nhóm này khớp bộ lọc.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredStale.map((rom) => (
                <RomCard
                  key={rom.slug}
                  rom={rom}
                  selected={selected.includes(rom.slug)}
                  onToggle={toggleCompare}
                  canSelect={selected.length < MAX_COMPARE}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="ngung" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Đã ngừng — không daily
          </h2>
          <p className="mt-1 mb-4 max-w-3xl text-sm text-muted-foreground">
            Tên còn trên diễn đàn. Không có bằng chứng build đáng tin gần
            snapshot. GSI không tính là ROM máy.
          </p>
          {filteredDiscontinued.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Không còn ROM trong nhóm này khớp bộ lọc.
            </p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {filteredDiscontinued.map((rom) => (
                <li key={rom.slug}>
                  <Link
                    href={paths.rom(rom.slug)}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
                  >
                    <span>
                      {rom.name}
                      <span className="ml-2 text-muted-foreground">
                        {rom.versionLabel}
                      </span>
                    </span>
                    <StatusBadge status={rom.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Faq />

      <section id="nguon" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Nguồn snapshot
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {catalog.sourcesNote}
          </p>
          <p className="mt-3 text-sm">
            <a
              href={catalog.stockRestoreHref}
              className="text-teal-300 underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Quay lại stock
            </a>{" "}
            ({catalog.stockRestoreLabel}).
          </p>
        </div>
      </section>
    </>
  );
}

function EmptyFilter() {
  return (
    <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center">
      <p className="font-medium">Không có ROM khớp bộ lọc.</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Xóa một tiêu chí — ROM stale/discontinued sẽ biến mất nếu bạn chỉ giữ
        bản Android mới + đang duy trì.
      </p>
    </div>
  );
}

function Faq() {
  const { catalog, paths } = useDevice();
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Câu hỏi ngắn
        </h2>
        <dl className="mt-5 grid gap-5 md:grid-cols-2">
          {catalog.faq.map((item) => (
            <div key={item.q}>
              <dt className="font-medium">{item.q}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {item.a}
                {item.q.startsWith("Flash") && (
                  <>
                    {" "}
                    <Link
                      href={paths.install}
                      className="text-teal-300 hover:underline"
                    >
                      Cài đặt
                    </Link>
                    .
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
