import { sources } from "./sources";
import type { UnlockGuide } from "../types";

export const unlockGuide: UnlockGuide = {
  title: "Mở khóa bootloader Pixel 7 Pro",
  summary:
    "Mọi custom ROM trên Pixel 7 Pro đều cần bootloader đã mở. Lệnh official là `fastboot flashing unlock` — không phải `fastboot oem unlock`. Bước này xóa toàn bộ dữ liệu trên máy.",
  officialHref: sources.lineageInstall,
  officialLabel: "Wiki LineageOS (mục Unlocking the bootloader)",
  extraLinks: [
    { label: "Platform-tools (adb / fastboot)", href: sources.platformTools },
    { label: "USB driver Windows", href: sources.googleUsbDriver },
  ],
  warnings: [
    "Unlock xóa sạch nội bộ: ảnh, app, tài khoản, eSIM đang cài trên máy. Sao lưu xong mới làm.",
    "Máy nhà mạng (đặc biệt Verizon Mỹ) thường khóa OEM unlocking. Trang này không hướng dẫn ép unlock máy bị nhà mạng khóa.",
    "OEM unlocking có thể xám cho đến khi máy online và hoàn tất setup stock lần đầu.",
    "Bootloader mở làm yếu verified boot. Chỉ khóa lại nếu ROM cho phép (stock, GrapheneOS, CalyxOS).",
    "Khóa bootloader khi đang ở Lineage / Evolution X / crDroid / Infinity-X / iodéOS / /e/OS có thể brick.",
  ],
  requirements: [
    "Đúng máy Pixel 7 Pro (cheetah), không phải Pixel 7 (panther).",
    "Cáp USB truyền dữ liệu. Cắm thẳng vào máy tính, tránh hub/cổng trước case.",
    "Pin trên 50%.",
    "Đã gỡ tài khoản Google trên máy (tránh Factory Reset Protection khi setup ROM mới).",
    "platform-tools mới từ Google, không dùng bản adb rời cũ.",
  ],
  steps: [
    {
      title: "Sao lưu và gỡ tài khoản Google",
      body: "Sao lưu ảnh, tin nhắn, mã 2FA, danh bạ. Xuất hoặc ghi lại eSIM với nhà mạng. Vào Cài đặt → Mật khẩu và tài khoản, gỡ mọi tài khoản Google trước khi unlock.",
    },
    {
      title: "Cài adb và fastboot",
      body: "Tải Android SDK Platform-Tools, giải nén, mở terminal trong thư mục đó (hoặc thêm vào PATH). Trên Linux, cài thêm gói udev để USB nhận máy khi không chạy root.",
      commands: [
        "sudo apt install android-sdk-platform-tools-common   # Debian / Ubuntu",
        "sudo pacman -S android-udev                         # Arch",
      ],
      note: "Windows 10/11 thường nhận Pixel 7 Pro ở Fastboot qua Windows Update (gói tùy chọn, đôi khi hiện tên LeMobile Android Device). Nếu không, cài Google USB Driver.",
    },
    {
      title: "Bật Developer options và OEM unlocking",
      body: "Cài đặt → Giới thiệu điện thoại → chạm Số bản dựng 7 lần. Rồi Cài đặt → Hệ thống → Tùy chọn nhà phát triển → bật Mở khóa OEM và Gỡ lỗi USB. Máy phải có mạng nếu công tắc OEM unlocking bị xám.",
    },
    {
      title: "Kiểm tra adb thấy máy",
      body: "Cắm cáp, cho phép gỡ lỗi USB trên màn hình điện thoại, rồi chạy:",
      commands: ["adb devices"],
      note: "Phải thấy serial và chữ device. unauthorized = chưa bấm Cho phép trên điện thoại.",
    },
    {
      title: "Vào Fastboot Mode",
      body: "Từ máy đang bật:",
      commands: ["adb reboot bootloader"],
      note: "Hoặc tắt máy, giữ Volume xuống + nguồn đến khi thấy tam giác và chữ Fastboot Mode. Đừng bấm Start.",
    },
    {
      title: "Kiểm tra fastboot thấy máy",
      body: "Trong terminal:",
      commands: ["fastboot devices"],
      note: "Không có output: đổi cáp, đổi cổng USB, cài driver, trên Linux thử lại sau khi cài udev. Không dùng máy ảo nếu có thể.",
    },
    {
      title: "Mở khóa bootloader",
      body: "Chạy lệnh Pixel official. Máy hiện menu; chọn UNLOCK THE BOOTLOADER bằng volume, xác nhận bằng nguồn. Toàn bộ dữ liệu bị xóa.",
      commands: ["fastboot flashing unlock"],
    },
    {
      title: "Khởi động lại và setup stock",
      body: "Nếu máy không tự reboot, chọn Start trên Fastboot. Setup Wi-Fi, bỏ qua khôi phục nếu không cần. Bật lại Developer options và Gỡ lỗi USB — OEM unlocking thường xám sau khi đã unlock, đó là bình thường.",
    },
  ],
  afterUnlock: [
    "Trong Fastboot, dòng Device State phải là unlocked.",
    "Mỗi lần boot có thể hiện cảnh báo bootloader unlocked — không tắt được trên hầu hết ROM recovery.",
    "Tiếp theo: flash ROM còn sống, hoặc quay lại stock nếu chỉ muốn thử unlock.",
    "GrapheneOS và CalyxOS: web/device flasher có thể tự unlock trong lúc cài. Bạn vẫn cần bật OEM unlocking trước.",
  ],
  cannotUnlock: [
    "OEM unlocking không bật được dù đã online và setup xong — thường là máy nhà mạng khóa.",
    "`fastboot flashing unlock` bị từ chối hoặc không hiện menu xác nhận.",
    "Không tìm hướng dẫn “force unlock” hay bypass FRP của máy người khác. Trả máy / đổi máy carrier-unlocked.",
  ],
};
