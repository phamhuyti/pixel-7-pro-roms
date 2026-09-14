"use client";

import { deviceList } from "@/data/registry";
import { SNAPSHOT_LABEL } from "@/data/labels";
import { pathsFor } from "@/lib/paths";
import type { DeviceId } from "@/data/types";
import { Smartphone } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

const LAST_DEVICE_KEY = "rom-catalog-device";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function readLastDevice(): DeviceId | null {
  const stored = window.localStorage.getItem(LAST_DEVICE_KEY);
  if (stored === "pixel-7-pro" || stored === "lg-v50") return stored;
  return null;
}

function remember(id: DeviceId) {
  window.localStorage.setItem(LAST_DEVICE_KEY, id);
}

export function DevicePicker() {
  const lastId = useSyncExternalStore(subscribe, readLastDevice, () => null);

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.45_0.08_175/0.18),transparent_50%),radial-gradient(ellipse_at_bottom_left,oklch(0.4_0.06_250/0.16),transparent_45%)]"
      />
      <div className="relative mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="font-mono text-xs tracking-[0.18em] text-teal-300 uppercase">
          Snapshot {SNAPSHOT_LABEL}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Chọn điện thoại trước khi xem ROM.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Catalog và hướng dẫn cài khác nhau theo máy. Chưa chọn máy thì chưa
          có bảng so sánh, flash, Magisk hay unlock.
        </p>

        {lastId && (
          <p className="mt-6 text-sm text-muted-foreground">
            Lần trước:{" "}
            <Link
              href={pathsFor(lastId).home}
              className="text-teal-300 hover:underline"
              onClick={() => remember(lastId)}
            >
              {deviceList.find((item) => item.id === lastId)?.name}
            </Link>
          </p>
        )}

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {deviceList.map((device) => {
            const paths = pathsFor(device.id);
            return (
              <li key={device.id}>
                <Link
                  href={paths.home}
                  onClick={() => remember(device.id)}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-teal-400/40 hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                      <Smartphone className="size-5" />
                    </span>
                    <div>
                      <p className="font-heading text-lg font-semibold">
                        {device.name}
                      </p>
                      <p className="font-mono text-xs text-teal-300 uppercase">
                        {device.codename} · {device.chipset}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {device.pickerSummary}
                  </p>
                  {device.pickerWarning && (
                    <p className="mt-3 text-sm text-amber-200/90">
                      {device.pickerWarning}
                    </p>
                  )}
                  <p className="mt-4 text-sm font-medium text-teal-300">
                    Vào catalog {device.shortName} →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
