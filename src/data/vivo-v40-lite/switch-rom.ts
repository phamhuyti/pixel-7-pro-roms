import type { SwitchGuide } from "../types";

export const switchOverview = {
  summary:
    "V40 Lite không có custom ROM trên catalog — không có “chuyển ROM”. Chỉ OTA / Local upgrade Funtouch hoặc mang máy ra dịch vụ khi brick.",
  rules: [
    "Không dirty-flash GSI/Lineage vì không có ROM đích được hỗ trợ.",
    "Không khóa/mở bootloader — máy stock khóa.",
    "Đổi bản Funtouch: OTA hoặc Local upgrade đúng model/vùng.",
    "Nhầm gói 5G / vùng khác: rủi ro brick — đừng thử.",
    "Telegram “chuyển ROM” không được liệt kê.",
  ],
};

export const switchGuides: Record<string, SwitchGuide> = {
  "stock-vivo": {
    summary:
      "Đang ở Funtouch: chỉ cập nhật cùng nhánh stock. Không có đường từ custom ROM về stock trên trang này ngoài OTA/Local upgrade / bảo hành.",
    stockFirst: true,
    dirtyAllowed: false,
    cleanRequired: false,
    steps: [
      {
        title: "Đang Funtouch — cập nhật",
        body: "System Upgrade / Local upgrade đúng gói. Không format trừ khi hãng hoặc dịch vụ yêu cầu.",
      },
      {
        title: "Đang ở ROM/GSI lạ (ngoài catalog)",
        body: "Không có bước sideload Lineage→stock. Ưu tiên trung tâm vivo với đúng SKU. Tự QFIL file lạ = ngoài phạm vi trang này.",
      },
    ],
    notes: [
      "FRP: gỡ tài khoản Google trước khi mang đi flash dịch vụ nếu máy còn vào được.",
    ],
  },
};
