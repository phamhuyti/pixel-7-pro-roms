import { FlashSteps } from "@/components/flash-steps";
import { BulletList, GuideChrome, GuideSection } from "@/components/guide-chrome";
import { Button } from "@/components/ui/button";
import type { DeviceCatalog } from "@/data/types";
import { pathsFor } from "@/lib/paths";
import Link from "next/link";

export function UnlockGuideView({ catalog }: { catalog: DeviceCatalog }) {
  const paths = pathsFor(catalog.id);
  const guide = catalog.unlockGuide;

  return (
    <GuideChrome
      backHref={paths.install}
      backLabel={`← Cài đặt ${catalog.shortName}`}
      eyebrow="Bước 0"
      title={guide.title}
      lede={guide.summary}
      officialHref={guide.officialHref}
      officialLabel={guide.officialLabel}
      extraActions={
        <Button variant="outline" render={<Link href={paths.install} />}>
          Chọn ROM để flash
        </Button>
      }
    >
      <GuideSection title="Cảnh báo">
        <BulletList items={guide.warnings} muted />
      </GuideSection>

      <GuideSection title="Cần có">
        <BulletList items={guide.requirements} muted />
      </GuideSection>

      {guide.extraLinks && (
        <GuideSection title="Công cụ / nguồn">
          <ul className="flex flex-col gap-1 text-sm">
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
        </GuideSection>
      )}

      <GuideSection title="Các bước">
        <FlashSteps steps={guide.steps} />
      </GuideSection>

      <GuideSection title="Sau khi unlock">
        <BulletList items={guide.afterUnlock} muted />
      </GuideSection>

      <GuideSection title="Không unlock được">
        <BulletList items={guide.cannotUnlock} muted />
      </GuideSection>
    </GuideChrome>
  );
}
