"use client";

import { CatalogFiltersBar } from "@/components/catalog-filters";
import { CompareTable } from "@/components/compare-table";
import { RomCard } from "@/components/rom-card";
import { StatusBadge } from "@/components/status-badge";
import { Wizard } from "@/components/wizard";
import { Button } from "@/components/ui/button";
import { SNAPSHOT_LABEL } from "@/data/labels";
import { discontinuedRoms, liveRoms, roms, staleRoms } from "@/data/roms";
import { sources } from "@/data/sources";
import { emptyFilters, filterRoms } from "@/lib/filter";
import { defaultCompareSlugs } from "@/lib/recommend";
import { cn } from "cn";
import Link from "next/link";
import { useMemo, useState } from "react";

const MAX_COMPARE = 4;

export function CatalogApp() {
  const [filters, setFilters] = useState(emptyFilters);
  const [selected, setSelected] = useState<string[]>(defaultCompareSlugs);
  const [listTab, setListTab] = useState("cards");

  const filtered = useMemo(() => filterRoms(roms, filters), [filters]);
  const filteredLive = useMemo(() => filterRoms(liveRoms, filters), [filters]);
  const filteredStale = useMemo(() => filterRoms(staleRoms, filters), [filters]);
  const filteredDiscontinued = useMemo(
    () => filterRoms(discontinuedRoms, filters),
    [filters]
  );
  const selectedRoms = selected
    .map((slug) => roms.find((rom) => rom.slug === slug))
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
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setSelected([])}
              >
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
                    : "text-muted-foreground hover:text-foreground"
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
                    : "text-muted-foreground hover:text-foreground"
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
                            href={`/roms/${rom.slug}`}
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
            ROM có build 2026 kiểm chứng được.
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
                href={`/roms/${rom.slug}`}
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
            Official nhưng build cũ
          </h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            Vẫn từng official A16, nhưng file cheetah không thấy vòng vá 2026.
            Kiểm tra maintainer trước khi flash.
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
            Index cộng đồng (kể cả CustomRomBay) vẫn liệt kê các tên này. Không
            có bằng chứng build 2026 đáng tin. GSI không tính là ROM máy.
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
                  href={`/roms/${rom.slug}`}
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
            Dữ liệu tĩnh, curated {SNAPSHOT_LABEL} từ wiki/trang tải official:
            GrapheneOS releases, CalyxOS install + news, LineageOS wiki/download,
            Evolution X, crDroid, Infinity-X changelog, iodéOS device list,
            /e/OS doc, RisingOS XDA/SourceForge, DerpFest SourceForge, PixelOS,
            CustomRomBay (chỉ để đối chiếu tên đã ngừng). Telegram unofficial
            không được liệt kê.
          </p>
          <p className="mt-3 text-sm">
            <Link
              href={sources.flashAndroid}
              className="text-teal-300 underline-offset-2 hover:underline"
            >
              Quay lại stock
            </Link>{" "}
            bằng Android Flash Tool nếu cần khóa bootloader sau ROM khác.
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
        Xóa một tiêu chí — nhiều ROM feature đã ngừng sẽ biến mất nếu bạn chỉ
        giữ Android 16 + đang duy trì.
      </p>
    </div>
  );
}

function Faq() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Câu hỏi ngắn
        </h2>
        <dl className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <dt className="font-medium">Có cần custom ROM trên P7 Pro không?</dt>
            <dd className="mt-1 text-sm text-muted-foreground">
              Không, nếu bạn chỉ muốn máy còn cập nhật. Stock hỗ trợ đến tháng
              10/2027. ROM để đổi mô hình bảo mật, deGoogle, hoặc UI.
            </dd>
          </div>
          <div>
            <dt className="font-medium">ROM nào “chơi game / mượt nhất”?</dt>
            <dd className="mt-1 text-sm text-muted-foreground">
              Không đo benchmark ở đây. Kernel và firmware stock quyết định phần
              lớn. Đừng flash ROM Telegram vì lời hứa FPS.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Banking chết thì sao?</dt>
            <dd className="mt-1 text-sm text-muted-foreground">
              Ở stock. GrapheneOS đôi khi chạy được nhờ compatibility mode.
              Root + giả Integrity không phải giải pháp được trang này khuyến
              nghị.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Firmware trước khi flash?</dt>
            <dd className="mt-1 text-sm text-muted-foreground">
              Lineage (và nhiều fork) yêu cầu firmware stock Android 16. Đọc
              wiki máy, đừng tin “đang ở ROM khác là đủ”.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
