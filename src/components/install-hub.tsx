import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { flashableLiveRoms, getFlashGuide } from "@/data/flash";
import {
  DEVICE_CODENAME,
  DEVICE_NAME,
  flashMethodLabels,
  relockLabels,
} from "@/data/labels";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export function InstallHub() {
  const custom = flashableLiveRoms.filter((rom) => !rom.isStock);
  const stock = flashableLiveRoms.find((rom) => rom.isStock);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs tracking-[0.18em] text-teal-300 uppercase">
        {DEVICE_NAME} · {DEVICE_CODENAME}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Mở bootloader và flash ROM còn sống
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Unlock một lần, rồi flash theo kênh official. Có mục chuyển từ custom
        ROM khác, Magisk (init_boot) và KernelSU khi kernel ROM hỗ trợ. Không
        hướng dẫn giả Play Integrity. ROM stale / đã ngừng không có bước flash.
      </p>

      <Alert className="mt-8 border-amber-500/30 bg-amber-500/8">
        <ShieldAlert className="text-amber-400" />
        <AlertTitle>Xóa dữ liệu, có thể mất bảo hành, có thể brick.</AlertTitle>
        <AlertDescription>
          Sai máy (panther thay vì cheetah), sai firmware, hoặc khóa bootloader
          trên ROM không hỗ trợ relock đều có thể làm máy không lên. Wiki
          official của dự án luôn thắng nếu khác bản tiếng Việt này.
        </AlertDescription>
      </Alert>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Bước 0 — Unlock
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Bắt buộc với ROM recovery. GrapheneOS / CalyxOS / iodé installer có
          thể tự gửi lệnh unlock — vẫn phải bật OEM unlocking trước.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading text-lg font-semibold">
            Mở khóa bootloader
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            `fastboot flashing unlock` trên Pixel 7 Pro. Xóa sạch máy. Máy nhà
            mạng có thể không mở được.
          </p>
          <Button className="mt-4" render={<Link href="/cai-dat/unlock-bootloader" />}>
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
              Dirty flash cùng ROM, clean flash khi đổi ROM. Graphene/Calyx về
              stock trước.
            </p>
            <Button
              className="mt-4"
              render={<Link href="/cai-dat/tu-custom-rom" />}
            >
              Xem quy tắc chuyển ROM
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-lg font-semibold">
              Magisk và KernelSU
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Patch init_boot trên Tensor. KernelSU chỉ khi kernel ROM có sẵn.
              Không có keybox / giả Integrity.
            </p>
            <Button className="mt-4" render={<Link href="/cai-dat/root" />}>
              Root theo từng ROM
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          ROM đang duy trì
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tám custom ROM còn kiểm chứng được trong catalog.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {custom.map((rom) => {
            const guide = getFlashGuide(rom.slug);
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
                  <Button size="sm" render={<Link href={`/cai-dat/${rom.slug}`} />}>
                    Cách flash
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    render={<Link href={`/roms/${rom.slug}`} />}
                  >
                    Chi tiết
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {stock && getFlashGuide(stock.slug) && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Quay lại stock
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nên làm trước Lineage-fork nếu không chắc firmware, hoặc trước khi
            khóa bootloader sau Graphene/Calyx.
          </p>
          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-lg font-semibold">{stock.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {getFlashGuide(stock.slug)?.summary}
            </p>
            <Button
              className="mt-4"
              render={<Link href={`/cai-dat/${stock.slug}`} />}
            >
              Flash lại Pixel OS
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
