import { sources } from "./sources";
import type { Rom } from "../types";

export const roms: Rom[] = [
  {
    slug: "stock-vivo",
    name: "Funtouch OS (stock)",
    shortName: "Stock vivo",
    isStock: true,
    status: "stock",
    group: "baseline",
    androidVersion: 14,
    versionLabel: "Android 14",
    buildLabel: "Funtouch OS 14 — OTA hãng",
    lastVerified: "2026-09",
    cadence: "monthly",
    ota: true,
    bootlock: "stock-locked",
    google: "stock",
    integrity: "stock",
    integrityNote:
      "Play Integrity trên Funtouch stock là mốc duy nhất thực tế trên máy này — không có Graphene/Calyx/Lineage để so.",
    camera: "vendor",
    cameraNote:
      "Camera vivo / Aura Light gốc. Không có custom ROM thay camera trên catalog này.",
    esim: "no",
    customization: "low",
    install: "stock",
    tagline:
      "Lựa chọn duy nhất còn thực tế: ở Funtouch, nhận OTA hãng — không có custom ROM official.",
    summary:
      "vivo V40 Lite (bản Việt Nam: Snapdragon 685 4G, Funtouch OS 14 / Android 14). Hãng không mở OEM unlocking; wiki Lineage không liệt kê máy. Catalog chỉ ghi stock và lý do không có Graphene/Calyx/Lineage — không catalog Telegram hay QFIL lạ.",
    strengths: [
      "OTA / System Upgrade chính thức",
      "Camera OEM và app ngân hàng ít “lạ” nhất trên chính máy này",
      "Không cần unlock — giữ bảo hành và verified boot hãng",
    ],
    weaknesses: [
      "Không có kênh custom ROM official / Lineage",
      "Funtouch nặng bloat hơn AOSP sạch",
      "Chu kỳ vá ngắn hơn Pixel; phụ thuộc lộ trình vivo từng vùng",
    ],
    bestFor: [
      "Máy dùng hàng ngày, cần OTA và banking",
      "Khôi phục / nâng cấp bằng gói hãng",
      "Ai không unlock được và không muốn rủi ro brick",
    ],
    notFor: [
      "DeGoogle / hardening kiểu Graphene",
      "Rice ROM / GSI Telegram",
    ],
    notes: [
      "Bản VN trên vivo.com.vn: Snapdragon 685 4G, 8+256, không 5G. Thị trường khác có V40 Lite 5G (Snapdragon 4 Gen 2, ví dụ V2417) — đừng flash gói firmware chéo biến thể.",
      "Gói Funtouch hay ghi PD2343F (Lite 5G) hoặc mã 4G theo vùng. Luôn khớp Cài đặt → Giới thiệu máy / phiên bản phần mềm trước khi tải gói.",
      "Không dùng pack QFIL/Telegram “unbrick” không rõ nguồn trên trang này.",
    ],
    links: [
      { label: "Trang sản phẩm VN", href: sources.productVn },
      { label: "Thông số VN", href: sources.productParamsVn },
      { label: "Cập nhật hệ thống (vivo VN)", href: sources.systemUpdateVn },
      { label: "Hướng dẫn firmware (vivo VN)", href: sources.localUpgradeGuide },
    ],
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
