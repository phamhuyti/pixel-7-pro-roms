import { sources } from "./sources";
import type { UnlockGuide } from "../types";

export const unlockGuide: UnlockGuide = {
  title: "Mở khóa bootloader vivo V40 Lite",
  summary:
    "vivo không cung cấp OEM unlocking cho V40 Lite (Funtouch). Wall of Shame xếp Vivo/iQOO ở mức tránh hoàn toàn: không app Deep Testing kiểu Realme, không `fastboot flashing unlock` như Pixel. Máy 2024 (sau firmware exploit ~2022) không có kênh unlock được Lineage hay catalog này hỗ trợ.",
  officialHref: sources.unlockWallOfShame,
  officialLabel: "Bootloader Unlock Wall of Shame — Vivo/iQOO",
  extraLinks: [
    { label: "Danh sách máy LineageOS", href: sources.lineageDevices },
    { label: "Thông số V40 Lite (VN)", href: sources.productParamsVn },
    { label: "Platform-tools (adb / fastboot)", href: sources.platformTools },
  ],
  warnings: [
    "Không có nút OEM unlocking trong Tùy chọn nhà phát triển cho mục đích custom ROM trên máy này.",
    "Hướng dẫn “unlock mọi vivo” / EDL / QFIL trên mạng thường nhắm máy cũ (trước ~05/2022) hoặc biến thể khác — áp dụng nhầm = brick cứng, mất mạng, mất bảo hành.",
    "V40 Lite không có trên wiki LineageOS. Không có ROM recovery official để “cần unlock rồi flash”.",
    "Catalog này không hướng dẫn exploit EDL, firehose lạ, hay Magisk suu — vì bước unlock hợp lệ không tồn tại cho máy này.",
    "Giữ bootloader khóa: nhận OTA Funtouch, banking/Integrity stock ổn định hơn mọi “ROM Telegram”.",
  ],
  requirements: [
    "Xác đúng máy: V40 Lite (VN: Snapdragon 685 4G) — không nhầm V40 / V40e / V40 Lite 5G.",
    "Đọc Wall of Shame Vivo trước khi tin video unlock.",
    "Nếu mục tiêu chỉ là cập nhật hoặc khôi phục: dùng trang Flash Funtouch / System Upgrade — không cần unlock.",
  ],
  steps: [
    {
      title: "Kiểm tra máy có trên Lineage không",
      body: "Mở wiki LineageOS Devices. Không thấy V40 Lite / mã model của bạn = không có cài Lineage official. Dừng kỳ vọng custom ROM kiểu Pixel/V50.",
    },
    {
      title: "Kiểm tra OEM unlocking",
      body: "Bật Tùy chọn nhà phát triển. Trên V40 Lite Funtouch thường không có OEM unlocking dùng được, hoặc tùy chọn không dẫn tới fastboot unlock như Pixel. Đây là thiết kế hãng, không phải bạn thiếu driver.",
    },
    {
      title: "Thử fastboot (chỉ để xác nhận — không unlock)",
      body: "Nếu vào được fastboot và muốn tự kiểm chứng máy bị khóa:",
      commands: ["adb reboot bootloader", "fastboot devices", "fastboot getvar unlocked"],
      note: "Không chạy `fastboot oem unlock` / `flashing unlock` theo video lạ. Trên vivo khóa, lệnh thường fail; ép bằng tool EDL không được trang này hỗ trợ.",
    },
    {
      title: "Dừng và ở stock",
      body: "Không có bước 4 “flash engineering abl”. Catalog kết thúc ở đây: giữ Funtouch, nhận OTA. Muốn custom ROM thật sự thì chọn máy có OEM unlock (ví dụ Pixel trong catalog này).",
    },
  ],
  afterUnlock: [
    "Không áp dụng — máy không có kênh unlock được hỗ trợ trên trang này.",
    "Nếu bạn đã unlock bằng phương pháp ngoài catalog: tự chịu rủi ro; không có hướng dẫn Magisk/ROM tiếp theo ở đây.",
  ],
  cannotUnlock: [
    "Không có OEM unlocking / fastboot từ chối unlock — đúng hành vi vivo Funtouch.",
    "Tool EDL/QFIL “universal vivo” không khớp chip/firmware 2024 → brick.",
    "Nhầm V40 Lite 4G (SD685) với bản 5G (SD 4 Gen 2) khi lấy file unlock/firmware.",
    "Tin Telegram “ROM + unlock tool” — không được liệt kê trên catalog này.",
  ],
};
