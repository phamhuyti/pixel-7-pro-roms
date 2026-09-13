"use client";

import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import type { ReactNode } from "react";
import Link from "next/link";

const rows: {
  label: string;
  render: (rom: Rom) => ReactNode;
}[] = [
  {
    label: "Trạng thái",
    render: (rom) => <StatusBadge status={rom.status} />,
  },
  { label: "Nhóm", render: (rom) => groupLabels[rom.group] },
  { label: "Android", render: (rom) => rom.versionLabel },
  { label: "Build đã kiểm", render: (rom) => rom.buildLabel },
  { label: "Cập nhật", render: (rom) => cadenceLabels[rom.cadence] },
  { label: "OTA", render: (rom) => (rom.ota ? "Có" : "Không") },
  { label: "Bootloader", render: (rom) => bootlockLabels[rom.bootlock] },
  { label: "Google", render: (rom) => googleLabels[rom.google] },
  { label: "Play Integrity", render: (rom) => integrityLabels[rom.integrity] },
  { label: "Camera", render: (rom) => cameraLabels[rom.camera] },
  { label: "eSIM", render: (rom) => esimLabels[rom.esim] },
  { label: "Tùy biến UI", render: (rom) => customizationLabels[rom.customization] },
  { label: "Cách cài", render: (rom) => installLabels[rom.install] },
];

export function CompareTable({ roms }: { roms: Rom[] }) {
  if (roms.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
        Chưa chọn ROM. Tick “So sánh” trên thẻ, hoặc dùng wizard ở trên.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 min-w-36 bg-card">
              Tiêu chí
            </TableHead>
            {roms.map((rom) => (
              <TableHead key={rom.slug} className="min-w-44">
                <Link
                  href={`/roms/${rom.slug}`}
                  className="font-semibold hover:underline"
                >
                  {rom.shortName}
                </Link>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="sticky left-0 z-10 bg-card font-medium whitespace-normal">
                {row.label}
              </TableCell>
              {roms.map((rom) => (
                <TableCell key={rom.slug} className="whitespace-normal">
                  {row.render(rom)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
