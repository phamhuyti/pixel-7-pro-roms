"use client";

import { CommandBlock } from "@/components/command-block";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  fetchLatestCheetahReleaseWithFallback,
  requiredFilesOf,
} from "@/lib/lineage-web-install/api";
import { BlobStore } from "@/lib/lineage-web-install/blob-store";
import {
  FastbootDevice,
  closeFastbootUsb,
  disarmFastbootAutoConnect,
  flashRecoveryImages,
  rebootToRecovery,
  unlockBootloader,
  webUsbAvailable,
} from "@/lib/lineage-web-install/fastboot";
import {
  planFileIngest,
  snapshotSelectedFiles,
} from "@/lib/lineage-web-install/files";
import {
  loadVerifiedFlashImages,
  loadVerifiedRomZip,
  verifyReleaseBlob,
} from "@/lib/lineage-web-install/flash-guard";
import {
  connectAdbForSideload,
  rebootToBootloaderViaAdb,
  sideloadZip,
} from "@/lib/lineage-web-install/sideload";
import {
  FLASH_IMAGE_NAMES,
  LINEAGE_DEVICE,
  LINEAGE_DEVICE_NAME,
  LINEAGE_DOWNLOADS_PAGE,
  type ResolvedRelease,
} from "@/lib/lineage-web-install/types";
import { cn } from "cn";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import type { Adb } from "@yume-chan/adb";

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

type SideloadPrompt = {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  cancelIsSkip?: boolean;
  connectAdb?: boolean;
};

function PromptCard({
  prompt,
  onConfirm,
  onCancel,
}: {
  prompt: SideloadPrompt;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
      <p className="font-medium text-foreground">{prompt.title}</p>
      <p className="mt-1 whitespace-pre-line">{prompt.body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" onClick={onConfirm}>
          {prompt.confirmLabel}
        </Button>
        {prompt.cancelLabel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {prompt.cancelLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

type PlanItem = {
  who: "auto" | "you";
  command: string;
  detail: string;
};

function CommandPlan({ items }: { items: PlanItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card/60">
      <p className="border-b border-border bg-muted/50 px-3 py-1.5 font-mono text-[11px] tracking-wide text-teal-300 uppercase">
        Lệnh sẽ chạy
      </p>
      <ol className="divide-y divide-border">
        {items.map((item) => (
          <li key={`${item.who}:${item.command}`} className="px-3 py-2.5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className={
                  item.who === "auto"
                    ? "rounded bg-teal-500/15 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-teal-300 uppercase"
                    : "rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-amber-300 uppercase"
                }
              >
                {item.who === "auto" ? "Installer" : "Trên máy"}
              </span>
              <code className="font-mono text-[13px] break-all text-foreground">
                {item.command}
              </code>
            </div>
            <p className="mt-1 text-xs leading-relaxed">{item.detail}</p>
          </li>
        ))}
      </ol>
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
  // null until mount so SSR HTML matches Chrome (navigator.usb is absent on the server).
  const [usbOk, setUsbOk] = useState<boolean | null>(null);
  const [release, setRelease] = useState<ResolvedRelease | null>(null);
  const [releaseError, setReleaseError] = useState<string | null>(null);
  const [cached, setCached] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [needReconnect, setNeedReconnect] = useState(false);

  const [bootloaderStatus, setBootloaderStatus] = useState<StepStatus>(emptyStatus);
  const [unlockStatus, setUnlockStatus] = useState<StepStatus>(emptyStatus);
  const [loadStatus, setLoadStatus] = useState<StepStatus>(emptyStatus);
  const [flashStatus, setFlashStatus] = useState<StepStatus>(emptyStatus);
  const [sideloadStatus, setSideloadStatus] = useState<StepStatus>(emptyStatus);
  const [prompt, setPrompt] = useState<SideloadPrompt | null>(null);
  const [gappsFile, setGappsFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [device] = useState(() => new FastbootDevice());
  const [store] = useState(() => new BlobStore());
  const reconnectResolver = useRef<(() => void) | null>(null);
  const promptResolver = useRef<
    ((value: false | { adb?: Adb }) => void) | null
  >(null);
  const restoreFastboot = useRef<(() => void) | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setUsbOk(webUsbAvailable());
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const latest = await fetchLatestCheetahReleaseWithFallback();
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

  const handleRebootBootloader = () =>
    runSafe(setBootloaderStatus, async () => {
      if (!usbOk) throw new Error("Trình duyệt không hỗ trợ WebUSB.");
      setBootloaderStatus({
        text: "Chọn thiết bị ADB trên hộp WebUSB. Trên máy: cho phép USB debugging nếu hỏi.",
        kind: "busy",
      });
      await rebootToBootloaderViaAdb();
      return (
        "Đã gửi adb reboot bootloader. Đợi Fastboot Mode (tam giác đỏ). " +
        "Đừng bấm Start. Rồi sang bước Unlock."
      );
    });

  const handleUnlock = () =>
    runSafe(setUnlockStatus, async () => {
      if (!usbOk) throw new Error("Trình duyệt không hỗ trợ WebUSB.");
      return unlockBootloader(device, (text) =>
        setUnlockStatus({ text, kind: "busy" }),
      );
    });

  const handleOpenDownloads = () => {
    window.open(LINEAGE_DOWNLOADS_PAGE, "_blank", "noopener,noreferrer");
    setLoadStatus({
      text:
        "Đã mở trang tải official (một tab). Tải đủ 5 file cùng nightly hiện trên trang này, rồi kéo thả hoặc bấm Nạp file. " +
        "Trình duyệt thường chặn mở 5 tab tải cùng lúc.",
      kind: "ok",
    });
  };

  const ingestFiles = async (files: File[]) => {
    if (!release) throw new Error("Chưa lấy được metadata build.");
    if (files.length === 0) {
      setLoadStatus({ text: "Không có file nào được chọn.", kind: "error" });
      return;
    }

    const needed = requiredFilesOf(release);
    const { matched, unmatched } = planFileIngest(files, needed);
    if (matched.length === 0) {
      setLoadStatus({
        text:
          `Không khớp file nào với nightly ${release.date}. ` +
          `Cần: ${needed.map((f) => f.filename).join(", ")}. ` +
          `Đã chọn: ${files.map((f) => f.name).join(", ")}.`,
        kind: "error",
      });
      return;
    }

    await store.init();
    let memoryOnly = false;
    let done = 0;
    for (const { file, meta } of matched) {
      await verifyReleaseBlob(
        file,
        meta,
        file.name === meta.filename ? meta.filename : `${file.name} → ${meta.filename}`,
        (hashed, total) => {
          const fileFrac = total ? hashed / total : 1;
          setLoadStatus({
            text: `Đối chiếu SHA256 ${meta.filename}… ${formatBytes(hashed)} / ${formatBytes(total)}`,
            kind: "busy",
            progress: (done + fileFrac) / matched.length,
          });
        },
      );
      const persisted = await store.saveFile(meta.filename, file);
      if (!persisted) memoryOnly = true;
      done += 1;
    }

    await refreshCached(release);

    const stillMissing: string[] = [];
    for (const f of needed) {
      if (!(await store.hasFile(f.filename))) stillMissing.push(f.filename);
    }

    const extra =
      unmatched.length > 0
        ? ` Bỏ qua (tên không khớp): ${unmatched.join(", ")}.`
        : "";
    const persistNote = memoryOnly
      ? " Cache IndexedDB đầy — file chỉ giữ trong tab này, đừng reload."
      : "";

    if (stillMissing.length > 0) {
      setLoadStatus({
        text:
          `Đã nạp một phần. Còn thiếu: ${stillMissing.join(", ")}. ` +
          `Chọn tiếp file còn thiếu cùng build ${release.date}.${extra}${persistNote}`,
        kind: "error",
      });
      return;
    }

    setLoadStatus({
      text:
        `Đã nạp và xác minh SHA256 đủ file cho LineageOS ${release.version} (${release.date}).` +
        extra +
        persistNote,
      kind: "ok",
      progress: 1,
    });
  };

  const ingestFromFiles = async (fileList: FileList | File[]) => {
    const files = snapshotSelectedFiles(fileList);
    if (files.length === 0) return;
    setBusy(true);
    try {
      await ingestFiles(files);
    } catch (error) {
      setLoadStatus({
        text: `Lỗi: ${error instanceof Error ? error.message : String(error)}`,
        kind: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    // Copy File objects BEFORE clearing value. Chrome FileList is live.
    const files = snapshotSelectedFiles(e.target.files);
    e.target.value = "";
    void ingestFromFiles(files);
  };

  const onDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (busy || !release) return;
    void ingestFromFiles(e.dataTransfer.files);
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

      const blobs = await loadVerifiedFlashImages(
        (name) => store.loadFile(name),
        release,
      );

      await flashRecoveryImages(
        device,
        blobs,
        (text, progress) => setFlashStatus({ text, kind: "busy", progress }),
        waitReconnect,
      );

      return (
        "Đã flash boot/dtbo/vendor_kernel_boot/vendor_boot. " +
        "Bước 5: Auto sideload — installer reboot recovery rồi chờ bạn Format data / Apply from ADB."
      );
    });

  const waitPrompt = (next: SideloadPrompt) =>
    new Promise<false | { adb?: Adb }>((resolve) => {
      promptResolver.current = resolve;
      setPrompt(next);
    });

  const handlePromptCancel = () => {
    setPrompt(null);
    promptResolver.current?.(false);
  };

  const handlePromptConfirm = async () => {
    if (!prompt) return;
    if (prompt.connectAdb) {
      try {
        setSideloadStatus({
          text: "Chọn thiết bị ADB (sideload) trên hộp WebUSB…",
          kind: "busy",
        });
        const adb = await connectAdbForSideload();
        setPrompt(null);
        promptResolver.current?.({ adb });
      } catch (error) {
        setSideloadStatus({
          text: `Lỗi: ${error instanceof Error ? error.message : String(error)}`,
          kind: "error",
        });
      }
      return;
    }
    setPrompt(null);
    promptResolver.current?.({});
  };

  const handleSideload = () =>
    runSafe(setSideloadStatus, async () => {
      if (!usbOk) throw new Error("Trình duyệt không hỗ trợ WebUSB.");
      if (!release) throw new Error("Chưa có metadata release.");
      const rom = await loadVerifiedRomZip((name) => store.loadFile(name), release);

      restoreFastboot.current?.();
      restoreFastboot.current = disarmFastbootAutoConnect(device);
      let openAdb: Adb | null = null;

      try {
        if (device.isConnected) {
          setSideloadStatus({
            text: "Reboot vào Lineage Recovery…",
            kind: "busy",
          });
          try {
            await rebootToRecovery(device, (text) =>
              setSideloadStatus({ text, kind: "busy" }),
            );
          } catch (error) {
            setSideloadStatus({
              text: `Không reboot recovery tự động (${error instanceof Error ? error.message : String(error)}). Chọn Recovery trên Fastboot bằng volume + nguồn.`,
              kind: "busy",
            });
          }
          await closeFastbootUsb(device);
        }

        const inRecovery = await waitPrompt({
          title: "Xác nhận Lineage Recovery",
          body: "Phải thấy logo Lineage. Nếu vẫn Fastboot: Volume chọn Recovery, nguồn xác nhận. Nếu không có logo Lineage — dừng, flash lại bước 5.",
          confirmLabel: "Đã thấy logo Lineage",
          cancelLabel: "Hủy",
        });
        if (!inRecovery) throw new Error("Đã hủy.");

        const formatted = await waitPrompt({
          title: "Format data trên recovery",
          body: "Factory reset → Format data / factory reset. Xóa mã hóa và dữ liệu nội bộ. Quay về menu chính. Chưa reboot hệ thống.",
          confirmLabel: "Đã Format data, đang ở menu recovery",
          cancelLabel: "Hủy",
        });
        if (!formatted) throw new Error("Đã hủy.");

        const romConnect = await waitPrompt({
          title: "Apply from ADB — sideload ROM",
          body: "Apply update → Apply from ADB (màn hình chờ sideload).\nTắt adb trên máy tính nếu đang chạy: adb kill-server.\nBấm nút dưới sẽ mở hộp WebUSB rồi gửi zip ROM.",
          confirmLabel: "Đã Apply from ADB — sideload ROM",
          cancelLabel: "Hủy",
          connectAdb: true,
        });
        if (!romConnect) throw new Error("Đã hủy.");
        const romAdb = romConnect.adb;
        if (!romAdb) throw new Error("Chưa kết nối ADB.");
        openAdb = romAdb;

        setSideloadStatus({
          text: `Sideload ${release.rom.filename}…`,
          kind: "busy",
          progress: 0,
        });
        const romResult = await sideloadZip(romAdb, rom, (sent, total) => {
          setSideloadStatus({
            text: `Sideload ${release.rom.filename}… ${formatBytes(sent)} / ${formatBytes(total)}`,
            kind: "busy",
            progress: total ? sent / total : 0,
          });
        });
        await Promise.resolve(romAdb.close()).catch(() => undefined);
        openAdb = null;

        if (gappsFile) {
          const gappsConnect = await waitPrompt({
            title: "Sideload GApps (add-on)",
            body: `Recovery hỏi reboot recovery để cài add-on → Yes.\nApply update → Apply from ADB.\nSignature verification failed với ${gappsFile.name} là bình thường → Yes trên máy.`,
            confirmLabel: "Đã Apply from ADB — sideload GApps",
            cancelLabel: "Bỏ qua GApps",
            cancelIsSkip: true,
            connectAdb: true,
          });
          if (gappsConnect && gappsConnect.adb) {
            const gappsAdb = gappsConnect.adb;
            openAdb = gappsAdb;
            setSideloadStatus({
              text: `Sideload ${gappsFile.name}…`,
              kind: "busy",
              progress: 0,
            });
            await sideloadZip(gappsAdb, gappsFile, (sent, total) => {
              setSideloadStatus({
                text: `Sideload ${gappsFile.name}… ${formatBytes(sent)} / ${formatBytes(total)}`,
                kind: "busy",
                progress: total ? sent / total : 0,
              });
            });
            await Promise.resolve(gappsAdb.close()).catch(() => undefined);
            openAdb = null;
          }
        }

        await waitPrompt({
          title: "Reboot hệ thống",
          body: "Back → Reboot system now. Boot đầu thường dưới 15 phút. Không chạy fastboot flashing lock.",
          confirmLabel: "Đã hiểu",
        });

        return (
          (romResult.note ? `${romResult.note} ` : "") +
          `Sideload ${release.rom.filename} xong. Không khóa bootloader.`
        );
      } finally {
        restoreFastboot.current?.();
        restoreFastboot.current = null;
        if (openAdb) {
          await Promise.resolve(openAdb.close()).catch(() => undefined);
        }
        setPrompt(null);
      }
    });

  const imagesReady =
    !!release && FLASH_IMAGE_NAMES.every((n) => cached[n]);
  const romReady = !!release && !!cached[release.rom.filename];
  const romZip = release?.rom.filename ?? "lineage-*-cheetah-signed.zip";
  const gappsZip = gappsFile?.name ?? "MindTheGapps-arm64-*.zip";

  return (
    <div className="space-y-2">
      {usbOk === false && (
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
          Giống GrapheneOS web installer: OEM unlocking đã bật, firmware stock{" "}
          <strong className="text-foreground">Android 16 mới nhất</strong>, đúng{" "}
          {LINEAGE_DEVICE_NAME} (<code className="text-foreground">{LINEAGE_DEVICE}</code>
          ). Bước 2 dùng ADB để vào Fastboot. Wiki Lineage không khóa bootloader sau khi cài.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            USB debugging bật (và xác nhận “Allow USB debugging” lần đầu). Cáp
            data, cổng USB thẳng; Linux nên có gói udev Android.
          </li>
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

      <StepCard step={2} title="Vào Fastboot bằng ADB">
        <p>
          Máy đang ở hệ thống (hoặc recovery có ADB). Wiki:{" "}
          <code className="text-foreground">adb -d reboot bootloader</code>. Đã ở
          Fastboot Mode thì bỏ qua bước này.
        </p>
        <CommandPlan
          items={[
            {
              who: "you",
              command: "USB debugging + Allow USB debugging",
              detail:
                "Tùy chọn nhà phát triển → gỡ lỗi USB. Lần đầu ADB: cho phép RSA trên máy. Tắt `adb kill-server` nếu adb CLI đang chiếm USB.",
            },
            {
              who: "auto",
              command: "adb -d reboot bootloader",
              detail:
                "WebUSB ADB gửi lệnh reboot vào Fastboot. Installer mở hộp chọn thiết bị khi bạn bấm nút.",
            },
            {
              who: "you",
              command: "Fastboot Mode (tam giác đỏ)",
              detail:
                "Đợi máy vào Fastboot. Đừng bấm Start. Rồi sang bước Unlock (WebUSB fastboot, khác ADB).",
            },
          ]}
        />
        <CommandBlock commands={["adb -d reboot bootloader"]} />
        <Button
          type="button"
          disabled={!usbOk || busy}
          onClick={() => void handleRebootBootloader().catch(() => undefined)}
        >
          adb reboot bootloader
        </Button>
        <StatusBlock id="bootloader" status={bootloaderStatus} />
      </StepCard>

      <StepCard step={3} title="Unlock bootloader">
        <p>
          Nếu đã unlock sẵn, bước này báo “đã unlock”. Lệnh wipe dữ liệu — xác nhận
          trên máy.
        </p>
        <CommandPlan
          items={[
            {
              who: "auto",
              command: "fastboot getvar unlocked",
              detail:
                "Đọc biến bootloader. Nếu already yes thì bỏ qua lệnh unlock.",
            },
            {
              who: "auto",
              command: "fastboot flashing unlock",
              detail:
                "Chỉ gửi khi máy còn khóa. Tương đương GrapheneOS “Unlock bootloader”.",
            },
            {
              who: "you",
              command: "UNLOCK THE BOOTLOADER",
              detail:
                "Volume chọn, nguồn xác nhận. Installer không bấm giúp — máy tự wipe.",
            },
          ]}
        />
        <Button
          type="button"
          disabled={!usbOk || busy}
          onClick={() => void handleUnlock().catch(() => undefined)}
        >
          Unlock bootloader
        </Button>
        <StatusBlock id="unlock" status={unlockStatus} />
      </StepCard>

      <StepCard step={4} title="Lấy bản LineageOS (nightly official)">
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
              ({release.date}) — ~{formatBytes(release.rom.size)}. Mirror không
              CORS nên tải file local rồi nạp vào đây (đối chiếu SHA256). Có thể
              nạp từng file hoặc cả 5 file; tên{" "}
              <code className="text-foreground">boot (1).img</code> vẫn nhận.
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
            Mở trang tải official
          </Button>
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy && release) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDropFiles}
          className={
            dragOver
              ? "rounded-lg border border-teal-400 bg-teal-500/10 px-3 py-4"
              : "rounded-lg border border-dashed border-border px-3 py-4"
          }
        >
          <p className="text-xs">
            Kéo thả 5 file đã tải vào đây, hoặc chọn từ ổ đĩa. Zip ROM ~1.4 GiB —
            SHA256 chạy theo luồng, đợi thanh tiến trình.
          </p>
          <label
            className={cn(
              buttonVariants({ variant: "outline" }),
              "mt-3 cursor-pointer",
              (!release || busy) && "pointer-events-none opacity-50",
            )}
          >
            <input
              type="file"
              multiple
              accept=".img,.zip,application/zip,application/octet-stream"
              className="sr-only"
              disabled={!release || busy}
              onChange={onFileInput}
            />
            Nạp file đã tải
          </label>
        </div>
        <StatusBlock id="load" status={loadStatus} />
        <p className="text-xs">
          Cache trình duyệt: {imagesReady ? "đủ 4 image" : "thiếu image"}
          {" · "}
          {romReady ? "có zip ROM (sideload auto)" : "chưa có zip ROM (cần cho sideload)"}
        </p>
      </StepCard>

      <StepCard step={5} title="Flash recovery images (WebUSB)">
        <p>
          Tương đương phần fastboot trên wiki / GrapheneOS “Flash release”, nhưng
          chỉ flash{" "}
          <code className="text-foreground">boot</code>,{" "}
          <code className="text-foreground">dtbo</code>,{" "}
          <code className="text-foreground">vendor_kernel_boot</code>,{" "}
          <code className="text-foreground">vendor_boot</code>. Zip ROM Lineage
          không phải factory image — phải sideload qua recovery (bước 6).
        </p>
        <CommandPlan
          items={[
            {
              who: "auto",
              command: "fastboot flash boot boot.img",
              detail: "Wiki cheetah: phân vùng phụ trước recovery.",
            },
            {
              who: "auto",
              command: "fastboot flash dtbo dtbo.img",
              detail: "Device tree overlay cùng nightly.",
            },
            {
              who: "auto",
              command: "fastboot flash vendor_kernel_boot vendor_kernel_boot.img",
              detail: "Kernel vendor boot Tensor (Pixel 7 Pro).",
            },
            {
              who: "auto",
              command: "fastboot reboot bootloader",
              detail:
                "Reboot Fastboot giữa chừng (như GrapheneOS). Có thể phải bấm Kết nối lại WebUSB.",
            },
            {
              who: "auto",
              command: "fastboot flash vendor_boot vendor_boot.img",
              detail: "Lineage Recovery. Sau đó sang bước 6 — chưa sideload zip.",
            },
          ]}
        />
        <CommandBlock
          commands={[
            "fastboot flash boot boot.img",
            "fastboot flash dtbo dtbo.img",
            "fastboot flash vendor_kernel_boot vendor_kernel_boot.img",
            "fastboot reboot bootloader",
            "fastboot flash vendor_boot vendor_boot.img",
          ]}
        />
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

      <StepCard step={6} title="Format data + sideload ROM">
        <p>
          Recovery không cho format/sideload từ fastboot — installer reboot recovery,
          rồi <strong className="text-foreground">dừng chờ bạn</strong> làm đúng bước
          trên máy (giống script CLI). Zip ROM gửi bằng WebUSB ADB, không cần
          platform-tools.
        </p>
        <CommandPlan
          items={[
            {
              who: "auto",
              command: "fastboot reboot recovery",
              detail:
                "Nếu máy còn ở Fastboot sau bước 5. Không được thì chọn Recovery bằng volume + nguồn.",
            },
            {
              who: "you",
              command: "Logo Lineage Recovery",
              detail:
                "Installer dừng, chờ bạn xác nhận đã thấy logo. Không có logo = flash lại bước 5.",
            },
            {
              who: "you",
              command: "Factory reset → Format data / factory reset",
              detail:
                "Xóa mã hóa + dữ liệu. Recovery không có lệnh WebUSB cho bước này — phải bấm trên máy, rồi xác nhận trên trang.",
            },
            {
              who: "you",
              command: "Apply update → Apply from ADB",
              detail:
                "Màn hình chờ sideload. Tắt adb trên máy tính (`adb kill-server`) để WebUSB nhận USB.",
            },
            {
              who: "auto",
              command: `adb -d sideload ${romZip}`,
              detail:
                "Gửi zip ROM qua protocol sideload-host (WebUSB ADB). Wiki: dừng ~47% vẫn có thể OK — đọc recovery.",
            },
            ...(gappsFile
              ? [
                  {
                    who: "you" as const,
                    command: "Reboot recovery (add-on) → Apply from ADB",
                    detail:
                      "Khi recovery hỏi cài add-on: Yes. Signature verification failed với GApps → Yes.",
                  },
                  {
                    who: "auto" as const,
                    command: `adb -d sideload ${gappsZip}`,
                    detail: `Sideload ${gappsZip} trước lần boot hệ thống đầu.`,
                  },
                ]
              : [
                  {
                    who: "auto" as const,
                    command: "# không sideload GApps",
                    detail:
                      "Chưa nạp zip GApps → vanilla. Có thể nạp MindTheGapps arm64 phía trên trước khi bấm auto.",
                  },
                ]),
            {
              who: "you",
              command: "Back → Reboot system now",
              detail: "Không chạy `fastboot flashing lock`. Boot đầu thường dưới 15 phút.",
            },
          ]}
        />
        <CommandBlock
          commands={
            gappsFile
              ? [
                  "fastboot reboot recovery",
                  `# trên recovery: Format data, rồi Apply from ADB`,
                  `adb -d sideload ${romZip}`,
                  `# recovery: reboot recovery cho add-on, Apply from ADB, Yes nếu signature fail`,
                  `adb -d sideload ${gappsZip}`,
                ]
              : [
                  "fastboot reboot recovery",
                  `# trên recovery: Format data, rồi Apply from ADB`,
                  `adb -d sideload ${romZip}`,
                ]
          }
        />
        <p>
          Tùy chọn GApps (trước boot đầu): nạp zip MindTheGapps arm64. Bỏ trống =
          vanilla.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => document.getElementById("gapps-file")?.click()}
          >
            {gappsFile ? `GApps: ${gappsFile.name}` : "Nạp GApps (tuỳ chọn)"}
          </Button>
          {gappsFile && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => setGappsFile(null)}
            >
              Bỏ GApps
            </Button>
          )}
          <input
            id="gapps-file"
            type="file"
            accept=".zip,application/zip"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              e.target.value = "";
              setGappsFile(file);
            }}
          />
        </div>
        <Button
          type="button"
          disabled={!usbOk || busy || !romReady}
          onClick={() => void handleSideload().catch(() => undefined)}
        >
          Bắt đầu auto sideload
        </Button>
        {prompt && (
          <PromptCard
            prompt={prompt}
            onConfirm={() => void handlePromptConfirm()}
            onCancel={handlePromptCancel}
          />
        )}
        <StatusBlock id="sideload" status={sideloadStatus} />
        <p className="text-xs">
          Cần zip ROM đã nạp ở bước 4. Wiki: adb dừng ~47% vẫn có thể thành công —
          đọc chữ trên recovery.
        </p>
      </StepCard>
    </div>
  );
}
