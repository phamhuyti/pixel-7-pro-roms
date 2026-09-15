import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { flashableRomsOf } from "@/data/registry";
import { flashMethodLabels, relockLabels } from "@/data/labels";
import type { DeviceCatalog } from "@/data/types";
import { pathsFor } from "@/lib/paths";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export function InstallHub({ catalog }: { catalog: DeviceCatalog }) {
  const paths = pathsFor(catalog.id);
  const flashable = flashableRomsOf(catalog);
  const custom = flashable.filter((rom) => !rom.isStock);
  const stock = flashable.find((rom) => rom.isStock);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs tracking-[0.18em] text-teal-300 uppercase">
        {catalog.name} · {catalog.codename}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Mở bootloader và flash {catalog.shortName}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {catalog.installHubLede}
      </p>

      <Alert className="mt-8 border-amber-500/30 bg-amber-500/8">
        <ShieldAlert className="text-amber-400" />
        <AlertTitle>Xóa dữ liệu, có thể mất bảo hành, có thể brick.</AlertTitle>
        <AlertDescription>
          Sai model, sai firmware, hoặc khóa bootloader trên ROM không hỗ trợ
          relock đều có thể làm máy không lên. Wiki official của dự án luôn
          thắng nếu khác bản tiếng Việt này.
        </AlertDescription>
      </Alert>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Bước 0 — Unlock
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{catalog.unlockBlurb}</p>
        <div className="mt-4 rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-lg font-semibold">
            Mở khóa bootloader
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {catalog.unlockGuide.summary}
          </p>
          <Button className="mt-4" render={<Link href={paths.unlock} />}>
            Xem hướng dẫn unlock
          </Button>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Đang ở ROM khác, hoặc cần root
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-lg font-semibold">
              Flash từ custom ROM
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {catalog.switchOverview.summary}
            </p>
            <Button className="mt-4" render={<Link href={paths.switchRom} />}>
              Xem quy tắc chuyển ROM
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-lg font-semibold">
              Magisk và KernelSU
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {catalog.id === "lg-v50"
                ? "Patch boot.img trên SD855. KernelSU không có kernel official. Không keybox / giả Integrity."
                : catalog.id === "vivo-v40-lite"
                  ? "Bootloader khóa — Magisk/KernelSU không hỗ trợ trên trang này. Không keybox / giả Integrity."
                  : "Patch init_boot trên Tensor. KernelSU chỉ khi kernel ROM có sẵn. Không keybox / giả Integrity."}
            </p>
            <Button className="mt-4" render={<Link href={paths.root} />}>
              Root theo từng ROM
            </Button>
          </div>
        </div>
      </section>

      {catalog.topicGuides?.["hotspot-6ghz"] && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Pipeline đặc biệt
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nối unlock → Lineage → Magisk → SoftAP 6GHz (không thay wiki flash).
          </p>
          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-lg font-semibold">
              {catalog.topicGuides["hotspot-6ghz"].title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {catalog.topicGuides["hotspot-6ghz"].summary}
            </p>
            <Button className="mt-4" render={<Link href={paths.hotspot6ghz} />}>
              Xem hướng dẫn 6GHz
            </Button>
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          ROM có hướng dẫn flash
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {custom.length} custom ROM có bước trên catalog này (kể cả stale nếu
          wiki còn).
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {custom.map((rom) => {
            const guide = catalog.flashGuides[rom.slug];
            if (!guide) return null;
            return (
              <article
                key={rom.slug}
                className="flex flex-col rounded-xl border border-border bg-card p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-base font-semibold">
                    {rom.name}
                  </h3>
                  <Badge variant="secondary">
                    {flashMethodLabels[guide.method]}
                  </Badge>
                  <Badge variant="outline">{relockLabels[guide.relock]}</Badge>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {guide.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" render={<Link href={paths.flash(rom.slug)} />}>
                    Cách flash
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    render={<Link href={paths.rom(rom.slug)} />}
                  >
                    Chi tiết
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {stock && catalog.flashGuides[stock.slug] && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Quay lại stock
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dùng khi cần firmware gốc hoặc khôi phục máy.
          </p>
          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-lg font-semibold">{stock.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {catalog.flashGuides[stock.slug]?.summary}
            </p>
            <Button
              className="mt-4"
              render={<Link href={paths.flash(stock.slug)} />}
            >
              Flash lại {stock.shortName}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
