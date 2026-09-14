import { sources } from "./sources";
import type { RootGuide } from "../types";

const integrityNote =
  "Root làm Play Integrity yếu hơn. DenyList chỉ ẩn Magisk khỏi app — không phải bypass Integrity. Không hướng dẫn module giả attestation hay keybox.";

const magiskNeverShare =
  "Không flash boot đã patch của người khác, kể cả cùng model. Patch trên đúng chiếc máy.";

const magiskUnlock =
  "Bootloader phải unlocked. Không khóa lại sau khi Magisk.";

const ksuNo =
  "V50 dùng kernel 4.14, không phải GKI. Không flash KernelSU generic / AnyKernel. Chỉ khi có kernel flashlmdd build sẵn KSU — hiện không có kênh official.";

const magiskBootSteps = [
  {
    title: "Cài app Magisk official",
    body: "Tải APK từ GitHub topjohnwu/Magisk Releases. Không dùng Magisk Delta / fork Telegram.",
  },
  {
    title: "Lấy boot.img đúng bản đang chạy",
    body: "V50 (SD855, A12/A14) vá Magisk trên boot, không phải init_boot. Stock: dump boot slot hiện tại (boot_a hoặc boot_b) lúc backup QFIL, hoặc từ KDZ. Lineage: file boot.img cùng zip đang cài.",
  },
  {
    title: "Patch trên máy rồi flash boot",
    body: "Magisk → Install → Select and Patch a File. Kéo magisk_patched_*.img về PC. Flash đúng slot đang active.",
    commands: [
      "adb pull /sdcard/Download/magisk_patched_XXXX.img",
      "adb reboot bootloader",
      "fastboot flash boot magisk_patched_XXXX.img",
      "fastboot reboot",
    ],
    note: "Nếu fastboot không lên (một số V50): flash boot qua Magisk Direct Install sau khi đã có Magisk, hoặc dd khi đã root. Wiki Lineage cần Magisk stock trước khi dd recovery.",
  },
];

const ksuUnsupported = {
  support: "unsupported" as const,
  summary:
    "Không có kernel KernelSU official cho flashlmdd. Đừng flash GKI/AnyKernel.",
  warnings: [ksuNo],
  steps: [
    {
      title: "Không cài KernelSU trên V50 theo guide này",
      body: "Muốn root: Magisk trên boot.img. KernelSU chỉ khi maintainer phát hành kernel KSU cho đúng build — chưa thấy kênh đó.",
    },
  ],
};

export const rootGuides: Record<string, RootGuide> = {
  "stock-lg": {
    magisk: {
      support: "unofficial",
      summary:
        "Magisk trên stock V50: sau unlock, patch boot.img của đúng slot/KDZ, flash boot. Wiki Lineage bắt bước này trước khi dd recovery.",
      warnings: [magiskUnlock, magiskNeverShare, integrityNote],
      steps: [
        {
          title: "Unlock xong, đúng stock",
          body: "Làm trang Mở khóa bootloader. Boot stock, cài Magisk APK. Xác định slot (fastboot getvar current-slot) nếu còn Fastboot.",
        },
        ...magiskBootSteps,
      ],
      after: [
        "Cập nhật Magisk: Direct Install trong app.",
        "Gỡ: Magisk Uninstall hoặc flash lại boot gốc từ backup/KDZ.",
        "Zygisk + DenyList không làm STRONG_INTEGRITY.",
      ],
    },
    kernelsu: ksuUnsupported,
    integrityNote,
  },

  lineageos: {
    magisk: {
      support: "unofficial",
      summary:
        "Lineage không hỗ trợ root. Sau khi sideload xong: patch boot.img của đúng zip Lineage đang chạy, flash boot. Đừng dùng boot stock.",
      warnings: [
        magiskUnlock,
        magiskNeverShare,
        "Wiki Lineage: We don't support any methods for rooting.",
        integrityNote,
      ],
      steps: [
        {
          title: "Boot Lineage đã setup",
          body: "Root sau lần boot đầu. Lấy boot.img từ chính gói zip/build bạn sideload.",
        },
        ...magiskBootSteps,
      ],
      after: [
        "Dirty zip Lineage mới thường ghi đè boot — Direct Install hoặc patch lại.",
        "DenyList không phải Integrity bypass.",
      ],
    },
    kernelsu: ksuUnsupported,
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
] as const;
