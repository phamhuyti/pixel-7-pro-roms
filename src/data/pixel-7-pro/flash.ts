import { liveRoms } from "./roms";
import { sources } from "./sources";
import type { FlashGuide } from "../types";

const sharedWipe = "Unlock và flash factory/sideload lần đầu xóa dữ liệu nội bộ.";

const sharedCable =
  "Dùng cáp data, cổng USB thẳng. Nhiều lỗi fastboot là cáp hoặc hub, không phải ROM.";

const rootPointer =
  "Magisk / KernelSU: xem mục Root trên trang này. Không có hướng dẫn giả Play Integrity.";

const noRelockFeature =
  "Không chạy `fastboot flashing lock` khi đang ở ROM này — brick. Chỉ khóa lại sau khi flash stock, GrapheneOS, hoặc CalyxOS.";

export const flashGuides: Record<string, FlashGuide> = {
  "stock-pixel": {
    method: "stock-web",
    officialHref: sources.flashAndroid,
    officialLabel: "Android Flash Tool",
    extraLinks: [
      { label: "Factory image cheetah", href: sources.factoryCheetah },
      { label: "GrapheneOS: gỡ AVB key trước khi về stock", href: sources.grapheneWeb },
    ],
    summary:
      "Flash lại Pixel OS official khi muốn daily stock, sửa firmware trước Lineage-fork, hoặc khóa bootloader an toàn sau custom ROM.",
    relock: "recommended",
    firmwareNote:
      "Chọn bản factory/OTA mới nhất cho Pixel 7 Pro. Lineage và nhiều fork yêu cầu firmware stock Android 16 trước khi cài ROM.",
    requirements: [
      "Bootloader đã mở nếu máy đang ở custom ROM.",
      "Trình duyệt Chromium (Chrome, Edge, Vanadium) cho flash.android.com.",
      "Cáp USB data, pin trên 50%.",
    ],
    warnings: [
      sharedWipe,
      "Khóa bootloader chỉ sau khi flash xong stock (hoặc Graphene/Calyx). Khóa khi còn ROM khác = brick.",
      "Nếu đang ở GrapheneOS, xóa AVB custom key trước khi flash stock rồi mới khóa.",
      rootPointer,
    ],
    downloads: [
      {
        label: "Android Flash Tool",
        href: sources.flashAndroid,
        detail: "Cách được khuyến nghị: chọn Pixel 7 Pro, wipe, flash.",
      },
      {
        label: "Factory images",
        href: sources.factoryCheetah,
        detail: "Phương án thủ công: giải nén và chạy flash-all.",
      },
    ],
    steps: [
      {
        title: "Nếu đang ở GrapheneOS: xóa verified boot key",
        body: "Vào Fastboot (Volume xuống + nguồn). Bootloader phải unlocked. Xóa key Graphene trước khi flash stock, nếu không máy chưa sạch trạng thái nhà máy.",
        commands: ["fastboot erase avb_custom_key"],
        note: "Bỏ qua bước này nếu bạn không từng cài GrapheneOS.",
      },
      {
        title: "Flash stock bằng Android Flash Tool",
        body: "Mở flash.android.com trên Chrome/Edge, cho phép WebUSB, chọn Pixel 7 Pro (cheetah). Bật xóa dữ liệu. Để installer flash firmware và OS. Đợi xong, đừng rút cáp giữa chừng.",
      },
      {
        title: "Hoặc flash factory image thủ công",
        body: "Tải factory image cheetah, giải nén, chạy script official trong thư mục đó. Script xóa dữ liệu nếu bạn không sửa cờ wipe.",
        commands: [
          "./flash-all.sh          # Linux / macOS",
          "flash-all.bat           # Windows",
        ],
      },
      {
        title: "Khóa bootloader (khuyến nghị trên stock)",
        body: "Sau khi máy boot stock ổn, quay lại Fastboot rồi khóa. Máy xóa dữ liệu lần nữa.",
        commands: ["fastboot flashing lock"],
        note: "Chỉ khóa khi chắc chắn đang ở stock (hoặc Graphene/Calyx vừa cài xong theo guide của họ).",
      },
    ],
    afterInstall: [
      "Setup Google, kiểm tra cuộc gọi, SMS, Wi-Fi, eSIM.",
      "Cập nhật OTA đến bản mới nhất trước khi flash ROM khác — Lineage yêu cầu firmware Android 16 mới.",
      "Device State: locked nếu bạn đã khóa lại.",
    ],
  },

  grapheneos: {
    method: "web-installer",
    officialHref: sources.grapheneWeb,
    officialLabel: "Web installer GrapheneOS",
    extraLinks: [
      { label: "Cài bằng dòng lệnh", href: sources.grapheneCli },
      { label: "Releases", href: sources.grapheneReleases },
    ],
    summary:
      "Cách official là web installer (WebUSB). Flasher tự flash firmware + OS. Sau đó khóa bootloader — đây là ROM cần khóa lại để verified boot có ý nghĩa.",
    relock: "required",
    firmwareNote:
      "Nên cập nhật stock trước. Graphene vẫn flash firmware mới sớm trong quá trình cài.",
    requirements: [
      "OEM unlocking đã bật trong stock.",
      "Chrome, Edge, Brave (tắt Shields), Vanadium hoặc Chromium — không dùng Firefox, không Incognito.",
      "Không dùng Snap/Flatpak browser, không cài từ máy ảo nếu có thể.",
      "Khoảng 2 GB RAM trống và 32 GB ổ trống trên máy tính.",
      "Linux: gói udev (android-sdk-platform-tools-common hoặc android-udev). Tạm dừng fwupd nếu USB bị chiếm.",
    ],
    warnings: [
      sharedWipe + " Khóa bootloader Graphene xóa dữ liệu lần nữa.",
      "Chỉ cài từ grapheneos.org. Không dùng bản Telegram “Graphene mod”.",
      "Máy nhà mạng có thể không unlock được.",
      sharedCable,
      rootPointer,
    ],
    downloads: [
      {
        label: "Web installer",
        href: sources.grapheneWeb,
        detail: "Khuyến nghị. Tải factory image ngay trên trang đó.",
      },
      {
        label: "Hướng dẫn CLI",
        href: sources.grapheneCli,
        detail: "Cùng factory image, dành cho người quen terminal.",
      },
    ],
    steps: [
      {
        title: "Bật OEM unlocking",
        body: "Làm đúng các bước trên trang Mở khóa bootloader. Web installer có thể gửi lệnh unlock — bạn vẫn phải bật công tắc OEM unlocking trước.",
      },
      {
        title: "Vào Fastboot Mode",
        body: "Reboot và giữ Volume xuống đến khi thấy tam giác đỏ và chữ Fastboot Mode. Đừng bấm Start. Cắm cáp thẳng vào máy tính.",
      },
      {
        title: "Unlock trên web installer",
        body: "Mở grapheneos.org/install/web, kết nối WebUSB, bấm Unlock bootloader. Trên máy chọn UNLOCK THE BOOTLOADER (volume + nguồn).",
      },
      {
        title: "Tải và flash factory image",
        body: "Chọn đúng Pixel 7 Pro (cheetah) trên installer. Bấm tải rồi Flash release. Không đụng máy cho đến khi script báo xong — installer tự reboot Fastboot giữa chừng.",
      },
      {
        title: "Khóa bootloader",
        body: "Vẫn ở Fastboot, bấm Lock bootloader trên trang. Xác nhận LOCK THE BOOTLOADER trên máy. Dữ liệu bị xóa lần nữa. Đây là bước bắt buộc để verified boot Graphene hoạt động.",
      },
      {
        title: "Boot lần đầu",
        body: "Chọn Start. Setup: nên để tắt OEM unlocking ở màn cuối. Có thể đối chiếu hash verified boot trên màn hình vàng lúc boot.",
        note: "Hash snapshot Pixel 7 Pro: bc1c0dd95664604382bb888412026422742eb333071ea0b2d19036217d49182f. Đối chiếu grapheneos.org/install hôm cài — hash đổi theo bản.",
      },
    ],
    afterInstall: [
      "Play Services là tùy chọn (sandbox), không cài sẵn như stock.",
      "Auditor app trên máy thứ hai nếu bạn cần attestation.",
      "Về stock sau này: Fastboot unlocked → `fastboot erase avb_custom_key` → flash.android.com → khóa.",
    ],
  },

  calyxos: {
    method: "web-installer",
    officialHref: sources.calyxInstall,
    officialLabel: "Cài CalyxOS cho Pixel 7 Pro",
    extraLinks: [
      { label: "Windows (device-flasher)", href: sources.calyxWindows },
      { label: "Linux (device-flasher)", href: sources.calyxLinux },
      { label: "Lỗi khóa bootloader Pixel", href: sources.pixelBootloaderIssue },
    ],
    summary:
      "Khuyến nghị web installer (Chromium + WebUSB). Device-flasher trên Windows/Linux là phương án hai. CalyxOS được thiết kế để khóa bootloader sau khi cài.",
    relock: "recommended",
    firmwareNote:
      "Đang ở custom ROM khác: flash stock bằng flash.android.com trước. Pixel có lỗi bootloader khiến khóa lại thất bại nếu bỏ qua bước này.",
    requirements: [
      "OEM unlocking đã bật, máy đã online.",
      "Gỡ tài khoản Google trước (FRP). Nếu flash rồi khóa khi còn FRP, có thể không bật lại OEM unlocking.",
      "Web installer: Chrome / Edge / Brave. Device-flasher không hỗ trợ macOS — dùng web.",
      "Cùng thư mục: file factory image cheetah (để nguyên zip) và device-flasher nếu đi đường CLI.",
    ],
    warnings: [
      sharedWipe,
      "Flash nhầm factory image máy khác sẽ brick.",
      "Từ ROM khác → stock trước khi mong khóa bootloader (issue tracker Google).",
      sharedCable,
      rootPointer,
    ],
    downloads: [
      {
        label: "Trang cài cheetah",
        href: sources.calyxInstall,
        detail: "Chọn Install from Browser nếu có.",
      },
      {
        label: "Device-flasher Windows",
        href: sources.calyxWindows,
        detail: "Tải device-flasher.exe + factory image cheetah, đối chiếu SHA256 trên trang đó.",
      },
      {
        label: "Device-flasher Linux",
        href: sources.calyxLinux,
        detail: "Cài udev, chmod +x device-flasher.linux, để zip factory cạnh binary.",
      },
    ],
    steps: [
      {
        title: "Chuẩn bị máy",
        body: "Bật OEM unlocking. Máy mới mua nhà mạng: rút SIM trước lần boot đầu. Đang ở ROM khác: flash stock rồi setup đủ để bật OEM unlocking.",
      },
      {
        title: "Cài bằng trình duyệt (khuyến nghị)",
        body: "Mở trang cài Pixel 7 Pro, chọn Install from Browser. Cho phép WebUSB, làm đúng từng màn. Khi hiện unlock: volume chọn UNLOCK THE BOOTLOADER, nguồn xác nhận.",
      },
      {
        title: "Hoặc device-flasher trên Windows",
        body: "Cài Google USB Driver. Tải device-flasher.exe và factory image cheetah vào cùng thư mục — không giải nén zip. Chạy device-flasher, làm theo chữ trên terminal.",
      },
      {
        title: "Hoặc device-flasher trên Linux",
        body: "Cài gói udev rồi chạy flasher trong thư mục có factory image.",
        commands: [
          "sudo apt install android-sdk-platform-tools-common",
          "chmod +x device-flasher.linux",
          "./device-flasher.linux",
        ],
      },
      {
        title: "Khóa bootloader",
        body: "Flasher official thường khóa giúp. Nếu không, khóa khi Fastboot báo đang ở Calyx vừa flash — không khóa nếu flash lỗi dở.",
        commands: ["fastboot flashing lock"],
      },
    ],
    afterInstall: [
      "OTA tự động trở lại từ CalyxOS 7.2.2.",
      "Fastboot “Device State: locked” = đã khóa.",
      "Về stock: xem hướng dẫn Pixel OS trên trang này.",
    ],
  },

  lineageos: {
    method: "web-installer",
    officialHref: sources.lineageWebInstall,
    officialLabel: "Web installer LineageOS",
    extraLinks: [
      { label: "Wiki cài LineageOS cheetah", href: sources.lineageInstall },
      { label: "Tải nightly + recovery", href: sources.lineageDownloads },
      { label: "Cập nhật firmware", href: sources.lineageFirmware },
      { label: "GApps (MindTheGapps arm64)", href: sources.lineageGapps },
      { label: "Auto-flash script (CLI)", href: sources.lineageAutoFlash },
    ],
    summary:
      "Giống GrapheneOS: web installer WebUSB (unlock + flash recovery images). Mirror Lineage không CORS — installer proxy tải vào cache IndexedDB + SHA256; zip ROM sideload qua recovery. Có thêm script CLI one-shot. Firmware stock Android 16 bắt buộc. Không khóa bootloader.",
    relock: "forbidden",
    firmwareNote:
      "Wiki: cần stock Android 16, bản vá mới nhất. Đang ở custom ROM khác (kể cả Lineage unofficial) không có nghĩa firmware đã đủ. Không chắc thì flash stock trước. Web installer / script không flash stock giúp bạn.",
    requirements: [
      "Bootloader sẽ unlock trên web installer (hoặc đã unlock — xem trang Mở khóa bootloader).",
      "Chrome / Edge / Brave / Vanadium — WebUSB; không Firefox, không Incognito.",
      "Đã boot stock ít nhất một lần; kiểm tra gọi/SMS/LTE nếu bạn cần chúng trên Lineage.",
      "Web: bấm Tải vào cache (proxy same-origin) hoặc tải 5 file cùng nightly rồi nạp (đối chiếu SHA256).",
      "CLI (tuỳ chọn): platform-tools + python3 + curl|wget cho script auto-flash.",
    ],
    warnings: [
      sharedWipe,
      noRelockFeature,
      "Installer / script chỉ chấp nhận product=cheetah và bootloader unlocked — đừng ép máy khác.",
      "Flash recovery lạ thay vendor_boot Lineage thường làm sideload hỏng.",
      "GApps (nếu dùng) phải sideload trước lần boot hệ thống đầu tiên.",
      rootPointer,
    ],
    downloads: [
      {
        label: "Web installer (WebUSB)",
        href: sources.lineageWebInstall,
        detail:
          "Kiểu grapheneos.org/install/web: Unlock → Tải vào cache (proxy) + SHA256 → Flash boot/dtbo/vendor_kernel_boot/vendor_boot → Auto sideload (chờ Format data / Apply from ADB trên recovery).",
      },
      {
        label: "Auto-flash script (cheetah)",
        href: "/tools/lineageos-cheetah-flash.sh",
        detail:
          "Tải nightly từ API official, đối chiếu SHA256, flash image, sideload zip. Format data / Apply from ADB chọn tay trên recovery.",
      },
      {
        label: "Wiki cài đặt",
        href: sources.lineageInstall,
        detail: "Nguồn bước chính thức — đọc một lượt trước khi flash (wiki thắng nếu lệch).",
      },
      {
        label: "Tải cheetah",
        href: sources.lineageDownloads,
        detail: "Bỏ qua file không được wiki nêu (init_boot, vbmeta, …).",
      },
    ],
    steps: [
      {
        title: "Đúng firmware stock Android 16",
        body: "Nếu không chắc, flash stock bằng Android Flash Tool rồi mới tiếp. Wiki không hướng dẫn up/downgrade tại chỗ. Web installer / script giả định firmware đã đúng.",
      },
      {
        title: "Cách khuyến nghị: Web installer (như GrapheneOS)",
        body: "Mở trang Web installer LineageOS trên catalog này. Chrome/Edge: USB debugging → adb reboot bootloader → Unlock (nếu cần) → Tải vào cache (hoặc nạp file) + SHA256 → Flash recovery images → Auto sideload (chờ Format data / Apply from ADB, rồi gửi zip qua WebUSB ADB).",
        note: "Khác GrapheneOS: không flash hết OS trong một factory zip, và không khóa bootloader.",
      },
      {
        title: "Hoặc auto-flash script (CLI)",
        body: "Linux / macOS / WSL: tải script, chmod +x, cắm máy đã unlock. Script tải nightly, kiểm tra product=cheetah, flash image, nhắc Format data / Apply from ADB, rồi sideload.",
        commands: [
          "chmod +x lineageos-cheetah-flash.sh",
          "./lineageos-cheetah-flash.sh",
          "./lineageos-cheetah-flash.sh --gapps MindTheGapps-arm64-*.zip",
          "./lineageos-cheetah-flash.sh --download-only",
        ],
        note: "Không dùng --yes trừ khi bạn chấp nhận wipe không hỏi lại. Wiki Lineage thắng nếu lệnh script lệch wiki.",
      },
      {
        title: "Hoặc flash tay — phân vùng phụ",
        body: "Tải boot.img, dtbo.img, vendor_kernel_boot.img từ trang download. Vào Fastboot rồi flash đúng tên file bạn vừa tải.",
        commands: [
          "fastboot flash boot boot.img",
          "fastboot flash dtbo dtbo.img",
          "fastboot flash vendor_kernel_boot vendor_kernel_boot.img",
          "fastboot reboot bootloader",
        ],
      },
      {
        title: "Flash Lineage Recovery",
        body: "File recovery official tên vendor_boot.img. Flash xong, trên Fastboot chọn Recovery. Phải thấy logo Lineage — nếu không, làm lại mục này.",
        commands: ["fastboot flash vendor_boot vendor_boot.img"],
      },
      {
        title: "Format data",
        body: "Trong recovery: Factory reset → Format data / factory reset. Xóa mã hóa và dữ liệu nội bộ. Quay về menu chính. Chưa reboot hệ thống.",
      },
      {
        title: "Sideload LineageOS",
        body: "Apply update → Apply from ADB. Trên máy tính:",
        commands: ["adb -d sideload lineage-*.zip"],
        note: "Signature fail = file hỏng hoặc không phải bản official. adb dừng ~47% kèm “failed to read command: Success” vẫn có thể thành công — xem thông báo trên recovery.",
      },
      {
        title: "GApps tùy chọn (trước boot đầu)",
        body: "Nếu muốn Google: recovery hỏi reboot recovery để cài add-on → Yes. Sideload MindTheGapps kiến trúc arm64. Chữ Signature verification failed với GApps là bình thường — chọn Yes. Script: thêm --gapps đường-dẫn-zip.",
        commands: ["adb -d sideload MindTheGapps-*.zip"],
      },
      {
        title: "Reboot hệ thống",
        body: "Back → Reboot system now. Boot đầu thường dưới 15 phút. Đừng root hay gỡ system app theo hướng dẫn lạ.",
      },
    ],
    afterInstall: [
      "Nâng major (ví dụ 22 → 23) phải sideload tay; updater app không làm giúp.",
      "Cập nhật nightly: recovery + sideload hoặc updater, đọc wiki update.",
      "Device integrity trên wiki là quirk đã biết. Banking/Wallet không phải thế mạnh.",
    ],
  },

  "evolution-x": {
    method: "recovery-sideload",
    officialHref: sources.evolutionX,
    officialLabel: "Trang máy Evolution X (cheetah)",
    extraLinks: [
      { label: "Wiki cài đặt chung", href: "https://wiki.evolution-x.org/installing-evolution-x" },
    ],
    summary:
      "Flash 4 image recovery Tensor rồi sideload zip. Bản GApps và vanilla đều có — đừng nhầm Android 15. Không khóa bootloader.",
    relock: "forbidden",
    firmwareNote:
      "Làm theo ghi chú firmware trên trang máy / How to install. Không chắc thì flash stock Android 16 trước.",
    requirements: [
      "Bootloader đã unlock.",
      "Từ evolution-x.org/devices/cheetah: ROM zip Android 16 + boot.img, dtbo.img, vendor_kernel_boot.img, vendor_boot.img.",
    ],
    warnings: [
      sharedWipe,
      noRelockFeature,
      "Wiki Evolution X: DO NOT RELOCK YOUR BOOTLOADER khi đang ở Evo X.",
      "Chọn đúng gói GApps hoặc vanilla. Bản Android 15 còn trên trang — không flash nhầm.",
      rootPointer,
    ],
    downloads: [
      {
        label: "Tải cheetah official",
        href: sources.evolutionX,
        detail: "Mục How to install trên trang máy thắng wiki chung nếu khác nhau.",
      },
    ],
    steps: [
      {
        title: "Tải đủ file",
        body: "ROM 11.x Android 16 cho cheetah, cộng bốn image cùng build. Không dùng file reupload.",
      },
      {
        title: "Flash recovery Evolution X",
        body: "Vào Fastboot rồi flash bốn phân vùng, sau đó vào recovery.",
        commands: [
          "fastboot flash boot boot.img",
          "fastboot flash dtbo dtbo.img",
          "fastboot flash vendor_kernel_boot vendor_kernel_boot.img",
          "fastboot flash vendor_boot vendor_boot.img",
          "fastboot reboot recovery",
        ],
      },
      {
        title: "Format data",
        body: "Factory reset → Format data / factory reset. Quay menu chính.",
      },
      {
        title: "Sideload ROM",
        body: "Apply update → Apply from ADB. Thay tên file cho đúng zip bạn tải.",
        commands: ["adb sideload rom.zip"],
        note: "Build userdebug có thể dừng sideload quanh 47%. Xem recovery, không rút cáp sớm.",
      },
      {
        title: "Reboot hệ thống",
        body: "Không sideload add-on lạ. Reboot system. Boot đầu chậm hơn bình thường.",
      },
    ],
    afterInstall: [
      "Bản GApps đã có Play; bản vanilla thì không.",
      "Cập nhật: OTA trong Settings, hoặc sideload zip mới từ recovery (dirty flash).",
    ],
  },

  crdroid: {
    method: "recovery-sideload",
    officialHref: sources.crdroidInstall,
    officialLabel: "Hướng dẫn cài crDroid 12 cheetah",
    extraLinks: [{ label: "Tải crDroid 12", href: sources.crdroid }],
    summary:
      "Theo crdroid.net: firmware Pixel mới nhất, flash vendor_boot recovery, sideload zip, đổi slot nếu cài GApps, rồi factory reset. Không khóa bootloader.",
    relock: "forbidden",
    firmwareNote: "Trang cài: phải đang ở firmware Pixel mới nhất. Dùng Android Flash Tool nếu chưa.",
    requirements: [
      "Bootloader đã unlock.",
      "Đã xóa tài khoản Google trên máy (tránh FRP).",
      "vendor_boot.img recovery từ nút Recovery trên trang tải cheetah 12.",
      "Zip crDroid 12.x và GApps (trang máy chỉ SourceForge) nếu bạn muốn Play.",
    ],
    warnings: [
      sharedWipe,
      noRelockFeature,
      "Làm đúng thứ tự official: sideload ROM trước, factory reset sau — khác Lineage.",
      "Đừng tiếp tục nếu một lệnh fail.",
      rootPointer,
    ],
    downloads: [
      {
        label: "Install crDroid 12",
        href: sources.crdroidInstall,
        detail: "Nguồn bước cho máy này.",
      },
      {
        label: "Download cheetah 12",
        href: sources.crdroid,
        detail: "ZIP + recovery vendor_boot.img.",
      },
    ],
    steps: [
      {
        title: "Vào Fastboot và flash recovery",
        body: "Mở terminal trong thư mục có vendor_boot.img.",
        commands: [
          "adb reboot bootloader",
          "fastboot flash vendor_boot vendor_boot.img",
        ],
        note: "fastboot ghi recovery vào slot đang active.",
      },
      {
        title: "Vào crDroid Recovery",
        body: "Dùng volume chọn Recovery Mode, nguồn xác nhận.",
      },
      {
        title: "Sideload crDroid",
        body: "Apply update → Apply from ADB. Thay zip_name bằng tên file thật.",
        commands: ["adb sideload zip_name.zip"],
      },
      {
        title: "GApps tùy chọn",
        body: "Hết ROM, recovery hỏi chuyển slot đối diện để flash GApps. Chọn Yes nếu bạn có GApps. Sideload GApps sau khi đã ở recovery slot mới.",
        commands: ["adb sideload gapps.zip"],
      },
      {
        title: "Factory reset rồi reboot",
        body: "Reboot vào recovery một lần nữa, Factory reset, rồi Reboot system. Đây là clean flash official.",
      },
    ],
    afterInstall: [
      "Dirty flash / OTA: Settings → System → Updater. GApps đã cài được giữ.",
      "Tùy biến nhiều — đọc changelog weekly trước khi dirty flash.",
    ],
  },

  "infinity-x": {
    method: "recovery-sideload",
    officialHref: sources.infinityFlash,
    officialLabel: "Flash guide official (cheetah)",
    extraLinks: [
      { label: "Tải ROM", href: sources.infinityDownloads },
      { label: "Thư mục IMG", href: sources.infinityImgs },
      { label: "Changelog", href: sources.infinityChangelog },
    ],
    summary:
      "Guide official_devices: bản này kèm firmware. Flash boot/dtbo/vendor_kernel_boot/vendor_boot, format, sideload zip. Không khóa bootloader.",
    relock: "forbidden",
    firmwareNote: "Flash guide ghi “These releases include firmware”. Vẫn đối chiếu changelog nếu bạn đến từ ROM rất cũ.",
    requirements: [
      "Bootloader đã unlock.",
      "ROM zip từ kênh official_devices / projectinfinity-x.com.",
      "Bộ IMG cùng phiên bản: boot, dtbo, vendor_kernel_boot, vendor_boot.",
    ],
    warnings: [
      sharedWipe,
      noRelockFeature,
      "Chỉ file từ official_devices hoặc SourceForge Infinity-X, không reupload.",
      rootPointer,
    ],
    downloads: [
      {
        label: "flashguide/cheetah.txt",
        href: sources.infinityFlash,
        detail: "Bước first-time / dirty flash gốc.",
      },
      {
        label: "IMG Android 16",
        href: sources.infinityImgs,
        detail: "Bốn file image Tensor.",
      },
    ],
    steps: [
      {
        title: "Tải ROM và IMG",
        body: "Lấy zip + boot.img, dtbo.img, vendor_kernel_boot.img, vendor_boot.img cùng nhánh 16.",
      },
      {
        title: "Flash image và vào recovery",
        body: "Fastboot, rồi:",
        commands: [
          "fastboot flash boot boot.img",
          "fastboot flash dtbo dtbo.img",
          "fastboot flash vendor_kernel_boot vendor_kernel_boot.img",
          "fastboot flash vendor_boot vendor_boot.img",
          "fastboot reboot recovery",
        ],
      },
      {
        title: "Format data",
        body: "Factory reset → Format data / factory reset. Về menu chính.",
      },
      {
        title: "Sideload ROM",
        body: "Apply update → Apply from ADB. Thay tên zip.",
        commands: ["adb sideload rom.zip"],
      },
      {
        title: "Reboot hệ thống",
        body: "Không cần add-on. Reboot system.",
      },
    ],
    afterInstall: [
      "Cập nhật: OTA trong Settings, hoặc dirty flash sideload zip mới.",
      "eSIM: changelog 09/2026 có cải thiện EuiccGoogle — vẫn kiểm tra với nhà mạng.",
    ],
  },

  iodeos: {
    method: "desktop-installer",
    officialHref: sources.iodeInstall,
    officialLabel: "Installer iodéOS",
    extraLinks: [{ label: "Danh sách máy official", href: sources.iodeDevices }],
    summary:
      "Pixel 7 Pro nằm danh sách official. Cách chính: installer Windows/Linux trên iode.tech. Không dùng mirror lạ. Không khóa bootloader trừ khi installer official tự khóa và xác nhận thành công.",
    relock: "forbidden",
    firmwareNote:
      "Installer thường kéo image đúng máy. Nếu cài tay, đối chiếu firmware như các fork Lineage (stock Android 16).",
    requirements: [
      "Bootloader đã unlock, OEM unlocking đã bật.",
      "Installer official Windows hoặc Linux từ iode.tech/installation.",
      "Đúng model Pixel 7 Pro (cheetah). Installer từng nhận nhầm Pixel 7 — đọc kỹ màn hình.",
    ],
    warnings: [
      sharedWipe,
      noRelockFeature,
      "Không flash file gắn UNOFFICIAL từ mirror nếu bạn muốn kênh iodé.",
      "Kẹt “waiting for any device” ở fastbootd: đổi sang cáp USB-A ↔ USB-C, cổng khác.",
      rootPointer,
    ],
    downloads: [
      {
        label: "Trang installation",
        href: sources.iodeInstall,
        detail: "Installer Windows/Linux + link cài tay.",
      },
    ],
    steps: [
      {
        title: "Unlock bootloader",
        body: "Làm trang Mở khóa bootloader trước. Installer cần Fastboot thấy máy.",
      },
      {
        title: "Tải installer official",
        body: "iode.tech/installation → bản Windows hoặc Linux. Giải nén, chạy file thực thi iodé — không lấy installer trên diễn đàn.",
      },
      {
        title: "Chọn đúng Pixel 7 Pro",
        body: "Cắm máy ở Fastboot. Xác nhận installer hiện Pixel 7 Pro / cheetah, không phải Pixel 7. Làm hết từng bước trên màn hình.",
      },
      {
        title: "Nếu installer kẹt Fastbootd",
        body: "Rút cáp, đổi USB-A, chạy lại. Vẫn kẹt: dùng mục Manually trên cùng trang official (terminal), không tự bịa lệnh từ video.",
      },
      {
        title: "Boot iodéOS",
        body: "Đợi installer báo xong. Setup microG / chặn tracker theo wizard máy. Không khóa bootloader thủ công.",
      },
    ],
    afterInstall: [
      "Cập nhật bằng updater iodé, không sideload zip Lineage thường.",
      "Banking/Wallet không phải thế mạnh (microG).",
    ],
  },

  "e-os": {
    method: "desktop-installer",
    officialHref: sources.eosDevice,
    officialLabel: "Trang thiết bị /e/OS (cheetah)",
    extraLinks: [{ label: "Quay lại stock nếu cần khớp firmware", href: sources.flashAndroid }],
    summary:
      "Community build. Easy Installer không phải lúc nào cũng liệt kê P7 Pro. Ưu tiên doc official: factory image + script flash của /e/. Firmware stock phải khớp Android của bản bạn tải. Không khóa bootloader.",
    relock: "forbidden",
    firmwareNote:
      "Catalog snapshot từng ghi community A15; trang thiết bị official hiện liệt A16 community. Đọc version trên doc.e.foundation trước khi flash. Bản A15 thường không cài được nếu stock/firmware đã A16 vá mới hơn — phải khớp hoặc hạ stock theo đúng doc.",
    requirements: [
      "Bootloader đã unlock.",
      "Đúng file cheetah từ doc.e.foundation / smartphone selector, không zip đổi tên.",
      "platform-tools. Trên Windows, cộng đồng thường chạy script trong Git Bash.",
    ],
    warnings: [
      sharedWipe,
      noRelockFeature,
      "Doc /e/ từng lệch version so với máy thực — luôn đọc trang thiết bị hôm bạn cài.",
      "Flash script máy khác (panther) lên cheetah sẽ hỏng máy.",
      rootPointer,
    ],
    downloads: [
      {
        label: "Pixel 7 Pro trên /e/OS",
        href: sources.eosDevice,
        detail: "Chọn Official hoặc Community install doc / command line trên trang đó.",
      },
    ],
    steps: [
      {
        title: "Đọc version official",
        body: "Mở trang thiết bị cheetah. Ghi lại Android (15 hay 16) và loại official/community. Tải đúng build đó.",
      },
      {
        title: "Khớp firmware stock",
        body: "Nếu doc yêu cầu stock Android N, flash stock N bằng Android Flash Tool trước. Đừng flash /e/ A15 lên firmware A16 vá cao hơn nếu doc cảnh báo security patch.",
      },
      {
        title: "Easy Installer chỉ khi máy được liệt kê",
        body: "Nếu installer báo “not yet supported”, đừng ép. Chuyển sang command-line trên install doc official.",
      },
      {
        title: "Flash factory image /e/",
        body: "Giải nén gói IMG/factory official cho cheetah. Trong thư mục đó chạy script flash_*_factory (tên đủ trong gói). Máy phải đang Fastboot, unlocked.",
        commands: [
          "chmod +x flash_cheetah_factory.sh",
          "./flash_cheetah_factory.sh",
        ],
        note: "Nếu script trong zip mang tên khác, dùng đúng file trong gói — đừng copy lệnh máy khác.",
      },
      {
        title: "Boot /e/OS",
        body: "Đợi script xong, Start. Tạo account /e/ nếu bạn dùng hệ sinh thái đó. Không `fastboot flashing lock`.",
      },
    ],
    afterInstall: [
      "Nếu mục tiêu chỉ là deGoogle + Android 16 đều đặn, CalyxOS hoặc iodéOS đơn giản hơn trên máy này.",
      "OTA theo updater /e/, không sideload zip Lineage.",
    ],
  },
};

export function getFlashGuide(slug: string): FlashGuide | undefined {
  return flashGuides[slug];
}

export const flashGuideSlugs = Object.keys(flashGuides);

export const flashableLiveRoms = liveRoms.filter((rom) => flashGuides[rom.slug]);
