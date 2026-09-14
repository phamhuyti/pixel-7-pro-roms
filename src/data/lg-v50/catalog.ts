import type { DeviceCatalog } from "../types";
import { flashGuides } from "./flash";
import { defaultCompareSlugs } from "./recommend";
import { roms } from "./roms";
import { magiskDocLinks, rootGuides } from "./root";
import { sources } from "./sources";
import { switchGuides, switchOverview } from "./switch-rom";
import { unlockGuide } from "./unlock";

export const v50Catalog: DeviceCatalog = {
  id: "lg-v50",
  name: "LG V50 ThinQ",
  shortName: "LG V50",
  codename: "flashlmdd",
  manufacturer: "LG",
  chipset: "Snapdragon 855",
  released: "2019",
  stockSupportEnd: "đã hết (Android 12)",
  pickerSummary:
    "SD855, stock hết vá. LineageOS 21 từng official rồi dừng maintain. Unlock không có kênh OEM.",
  pickerWarning:
    "Không có custom ROM còn nightly official. Catalog nêu wiki còn sống và kho zip công khai — không catalog Telegram.",
  heroTitle: "V50 không còn ROM “còn sống” kiểu Pixel — chỉ còn wiki và kho đóng băng.",
  heroLede:
    "LG đã ngừng hỗ trợ. LineageOS ghi flashlmdd no longer maintained (trước đó 21 / Android 14). Trang này tóm tắt unlock cộng đồng, KDZ, và wiki cài Lineage — wiki thắng nếu lệch.",
  wizardLede:
    "Không có nightly official. Gợi ý gồm stock và ROM còn wiki / kho công khai (stale) — không phải ROM “còn sống” kiểu Pixel.",
  installHubLede:
    "Không có OEM unlock. Sau EDL/XDA, flash KDZ hoặc Lineage 21 theo wiki. Magisk vá boot.img (không init_boot). Không giả Play Integrity. Lineage official đã dừng — zip tự build hoặc kho microG.",
  unlockBlurb:
    "LG không có OEM unlocking. Unlock unofficial (EDL / engineering ABL) theo XDA; Lineage không hỗ trợ bước này.",
  sourcesNote:
    "Nguồn snapshot: wiki LineageOS flashlmdd (install/build, không còn download official), download.lineage.microg.org (zip 02/05/2026), XDA unlock Firehose G8/V50, lg-firmwares KDZ, thread /e/OS unofficial đã đóng, XDA GSI Evolution X 2023. Telegram không được liệt kê.",
  stockRestoreHref: sources.lgFirmwares,
  stockRestoreLabel: "KDZ lg-firmwares",
  faq: [
    {
      q: "Còn ROM official không?",
      a: "Không nightly. Lineage 21 từng official rồi dừng. Còn wiki cài và (tùy lúc) zip Lineage for microG.",
    },
    {
      q: "Unlock thế nào?",
      a: "Không có OEM unlocking. Cộng đồng dùng EDL/QFIL + engineering ABL rồi fastboot oem unlock. Làm theo XDA; Lineage không hỗ trợ.",
    },
    {
      q: "Dual Screen?",
      a: "Chỉ kỳ vọng trên stock LG. Lineage wiki/XDA: Dual Screen không chạy.",
    },
    {
      q: "Firmware trước Lineage?",
      a: "Stock Android 12 mới nhất đúng model. Đang ở ROM khác không được tính là đủ.",
    },
    {
      q: "Magisk?",
      a: "Vá boot.img, không phải init_boot. Wiki Lineage bắt root stock trước khi dd recovery. Không giả Play Integrity.",
    },
  ],
  androidFilters: [
    { value: "all", label: "Mọi Android" },
    { value: "14", label: "Android 14" },
    { value: "12", label: "Android 12" },
    { value: "older", label: "Android 11 trở xuống" },
  ],
  androidOlderBelow: 12,
  defaultCompareSlugs,
  roms,
  unlockGuide,
  flashGuides,
  switchGuides,
  switchOverview,
  rootGuides,
  magiskDocLinks: [...magiskDocLinks],
};
