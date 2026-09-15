import { FlashSteps } from "@/components/flash-steps";
import { BulletList, GuideChrome, GuideSection } from "@/components/guide-chrome";
import { RootGuideSections } from "@/components/root-guide-view";
import { SwitchGuideSections } from "@/components/switch-guide-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { flashMethodLabels, relockLabels } from "@/data/labels";
import type { DeviceCatalog, FlashGuide, Rom } from "@/data/types";
import { pathsFor } from "@/lib/paths";
import Link from "next/link";

export function FlashGuideView({
  catalog,
  rom,
  guide,
}: {
  catalog: DeviceCatalog;
  rom: Rom;
  guide: FlashGuide;
}) {
  const paths = pathsFor(catalog.id);
  const switchGuide = catalog.switchGuides[rom.slug];
  const rootGuide = catalog.rootGuides[rom.slug];
  return (
    <GuideChrome
      backHref={paths.install}
      backLabel={`← Cài đặt ${catalog.shortName}`}
      eyebrow={rom.shortName}
      title={`Flash ${rom.name}`}
      lede={guide.summary}
      officialHref={guide.officialHref}
      officialLabel={guide.officialLabel}
      extraActions={
        <>
          {!rom.isStock && (
            <Button variant="outline" render={<Link href={paths.unlock} />}>
              Mở khóa bootloader
            </Button>
          )}
          {rom.slug === "lineageos" && catalog.id === "pixel-7-pro" && (
            <Button render={<Link href={paths.lineageWeb} />}>
              Auto-flash
            </Button>
          )}
          <Button variant="ghost" render={<Link href={paths.rom(rom.slug)} />}>
            Chi tiết ROM
          </Button>
          {switchGuide && (
            <Button variant="ghost" render={<Link href="#tu-custom-rom" />}>
              Từ ROM khác
            </Button>
          )}
          {rootGuide && (
            <Button variant="ghost" render={<Link href="#root" />}>
              Magisk / KernelSU
            </Button>
          )}
        </>
      }
    >
      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="secondary">{flashMethodLabels[guide.method]}</Badge>
        <Badge variant="outline">{relockLabels[guide.relock]}</Badge>
      </div>

      {guide.firmwareNote && (
        <GuideSection title="Firmware">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {guide.firmwareNote}
          </p>
        </GuideSection>
      )}

      <GuideSection title="Cần có">
        <BulletList items={guide.requirements} muted />
      </GuideSection>

      <GuideSection title="Cảnh báo">
        <BulletList items={guide.warnings} muted />
      </GuideSection>

      <GuideSection title="Tải official">
        <ul className="space-y-2">
          {guide.downloads.map((item) => (
            <li
              key={item.href}
              className="rounded-lg border border-border bg-card px-3 py-2"
            >
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-teal-300 hover:underline"
              >
                {item.label}
              </a>
              {item.detail && (
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              )}
            </li>
          ))}
        </ul>
        {guide.extraLinks && guide.extraLinks.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            {guide.extraLinks.map((link) => (
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
        )}
      </GuideSection>

      <GuideSection title="Các bước">
        <FlashSteps steps={guide.steps} />
      </GuideSection>

      <GuideSection title="Sau khi cài">
        <BulletList items={guide.afterInstall} muted />
      </GuideSection>

      {switchGuide && <SwitchGuideSections guide={switchGuide} />}
      {rootGuide && (
        <RootGuideSections
          guide={rootGuide}
          magiskDocLinks={catalog.magiskDocLinks}
        />
      )}
    </GuideChrome>
  );
}
