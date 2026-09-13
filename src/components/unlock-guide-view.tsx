import { FlashSteps } from "@/components/flash-steps";
import { BulletList, GuideChrome, GuideSection } from "@/components/guide-chrome";
import { Button } from "@/components/ui/button";
import { unlockGuide } from "@/data/unlock";
import Link from "next/link";

export function UnlockGuideView() {
  const guide = unlockGuide;

  return (
    <GuideChrome
      eyebrow="Bước 0"
      title="Mở khóa bootloader Pixel 7 Pro"
      lede={guide.summary}
      officialHref={guide.officialHref}
      officialLabel={guide.officialLabel}
      extraActions={
        <Button variant="outline" render={<Link href="/cai-dat" />}>
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
        <GuideSection title="Công cụ official">
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
