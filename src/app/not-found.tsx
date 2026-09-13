import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-start gap-4 px-4 py-20 sm:px-6">
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        404
      </p>
      <h1 className="font-heading text-2xl font-semibold">
        Không có ROM hoặc trang này.
      </h1>
      <p className="text-sm text-muted-foreground">
        Catalog chỉ gồm ROM có slug trong dữ liệu snapshot. Telegram unofficial
        không được liệt kê.
      </p>
      <Button render={<Link href="/" />}>Về trang so sánh</Button>
    </div>
  );
}
