import { GuideChrome, GuideSection } from "@/components/guide-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { flashableLiveRoms } from "@/data/flash";
import { DEVICE_NAME, rootSupportLabels } from "@/data/labels";
import { getRootGuide, magiskDocLinks } from "@/data/root";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Magisk và KernelSU",
  description: `Root Pixel 7 Pro theo từng ROM còn sống. Magisk init_boot, KernelSU chỉ khi kernel ROM có sẵn. Không hướng dẫn giả Play Integrity.`,
};

export default function RootOverviewPage() {
  return (
    <GuideChrome
      eyebrow="Root"
      title="Magisk và KernelSU trên Pixel 7 Pro"
      lede={`Tensor (cheetah) dùng init_boot cho Magisk, không phải boot.img. KernelSU chỉ khi kernel của đúng ROM đã build KSU. ${DEVICE_NAME} — không có bypass Play Integrity.`}
      officialHref="https://topjohnwu.github.io/Magisk/install.html"
      officialLabel="Magisk install official"
    >
      <GuideSection title="Tài liệu gốc">
        <ul className="flex flex-col gap-1 text-sm">
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
      </GuideSection>

      <GuideSection title="Từng ROM còn sống">
        <ul className="space-y-3">
          {flashableLiveRoms.map((rom) => {
            const guide = getRootGuide(rom.slug);
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
                  render={<Link href={`/cai-dat/${rom.slug}#root`} />}
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
