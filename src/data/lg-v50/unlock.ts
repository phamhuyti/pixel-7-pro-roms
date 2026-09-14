import { sources } from "./sources";
import type { UnlockGuide } from "../types";

export const unlockGuide: UnlockGuide = {
  title: "Mở khóa bootloader LG V50 ThinQ",
  summary:
    "LG không cung cấp OEM unlocking cho V50. Wiki LineageOS ghi rõ: không có cách unlock official — mọi cách cộng đồng đều không được Lineage hỗ trợ. Lệnh sau khi đã có fastboot thật là `fastboot oem unlock` (không phải `fastboot flashing unlock` như Pixel).",
  officialHref: sources.lineageWiki,
  officialLabel: "Wiki LineageOS flashlmdd (cảnh báo unlock)",
  extraLinks: [
    {
      label: "XDA: unlock G8/G8x/V50 (Firehose / EDL)",
      href: sources.unlockXda,
    },
    {
      label: "XDA Developers: mô tả phương pháp (2021)",
      href: sources.unlockXdaNews,
    },
    { label: "Platform-tools (adb / fastboot)", href: sources.platformTools },
  ],
  warnings: [
    "Không có nút OEM unlocking như Pixel. Ép unlock sai file engineering / sai biến thể = brick cứng.",
    "Wiki Lineage: unofficial unlock không được dự án hỗ trợ. Làm theo XDA, không theo video Telegram.",
    "Backup abl_a / abl_b (và đúng các phân vùng thread XDA liệt kê) trước khi ghi đè. Mất bản backup thì không khôi phục fastboot gốc.",
    "Sprint / Verizon / Hàn / EU dùng bộ file khác nhau. LM-V500N không phải LM-V500EM.",
    "Unlock xóa dữ liệu. Gỡ tài khoản Google trước (FRP).",
    "Sau custom ROM: đừng `fastboot oem lock` / `flashing lock`.",
  ],
  requirements: [
    "Đúng model trên tem / Cài đặt → Giới thiệu: LM-V500EM, LM-V500N, hoặc LM-V450 (Sprint).",
    "Máy tính Windows thường dùng QFIL (EDL 9008). Cáp data, cổng USB thẳng.",
    "Pin trên 50%. Sao lưu ảnh, eSIM không có — V50 không eSIM.",
    "Thread XDA “Guide LG G8/G8x/v50 Bootloader Unlock and Magisk Root using Firehose” — lấy engineering ABL đúng máy từ đó, không file lạ.",
  ],
  steps: [
    {
      title: "Đọc wiki và thread XDA một lượt",
      body: "Wiki Lineage chỉ cảnh báo, không hướng dẫn unlock. Toàn bộ thao tác EDL/QFIL nằm trên XDA. Trang này tóm tắt thứ tự để bạn đối chiếu — nếu XDA khác, làm theo XDA.",
    },
    {
      title: "Xác đúng model và bản stock",
      body: "Ghi lại LM-V50xxxx và software version. Nhiều hướng dẫn giả định Android 10 khi vào EDL lần đầu. Đừng đổi KDZ giữa chừng nếu thread yêu cầu đúng bản.",
    },
    {
      title: "Vào EDL (9008) và backup",
      body: "Máy tắt: giữ Volume xuống rồi cắm USB (một số máy cần tổ hợp khác — xem XDA). QFIL Partition Manager: đọc/backup đúng phân vùng thread nêu (thường gồm abl_a, abl_b). Cất file .bin ra chỗ an toàn.",
    },
    {
      title: "Nạp engineering ABL rồi vào Fastboot",
      body: "Chỉ load ABL engineering của đúng gói V50/G8 trên XDA. Sau đó reboot Fastboot (Volume xuống + nguồn, hoặc cắm USB khi giữ Volume xuống). Fastboot phải hiện Device State: locked.",
      note: "Trang này không host firehose / ABL. Sai programmer brick máy.",
    },
    {
      title: "Unlock",
      body: "Khi fastboot đã thấy máy, lệnh cộng đồng trên V50 là oem unlock. Xác nhận trên máy nếu có menu.",
      commands: ["fastboot devices", "fastboot oem unlock"],
    },
    {
      title: "Khôi phục ABL gốc",
      body: "Flash lại abl_a / abl_b (và phân vùng khác nếu bạn đã thay) từ bản backup. Không để engineering ABL vĩnh viễn.",
      commands: [
        "fastboot flash abl_a abl_a.bin",
        "fastboot flash abl_b abl_b.bin",
        "fastboot reboot",
      ],
      note: "Tên file backup QFIL thường dài — kéo đúng file tương ứng slot. XDA có đoạn restore chi tiết.",
    },
  ],
  afterUnlock: [
    "Boot có cảnh báo unlocked. Stock setup lại, bật USB debugging.",
    "Lineage yêu cầu Magisk trên stock trước khi dd recovery — xem Magisk/KernelSU.",
    "Không khóa bootloader sau Lineage / GSI.",
  ],
  cannotUnlock: [
    "QFIL không thấy 9008: đổi cáp, driver Qualcomm, cổng USB.",
    "Không có engineering ABL đúng biến thể — đừng lấy file G8 gắn cho V50 nếu thread không nói máy bạn.",
    "fastboot không lên: chưa nạp ABL engineering, hoặc đã restore quá sớm.",
  ],
};
