import type { TopicGuide } from "../types";
import { sources } from "./sources";

/**
 * LineageOS + Magisk + hotspot 6GHz (SoftAP) trên Pixel 7 Pro (cheetah).
 * Flash/root chi tiết nằm ở trang Lineage — trang này nối pipeline và phần SoftAP/region.
 */
export const hotspot6ghzGuide: TopicGuide = {
  title: "LineageOS + root + hotspot 6GHz",
  summary:
    "Pipeline Pixel 7 Pro (cheetah): unlock → flash LineageOS → Magisk (init_boot) → VPNHotspot ép band 6GHz. Nếu SoftAP vẫn khóa 6GHz, set mã vùng Wi‑Fi (ưu tiên VN sau Thông tư 01/2025/TT-BKHCN).",
  officialHref: sources.lineageInstall,
  officialLabel: "Wiki LineageOS cheetah",
  extraLinks: [
    { label: "Tải LineageOS cheetah", href: sources.lineageDownloads },
    { label: "Platform-tools (adb / fastboot)", href: sources.platformTools },
    { label: "Magisk Releases", href: sources.magiskReleases },
    { label: "VPNHotspot (Mygod)", href: sources.vpnHotspotRepo },
    { label: "Termux (F-Droid)", href: sources.termuxFDroid },
  ],
  warnings: [
    "Toàn bộ pipeline xóa dữ liệu máy và làm yếu verified boot. Sao lưu ảnh, danh bạ, 2FA, eSIM trước.",
    "Không khóa bootloader khi đang ở Lineage — có thể brick.",
    "Trên Tensor (Pixel 7 Pro) Magisk vá init_boot, không flash boot.img như hướng dẫn cũ cho máy khác.",
    "App ngân hàng / ví có thể từ chối máy đã root. Phù hợp máy phụ hơn là máy chính chứa dữ liệu nhạy cảm.",
    "Đổi mã vùng Wi‑Fi (đặc biệt sang US) chỉ là cấu hình SoftAP/regdb — vẫn nên hiểu công suất/băng thông theo chuẩn nước đó.",
  ],
  requirements: [
    "Đúng Pixel 7 Pro (cheetah), không phải Pixel 7 (panther).",
    "Pin ≥ 50%, cáp USB truyền dữ liệu, platform-tools mới từ Google.",
    "Đã gỡ tài khoản Google trên máy stock trước unlock (tránh FRP).",
    "Firmware stock Android 16 trước khi flash Lineage (wiki yêu cầu).",
    "Sau root: VPNHotspot + (nếu cần) Termux với quyền root để set region.",
  ],
  downloads: [
    {
      label: "Wiki cài LineageOS",
      href: sources.lineageInstall,
      detail: "Checklist official — thắng nếu lệnh trên trang này lệch wiki.",
    },
    {
      label: "Auto-flash script (cheetah)",
      href: sources.lineageAutoFlash,
      detail: "Tải nightly + flash phân vùng Tensor; Format data / Apply from ADB vẫn chọn tay.",
    },
    {
      label: "VPNHotspot Releases",
      href: sources.vpnHotspotReleases,
      detail: "APK ép band/kênh SoftAP (cần root).",
    },
    {
      label: "Termux trên F-Droid",
      href: sources.termuxFDroid,
      detail: "Khuyến nghị F-Droid; bản Play đã ngừng cập nhật.",
    },
  ],
  sections: [
    {
      id: "pipeline",
      title: "Pipeline cài đặt (đã có trên catalog)",
      intro:
        "Không lặp lại toàn bộ wiki ở đây. Làm lần lượt ba trang dưới — mỗi trang có lệnh đúng cho cheetah.",
      bullets: [
        "Unlock bootloader: `fastboot flashing unlock` (xóa sạch dữ liệu).",
        "Flash LineageOS: firmware A16 → flash boot/dtbo/vendor_kernel_boot/vendor_boot → sideload zip (hoặc auto-flash script).",
        "Root Magisk: patch init_boot của đúng nightly đang chạy, `fastboot flash init_boot magisk_patched_*.img`.",
      ],
      steps: [
        {
          title: "Mở khóa bootloader",
          body: "Bật OEM unlocking + USB debugging trên stock, gỡ Google, rồi unlock. Chi tiết và lệnh đầy đủ ở trang unlock.",
          commands: ["adb reboot bootloader", "fastboot flashing unlock"],
          note: "Trên màn hình máy: Volume chọn UNLOCK, Power xác nhận. Máy wipe và reboot.",
        },
        {
          title: "Flash LineageOS (cheetah)",
          body: "Dùng trang flash Lineage trên catalog (script auto-flash hoặc lệnh tay theo wiki). Đừng chỉ `fastboot flash boot recovery.img` — trên Tensor recovery official là vendor_boot kèm các image phụ.",
          note: "Wiki có thể yêu cầu thêm dtbo / vendor_kernel_boot tùy bản — đọc wiki một lượt trước khi flash.",
        },
        {
          title: "Root bằng Magisk (init_boot)",
          body: "Cài Magisk APK → patch init_boot lấy từ zip nightly đang chạy → flash init_boot (không phải boot). Xác nhận Magisk hiện Installed.",
          commands: [
            "adb reboot bootloader",
            "fastboot flash init_boot magisk_patched_XXXX.img",
            "fastboot reboot",
          ],
        },
      ],
      relatedHref: "/pixel-7-pro/cai-dat/lineageos",
      relatedLabel: "Mở hướng dẫn flash LineageOS (+ mục Magisk #root)",
    },
    {
      id: "vpnhotspot",
      title: "Cài VPNHotspot và ép 6GHz",
      intro:
        "Stock SoftAP thường không cho chọn band 6GHz thoải mái. VPNHotspot (root) mở cấu hình AP band / kênh.",
      steps: [
        {
          title: "Cài APK VPNHotspot",
          body: "Tải bản Releases từ GitHub Mygod/VPNHotspot, cài trên máy đã root. Cấp quyền root khi app hỏi.",
        },
        {
          title: "Cấu hình SoftAP 6GHz",
          body: "Mở app → icon Wi‑Fi góc trên phải. Chỉnh thông số gợi ý:",
          note: "Security: WPA3-SAE · AP Band: kênh trong dải 6GHz (ví dụ kênh 69 ≈ 6295 MHz) · Max Channel Bandwidth: 160 MHz · tắt Wi‑Fi 7, chỉ bật Wi‑Fi 6.",
        },
        {
          title: "Bật hotspot",
          body: "Bật toggle WiFi Hotspot trong app. Client phải hỗ trợ Wi‑Fi 6E (6GHz) mới thấy SSID.",
          note: "Nếu mục 6GHz xám / khóa: sang mục đổi region code bên dưới.",
        },
      ],
    },
    {
      id: "region",
      title: "Đổi mã vùng Wi‑Fi (nếu 6GHz vẫn khóa)",
      intro:
        "Việt Nam đã hợp pháp hóa WLAN 6GHz (5925–6425 MHz) theo Thông tư 01/2025/TT-BKHCN (hiệu lực 15/5/2025). Có hai tầng khóa khác nhau.",
      bullets: [
        "Tầng kernel (wireless-regdb): VN đã có trong database khoảng bản 2025.07.10 — kernel “biết” VN được 6GHz.",
        "Tầng SoftAP/Hotspot riêng của Google: danh sách tách biệt, cập nhật chậm hơn; chưa chắc VN đã có. Thử VN trước; nếu vẫn khóa mới cân nhắc mã đã unlock (ví dụ US) như dự phòng.",
        "Script đặt trong Magisk post-fs-data.d chạy lại mỗi lần boot.",
      ],
      steps: [
        {
          title: "Cài Termux (F-Droid) và vào root",
          body: "Cài Termux từ F-Droid (không dùng bản Play đã ngừng cập nhật). Mở Termux, cấp root:",
          commands: ["su"],
        },
        {
          title: "Cài iw",
          body: "Trong Termux (đã su hoặc trước khi su, tùy môi trường gói):",
          commands: ["pkg install root-repo", "pkg install iw"],
        },
        {
          title: "Tạo script post-fs-data (thử VN trước)",
          body: "Tạo file Magisk chạy sớm sau mount data. Ưu tiên mã VN vì đúng pháp lý hiện tại:",
          commands: [
            "printf '%s\\n' '#!/system/bin/sh' 'resetprop -n ro.boot.wificountrycode VN' 'iw reg set VN' > /data/adb/post-fs-data.d/set_region.sh",
            "chmod +x /data/adb/post-fs-data.d/set_region.sh",
            "reboot",
          ],
          note: "Nếu sau reboot VPNHotspot vẫn khóa 6GHz, sửa hai chỗ VN thành US (hoặc mã đã xác nhận unlock), chmod lại nếu cần, reboot. Đó là dự phòng SoftAP Google, không còn “chính danh” theo quốc gia bạn đang ở.",
        },
        {
          title: "Kiểm tra lại SoftAP",
          body: "Sau reboot, mở lại VPNHotspot và xem band 6GHz còn xám không. Client 6E kết nối thử.",
        },
      ],
    },
  ],
  notes: [
    "Phần cứng Wi‑Fi 6E trên Pixel 7 Pro chỉ mở SoftAP 6GHz khi stack phần mềm / mã vùng cho phép — cấu hình đúng mà vẫn fail thường là giới hạn vùng hoặc client không 6E.",
    "Chỉ đổi wificountrycode / `iw reg set` — không đụng mã vùng di động. Nếu LTE/SIM lỗi lạ sau bước này, xóa `/data/adb/post-fs-data.d/set_region.sh` rồi reboot để hoàn tác.",
    "Có thể thay VN/US bằng mã ISO 3166-1 alpha-2 khác nếu kernel regdb của quốc gia đó đã mở 6GHz; ưu tiên VN khi bạn ở Việt Nam.",
    "Wiki Lineage và Magisk docs thắng nếu lệnh flash/root trên trang này lệch snapshot.",
  ],
};
