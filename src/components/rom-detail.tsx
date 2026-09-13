import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  bootlockLabels,
  cadenceLabels,
  cameraLabels,
  customizationLabels,
  esimLabels,
  googleLabels,
  groupLabels,
  installLabels,
  integrityLabels,
} from "@/data/labels";
import type { Rom } from "@/data/types";
import Link from "next/link";

export function RomDetail({ rom }: { rom: Rom }) {
  const facts = [
    ["Android", rom.versionLabel],
    ["Build", rom.buildLabel],
    ["Nhóm", groupLabels[rom.group]],
    ["Cập nhật", cadenceLabels[rom.cadence]],
    ["OTA", rom.ota ? "Có" : "Không"],
    ["Bootloader", bootlockLabels[rom.bootlock]],
    ["Google", googleLabels[rom.google]],
    ["Play Integrity", integrityLabels[rom.integrity]],
    ["Camera", cameraLabels[rom.camera]],
    ["eSIM", esimLabels[rom.esim]],
    ["Tùy biến", customizationLabels[rom.customization]],
    ["Cài đặt", installLabels[rom.install]],
  ] as const;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          ← Catalog Pixel 7 Pro
        </Link>
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {rom.name}
        </h1>
        <StatusBadge status={rom.status} />
        {rom.isStock && <Badge variant="secondary">Baseline</Badge>}
      </div>
      <p className="mt-3 text-lg text-muted-foreground">{rom.tagline}</p>
      <p className="mt-4 leading-relaxed">{rom.summary}</p>

      <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {facts.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-card px-3 py-2">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-8 space-y-2">
        <h2 className="font-heading text-lg font-semibold">Play Integrity</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {rom.integrityNote}
        </p>
      </section>
      <section className="mt-6 space-y-2">
        <h2 className="font-heading text-lg font-semibold">Camera</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {rom.cameraNote}
        </p>
      </section>

      {rom.strengths.length > 0 && (
        <section className="mt-8">
          <h2 className="font-heading text-lg font-semibold">Điểm mạnh</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {rom.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {rom.weaknesses.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-semibold">Điểm yếu</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {rom.weaknesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {rom.bestFor.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-semibold">Phù hợp với</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {rom.bestFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {rom.notFor.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-semibold">Không phù hợp với</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {rom.notFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {rom.notes.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-semibold">Ghi chú</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {rom.notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <Separator className="my-8" />

      <h2 className="font-heading text-lg font-semibold">Link official</h2>
      {rom.links.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Không còn kênh official đáng tin. Đừng tải zip mang tên này từ diễn
          đàn lạ.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {rom.links.map((link) => (
            <li key={link.href}>
              <Button
                variant="outline"
                render={
                  <a href={link.href} target="_blank" rel="noreferrer" />
                }
              >
                {link.label}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-sm">
        <Link href="/#so-sanh" className="text-teal-300 hover:underline">
          Quay lại bảng so sánh
        </Link>
      </p>
    </article>
  );
}
