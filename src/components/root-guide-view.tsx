import { FlashSteps } from "@/components/flash-steps";
import { BulletList, GuideSection } from "@/components/guide-chrome";
import { Badge } from "@/components/ui/badge";
import { rootSupportLabels } from "@/data/labels";
import type { RootGuide, RootMethodGuide } from "@/data/types";

function MethodBlock({
  title,
  method,
}: {
  title: string;
  method: RootMethodGuide;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-heading text-base font-semibold">{title}</h3>
        <Badge variant="outline">{rootSupportLabels[method.support]}</Badge>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {method.summary}
      </p>
      {method.warnings.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Cảnh báo
          </p>
          <div className="mt-1">
            <BulletList items={method.warnings} muted />
          </div>
        </div>
      )}
      <div className="mt-4">
        <FlashSteps steps={method.steps} />
      </div>
      {method.after && method.after.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Sau khi root
          </p>
          <div className="mt-1">
            <BulletList items={method.after} muted />
          </div>
        </div>
      )}
    </div>
  );
}

export function RootGuideSections({
  guide,
  magiskDocLinks,
}: {
  guide: RootGuide;
  magiskDocLinks: { label: string; href: string }[];
}) {
  return (
    <div id="root" className="scroll-mt-20">
      <GuideSection title="Root — Magisk và KernelSU">
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {guide.integrityNote}
        </p>
        <ul className="mb-6 flex flex-col gap-1 text-sm">
          {magiskDocLinks.map((link) => (
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
        <div className="space-y-4">
          <MethodBlock title="Magisk" method={guide.magisk} />
          <MethodBlock title="KernelSU" method={guide.kernelsu} />
        </div>
      </GuideSection>
    </div>
  );
}
