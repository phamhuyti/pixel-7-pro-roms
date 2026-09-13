import Link from "next/link";
import { DEVICE_CODENAME } from "@/data/labels";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-[11px] font-semibold tracking-tight text-primary-foreground">
            7
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Cheetah ROMs
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/#goi-y" className="hidden hover:text-foreground sm:inline">
            Gợi ý
          </Link>
          <Link href="/#so-sanh" className="hover:text-foreground">
            So sánh
          </Link>
          <Link href="/cai-dat" className="hover:text-foreground">
            Cài đặt
          </Link>
          <Link href="/#ngung" className="hidden hover:text-foreground sm:inline">
            Đã ngừng
          </Link>
          <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] text-foreground">
            {DEVICE_CODENAME}
          </span>
        </nav>
      </div>
    </header>
  );
}
