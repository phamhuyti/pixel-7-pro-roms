"use client";

import { catalogs, isDeviceId } from "@/data/registry";
import { SNAPSHOT_LABEL } from "@/data/labels";
import { pathsFor } from "@/lib/paths";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const deviceId = pathname.split("/")[1];
  const device = isDeviceId(deviceId) ? catalogs[deviceId] : null;
  const paths = device ? pathsFor(device.id) : null;

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Snapshot cộng đồng {SNAPSHOT_LABEL}. Chọn máy trên trang chủ trước.
          Wiki dự án thắng nếu lệch. Không hướng dẫn giả Play Integrity.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="hover:text-foreground">
            Đổi máy
          </Link>
          {device && paths && (
            <>
              <Link href={paths.install} className="hover:text-foreground">
                Cài đặt
              </Link>
              <a
                href={device.stockRestoreHref}
                className="hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                {device.stockRestoreLabel}
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
