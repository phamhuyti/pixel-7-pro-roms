import { FlashSteps } from "@/components/flash-steps";
import { BulletList, GuideChrome, GuideSection } from "@/components/guide-chrome";
import { Button } from "@/components/ui/button";
import type { DeviceCatalog, TopicGuide } from "@/data/types";
import { pathsFor } from "@/lib/paths";
import Link from "next/link";

export function TopicGuideView({
  catalog,
  guide,
  slug,
}: {
  catalog: DeviceCatalog;
  guide: TopicGuide;
  slug: string;
}) {
  const paths = pathsFor(catalog.id);

  return (
    <GuideChrome
      backHref={paths.install}
      backLabel={`← Cài đặt ${catalog.shortName}`}
      eyebrow={`Chủ đề · ${slug}`}
      title={guide.title}
      lede={guide.summary}
      officialHref={guide.officialHref}
      officialLabel={guide.officialLabel}
      extraActions={
        <>
          <Button variant="outline" render={<Link href={paths.unlock} />}>
            Unlock
          </Button>
          <Button
            variant="outline"
            render={<Link href={paths.flash("lineageos")} />}
          >
            Flash LineageOS
          </Button>
          <Button
            variant="outline"
            render={<Link href={`${paths.flash("lineageos")}#root`} />}
          >
            Magisk
          </Button>
        </>
      }
    >
      <GuideSection title="Cảnh báo">
        <BulletList items={guide.warnings} muted />
      </GuideSection>

      <GuideSection title="Cần có">
        <BulletList items={guide.requirements} muted />
      </GuideSection>

      {guide.extraLinks && guide.extraLinks.length > 0 && (
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

      {guide.downloads && guide.downloads.length > 0 && (
        <GuideSection title="Tải">
          <ul className="space-y-3">
            {guide.downloads.map((item) => (
              <li
                key={item.href}
                className="rounded-xl border border-border bg-card p-4"
              >
                <a
                  href={item.href}
                  target={item.href.startsWith("/") ? undefined : "_blank"}
                  rel={item.href.startsWith("/") ? undefined : "noreferrer"}
                  className="font-medium text-teal-300 hover:underline"
                >
                  {item.label}
                </a>
                {item.detail && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </GuideSection>
      )}

      {guide.sections.map((section) => (
        <GuideSection key={section.id} title={section.title}>
          {section.intro && (
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              {section.intro}
            </p>
          )}
          {section.bullets && section.bullets.length > 0 && (
            <div className="mb-4">
              <BulletList items={section.bullets} muted />
            </div>
          )}
          {section.steps && section.steps.length > 0 && (
            <FlashSteps steps={section.steps} />
          )}
          {section.relatedHref && section.relatedLabel && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                render={
                  section.relatedHref.startsWith("/") ? (
                    <Link href={section.relatedHref} />
                  ) : (
                    <a href={section.relatedHref} target="_blank" rel="noreferrer" />
                  )
                }
              >
                {section.relatedLabel}
              </Button>
            </div>
          )}
        </GuideSection>
      ))}

      <GuideSection title="Ghi chú">
        <BulletList items={guide.notes} muted />
      </GuideSection>
    </GuideChrome>
  );
}
