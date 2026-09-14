import { sources } from "./sources";
import type { FlashGuide } from "../types";

const sharedWipe =
  "Format data / factory reset và unlock đều xóa nội bộ. Sao lưu xong mới làm.";

const noRelock =
  "Không `fastboot oem lock` khi đang custom ROM trên V50 — brick. Khôi phục stock KDZ cũng không biến unlock unofficial thành OEM lock an toàn.";

const rootPointer =
  "Magisk: vá boot.img (không phải init_boot — V50 không phải Tensor). KernelSU không có kernel official. Không giả Play Integrity.";

export const flashGuides: Record<string, FlashGuide> = {
  "stock-lg": {
    method: "desktop-installer",
    officialHref: sources.lgFirmwaresHow,
    officialLabel: "lg-firmwares: how to flash",
    extraLinks: [{ label: "Kho KDZ", href: sources.lgFirmwares }],
    summary:
      "Khôi phục LG UX bằng KDZ + LGUP (hoặc hướng dẫn trên lg-firmwares). Chọn đúng model. Dùng khi brick, sai firmware, hoặc cần Android 12 trước Lineage.",
    relock: "forbidden",
    firmwareNote:
      "KDZ phải khớp model (V500N / V500EM / V450…). Crossflash nhà mạng khác có thể mất LTE/IMEI. Trang hãng LG không còn công cụ consumer cho máy này.",
    requirements: [
      "File KDZ đúng model, cùng vùng nếu có thể.",
      "LGUP + DLL/common đúng thế hệ V50 (nguồn từ lg-firmwares / XDA, không pack Telegram).",
      "Driver LG USB. Windows.",
      "Pin > 50%. Backup.",
    ],
    warnings: [
      sharedWipe,
      noRelock,
      "Flash KDZ nhầm model = mất mạng hoặc brick.",
      rootPointer,
    ],
    downloads: [
      {
        label: "lg-firmwares.com",
        href: sources.lgFirmwares,
        detail: "Chọn đúng LM-V50xxxx, tải KDZ, đối chiếu MD5 nếu trang có.",
      },
      {
        label: "How to flash",
        href: sources.lgFirmwaresHow,
        detail: "Thứ tự LGUP trên trang đó thắng nếu lệch bản tiếng Việt này.",
      },
      {
        label: "Kho LGUP / KDZ mẫu (Synology)",
        href: sources.v50ArchiveShare,
        detail: "LGUP + DLL và KDZ mẫu trong share — vẫn phải đúng model; không thay lg-firmwares.",
      },
    ],
    steps: [
      {
        title: "Tải đúng KDZ",
        body: "Vào lg-firmwares, chọn model in trên máy (không đoán). Ưu tiên Android 12 mới nhất của đúng SKU nếu chuẩn bị flash Lineage.",
      },
      {
        title: "Cài LGUP và driver",
        body: "Làm đúng mục how-to-flash: USB driver LG, LGUP, DLL. Máy ở Download mode: tắt máy, giữ Volume xuống, cắm USB (cùng combo wiki Lineage gọi Fastboot/Download).",
      },
      {
        title: "Flash KDZ",
        body: "LGUP nhận máy → chọn KDZ → Refurbish / Upgrade theo trang hướng dẫn (Refurbish xóa data). Đợi xong, đừng rút cáp.",
      },
      {
        title: "Boot stock lần đầu",
        body: "Setup, kiểm tra SIM/gọi. Gỡ Google nếu sắp unlock/flash ROM khác (FRP).",
      },
    ],
    afterInstall: [
      "Đây là firmware gốc — không còn OTA bảo mật.",
      "Muốn Lineage: ở đúng Android 12 mới, rồi unlock (nếu chưa) và Magisk stock.",
    ],
  },

  lineageos: {
    method: "recovery-sideload",
    officialHref: sources.lineageInstall,
    officialLabel: "Wiki cài LineageOS flashlmdd",
    extraLinks: [
      { label: "Wiki máy (đã dừng maintain)", href: sources.lineageWiki },
      { label: "Tự build lineage-21.0", href: sources.lineageBuild },
      { label: "Lineage for microG (zip ngày)", href: sources.lineageMicrog },
      { label: "GApps arm64", href: sources.gapps },
    ],
    summary:
      "Wiki còn: firmware stock Android 12, root stock, dd recovery vào boot_a/boot_b, copy-partitions, format, sideload. Official download đã mất — tự build hoặc zip microG công khai. Dual Screen không chạy. Không khóa bootloader.",
    relock: "forbidden",
    firmwareNote:
      "Bắt buộc stock Android 12, bản vá mới nhất của đúng model. Đang ở custom ROM khác không có nghĩa firmware đủ. Không chắc thì KDZ A12 trước.",
    requirements: [
      "Model wiki: LM-V500EM hoặc LM-V500N (XDA: LM-V450 thường dùng chung zip flashlmdd).",
      "Bootloader đã unlock (unofficial).",
      "Magisk trên stock — wiki bắt root trước khi dd.",
      "Gói cài: tự brunch flashlmdd, hoặc bộ lineage.microg.org cùng ngày (boot.img + zip).",
      "copy-partitions-20220613-signed.zip từ trang wiki cài đặt.",
    ],
    warnings: [
      sharedWipe,
      noRelock,
      "Wiki: The device must be rooted before proceeding.",
      "dd nhầm phân vùng / recovery TWRP lạ thay vì Lineage boot.img hay làm brick.",
      "download.lineageos.org/devices/flashlmdd không còn — đừng tải zip “official” từ diễn đàn lạ.",
      "Dual Screen không hoạt động.",
      rootPointer,
    ],
    downloads: [
      {
        label: "Wiki install",
        href: sources.lineageInstall,
        detail: "Nguồn bước. Đọc Rooting + dd + copy-partitions + sideload.",
      },
      {
        label: "Build guide",
        href: sources.lineageBuild,
        detail: "breakfast/brunch flashlmdd trên nhánh lineage-21.0.",
      },
      {
        label: "microG builds (không official)",
        href: sources.lineageMicrog,
        detail: "Ví dụ lineage-21.0-20260502-microG-flashlmdd.zip + boot.img. SHA256 trên trang.",
      },
    ],
    steps: [
      {
        title: "Stock Android 12 + đã unlock + Magisk",
        body: "Boot stock A12 ít nhất một lần, kiểm tra gọi/SMS. Unlock xong, cài Magisk (vá boot slot đang chạy). USB debugging bật.",
      },
      {
        title: "Đưa recovery Lineage vào máy",
        body: "File recovery wiki chính là boot.img build Lineage (hoặc boot.img cùng bộ microG). Copy vào /sdcard:",
        commands: ["adb -d push boot.img /sdcard/boot.img"],
      },
      {
        title: "dd recovery vào cả hai slot boot",
        body: "Wiki: recovery nằm trên phân vùng boot. Cần root (su):",
        commands: [
          "adb -d shell",
          "su",
          "dd if=/sdcard/boot.img of=/dev/block/bootdevice/by-name/boot_a",
          "dd if=/sdcard/boot.img of=/dev/block/bootdevice/by-name/boot_b",
          "reboot recovery",
        ],
        note: "Logo Lineage recovery. Màn hình LG hỏi factory reset khi vào recovery: chấp nhận bằng phím — wiki nói thao tác này không xóa nếu recovery đúng.",
      },
      {
        title: "copy-partitions (một lần trên máy)",
        body: "Apply update → Apply from ADB. Sideload copy-partitions-20220613-signed.zip rồi Advanced → Reboot to recovery.",
        commands: ["adb -d sideload copy-partitions-20220613-signed.zip"],
      },
      {
        title: "Format data",
        body: "Factory reset → Format data / factory reset. Về menu chính. Chưa reboot hệ thống.",
      },
      {
        title: "Sideload Lineage",
        body: "Apply from ADB. Zip tự build hoặc zip microG cùng bộ boot bạn đã dd.",
        commands: ["adb -d sideload lineage-21.0-*-flashlmdd.zip"],
        note: "Signature fail = sai file. adb dừng ~47% kèm Success vẫn có thể xong — đọc recovery.",
      },
      {
        title: "GApps tùy chọn (trước boot đầu)",
        body: "Nếu muốn Play: reboot recovery khi được hỏi, sideload MindTheGapps arm64 cho Android 14. Bỏ qua nếu dùng zip microG.",
        commands: ["adb -d sideload MindTheGapps-14.0.0-arm64-*.zip"],
      },
      {
        title: "Reboot hệ thống",
        body: "Reboot system now. Boot đầu có thể tới 15 phút. Dual Screen không hiện.",
      },
    ],
    afterInstall: [
      "Không còn updater official. Bản mới = tự build hoặc chờ zip microG mới.",
      "Nâng major không có kênh. Dirty chỉ khi cùng 21.x.",
      "IMS/VoLTE: xem quirk wiki.",
    ],
  },
};

export function getFlashGuide(slug: string): FlashGuide | undefined {
  return flashGuides[slug];
}

export const flashGuideSlugs = Object.keys(flashGuides);
