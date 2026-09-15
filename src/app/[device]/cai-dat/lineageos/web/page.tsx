import { GuideChrome } from "@/components/guide-chrome";
import { LineageWebInstaller } from "@/components/lineage-web-installer";
import { Button } from "@/components/ui/button";
import { getCatalog } from "@/data/registry";
import { sources } from "@/data/pixel-7-pro/sources";
import { pathsFor } from "@/lib/paths";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ device: "pixel-7-pro" }];
}

export const metadata: Metadata = {
  title: "Web installer LineageOS",
  description:
    "WebUSB installer kiểu GrapheneOS cho LineageOS trên Pixel 7 Pro (cheetah): unlock, nạp nightly official + SHA256, flash recovery images.",
};

export default async function LineageWebInstallPage({
  params,
}: {
  params: Promise<{ device: string }>;
}) {
  const { device } = await params;
  if (device !== "pixel-7-pro") notFound();
  const catalog = getCatalog(device);
  if (!catalog) notFound();
  const paths = pathsFor(catalog.id);

  return (
    <GuideChrome
      backHref={paths.flash("lineageos")}
      backLabel="← Flash LineageOS"
      eyebrow="WebUSB · cheetah"
      title="Web installer LineageOS"
      lede="Bám mô hình grapheneos.org/install/web: WebUSB unlock + flash. Khác GrapheneOS: mirror Lineage không CORS nên nạp file local (đối chiếu SHA256), và zip ROM vẫn sideload qua recovery — không khóa bootloader."
      officialHref={sources.lineageInstall}
      officialLabel="Wiki LineageOS cheetah"
      extraActions={
        <>
          <Button variant="outline" render={<Link href={paths.flash("lineageos")} />}>
            Guide + script CLI
          </Button>
          <Button
            variant="ghost"
            render={
              <a href={sources.lineageDownloads} target="_blank" rel="noreferrer" />
            }
          >
            download.lineageos.org
          </Button>
        </>
      }
    >
      <LineageWebInstaller />
    </GuideChrome>
  );
}
