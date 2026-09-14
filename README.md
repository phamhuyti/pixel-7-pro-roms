# Catalog custom ROM (chọn máy trước)

Trang so sánh tiếng Việt các custom ROM **official / community có trang tải công khai**. Snapshot curated, không scrape realtime.

**Trang chủ chỉ chọn điện thoại.** Catalog, flash và Magisk nằm sau khi chọn máy:

- [`/pixel-7-pro`](src/app/[device]/page.tsx) — Google Pixel 7 Pro (`cheetah`)
- [`/lg-v50`](src/app/[device]/page.tsx) — LG V50 ThinQ (`flashlmdd`)

URL cũ `/cai-dat` và `/roms/:slug` redirect sang Pixel 7 Pro.

## Không làm gì

- Không catalog bản Telegram unofficial
- Không hướng dẫn giả Play Integrity (module attestation / keybox)

Cài ROM: `/{máy}/cai-dat` — unlock, flash, chuyển từ custom ROM, Magisk/KernelSU. Wiki dự án thắng nếu lệch.

## Máy

| Máy | Ghi chú snapshot 14/09/2026 |
| --- | --- |
| Pixel 7 Pro | Stock còn vá đến 10/2027. Graphene/Calyx/Lineage và fork A16 còn kiểm chứng. Unlock official `fastboot flashing unlock`. Magisk: `init_boot`. |
| LG V50 ThinQ | Stock hết vá (A12). LineageOS 21 từng official, wiki ghi *no longer maintained*. Không OEM unlock. Magisk: `boot.img`. Dual Screen không chạy trên Lineage. Có kho Synology công cụ unlock + zip unofficial đã lưu. |

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
- [`src/data/labels.ts`](src/data/labels.ts) — ngày snapshot và nhãn tiếng Việt

Telegram “ROM mới mỗi tuần” không có trong catalog này.
