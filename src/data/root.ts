import { sources } from "./sources";
import type { RootGuide } from "./types";

const integrityNote =
  "Root làm Play Integrity yếu hơn stock. DenyList / Zygisk của Magisk chỉ ẩn Magisk khỏi từng app — không phải bypass Integrity. Trang này không hướng dẫn module giả attestation hay keybox.";

const magiskNeverShare =
  "Không flash file Magisk đã patch của người khác, kể cả cùng model. Patch trên đúng chiếc máy sẽ cài.";

const magiskUnlock =
  "Bootloader phải unlocked. Không khóa lại sau khi root — trừ khi bạn đã gỡ Magisk và flash lại stock/Graphene/Calyx sạch.";

const ksuNoRandomKernel =
  "Pixel 7 Pro không phải máy flash KernelSU GKI generic an toàn. Chỉ dùng KernelSU nếu kernel của đúng ROM đã build sẵn KSU. Đừng flash boot/AnyKernel lạ.";

const magiskOfficialSteps = [
  {
    title: "Cài app Magisk official",
    body: "Tải APK mới nhất từ GitHub topjohnwu/Magisk (Releases), cài trên máy. Không dùng Magisk Delta / Kitsune / fork Telegram.",
  },
  {
    title: "Lấy init_boot.img của đúng bản đang chạy",
    body: "Pixel 7 Pro (Android 13+) dùng init_boot, không phải boot.img. Lấy từ factory image Google cùng tháng vá, hoặc giải nén payload.bin trong zip ROM đang cài (payload-dumper-go -p init_boot).",
  },
  {
    title: "Patch trên máy",
    body: "Copy init_boot.img vào điện thoại. Mở Magisk → Install → Select and Patch a File → chọn file đó. Kéo file magisk_patched_*.img về máy tính.",
    commands: ["adb pull /sdcard/Download/magisk_patched_XXXX.img"],
  },
  {
    title: "Flash init_boot đã patch",
    body: "Vào Fastboot rồi flash đúng phân vùng init_boot. Sai phân vùng (flash vào boot) có thể không root hoặc loạn recovery.",
    commands: [
      "adb reboot bootloader",
      "fastboot flash init_boot magisk_patched_XXXX.img",
      "fastboot reboot",
    ],
    note: "Sau boot, mở Magisk — nếu hỏi sửa môi trường, bấm OK và để máy reboot.",
  },
];

const magiskAfter = [
  "Cập nhật Magisk sau này: trong app → Direct Install, đừng patch lại file người khác.",
  "Gỡ: Magisk app → Uninstall. Hoặc flash lại init_boot gốc của đúng ROM.",
  "Zygisk + DenyList là tính năng Magisk: chọn app để không inject. Không làm STRONG_INTEGRITY.",
];

const ksuUnsupported = {
  support: "unsupported" as const,
  summary:
    "Không có kernel KernelSU official cho cấu hình này. Đừng flash GKI/AnyKernel lạ lên cheetah.",
  warnings: [ksuNoRandomKernel],
  steps: [
    {
      title: "Không cài KernelSU trên ROM này",
      body: "Muốn root: dùng Magisk (nếu ROM cho phép) hoặc ở stock không root. KernelSU chỉ khi maintainer phát hành kernel có KSU cho đúng build.",
    },
  ],
};

const grapheneCalyxRoot = {
  support: "unsupported" as const,
  summary:
    "Root phá verified boot. ROM này chỉ có ý nghĩa khi khóa bootloader — Magisk/KernelSU đi ngược mục tiêu đó.",
  warnings: [
    magiskUnlock,
    "Giữ Magisk rồi khóa bootloader = brick hoặc bootloop.",
  ],
  steps: [
    {
      title: "Không root GrapheneOS / CalyxOS",
      body: "Dự án không hỗ trợ Magisk hay KernelSU. Cần root thì chọn ROM recovery (Lineage, Evo, crDroid, Infinity-X) và để bootloader mở.",
    },
  ],
};

export const rootGuides: Record<string, RootGuide> = {
  "stock-pixel": {
    magisk: {
      support: "unofficial",
      summary:
        "Magisk trên stock Pixel 7 Pro: unlock, patch init_boot từ factory image đang chạy, flash init_boot. Mất Play Integrity gốc.",
      warnings: [magiskUnlock, magiskNeverShare, integrityNote],
      steps: [
        {
          title: "Unlock và đúng factory image",
          body: "Máy phải unlocked. Tải factory image cheetah trùng bản vá đang chạy từ developers.google.com/android/images — giải nén đến file init_boot.img.",
        },
        ...magiskOfficialSteps,
      ],
      after: magiskAfter,
    },
    kernelsu: ksuUnsupported,
    integrityNote,
  },

  grapheneos: {
    magisk: grapheneCalyxRoot,
    kernelsu: grapheneCalyxRoot,
    integrityNote:
      "GrapheneOS dùng sandboxed Play và compatibility mode official — không phải Magisk. Root Graphene làm mất verified boot. Không hướng dẫn giả Integrity.",
  },

  calyxos: {
    magisk: grapheneCalyxRoot,
    kernelsu: grapheneCalyxRoot,
    integrityNote:
      "CalyxOS dùng microG, Integrity vốn yếu. Root rồi khóa bootloader không phải mô hình dự án. Không hướng dẫn giả Integrity.",
  },

  lineageos: {
    magisk: {
      support: "unofficial",
      summary:
        "LineageOS không hỗ trợ root. Magisk theo docs official: patch init_boot của đúng nightly đang chạy, flash init_boot. Làm sau khi máy đã boot Lineage lần đầu.",
      warnings: [
        magiskUnlock,
        magiskNeverShare,
        "Wiki Lineage không hỗ trợ root trên kênh official.",
        integrityNote,
      ],
      steps: [
        {
          title: "Boot Lineage xong đã setup",
          body: "Cài Magisk sau lần boot đầu. Sideload Magisk.zip trong recovery là phương án cũ (deprecated); trên Tensor nên patch init_boot.",
        },
        {
          title: "Cài app Magisk official",
          body: "Tải APK từ GitHub topjohnwu/Magisk Releases, cài trên máy.",
        },
        {
          title: "Lấy init_boot từ zip nightly",
          body: "Giải payload.bin của đúng file lineage-*-cheetah.zip đang chạy (payload-dumper-go -p init_boot). Factory image stock chỉ dùng nếu bạn biết ROM không đổi init_boot.",
        },
        {
          title: "Patch trên máy rồi flash init_boot",
          body: "Magisk → Install → Select and Patch a File. Kéo magisk_patched_*.img về PC, Fastboot:",
          commands: [
            "adb pull /sdcard/Download/magisk_patched_XXXX.img",
            "adb reboot bootloader",
            "fastboot flash init_boot magisk_patched_XXXX.img",
            "fastboot reboot",
          ],
        },
      ],
      after: magiskAfter,
    },
    kernelsu: ksuUnsupported,
    integrityNote,
  },

  "evolution-x": {
    magisk: {
      support: "official-optional",
      summary:
        "Trang/XDA Evo nêu Magisk là add-on tùy chọn. Cách bền trên Pixel 7 Pro vẫn là patch init_boot, không phải zip recovery (deprecated).",
      warnings: [magiskUnlock, magiskNeverShare, integrityNote],
      steps: [
        {
          title: "Boot Evolution X đã xong",
          body: "Root sau khi hệ thống lên. Nếu vừa sideload ROM, reboot system rồi mới patch — trừ khi bạn theo đúng mục add-on trên trang máy.",
        },
        ...magiskOfficialSteps,
      ],
      after: magiskAfter,
    },
    kernelsu: ksuUnsupported,
    integrityNote,
  },

  crdroid: {
    magisk: {
      support: "official-optional",
      summary:
        "crdroid.net/cheetah/12/install ghi Magisk là tùy chọn (sideload sau khi đổi slot). Trên Tensor, patch init_boot vẫn là cách Magisk khuyến nghị.",
      warnings: [magiskUnlock, magiskNeverShare, integrityNote],
      steps: [
        {
          title: "Cách trang crDroid: sideload APK-zip",
          body: "Sau khi sideload ROM và (nếu có) GApps, recovery hỏi đổi slot. Yes, rồi sideload Magisk. Đổi đuôi APK thành zip.",
          commands: [
            "adb sideload Magisk-vXX.X.apk.zip",
          ],
          note: "Magisk docs đánh dấu custom recovery là deprecated. Nếu sideload lỗi, dùng init_boot bên dưới.",
        },
        {
          title: "Cách Magisk official: init_boot",
          body: "Lấy init_boot từ zip crDroid đang chạy hoặc factory image cùng vá, patch trong app, flash init_boot.",
        },
        ...magiskOfficialSteps.slice(2),
      ],
      after: magiskAfter,
    },
    kernelsu: {
      support: "official-optional",
      summary:
        "Trang cài crDroid 12 cheetah nêu KernelSU apk tùy chọn (GitHub, Show all assets). Chỉ cài Manager nếu kernel build sẵn KSU. Không flash GKI generic.",
      warnings: [
        ksuNoRandomKernel,
        "Không cài Magisk và KernelSU cùng lúc.",
        integrityNote,
      ],
      steps: [
        {
          title: "Xác nhận kernel có KSU",
          body: "Boot crDroid, cài KernelSU Manager từ github.com/tiann/KernelSU releases. App hiện version kernel / Working thì kernel đã có KSU. Hiện Unsupported thì gỡ app — đừng flash boot lạ.",
        },
        {
          title: "Cài Manager (khi kernel đã có KSU)",
          body: "Tải APK official, cài, cấp quyền superuser từng app trong Manager. Cập nhật kernel khi maintainer phát hành build mới — OTA có thể mất KSU nếu kernel đổi.",
        },
      ],
      after: [
        "Gỡ: gỡ app không gỡ được hook trong kernel; phải flash lại kernel/ROM không KSU.",
      ],
    },
    integrityNote,
  },

  "infinity-x": {
    magisk: {
      support: "official-optional",
      summary:
        "flashguide official_devices mô tả Magisk bằng init_boot từ factory image — đúng chuẩn Pixel 7 Pro.",
      warnings: [magiskUnlock, magiskNeverShare, integrityNote],
      steps: [
        {
          title: "Lấy init_boot từ factory image",
          body: "Guide Infinity-X: giải nén factory image Google, copy init_boot.img vào máy. Nên trùng tháng vá với ROM đang chạy.",
        },
        ...magiskOfficialSteps,
      ],
      after: magiskAfter,
    },
    kernelsu: ksuUnsupported,
    integrityNote,
  },

  iodeos: {
    magisk: {
      support: "unofficial",
      summary:
        "iodé không hướng dẫn root. Magisk vẫn là init_boot sau khi installer xong. Root đi ngược mô hình deGoogle/tracker của iodé.",
      warnings: [magiskUnlock, magiskNeverShare, integrityNote],
      steps: magiskOfficialSteps,
      after: magiskAfter,
    },
    kernelsu: ksuUnsupported,
    integrityNote,
  },

  "e-os": {
    magisk: {
      support: "unofficial",
      summary:
        "/e/OS community không hỗ trợ root. Magisk: patch init_boot sau khi factory script xong. Không khóa bootloader.",
      warnings: [magiskUnlock, magiskNeverShare, integrityNote],
      steps: magiskOfficialSteps,
      after: magiskAfter,
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
