import { BulletList, GuideChrome, GuideSection } from "@/components/guide-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { flashableLiveRoms } from "@/data/flash";
import { DEVICE_NAME } from "@/data/labels";
import { getSwitchGuide, switchOverview } from "@/data/switch-rom";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flash khi đang ở custom ROM",
  description: `Chuyển ROM trên ${DEVICE_NAME}: dirty flash cùng ROM, clean flash khi đổi ROM, về stock trước Graphene/Calyx.`,
};

export default function SwitchRomPage() {
  return (
    <GuideChrome
      eyebrow="Đang ở custom ROM"
      title="Flash khi máy đã có ROM khác"
      lede={switchOverview.summary}
      officialHref="/cai-dat"
      officialLabel="Danh sách ROM còn sống"
    >
      <GuideSection title="Quy tắc">
        <BulletList items={switchOverview.rules} muted />
      </GuideSection>

      <GuideSection title="Từng ROM">
        <ul className="space-y-3">
          {flashableLiveRoms.map((rom) => {
            const guide = getSwitchGuide(rom.slug);
            if (!guide) return null;
            return (
              <li
                key={rom.slug}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-base font-semibold">
                    {rom.name}
                  </h3>
                  {guide.stockFirst && (
                    <Badge variant="secondary">Stock trước</Badge>
                  )}
                  {guide.dirtyAllowed && (
                    <Badge variant="outline">Có dirty</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {guide.summary}
                </p>
                <Button
                  className="mt-3"
                  size="sm"
                  render={<Link href={`/cai-dat/${rom.slug}#tu-custom-rom`} />}
                >
                  Bước chi tiết
                </Button>
              </li>
            );
          })}
        </ul>
      </GuideSection>
    </GuideChrome>
  );
}
