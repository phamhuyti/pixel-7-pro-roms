"use client";

import { Button } from "@/components/ui/button";
import { needLabels } from "@/data/labels";
import type { NeedId } from "@/data/types";
import { recommendRoms } from "@/lib/recommend";
import { cn } from "cn";
import { Banknote, Camera, Palette, Shield, Unplug } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const needOrder: NeedId[] = [
  "security",
  "banking",
  "camera",
  "degoogle",
  "customize",
];

const needIcons: Record<NeedId, typeof Shield> = {
  security: Shield,
  banking: Banknote,
  camera: Camera,
  degoogle: Unplug,
  customize: Palette,
};

export function Wizard({
  onApply,
}: {
  onApply: (slugs: string[]) => void;
}) {
  const [needs, setNeeds] = useState<NeedId[]>([]);
  const picks = useMemo(() => recommendRoms(needs), [needs]);

  useEffect(() => {
    if (needs.length === 0) return;
    document
      .getElementById("goi-y-ket-qua")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [needs]);

  function toggle(need: NeedId) {
    setNeeds((current) =>
      current.includes(need)
        ? current.filter((item) => item !== need)
        : [...current, need]
    );
  }

  return (
    <section id="goi-y" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Bạn cần gì ở máy này?
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Không có ROM “tốt nhất”. Chọn một hoặc nhiều nhu cầu — trang này
              chỉ xếp các lựa chọn còn sống, kèm lý do.
            </p>
          </div>
          {needs.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setNeeds([])}>
              Xóa lựa chọn
            </Button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {needOrder.map((need) => {
            const selected = needs.includes(need);
            const Icon = needIcons[need];
            return (
              <button
                key={need}
                type="button"
                onClick={() => toggle(need)}
                aria-pressed={selected}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left transition-colors",
                  selected
                    ? "border-teal-400/50 bg-teal-400/10"
                    : "border-border bg-card hover:bg-muted/50"
                )}
              >
                <Icon className="mb-2 size-4 text-teal-300" />
                <p className="text-sm font-medium">{needLabels[need].title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {needLabels[need].detail}
                </p>
              </button>
            );
          })}
        </div>

        {needs.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Chưa chọn nhu cầu — bên dưới vẫn xem được toàn bộ catalog.
          </p>
        ) : picks.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Không khớp ROM còn sống. Nới nhu cầu hoặc xem bảng so sánh.
          </p>
        ) : (
          <div
            id="goi-y-ket-qua"
            aria-live="polite"
            className="mt-6 space-y-3 rounded-xl border border-teal-400/30 bg-teal-400/5 p-4"
          >
            <h3 className="font-heading text-lg font-semibold tracking-tight">
              Gợi ý cho bạn
            </h3>
            <ol className="grid gap-3 md:grid-cols-2">
              {picks.map((pick, index) => (
                <li
                  key={pick.rom.slug}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <p className="font-mono text-[11px] text-muted-foreground">
                    Gợi ý {index + 1}
                  </p>
                  <Link
                    href={`/roms/${pick.rom.slug}`}
                    className="mt-1 block font-heading text-lg font-semibold hover:underline"
                  >
                    {pick.rom.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pick.rom.tagline}
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-sm">
                    {pick.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <Button
              onClick={() => onApply(picks.map((pick) => pick.rom.slug))}
            >
              Đưa {picks.length} gợi ý vào bảng so sánh
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
