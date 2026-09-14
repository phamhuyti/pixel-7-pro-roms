import type { SwitchGuide } from "../types";

export const switchOverview = {
  summary:
    "Đang ở custom ROM rồi thì gần như không cần unlock lại. Việc quan trọng là firmware, format data, và ROM nào bắt buộc về stock trước.",
  rules: [
    "Cùng một ROM, cùng nhánh Android lớn: dirty flash (sideload, không format) thường được maintainer cho phép.",
    "Đổi sang ROM khác: luôn clean flash — Format data / factory reset. Đừng dirty từ Evo sang Lineage hay ngược lại.",
    "GrapheneOS và CalyxOS: về stock bằng Android Flash Tool trước, rồi mới chạy installer và khóa bootloader.",
    "Lineage và nhiều fork: đang ở ROM khác không có nghĩa firmware Android 16 đã đủ. Không chắc thì flash stock A16 trước.",
    "Gỡ tài khoản Google trên ROM cũ trước khi wipe (FRP).",
    "Bootloader đã unlocked thì không chạy lại `fastboot flashing unlock`.",
    "Không khóa bootloader cho đến khi chắc chắn đang ở stock, Graphene, hoặc Calyx vừa cài xong.",
  ],
};

export const switchGuides: Record<string, SwitchGuide> = {
  "stock-pixel": {
    summary:
      "Từ bất kỳ custom ROM: Flash Tool hoặc factory image. GrapheneOS cần xóa AVB key trước.",
    stockFirst: false,
    dirtyAllowed: false,
    cleanRequired: true,
    steps: [
      {
        title: "Gỡ tài khoản Google trên ROM cũ",
        body: "Tránh FRP khi stock setup. Sao lưu, rồi Settings → gỡ Google.",
      },
      {
        title: "Nếu đang GrapheneOS: xóa AVB key",
        body: "Fastboot, unlocked:",
        commands: ["fastboot erase avb_custom_key"],
      },
      {
        title: "Flash stock và (khuyến nghị) khóa",
        body: "Làm đủ các bước trên trang Flash Pixel OS. Wipe. Khóa bootloader chỉ sau khi stock đã boot.",
      },
    ],
    notes: [
      "OTA stock sau đó để firmware mới nhất trước khi nhảy sang ROM khác.",
    ],
  },

  grapheneos: {
    summary:
      "Từ Lineage/Evo/crDroid/iodé: về stock trước (khuyến nghị), rồi web installer, rồi khóa. Đừng flash Graphene đè lên ROM recovery rồi khóa.",
    stockFirst: true,
    dirtyAllowed: false,
    cleanRequired: true,
    steps: [
      {
        title: "Về stock",
        body: "Android Flash Tool, wipe. Nếu từng Graphene trước đó, erase avb_custom_key. Setup Wi-Fi, bật lại OEM unlocking nếu công tắc cần.",
      },
      {
        title: "Chạy web installer GrapheneOS",
        body: "Làm trang Flash GrapheneOS: Fastboot → unlock (nếu đã unlock thì bỏ qua) → flash → lock.",
      },
    ],
    notes: [
      "Installer Graphene tự flash firmware. Stock trước để tránh trạng thái AVB/bootloader dở.",
    ],
  },

  calyxos: {
    summary:
      "Calyx official: đang ở custom ROM khác thì flash stock trước — Pixel có lỗi khiến khóa bootloader thất bại nếu bỏ bước này.",
    stockFirst: true,
    dirtyAllowed: false,
    cleanRequired: true,
    steps: [
      {
        title: "Flash stock",
        body: "flash.android.com, wipe. Gỡ Google trên ROM cũ trước.",
      },
      {
        title: "Cài Calyx rồi khóa",
        body: "Web installer hoặc device-flasher trên trang Flash CalyxOS. Khóa bootloader khi flasher xong.",
      },
    ],
    notes: [
      "FRP còn trên máy rồi khóa Calyx có thể không bật lại OEM unlocking.",
    ],
  },

  lineageos: {
    summary:
      "Từ ROM khác: firmware stock Android 16 mới nhất, flash recovery Lineage, format data, sideload. Dirty flash chỉ khi đã ở official Lineage 23.x.",
    stockFirst: true,
    dirtyAllowed: true,
    cleanRequired: true,
    steps: [
      {
        title: "Từ ROM khác (Evo, crDroid, iodé, …)",
        body: "Flash stock Android 16 mới nếu không chắc firmware. Rồi làm đủ trang Flash LineageOS — kể cả format data. Không dirty từ ROM khác.",
      },
      {
        title: "Đang official Lineage 23.x — dirty",
        body: "Recovery Lineage → Apply from ADB → sideload nightly mới. Không format. Nâng major (22→23) phải sideload tay, updater không làm.",
        commands: ["adb -d sideload lineage-*.zip"],
      },
    ],
    notes: [
      "GApps: đã có thì dirty thường giữ. Cài GApps lần đầu vẫn phải trước boot đầu — tức là chỉ khi clean.",
    ],
  },

  "evolution-x": {
    summary:
      "Từ ROM khác: clean flash (format). Đang Evo A16: dirty sideload hoặc OTA. Không khóa bootloader.",
    stockFirst: false,
    dirtyAllowed: true,
    cleanRequired: true,
    steps: [
      {
        title: "Từ ROM khác",
        body: "Không chắc firmware thì stock A16 trước. Flash 4 image Evo, recovery, Format data, sideload zip. Đúng bản GApps/vanilla và Android 16.",
      },
      {
        title: "Đang Evolution X — dirty / OTA",
        body: "Recovery → Apply from ADB → sideload zip mới, không format. Hoặc Settings updater.",
        commands: ["adb sideload rom.zip"],
      },
    ],
    notes: ["Wiki Evo: không khóa bootloader khi đang ở Evo."],
  },

  crdroid: {
    summary:
      "Từ ROM khác: firmware Pixel mới, vendor_boot crDroid, sideload, factory reset. Đang crDroid 12: dirty hoặc OTA.",
    stockFirst: false,
    dirtyAllowed: true,
    cleanRequired: true,
    steps: [
      {
        title: "Từ ROM khác",
        body: "Làm clean flash trên trang Flash crDroid — kể cả Factory reset ở cuối. Đừng sideload crDroid đè Evo/LOS rồi bỏ format.",
      },
      {
        title: "Đang crDroid 12 — dirty",
        body: "adb reboot recovery → sideload zip. Recovery hỏi đổi slot cho GApps/Magisk: Yes nếu bạn từng cài. Không factory reset.",
        commands: [
          "adb reboot recovery",
          "adb sideload zip_name.zip",
        ],
      },
    ],
    notes: ["OTA Updater giữ GApps/Magisk nếu đã có."],
  },

  "infinity-x": {
    summary:
      "Bản official kèm firmware. Từ ROM khác: flash 4 IMG + format + sideload. Đang Infinity-X: dirty hoặc OTA.",
    stockFirst: false,
    dirtyAllowed: true,
    cleanRequired: true,
    steps: [
      {
        title: "Từ ROM khác",
        body: "Làm first-time trên trang Flash Infinity-X, có Format data. File IMG + zip cùng nhánh 16.",
      },
      {
        title: "Đang Infinity-X — dirty",
        body: "Recovery → sideload zip mới, không format. Hoặc updater trong Settings.",
        commands: ["adb sideload romname.zip"],
      },
    ],
    notes: ["Magisk: sau dirty thường phải Direct Install lại trong app nếu OTA ghi đè init_boot."],
  },

  iodeos: {
    summary:
      "Từ ROM khác: bootloader đã unlock, chạy lại installer iodé. Clean — installer wipe. Không dirty từ Lineage sang iodé.",
    stockFirst: false,
    dirtyAllowed: false,
    cleanRequired: true,
    steps: [
      {
        title: "Installer lại từ Fastboot",
        body: "Gỡ Google trên ROM cũ. Fastboot Mode, chạy installer official, chọn đúng Pixel 7 Pro. Để installer wipe.",
      },
      {
        title: "Cài tay",
        body: "Nếu installer kẹt, dùng mục Manually trên iode.tech — không sideload zip Lineage lên iodé.",
      },
    ],
    notes: ["Cập nhật iodé: updater của iodé, không dirty zip LOS."],
  },

  "e-os": {
    summary:
      "Từ ROM khác: khớp firmware với bản /e/ (A15 hay A16), chạy factory script cheetah, wipe. Không dirty từ LOS/Evo.",
    stockFirst: true,
    dirtyAllowed: false,
    cleanRequired: true,
    steps: [
      {
        title: "Khớp stock / firmware",
        body: "Đọc trang thiết bị /e/ hôm nay. Flash stock đúng Android nếu doc yêu cầu, rồi factory script.",
      },
      {
        title: "Chạy flash_*_factory",
        body: "Fastboot unlocked, script trong gói official cheetah. Không dùng script panther.",
      },
    ],
    notes: ["OTA /e/ sau đó, không sideload zip Lineage."],
  },
};

export function getSwitchGuide(slug: string): SwitchGuide | undefined {
  return switchGuides[slug];
}
