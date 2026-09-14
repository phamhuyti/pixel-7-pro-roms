import { sources } from "./sources";
import type { Rom } from "../types";

export const roms: Rom[] = [
  {
    slug: "stock-lg",
    name: "LG UX (stock)",
    shortName: "Stock LG",
    isStock: true,
    status: "stock",
    group: "baseline",
    androidVersion: 12,
    versionLabel: "Android 12",
    buildLabel: "LG UX, hết OTA hãng",
    lastVerified: "2026-09",
    cadence: "stopped",
    ota: false,
    bootlock: "stock-locked",
    google: "stock",
    integrity: "stock",
    integrityNote:
      "Play Integrity trên stock LG đã cũ (A12, không còn vá). Vẫn là mốc so với custom ROM trên chính máy này — không so được với Pixel 2026.",
    camera: "vendor",
    cameraNote:
      "LG Camera / AI Cam gốc. Custom ROM mất Dual Screen và thường kém night / zoom so với stock.",
    esim: "no",
    customization: "low",
    install: "desktop",
    tagline:
      "LG đã ngừng vá V50 — stock chỉ còn là firmware gốc để khôi phục, không phải lựa chọn bảo mật 2026.",
    summary:
      "LG V50 ThinQ (2019, Snapdragon 855) nhận Android 12 rồi hết hỗ trợ. Stock vẫn cần khi khôi phục KDZ, khớp firmware trước Lineage, hoặc máy nhà mạng chưa unlock. Không còn lý do bảo mật để ở stock lâu dài.",
    strengths: [
      "Camera OEM và Dual Screen (nếu còn phụ kiện) chỉ ổn trên stock",
      "Mạng / VoLTE tùy biến thể thường đúng hơn custom",
      "Điểm xuất phát để flash KDZ đúng model",
    ],
    weaknesses: [
      "Không còn bản vá bảo mật hãng",
      "LG UX nặng, không có Graphene/Calyx trên máy này",
      "Unlock bootloader không có kênh OEM",
    ],
    bestFor: [
      "Khôi phục máy brick / sai KDZ",
      "Giữ Dual Screen",
      "Máy chưa unlock, chỉ dùng stock",
    ],
    notFor: [
      "Ai cần vá bảo mật 2026",
      "DeGoogle / ROM hardening",
    ],
    notes: [
      "Đúng model: LM-V500EM (EU), LM-V500N (Hàn), LM-V450 (Sprint/V50 5G). Flash nhầm KDZ biến thể khác có thể mất mạng.",
      "Sau unlock unofficial, khóa lại bootloader trên stock không được wiki Lineage khuyến nghị.",
    ],
    links: [
      { label: "KDZ / lg-firmwares", href: sources.lgFirmwares },
      { label: "Cách flash KDZ", href: sources.lgFirmwaresHow },
    ],
  },
  {
    slug: "lineageos",
    name: "LineageOS 21",
    shortName: "Lineage",
    isStock: false,
    status: "stale",
    group: "clean",
    androidVersion: 14,
    versionLabel: "Android 14",
    buildLabel: "Official đã dừng — trước đây 21 (flashlmdd)",
    lastVerified: "2026-09",
    cadence: "stopped",
    ota: false,
    bootlock: "unlocked-only",
    google: "optional-gapps",
    integrity: "weak",
    integrityNote:
      "Wiki ghi quirk device integrity. Banking/Wallet không phải thế mạnh. Không hướng dẫn giả Integrity.",
    camera: "aosp",
    cameraNote:
      "Camera AOSP / HAL còn lại. Dual Screen không chạy. Đừng kỳ vọng LG Camera gốc.",
    esim: "no",
    customization: "low",
    install: "recovery",
    tagline:
      "ROM custom duy nhất từng official trên wiki Lineage — hiện không còn maintainer hay nightly.",
    summary:
      "Wiki LineageOS: LG V50 ThinQ (flashlmdd) no longer maintained. Trước đó official 21 (Android 14) cho LM-V500EM và LM-V500N. download.lineageos.org không còn gói máy này. Cài được nếu tự build (wiki) hoặc zip công khai có ngày, không phải nightly.",
    strengths: [
      "Wiki cài đặt còn, thiết bị từng official",
      "AOSP sạch, GApps tùy chọn",
      "Cùng build cho các biến thể V500 (XDA: V450 thường chạy chung)",
    ],
    weaknesses: [
      "Không còn bản official mới",
      "Dual Screen không hoạt động",
      "Cần firmware stock Android 12 + root stock trước khi dd recovery",
      "IMS / VoLTE là quirk",
    ],
    bestFor: [
      "Ai chấp nhận ROM A14 đã dừng official",
      "Tự build từ lineage-21.0",
    ],
    notFor: [
      "Ai cần Dual Screen",
      "Ai cần OTA / vá đều",
      "Máy chưa unlock",
    ],
    notes: [
      "Wiki: không có cách unlock official. Unlock unofficial không được Lineage hỗ trợ.",
      "Firmware bắt buộc: stock Android 12 mới nhất cho đúng model trước khi flash.",
      "Cài recovery bằng dd vào boot_a và boot_b — cần Magisk trên stock.",
    ],
    links: [
      { label: "Wiki máy", href: sources.lineageWiki },
      { label: "Wiki cài đặt", href: sources.lineageInstall },
      { label: "Tự build", href: sources.lineageBuild },
      { label: "XDA (khi còn official)", href: sources.lineageXda },
    ],
  },
  {
    slug: "lineage-microg",
    name: "LineageOS for microG",
    shortName: "LOS microG",
    isStock: false,
    status: "stale",
    group: "degoogle",
    androidVersion: 14,
    versionLabel: "Android 14",
    buildLabel: "lineage-21.0-20260502-microG-flashlmdd",
    lastVerified: "2026-09",
    cadence: "irregular",
    ota: false,
    bootlock: "unlocked-only",
    google: "microg",
    integrity: "weak",
    integrityNote:
      "microG không thay Play Integrity stock. Banking/Wallet thường fail. Không hướng dẫn giả Integrity.",
    camera: "aosp",
    cameraNote: "Cùng hạn chế camera/Dual Screen như Lineage 21.",
    esim: "no",
    customization: "low",
    install: "recovery",
    tagline:
      "Bản Lineage 21 + microG công khai (tháng 5/2026) — không phải nightly Lineage official.",
    summary:
      "download.lineage.microg.org còn zip flashlmdd ngày 02/05/2026 (boot/dtbo/vbmeta + ROM). Đây là fork Lineage có microG, không phải kênh LineageOS.org. Coi như kho lưu sau khi official dừng — kiểm tra checksum trên trang đó trước khi flash.",
    strengths: [
      "Có file công khai, có SHA256",
      "microG sẵn, không cần GApps",
    ],
    weaknesses: [
      "Không phải Lineage official",
      "Không có lịch vá rõ sau 05/2026",
      "Cùng quirk Dual Screen / IMS",
    ],
    bestFor: ["DeGoogle trên V50 khi chấp nhận bản đóng băng 05/2026"],
    notFor: ["Ai chỉ tin zip download.lineageos.org"],
    notes: [
      "Cài theo wiki Lineage flashlmdd (firmware A12, root, dd recovery, copy-partitions, sideload).",
      "Dùng đúng bộ file cùng ngày trên lineage.microg.org, không trộn boot Lineage official cũ.",
    ],
    links: [{ label: "Tải flashlmdd (microG)", href: sources.lineageMicrog }],
  },
  {
    slug: "e-os",
    name: "/e/OS (unofficial)",
    shortName: "/e/OS",
    isStock: false,
    status: "discontinued",
    group: "degoogle",
    androidVersion: 14,
    versionLabel: "Android 14",
    buildLabel: "e-2.7-u-20250218-UNOFFICIAL — thread đóng",
    lastVerified: "2026-09",
    cadence: "stopped",
    ota: false,
    bootlock: "unlocked-only",
    google: "microg",
    integrity: "weak",
    integrityNote: "Community unofficial, Integrity yếu. Không hướng dẫn giả attestation.",
    camera: "aosp",
    cameraNote: "Không phải camera LG gốc.",
    esim: "no",
    customization: "low",
    install: "recovery",
    tagline:
      "Một zip unofficial 02/2025 trên forum /e/ — không phải máy official, thread đã đóng.",
    summary:
      "community.e.foundation từng có e-2.7-u UNOFFICIAL flashlmdd (SourceForge ronnz98). Topic tự đóng sau 365 ngày (02/2026). Không có Easy Installer, không có kênh official /e/ cho V50.",
    strengths: ["Từng là lựa chọn deGoogle dựa trên Lineage"],
    weaknesses: [
      "Unofficial, một bản",
      "Thread đóng, không hỗ trợ",
    ],
    bestFor: [],
    notFor: ["Ai cần ROM còn duy trì"],
    notes: ["Không có hướng dẫn flash trên catalog này."],
    links: [{ label: "Thread unofficial (đã đóng)", href: sources.eosUnofficial }],
  },
  {
    slug: "evolution-x-gsi",
    name: "Evolution X (GSI)",
    shortName: "Evo GSI",
    isStock: false,
    status: "discontinued",
    group: "feature",
    androidVersion: 14,
    versionLabel: "Android 14 GSI",
    buildLabel: "GSI 8.0.3 (2023-12) — không phải ROM máy",
    lastVerified: "2026-09",
    cadence: "stopped",
    ota: false,
    bootlock: "unlocked-only",
    google: "gapps",
    integrity: "unknown",
    integrityNote: "GSI generic, Integrity không đo trên catalog này.",
    camera: "aosp",
    cameraNote: "GSI: camera/haptic/VoLTE tùy vendor base — thường thiếu.",
    esim: "no",
    customization: "medium",
    install: "recovery",
    tagline:
      "GSI 2023 trên XDA, không phải Evolution X official cho flashlmdd.",
    summary:
      "Thread XDA flash GSI Evolution X lên base ROM V50. Không có thiết bị cheetah-style trên evolution-x.org. Catalog ghi để bạn không nhầm với ROM máy còn sống.",
    strengths: [],
    weaknesses: [
      "Không phải ROM device official",
      "Phụ thuộc base ROM + TWRP cộng đồng",
      "Haptic / VoLTE / vân tay hay lỗi",
    ],
    bestFor: [],
    notFor: ["Daily driver cần ổn định"],
    notes: [
      "Không catalog GSI Telegram khác. Không có bước flash trên trang này.",
    ],
    links: [{ label: "XDA GSI (lưu trữ)", href: sources.evoGsiXda }],
  },
];

export function getRom(slug: string): Rom | undefined {
  return roms.find((rom) => rom.slug === slug);
}

export const liveRoms = roms.filter(
  (rom) => rom.status === "stock" || rom.status === "active",
);

export const staleRoms = roms.filter((rom) => rom.status === "stale");

export const discontinuedRoms = roms.filter(
  (rom) => rom.status === "discontinued",
);
