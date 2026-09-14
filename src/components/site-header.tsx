"use client";

import { catalogs, isDeviceId } from "@/data/registry";
import { SNAPSHOT_LABEL } from "@/data/labels";
import { pathsFor } from "@/lib/paths";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const deviceId = pathname.split("/")[1];
  const device = isDeviceId(deviceId) ? catalogs[deviceId] : null;
  const paths = device ? pathsFor(device.id) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-[11px] font-semibold tracking-tight text-primary-foreground">
            {device ? device.shortName.slice(0, 1) : "R"}
          </span>
          <span className="text-sm font-semibold tracking-tight">
            {device ? device.shortName : "ROM catalog"}
          </span>
        </Link>
        {device && paths ? (
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href={`${paths.home}#goi-y`}
              className="hidden hover:text-foreground sm:inline"
            >
              Gợi ý
            </Link>
            <Link href={`${paths.home}#so-sanh`} className="hover:text-foreground">
              So sánh
            </Link>
            <Link href={paths.install} className="hover:text-foreground">
              Cài đặt
            </Link>
            <Link
              href={`${paths.home}#ngung`}
              className="hidden hover:text-foreground sm:inline"
            >
              Đã ngừng
            </Link>
            <Link
              href="/"
              className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] text-foreground hover:bg-muted"
            >
              Đổi máy
            </Link>
            <span className="hidden rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] text-foreground sm:inline">
              {device.codename}
            </span>
          </nav>
        ) : (
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono text-[11px]">{SNAPSHOT_LABEL}</span>
          </nav>
        )}
      </div>
    </header>
  );
}
