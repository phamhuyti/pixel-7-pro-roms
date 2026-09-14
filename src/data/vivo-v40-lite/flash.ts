import { sources } from "./sources";
import type { FlashGuide } from "../types";

const sharedWipe =
  "OTA thường giữ dữ liệu; Local upgrade / phục hồi dịch vụ có thể xóa hoặc lỗi. Sao lưu trước.";

const noCustom =
  "Không có hướng dẫn flash Lineage/GSI/Magisk trên V40 Lite trong catalog này — bootloader không mở được theo kênh hỗ trợ.";

export const flashGuides: Record<string, FlashGuide> = {
  "stock-vivo": {
    method: "ota-local",
    officialHref: sources.systemUpdateVn,
    officialLabel: "vivo VN — Cập nhật hệ thống",
    extraLinks: [
      { label: "Hướng dẫn firmware / Local upgrade (VN)", href: sources.localUpgradeGuide },
      { label: "Trang sản phẩm V40 Lite VN", href: sources.productVn },
    ],
    summary:
      "Ở Funtouch: ưu tiên OTA trong Cài đặt → System Upgrade. Gói Local upgrade chỉ khi tải đúng gói vùng/model từ kênh vivo. Không QFIL Telegram. Không custom ROM.",
    relock: "n/a",
    firmwareNote:
      "Gói phải khớp đúng biến thể (VN 4G SD685 ≠ Lite 5G SD 4 Gen 2 ≠ V40 thường). Sai gói có thể brick hoặc mất mạng. Ưu tiên OTA đẩy về máy hơn file tải tay.",
    requirements: [
      "Pin > 30–50%. Wi‑Fi ổn định nếu OTA.",
      "Đúng model trên tem / Giới thiệu máy — ghi lại phiên bản phần mềm hiện tại.",
      "Sao lưu ảnh, tin nhắn, mã 2FA — trước Local upgrade hoặc mang ra trung tâm bảo hành.",
      "Chỉ gói từ vivo.com (đúng quốc gia) hoặc OTA — không pack “PD… QFIL” diễn đàn lạ.",
    ],
    warnings: [
      sharedWipe,
      noCustom,
      "Không flash đè firmware vùng khác / bản 5G lên máy 4G VN.",
      "Không downgrade tùy tiện trên Android 8+ (hãng thường chặn).",
    ],
    downloads: [
      {
        label: "System Upgrade (vivo VN)",
        href: sources.systemUpdateVn,
        detail: "Chọn đúng mẫu nếu trang liệt kê; không thấy thì dùng OTA trên máy.",
      },
      {
        label: "Hướng dẫn cài firmware (vivo VN)",
        href: sources.localUpgradeGuide,
        detail: "Đặt gói ở thư mục gốc bộ nhớ trong, không giải nén — làm theo trang VN.",
      },
    ],
    steps: [
      {
        title: "Ưu tiên OTA trên máy",
        body: "Cài đặt → System Upgrade (hoặc Cập nhật hệ thống) → kiểm tra bản mới. Tải và cài khi pin đủ. Đây là đường chính cho V40 Lite còn bảo hành.",
      },
      {
        title: "Local upgrade (khi đã có gói đúng)",
        body: "Chỉ khi vivo cung cấp gói cho đúng model/vùng của bạn. Copy gói (không giải nén) vào thư mục gốc bộ nhớ trong → System Upgrade → biểu tượng menu → Local upgrade → chọn gói.",
        note: "Nếu máy không vào được hệ thống: một số máy vivo dùng Recovery → Install software — chỉ khi đúng gói và đúng combo phím máy bạn; dịch vụ ủy quyền an toàn hơn tự QFIL.",
      },
      {
        title: "Không dùng QFIL / EDL “unbrick” lạ",
        body: "Catalog không hướng dẫn QFIL firehose cho V40 Lite. Brick / mất IMEI: trung tâm vivo hoặc kỹ thuật viên có file đúng SKU — không tải zip PD… từ site không rõ.",
      },
      {
        title: "Sau khi lên bản mới",
        body: "Boot, kiểm tra SIM/NFC/camera. Không khóa/mở bootloader — máy vốn khóa stock.",
      },
    ],
    afterInstall: [
      "Custom ROM: không có trên catalog này.",
      "Root/Magisk: xem trang Magisk — không hỗ trợ khi chưa unlock (và unlock không có kênh).",
      "Đối chiếu thêm: trang thông số VN và Wall of Shame nếu ai đó rủ unlock.",
    ],
  },
};

export function getFlashGuide(slug: string): FlashGuide | undefined {
  return flashGuides[slug];
}

export const flashGuideSlugs = Object.keys(flashGuides);
