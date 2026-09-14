import { BulletList, GuideChrome, GuideSection } from "@/components/guide-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { flashableRomsOf } from "@/data/registry";
import type { DeviceCatalog } from "@/data/types";
import { pathsFor } from "@/lib/paths";
import Link from "next/link";

export function SwitchOverviewView({ catalog }: { catalog: DeviceCatalog }) {
  const paths = pathsFor(catalog.id);
  const flashable = flashableRomsOf(catalog);

  return (
    <GuideChrome
      backHref={paths.install}
      backLabel={`← Cài đặt ${catalog.shortName}`}
      eyebrow="Đang ở custom ROM"
      title="Flash khi máy đã có ROM khác"
      lede={catalog.switchOverview.summary}
      officialHref={paths.install}
      officialLabel="Danh sách ROM có guide"
    >
      <GuideSection title="Quy tắc">
        <BulletList items={catalog.switchOverview.rules} muted />
      </GuideSection>

      <GuideSection title="Từng ROM">
        <ul className="space-y-3">
          {flashable.map((rom) => {
            const guide = catalog.switchGuides[rom.slug];
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
                  render={
                    <Link href={`${paths.flash(rom.slug)}#tu-custom-rom`} />
                  }
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
