import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { STOCK_SUPPORT_END } from "@/data/labels";
import { ShieldAlert } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
      <Alert className="border-amber-500/30 bg-amber-500/8">
        <ShieldAlert className="text-amber-400" />
        <AlertTitle>Đây là bảng so sánh, không phải hướng dẫn flash.</AlertTitle>
        <AlertDescription>
          Mở bootloader xóa dữ liệu, ảnh hưởng bảo hành và làm yếu verified
          boot. Play Integrity / ngân hàng / Wallet trên custom ROM đều kém
          stock. Không catalog bản Telegram unofficial, không hướng dẫn bypass
          Integrity. Stock vẫn vá đến {STOCK_SUPPORT_END} — flash chỉ khi bạn
          chấp nhận rủi ro và tự đọc wiki official.
        </AlertDescription>
      </Alert>
    </div>
  );
}
