import type { DeviceCatalog } from "../types";
import { flashGuides } from "./flash";
import { defaultCompareSlugs } from "./recommend";
import { roms } from "./roms";
import { magiskDocLinks, rootGuides } from "./root";
import { sources } from "./sources";
import { switchGuides, switchOverview } from "./switch-rom";
import { unlockGuide } from "./unlock";

export const pixelCatalog: DeviceCatalog = {
  id: "pixel-7-pro",
  name: "Google Pixel 7 Pro",
  shortName: "Pixel 7 Pro",
  codename: "cheetah",
  manufacturer: "Google",
  chipset: "Google Tensor G2",
  released: "2022",
  stockSupportEnd: "tháng 10/2027",
  pickerSummary:
    "Tensor G2, stock còn vá đến 10/2027. GrapheneOS, CalyxOS, LineageOS và các fork A16 còn kiểm chứng được.",
  heroTitle: "Chọn custom ROM theo nhu cầu, không theo lời đồn Telegram.",
  heroLede:
    "Máy vẫn nhận stock đến tháng 10/2027. Trang này đối chiếu các ROM official/community còn kiểm chứng được — và chỉ rõ ROM đã chết để bạn không flash nhầm.",
  wizardLede:
    "Không có ROM “tốt nhất”. Chọn một hoặc nhiều nhu cầu — trang này chỉ xếp các lựa chọn còn sống, kèm lý do.",
  installHubLede:
    "Unlock một lần, rồi flash theo kênh official. Có mục chuyển từ custom ROM khác, Magisk (init_boot trên Tensor) và KernelSU khi kernel ROM hỗ trợ. Không hướng dẫn giả Play Integrity. ROM stale / đã ngừng không có bước flash — trừ khi wiki còn và được ghi rõ.",
  unlockBlurb:
    "Bắt buộc với ROM recovery. GrapheneOS / CalyxOS / iodé installer có thể tự gửi lệnh unlock — vẫn phải bật OEM unlocking trước.",
  sourcesNote:
    "Dữ liệu tĩnh, curated từ wiki/trang tải official: GrapheneOS releases, CalyxOS install + news, LineageOS wiki/download, Evolution X, crDroid, Infinity-X changelog, iodéOS device list, /e/OS doc, RisingOS XDA/SourceForge, DerpFest SourceForge, PixelOS, CustomRomBay (chỉ để đối chiếu tên đã ngừng). Telegram unofficial không được liệt kê.",
  stockRestoreHref: sources.flashAndroid,
  stockRestoreLabel: "Android Flash Tool",
  faq: [
    {
      q: "Có cần custom ROM trên P7 Pro không?",
      a: "Không, nếu bạn chỉ muốn máy còn cập nhật. Stock hỗ trợ đến tháng 10/2027. ROM để đổi mô hình bảo mật, deGoogle, hoặc UI.",
    },
    {
      q: "ROM nào “chơi game / mượt nhất”?",
      a: "Không đo benchmark ở đây. Kernel và firmware stock quyết định phần lớn. Đừng flash ROM Telegram vì lời hứa FPS.",
    },
    {
      q: "Banking chết thì sao?",
      a: "Ở stock. GrapheneOS đôi khi chạy được nhờ compatibility mode. Root + giả Integrity không phải giải pháp được trang này khuyến nghị.",
    },
    {
      q: "Firmware trước khi flash?",
      a: "Lineage (và nhiều fork) yêu cầu firmware stock Android 16. Đọc wiki máy, đừng tin “đang ở ROM khác là đủ”.",
    },
    {
      q: "Flash thế nào?",
      a: "Trang Cài đặt có unlock, flash, chuyển từ custom ROM, Magisk/KernelSU. Không giả Play Integrity.",
    },
  ],
  androidFilters: [
    { value: "all", label: "Mọi Android" },
    { value: "16", label: "Android 16" },
    { value: "15", label: "Android 15" },
    { value: "older", label: "Android 14 trở xuống" },
  ],
  androidOlderBelow: 15,
  defaultCompareSlugs,
  roms,
  unlockGuide,
  flashGuides,
  switchGuides,
  switchOverview,
  rootGuides,
  magiskDocLinks: [...magiskDocLinks],
};
