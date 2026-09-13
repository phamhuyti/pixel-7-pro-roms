import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { STOCK_SUPPORT_END } from "@/data/labels";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export function Disclaimer() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
      <Alert className="border-amber-500/30 bg-amber-500/8">
        <ShieldAlert className="text-amber-400" />
        <AlertTitle>Flash theo kênh official — vẫn xóa dữ liệu.</AlertTitle>
        <AlertDescription>
          Mở bootloader xóa máy, ảnh hưởng bảo hành và làm yếu verified boot.
          Play Integrity / ngân hàng / Wallet trên custom ROM đều kém stock.
          Không catalog bản Telegram unofficial, không hướng dẫn giả Play
          Integrity. Magisk/KernelSU nằm trong Cài đặt. Stock vẫn vá đến{" "}
          {STOCK_SUPPORT_END}. Có trang{" "}
          <Link href="/cai-dat" className="text-foreground underline-offset-2 hover:underline">
            Cài đặt
          </Link>{" "}
          — wiki official thắng nếu lệch.
        </AlertDescription>
      </Alert>
    </div>
  );
}
