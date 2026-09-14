import type { DeviceCatalog } from "../types";
import { flashGuides } from "./flash";
import { defaultCompareSlugs } from "./recommend";
import { roms } from "./roms";
import { magiskDocLinks, rootGuides } from "./root";
import { sources } from "./sources";
import { switchGuides, switchOverview } from "./switch-rom";
import { unlockGuide } from "./unlock";

export const v40LiteCatalog: DeviceCatalog = {
  id: "vivo-v40-lite",
  name: "vivo V40 Lite",
  shortName: "V40 Lite",
  codename: "v40lite",
  manufacturer: "vivo",
  chipset: "Snapdragon 685",
  released: "2024",
  stockSupportEnd: "theo lộ trình Funtouch từng vùng (VN: OTA hãng)",
  pickerSummary:
    "SD685 (bản VN 4G), Funtouch 14. Không OEM unlock, không Lineage/Graphene trên wiki — catalog chỉ stock.",
  pickerWarning:
    "Không có custom ROM official. Đừng flash QFIL/Telegram. Bản 5G (SD 4 Gen 2) khác firmware với máy VN.",
  heroTitle: "V40 Lite không có custom ROM trong catalog — chỉ Funtouch stock.",
  heroLede:
    "vivo khóa bootloader; LineageOS không liệt kê máy. Trang này ghi rõ giới hạn đó, hướng dẫn OTA/Local upgrade, và cảnh báo unlock giả — wiki/hãng thắng nếu lệch.",
  wizardLede:
    "Không có Graphene/Lineage để xếp hạng. Gợi ý chỉ hướng về stock Funtouch theo nhu cầu còn thực tế (banking, camera, OTA).",
  installHubLede:
    "Không có OEM unlock. Không flash Lineage/GSI trên trang này. Magisk/KernelSU không hỗ trợ khi máy khóa. Chỉ OTA / Local upgrade Funtouch đúng model.",
  unlockBlurb:
    "vivo không mở OEM unlocking cho V40 Lite. Trang unlock giải thích vì sao dừng lại ở stock — không hướng dẫn EDL.",
  sourcesNote:
    "Nguồn snapshot: vivo.com.vn (sản phẩm + thông số + system-update), hướng dẫn Local upgrade vivo, GSMArena (đối chiếu biến thể 4G/5G), Bootloader Unlock Wall of Shame (Vivo/iQOO), wiki Lineage devices (xác nhận không có máy). Không catalog Telegram, không host QFIL.",
  stockRestoreHref: sources.systemUpdateVn,
  stockRestoreLabel: "System Upgrade (vivo VN)",
  faq: [
    {
      q: "Có custom ROM không?",
      a: "Không trên catalog này. Không Lineage official, không Graphene/Calyx. Chỉ Funtouch stock.",
    },
    {
      q: "Unlock thế nào?",
      a: "Không có kênh OEM. Exploit EDL/máy cũ không áp dụng an toàn cho V40 Lite 2024 — trang này không hướng dẫn.",
    },
    {
      q: "Bản VN khác bản 5G?",
      a: "Có. VN: Snapdragon 685 4G. Nhiều thị trường: V40 Lite 5G (Snapdragon 4 Gen 2). Đừng dùng chung firmware.",
    },
    {
      q: "Cập nhật / gói stock?",
      a: "Cài đặt → System Upgrade. Local upgrade chỉ với gói đúng model từ kênh vivo.",
    },
    {
      q: "Magisk / root?",
      a: "Không hỗ trợ khi bootloader khóa. Không giả Play Integrity.",
    },
    {
      q: "Mã máy / gói Funtouch?",
      a: "Catalog dùng slug v40lite. Gói hãng hay ghi PD2343F (Lite 5G) hoặc mã 4G theo vùng — luôn khớp Cài đặt → Giới thiệu máy, không đoán theo tên marketing.",
    },
  ],
  androidFilters: [
    { value: "all", label: "Mọi Android" },
    { value: "15", label: "Android 15" },
    { value: "14", label: "Android 14" },
    { value: "older", label: "Android 13 trở xuống" },
  ],
  androidOlderBelow: 14,
  defaultCompareSlugs,
  roms,
  unlockGuide,
  flashGuides,
  switchGuides,
  switchOverview,
  rootGuides,
  magiskDocLinks: [...magiskDocLinks],
};
