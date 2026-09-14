import type {
  Bootlock,
  Cadence,
  CameraSupport,
  Customization,
  EsimSupport,
  FlashMethod,
  GoogleStack,
  InstallEase,
  Integrity,
  NeedId,
  RelockAdvice,
  RomGroup,
  RomStatus,
  RootSupport,
} from "./types";

export const SNAPSHOT_DATE = "2026-09-14";
export const SNAPSHOT_LABEL = "14 tháng 9, 2026";

export const statusLabels: Record<RomStatus, string> = {
  stock: "Stock",
  active: "Đang duy trì",
  stale: "Cần kiểm tra",
  discontinued: "Đã ngừng",
};

export const groupLabels: Record<RomGroup, string> = {
  baseline: "Hệ điều hành gốc",
  privacy: "Bảo mật / quyền riêng tư",
  clean: "AOSP sạch",
  degoogle: "DeGoogle",
  feature: "Tùy biến / gần Pixel",
};

export const googleLabels: Record<GoogleStack, string> = {
  stock: "Google Play gốc",
  "sandboxed-play": "Play trong sandbox",
  microg: "microG",
  gapps: "GApps đi kèm",
  "optional-gapps": "GApps tùy chọn",
  none: "Không Google",
};

export const bootlockLabels: Record<Bootlock, string> = {
  "stock-locked": "Bootloader khóa sẵn",
  "can-relock": "Có thể khóa lại",
  "unlocked-only": "Phải để mở khóa",
};

export const cadenceLabels: Record<Cadence, string> = {
  "same-week": "Trong tuần sau patch Google",
  weekly: "Hàng tuần / nightly",
  monthly: "Hàng tháng",
  irregular: "Không đều",
  stopped: "Đã dừng",
};

export const integrityLabels: Record<Integrity, string> = {
  stock: "Gần stock",
  limited: "Hạn chế",
  weak: "Yếu",
  unknown: "Không rõ",
};

export const cameraLabels: Record<CameraSupport, string> = {
  "stock-pixel": "Camera Pixel đầy đủ",
  "pixel-hal": "Gần Pixel / HAL vendor",
  gcam: "GCam / một phần",
  aosp: "Camera AOSP",
  vendor: "Camera hãng / OEM",
};

export const installLabels: Record<InstallEase, string> = {
  stock: "Cài sẵn / OTA hãng",
  "web-flasher": "Web / device flasher",
  recovery: "Recovery + sideload",
  desktop: "LGUP / KDZ trên máy tính",
};

export const flashMethodLabels: Record<FlashMethod, string> = {
  "stock-web": "Android Flash Tool",
  "web-installer": "Web installer",
  "device-flasher": "Device flasher",
  "recovery-sideload": "Recovery + sideload",
  "desktop-installer": "Installer trên máy tính",
  "ota-local": "OTA / Local upgrade",
};

export const relockLabels: Record<RelockAdvice, string> = {
  required: "Phải khóa lại bootloader",
  recommended: "Nên khóa lại sau khi flash",
  forbidden: "Không được khóa lại",
  "n/a": "Không áp dụng",
};

export const rootSupportLabels: Record<RootSupport, string> = {
  "official-optional": "Tùy chọn trên trang ROM",
  unofficial: "Không official",
  unsupported: "Không hỗ trợ",
};

export const esimLabels: Record<EsimSupport, string> = {
  yes: "Có",
  partial: "Một phần",
  unknown: "Chưa rõ",
  no: "Không",
};

export const customizationLabels: Record<Customization, string> = {
  none: "Gần như không",
  low: "Thấp",
  medium: "Vừa",
  high: "Cao",
};

export const needLabels: Record<NeedId, { title: string; detail: string }> = {
  security: {
    title: "Bảo mật tối đa",
    detail: "Hardening, verified boot, vá nhanh hơn lời đồn trên Telegram.",
  },
  banking: {
    title: "Ngân hàng / Wallet",
    detail: "Play Integrity, Google Wallet, app ngân hàng ít bị chặn.",
  },
  camera: {
    title: "Camera Pixel",
    detail: "Night Sight, Real Tone, chỉnh ảnh Google Photos.",
  },
  degoogle: {
    title: "Bớt phụ thuộc Google",
    detail: "microG, sandbox Play, hoặc không GApps.",
  },
  customize: {
    title: "Tùy biến giao diện",
    detail: "QS, lockscreen, theme, extra features.",
  },
};

export const androidFilterOptions = [
  { value: "all", label: "Mọi Android" },
  { value: "16", label: "Android 16" },
  { value: "15", label: "Android 15" },
  { value: "older", label: "Android 14 trở xuống" },
] as const;
