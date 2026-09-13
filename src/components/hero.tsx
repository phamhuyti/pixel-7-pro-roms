import { Button } from "@/components/ui/button";
import {
  DEVICE_CODENAME,
  DEVICE_NAME,
  SNAPSHOT_LABEL,
  STOCK_SUPPORT_END,
} from "@/data/labels";
import { liveRoms, staleRoms } from "@/data/roms";
import Link from "next/link";

export function Hero() {
  const activeCount = liveRoms.filter((rom) => !rom.isStock).length;

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.45_0.08_175/0.18),transparent_50%),radial-gradient(ellipse_at_bottom_left,oklch(0.4_0.06_250/0.16),transparent_45%)]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-5">
          <p className="font-mono text-xs tracking-[0.18em] text-teal-300 uppercase">
            {DEVICE_NAME} · {DEVICE_CODENAME}
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Chọn custom ROM theo nhu cầu, không theo lời đồn Telegram.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Máy vẫn nhận stock đến {STOCK_SUPPORT_END}. Trang này đối chiếu các
            ROM official/community còn kiểm chứng được — và chỉ rõ ROM đã chết
            để bạn không flash nhầm.
          </p>
          <Button render={<Link href="/cai-dat" />}>
            Unlock và flash ROM còn sống
          </Button>
        </div>
        <dl className="grid grid-cols-3 gap-3 sm:gap-4">
          <Stat value={String(activeCount)} label="ROM còn sống" />
          <Stat value={String(staleRoms.length)} label="Cần kiểm tra" />
          <Stat value={SNAPSHOT_LABEL.split(",")[0]} label="Ngày snapshot" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 px-3 py-3 sm:px-4">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-heading text-lg font-semibold tracking-tight sm:text-xl">
        {value}
      </dd>
    </div>
  );
}
