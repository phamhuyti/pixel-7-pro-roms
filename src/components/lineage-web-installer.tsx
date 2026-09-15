"use client";

import { Button } from "@/components/ui/button";
import {
  fetchLatestCheetahRelease,
  requiredFilesOf,
  verifyBlobSha256,
} from "@/lib/lineage-web-install/api";
import { BlobStore } from "@/lib/lineage-web-install/blob-store";
import {
  FastbootDevice,
  flashRecoveryImages,
  missingFlashImages,
  unlockBootloader,
  webUsbAvailable,
} from "@/lib/lineage-web-install/fastboot";
import {
  FLASH_IMAGE_NAMES,
  LINEAGE_DEVICE,
  LINEAGE_DEVICE_NAME,
  type FlashImageName,
  type ResolvedRelease,
} from "@/lib/lineage-web-install/types";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

type StatusKind = "idle" | "ok" | "error" | "busy";

type StepStatus = {
  text: string;
  kind: StatusKind;
  progress?: number;
};

const emptyStatus = (): StepStatus => ({ text: "", kind: "idle" });

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MiB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GiB`;
}

function StatusBlock({
  id,
  status,
  reconnect,
  onReconnect,
}: {
  id: string;
  status: StepStatus;
  reconnect?: boolean;
  onReconnect?: () => void;
}) {
  if (!status.text && !reconnect) return null;
  return (
    <div id={`${id}-status-container`} className="mt-3 space-y-2">
      {status.text && (
        <p
          className={
            status.kind === "error"
              ? "text-sm text-red-400"
              : status.kind === "ok"
                ? "text-sm text-teal-300"
                : "text-sm text-muted-foreground"
          }
        >
          {status.text}
        </p>
      )}
      {status.progress !== undefined && (
        <progress
          className="h-2 w-full overflow-hidden rounded bg-muted [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-teal-500 [&::-moz-progress-bar]:bg-teal-500"
          value={status.progress}
          max={1}
        />
      )}
      {reconnect && onReconnect && (
        <Button type="button" variant="outline" size="sm" onClick={onReconnect}>
          Kết nối lại thiết bị (WebUSB)
        </Button>
      )}
    </div>
  );
}

function StepCard({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        <span className="mr-2 font-mono text-sm text-teal-300">{step}.</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function LineageWebInstaller() {
  const [usbOk] = useState(() => webUsbAvailable());
  const [release, setRelease] = useState<ResolvedRelease | null>(null);
  const [releaseError, setReleaseError] = useState<string | null>(null);
  const [cached, setCached] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [needReconnect, setNeedReconnect] = useState(false);

  const [unlockStatus, setUnlockStatus] = useState<StepStatus>(emptyStatus);
  const [loadStatus, setLoadStatus] = useState<StepStatus>(emptyStatus);
  const [flashStatus, setFlashStatus] = useState<StepStatus>(emptyStatus);

  const [device] = useState(() => new FastbootDevice());
  const [store] = useState(() => new BlobStore());
  const reconnectResolver = useRef<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const latest = await fetchLatestCheetahRelease();
        if (cancelled) return;
        setRelease(latest);
        await store.init();
        const map: Record<string, boolean> = {};
        for (const f of requiredFilesOf(latest)) {
          map[f.filename] = await store.hasFile(f.filename);
        }
        if (!cancelled) setCached(map);
      } catch (e) {
        if (!cancelled) {
          setReleaseError(e instanceof Error ? e.message : String(e));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [store]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!busy) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [busy]);

  const refreshCached = async (rel: ResolvedRelease) => {
    const map: Record<string, boolean> = {};
    for (const f of requiredFilesOf(rel)) {
      map[f.filename] = await store.hasFile(f.filename);
    }
    setCached(map);
  };

  const runSafe = async (
    setStatus: (s: StepStatus) => void,
    fn: () => Promise<string | void>,
  ) => {
    setBusy(true);
    setStatus({ text: "Đang chạy…", kind: "busy" });
    try {
      const msg = await fn();
      setStatus({
        text: msg ?? "Xong.",
        kind: "ok",
        progress: 1,
      });
    } catch (error) {
      let message: string;
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        message =
          "Hết dung lượng lưu trình duyệt (IndexedDB). Thoát Incognito hoặc giải phóng ổ đĩa.";
      } else if (error instanceof Error && error.message) {
        message = error.message;
      } else {
        message = String(error);
      }
      setStatus({ text: `Lỗi: ${message}`, kind: "error" });
      throw error;
    } finally {
      setBusy(false);
    }
  };

  const handleUnlock = () =>
    runSafe(setUnlockStatus, async () => {
      if (!usbOk) throw new Error("Trình duyệt không hỗ trợ WebUSB.");
      return unlockBootloader(device, (text) =>
        setUnlockStatus({ text, kind: "busy" }),
      );
    });

  const handleOpenDownloads = () => {
    if (!release) return;
    for (const f of requiredFilesOf(release)) {
      window.open(f.url, "_blank", "noopener,noreferrer");
    }
    setLoadStatus({
      text: "Đã mở link tải official. Sau khi tải xong, bấm “Nạp file đã tải” và chọn đủ 5 file cùng build.",
      kind: "ok",
    });
  };

  const ingestFiles = async (fileList: FileList | File[]) => {
    if (!release) throw new Error("Chưa lấy được metadata build.");
    const files = [...fileList];
    if (files.length === 0) return;

    const byName = new Map(files.map((f) => [f.name, f]));
    const needed = requiredFilesOf(release);
    let done = 0;

    await store.init();
    for (const meta of needed) {
      const file = byName.get(meta.filename);
      if (!file) continue;
      setLoadStatus({
        text: `Đối chiếu SHA256 ${meta.filename}…`,
        kind: "busy",
        progress: done / needed.length,
      });
      await verifyBlobSha256(file, meta.sha256, meta.filename);
      await store.saveFile(meta.filename, file);
      done += 1;
    }

    await refreshCached(release);

    const stillMissing: string[] = [];
    for (const f of needed) {
      if (!(await store.hasFile(f.filename))) stillMissing.push(f.filename);
    }

    if (stillMissing.length > 0) {
      setLoadStatus({
        text: `Đã nạp một phần. Còn thiếu: ${stillMissing.join(", ")}. Chọn lại đủ file cùng build ${release.date}.`,
        kind: "error",
      });
      return;
    }

    setLoadStatus({
      text: `Đã nạp và xác minh SHA256 đủ file cho LineageOS ${release.version} (${release.date}).`,
      kind: "ok",
      progress: 1,
    });
  };

  const handleLoadFiles = () => {
    fileInputRef.current?.click();
  };

  const onFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    e.target.value = "";
    if (!list?.length) return;
    setBusy(true);
    try {
      await ingestFiles(list);
    } catch (error) {
      setLoadStatus({
        text: `Lỗi: ${error instanceof Error ? error.message : String(error)}`,
        kind: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const waitReconnect = () =>
    new Promise<void>((resolve) => {
      setNeedReconnect(true);
      setFlashStatus({
        text: "Máy đang reboot Fastboot — bấm “Kết nối lại thiết bị” khi thấy Fastboot Mode.",
        kind: "busy",
      });
      reconnectResolver.current = () => {
        setNeedReconnect(false);
        resolve();
      };
    });

  const handleReconnect = async () => {
    await device.connect();
    reconnectResolver.current?.();
    reconnectResolver.current = null;
  };

  const handleFlash = () =>
    runSafe(setFlashStatus, async () => {
      if (!usbOk) throw new Error("Trình duyệt không hỗ trợ WebUSB.");
      if (!release) throw new Error("Chưa có metadata release.");

      const blobs: Partial<Record<FlashImageName, Blob>> = {};
      await store.init();
      for (const name of FLASH_IMAGE_NAMES) {
        const blob = await store.loadFile(name);
        if (!blob) {
          throw new Error(
            `Chưa nạp ${name}. Tải từ link official rồi “Nạp file đã tải”.`,
          );
        }
        // Re-verify against current release metadata
        await verifyBlobSha256(blob, release.images[name].sha256, name);
        blobs[name] = blob;
      }
      const miss = missingFlashImages(blobs);
      if (miss.length) {
        throw new Error(`Thiếu image: ${miss.join(", ")}`);
      }

      await flashRecoveryImages(
        device,
        blobs as Record<FlashImageName, Blob>,
        (text, progress) => setFlashStatus({ text, kind: "busy", progress }),
        waitReconnect,
      );

      return (
        "Đã flash boot/dtbo/vendor_kernel_boot/vendor_boot. " +
        "Trên Fastboot chọn Recovery (logo Lineage). Format data → Apply from ADB → sideload zip ROM (và GApps nếu cần). " +
        "Không khóa bootloader."
      );
    });

  const imagesReady =
    !!release && FLASH_IMAGE_NAMES.every((n) => cached[n]);
  const romReady = !!release && !!cached[release.rom.filename];

  return (
    <div className="space-y-2">
      {!usbOk && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          Trình duyệt không hỗ trợ WebUSB. Dùng Chrome / Edge / Brave / Vanadium
          (không Firefox, không Incognito). Hoặc dùng script CLI{" "}
          <a
            className="underline"
            href="/tools/lineageos-cheetah-flash.sh"
          >
            lineageos-cheetah-flash.sh
          </a>
          .
        </p>
      )}

      <StepCard step={1} title="Điều kiện trước khi flash">
        <p>
          Giống GrapheneOS web installer: máy ở{" "}
          <strong className="text-foreground">Fastboot Mode</strong> (tam giác đỏ),
          OEM unlocking đã bật, firmware stock{" "}
          <strong className="text-foreground">Android 16 mới nhất</strong>, đúng{" "}
          {LINEAGE_DEVICE_NAME} (<code className="text-foreground">{LINEAGE_DEVICE}</code>
          ). Wiki Lineage không khóa bootloader sau khi cài.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Cáp data, cổng USB thẳng; Linux nên có gói udev Android.</li>
          <li>
            Mirror LineageOS không cho trình duyệt tải trực tiếp (CORS) — khác
            releases.grapheneos.org — nên bước tải mở link official, rồi nạp file
            local và đối chiếu SHA256 trong máy bạn.
          </li>
          <li>
            Script CLI vẫn tự tải + flash + sideload nếu bạn muốn one-shot trên
            terminal.
          </li>
        </ul>
      </StepCard>

      <StepCard step={2} title="Unlock bootloader">
        <p>
          Nếu đã unlock sẵn, bước này báo “đã unlock”. Lệnh wipe dữ liệu — xác nhận
          trên máy.
        </p>
        <Button
          type="button"
          disabled={!usbOk || busy}
          onClick={() => void handleUnlock().catch(() => undefined)}
        >
          Unlock bootloader
        </Button>
        <StatusBlock id="unlock" status={unlockStatus} />
      </StepCard>

      <StepCard step={3} title="Lấy bản LineageOS (nightly official)">
        {releaseError && (
          <p className="text-red-400">Không đọc API: {releaseError}</p>
        )}
        {release && (
          <>
            <p>
              Nightly mới nhất từ{" "}
              <code className="text-foreground">download.lineageos.org</code>:{" "}
              <strong className="text-foreground">
                LineageOS {release.version}
              </strong>{" "}
              ({release.date}) — ~{formatBytes(release.rom.size)}.
            </p>
            <ul className="space-y-1 font-mono text-xs text-foreground/90">
              {requiredFilesOf(release).map((f) => (
                <li key={f.filename} className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      cached[f.filename] ? "text-teal-300" : "text-amber-300"
                    }
                  >
                    {cached[f.filename] ? "● cached" : "○ missing"}
                  </span>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-300 hover:underline"
                  >
                    {f.filename}
                  </a>
                  <span className="text-muted-foreground">
                    {formatBytes(f.size)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            disabled={!release || busy}
            onClick={handleOpenDownloads}
          >
            Mở link tải (5 file)
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!release || busy}
            onClick={handleLoadFiles}
          >
            Nạp file đã tải
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => void onFileInput(e)}
          />
        </div>
        <StatusBlock id="load" status={loadStatus} />
        <p className="text-xs">
          Cache trình duyệt: {imagesReady ? "đủ 4 image" : "thiếu image"}
          {" · "}
          {romReady ? "có zip ROM" : "chưa có zip ROM (cần cho sideload tay)"}
        </p>
      </StepCard>

      <StepCard step={4} title="Flash recovery images (WebUSB)">
        <p>
          Tương đương phần fastboot trên wiki / GrapheneOS “Flash release”, nhưng
          chỉ flash{" "}
          <code className="text-foreground">boot</code>,{" "}
          <code className="text-foreground">dtbo</code>,{" "}
          <code className="text-foreground">vendor_kernel_boot</code>,{" "}
          <code className="text-foreground">vendor_boot</code>. Zip ROM Lineage
          không phải factory image — phải sideload qua recovery (bước 5).
        </p>
        <Button
          type="button"
          disabled={!usbOk || busy || !imagesReady}
          onClick={() => void handleFlash().catch(() => undefined)}
        >
          Flash recovery images
        </Button>
        <StatusBlock
          id="flash"
          status={flashStatus}
          reconnect={needReconnect}
          onReconnect={() => void handleReconnect()}
        />
      </StepCard>

      <StepCard step={5} title="Format data + sideload ROM">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Fastboot → Recovery. Phải thấy logo Lineage; nếu không, flash lại bước
            4.
          </li>
          <li>Factory reset → Format data / factory reset → về menu chính.</li>
          <li>
            Apply update → Apply from ADB, rồi trên máy tính:
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground">
              {release
                ? `adb -d sideload ${release.rom.filename}`
                : "adb -d sideload lineage-*-cheetah-signed.zip"}
            </pre>
          </li>
          <li>
            GApps (tuỳ chọn, trước boot đầu): recovery hỏi reboot recovery → Yes,
            rồi{" "}
            <code className="text-foreground">
              adb -d sideload MindTheGapps-arm64-*.zip
            </code>
            .
          </li>
          <li>Back → Reboot system now. Không chạy `fastboot flashing lock`.</li>
        </ol>
        <p>
          Muốn sideload cũng được script hoá:{" "}
          <a
            className="text-teal-300 hover:underline"
            href="/tools/lineageos-cheetah-flash.sh"
          >
            lineageos-cheetah-flash.sh
          </a>{" "}
          (tải + flash + nhắc Format/Apply + sideload).
        </p>
      </StepCard>
    </div>
  );
}
