# Catalog custom ROM (chọn máy trước)

Trang so sánh tiếng Việt các custom ROM **official / community có trang tải công khai**. Snapshot curated, không scrape realtime.

**Trang chủ chỉ chọn điện thoại.** Catalog, flash và Magisk nằm sau khi chọn máy:

- [`/pixel-7-pro`](src/app/[device]/page.tsx) — Google Pixel 7 Pro (`cheetah`)
- [`/lg-v50`](src/app/[device]/page.tsx) — LG V50 ThinQ (`flashlmdd`)
- [`/vivo-v40-lite`](src/app/[device]/page.tsx) — vivo V40 Lite (`v40lite`, bản VN SD685)

URL cũ `/cai-dat` và `/roms/:slug` redirect sang Pixel 7 Pro.

## Không làm gì

- Không catalog bản Telegram unofficial
- Không hướng dẫn giả Play Integrity (module attestation / keybox)

Cài ROM: `/{máy}/cai-dat` — unlock, flash, chuyển từ custom ROM, Magisk/KernelSU. Wiki dự án thắng nếu lệch.

### Auto-flash LineageOS (Pixel 7 Pro)

Script bám [wiki cheetah](https://wiki.lineageos.org/devices/cheetah/install/): tải nightly official + SHA256, flash `boot` / `dtbo` / `vendor_kernel_boot` / `vendor_boot`, sideload zip. Format data và Apply from ADB vẫn chọn tay trên recovery. **Không** khóa bootloader.

```bash
# Sau khi chạy site local, hoặc lấy từ repo:
curl -fsSL -o lineageos-cheetah-flash.sh http://127.0.0.1:43123/tools/lineageos-cheetah-flash.sh
chmod +x lineageos-cheetah-flash.sh
./lineageos-cheetah-flash.sh                  # tải + flash
./lineageos-cheetah-flash.sh --download-only  # chỉ tải
./lineageos-cheetah-flash.sh --gapps MindTheGapps-arm64.zip
```

File nguồn: [`public/tools/lineageos-cheetah-flash.sh`](public/tools/lineageos-cheetah-flash.sh) (và bản sao [`tools/`](tools/lineageos-cheetah-flash.sh)). Cần `adb`/`fastboot`, `python3`, firmware stock Android 16, bootloader unlocked, đúng máy `cheetah`.

Hotspot 6GHz (VPNHotspot + mã vùng): [`/pixel-7-pro/cai-dat/hotspot-6ghz`](src/app/[device]/cai-dat/hotspot-6ghz/page.tsx) — dữ liệu [`src/data/pixel-7-pro/hotspot-6ghz.ts`](src/data/pixel-7-pro/hotspot-6ghz.ts).

## Máy

| Máy | Ghi chú snapshot 14/09/2026 |
| --- | --- |
| Pixel 7 Pro | Stock còn vá đến 10/2027. Graphene/Calyx/Lineage và fork A16 còn kiểm chứng. Unlock official `fastboot flashing unlock`. Magisk: `init_boot`. |
| LG V50 ThinQ | Stock hết vá (A12). LineageOS 21 từng official, wiki ghi *no longer maintained*. Không OEM unlock. Magisk: `boot.img`. Dual Screen không chạy trên Lineage. Có kho Synology công cụ unlock + zip unofficial đã lưu. |
| vivo V40 Lite | Bản VN: SD685 4G, Funtouch 14. Không OEM unlock (Wall of Shame Vivo). Không Lineage/Graphene trên wiki. Catalog chỉ stock + OTA/Local upgrade; không QFIL/Telegram. Bản 5G (SD 4 Gen 2) khác firmware. |

## Chạy local

Cần Node.js 20+.

```bash
npm install
npm run dev
```

Mở [http://127.0.0.1:43123](http://127.0.0.1:43123).

```bash
npm run build
npm start
```

## Docker

```bash
docker compose up -d --build
```

Mở [http://127.0.0.1:43123](http://127.0.0.1:43123). Image production dùng `output: "standalone"`.

## Dữ liệu

- [`src/data/registry.ts`](src/data/registry.ts) — danh sách máy
- [`src/data/pixel-7-pro/`](src/data/pixel-7-pro/) — catalog Pixel
- [`src/data/lg-v50/`](src/data/lg-v50/) — catalog V50
- [`src/data/vivo-v40-lite/`](src/data/vivo-v40-lite/) — catalog V40 Lite
- [`src/data/labels.ts`](src/data/labels.ts) — ngày snapshot và nhãn tiếng Việt

Telegram “ROM mới mỗi tuần” không có trong catalog này.
