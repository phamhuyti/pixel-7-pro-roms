import Link from "next/link";
import { SNAPSHOT_LABEL } from "@/data/labels";
import { sources } from "@/data/sources";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Snapshot cộng đồng {SNAPSHOT_LABEL}. Không phải hướng dẫn flash.
          Luôn tải từ trang official của từng ROM.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href={sources.customRomBay} className="hover:text-foreground">
            CustomRomBay
          </Link>
          <Link href={sources.flashAndroid} className="hover:text-foreground">
            Flash stock
          </Link>
          <Link href="/#nguon" className="hover:text-foreground">
            Nguồn
          </Link>
        </div>
      </div>
    </footer>
  );
}
