import { GuideChrome, GuideSection } from "@/components/guide-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { flashableRomsOf } from "@/data/registry";
import { rootSupportLabels } from "@/data/labels";
import type { DeviceCatalog } from "@/data/types";
import { pathsFor } from "@/lib/paths";
import Link from "next/link";

export function RootOverviewView({ catalog }: { catalog: DeviceCatalog }) {
  const paths = pathsFor(catalog.id);
  const flashable = flashableRomsOf(catalog);
  const lede =
    catalog.id === "lg-v50"
      ? `SD855 (${catalog.codename}) dùng boot.img cho Magisk, không phải init_boot. KernelSU không có kernel official. Không bypass Play Integrity.`
      : `Tensor (${catalog.codename}) dùng init_boot cho Magisk, không phải boot.img. KernelSU chỉ khi kernel của đúng ROM đã build KSU. Không bypass Play Integrity.`;

  return (
    <GuideChrome
      backHref={paths.install}
      backLabel={`← Cài đặt ${catalog.shortName}`}
      eyebrow="Root"
      title={`Magisk và KernelSU trên ${catalog.shortName}`}
      lede={lede}
      officialHref="https://topjohnwu.github.io/Magisk/install.html"
      officialLabel="Magisk install official"
    >
      <GuideSection title="Tài liệu gốc">
        <ul className="flex flex-col gap-1 text-sm">
          {catalog.magiskDocLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-teal-300 hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </GuideSection>

      <GuideSection title="Từng ROM có guide flash">
        <ul className="space-y-3">
          {flashable.map((rom) => {
            const guide = catalog.rootGuides[rom.slug];
            if (!guide) return null;
            return (
              <li
                key={rom.slug}
                className="rounded-xl border border-border bg-card p-4"
              >
                <h3 className="font-heading text-base font-semibold">
                  {rom.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Magisk · {rootSupportLabels[guide.magisk.support]}
                  </Badge>
                  <Badge variant="outline">
                    KernelSU · {rootSupportLabels[guide.kernelsu.support]}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {guide.magisk.summary}
                </p>
                <Button
                  className="mt-3"
                  size="sm"
                  render={<Link href={`${paths.flash(rom.slug)}#root`} />}
                >
                  Magisk / KernelSU
                </Button>
              </li>
            );
          })}
        </ul>
      </GuideSection>
    </GuideChrome>
  );
}
