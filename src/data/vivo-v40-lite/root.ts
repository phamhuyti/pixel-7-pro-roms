import { sources } from "./sources";
import type { RootGuide } from "../types";

const integrityNote =
  "Không root được theo kênh hỗ trợ thì Play Integrity stock Funtouch vẫn là mốc. Không hướng dẫn module giả attestation / keybox.";

const noUnlock =
  "Bootloader V40 Lite không mở được theo OEM. Không flash Magisk / KernelSU / boot đã patch khi máy còn khóa — brick hoặc không boot.";

export const rootGuides: Record<string, RootGuide> = {
  "stock-vivo": {
    magisk: {
      support: "unsupported",
      summary:
        "Không có Magisk official cho V40 Lite khi bootloader khóa. vivo Funtouch còn chặn `su` ở kernel trên một số máy — Wall of Shame ghi Magisk “suu” chỉ sau khi đã unlock, mà unlock không có kênh cho máy này.",
      warnings: [
        noUnlock,
        "Không dùng Magisk Delta / fork Telegram / “root one click”.",
        integrityNote,
      ],
      steps: [
        {
          title: "Không cài Magisk trên V40 Lite theo guide này",
          body: "Điều kiện Magisk thường cần: bootloader unlocked + boot/init_boot đúng bản. V40 Lite thiếu bước unlock được hỗ trợ. Ở stock Funtouch nếu cần banking và OTA.",
        },
        {
          title: "Nếu đã root bằng cách khác",
          body: "Trang này không duy trì hướng dẫn. Gỡ bằng flash lại stock đúng gói / trung tâm bảo hành. Không chia sẻ boot đã patch.",
        },
      ],
      after: [
        "Muốn root hợp lệ: chọn máy có OEM unlock trong catalog (Pixel).",
      ],
    },
    kernelsu: {
      support: "unsupported",
      summary:
        "Không có kernel KernelSU official cho V40 Lite. Không flash GKI/AnyKernel generic.",
      warnings: [noUnlock, "KernelSU trên máy khóa bootloader không áp dụng."],
      steps: [
        {
          title: "Không cài KernelSU",
          body: "Không có maintainer/kernel public cho máy này trên catalog. Bỏ qua KernelSU.",
        },
      ],
    },
    integrityNote,
  },
};

export function getRootGuide(slug: string): RootGuide | undefined {
  return rootGuides[slug];
}

export const magiskDocLinks = [
  { label: "Magisk install official", href: sources.magiskInstall },
  { label: "Magisk Releases", href: sources.magiskReleases },
  { label: "KernelSU install", href: sources.kernelsuInstall },
  { label: "KernelSU Releases", href: sources.kernelsuReleases },
  { label: "Wall of Shame — Vivo (Magisk suu note)", href: sources.unlockWallOfShame },
] as const;
