# Custom ROM Pixel 7 Pro (cheetah)

Trang so sánh tiếng Việt các custom ROM **official / community có trang tải công khai** cho Google Pixel 7 Pro. Snapshot curated, không scrape realtime.

Stock Pixel OS được đưa vào như **mốc so sánh**: máy vẫn nhận cập nhật đến tháng 10/2027. Custom ROM chỉ đáng cân nhắc khi bạn cần hardening, deGoogle, hoặc tùy biến.

## Không làm gì

- Không catalog bản Telegram unofficial
- Không hướng dẫn bypass Play Integrity / root / Magisk

Cài ROM: trang [`/cai-dat`](src/app/cai-dat/page.tsx) tóm bước official (unlock + từng ROM còn sống). Wiki dự án thắng nếu lệch. Mở bootloader xóa dữ liệu.

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

- [`src/data/roms.ts`](src/data/roms.ts) — catalog ROM (stock, đang duy trì, cũ, đã ngừng)
- [`src/data/flash.ts`](src/data/flash.ts) — hướng dẫn flash ROM còn sống
- [`src/data/unlock.ts`](src/data/unlock.ts) — mở khóa bootloader
- [`src/data/sources.ts`](src/data/sources.ts) — URL official
- [`src/data/labels.ts`](src/data/labels.ts) — ngày snapshot và nhãn tiếng Việt

Nguồn chính lúc snapshot 13/09/2026: GrapheneOS releases, CalyxOS, LineageOS wiki/download, Evolution X, crDroid, Infinity-X changelog, iodéOS, /e/OS, RisingOS, DerpFest, PixelOS, CustomRomBay (đối chiếu tên cũ).

## Gợi ý nhanh

| Nhu cầu | Hướng đi |
| --- | --- |
| Bảo mật tối đa | GrapheneOS |
| DeGoogle dễ dùng | CalyxOS hoặc iodéOS |
| AOSP sạch, lâu dài | LineageOS |
| Gần Pixel + theme | Evolution X / Infinity-X |
| Tùy biến nhiều | crDroid |
| Ngân hàng / Wallet | Ở stock đến 10/2027 |

Telegram “ROM mới mỗi tuần” không có trong catalog này.
