import type { SwitchGuide } from "../types";

export const switchOverview = {
  summary:
    "V50 đã unlock thì không unlock lại. Việc quan trọng: KDZ đúng model, firmware A12 trước Lineage, và không dirty từ GSI sang Lineage.",
  rules: [
    "Cùng Lineage 21.x: dirty sideload (không format) nếu zip cùng nhánh.",
    "Đổi ROM / về stock: luôn format hoặc flash KDZ.",
    "Lineage wiki: đang ở custom ROM khác không chứng minh đã có firmware Android 12.",
    "Gỡ Google trên ROM cũ trước khi wipe (FRP).",
    "Không khóa bootloader.",
    "Dual Screen chỉ kỳ vọng trên stock LG.",
  ],
};

export const switchGuides: Record<string, SwitchGuide> = {
  "stock-lg": {
    summary:
      "Từ Lineage/GSI: Download mode + KDZ đúng model (LGUP). Wipe. Không khóa bootloader.",
    stockFirst: false,
    dirtyAllowed: false,
    cleanRequired: true,
    steps: [
      {
        title: "Gỡ Google trên ROM cũ",
        body: "Tránh FRP. Sao lưu.",
      },
      {
        title: "KDZ + LGUP",
        body: "Làm trang Flash LG UX. Đúng LM-V50xxxx. Refurbish nếu cần sạch.",
      },
    ],
    notes: [
      "Sau stock A12 mới tính Lineage. Crossflash nhà mạng khác rủi ro mạng.",
    ],
  },

  lineageos: {
    summary:
      "Từ stock hoặc ROM khác: firmware A12, Magisk stock, dd recovery Lineage, format, sideload. Dirty chỉ khi đã ở Lineage 21.x.",
    stockFirst: true,
    dirtyAllowed: true,
    cleanRequired: true,
    steps: [
      {
        title: "Từ stock / ROM khác",
        body: "KDZ Android 12 nếu không chắc firmware. Unlock + Magisk stock. Làm đủ trang Flash LineageOS — kể cả format. Không dirty GSI/Evo lên Lineage.",
      },
      {
        title: "Đang Lineage 21.x — dirty",
        body: "Recovery Lineage → Apply from ADB → sideload zip 21 mới. Không format. GApps đã có thì thường giữ.",
        commands: ["adb -d sideload lineage-21.0-*-flashlmdd.zip"],
      },
    ],
    notes: [
      "Official không còn nightly — dirty chỉ khi bạn tự build hoặc zip microG mới cùng 21.0.",
      "GApps lần đầu vẫn phải trước boot đầu (clean).",
    ],
  },
};
