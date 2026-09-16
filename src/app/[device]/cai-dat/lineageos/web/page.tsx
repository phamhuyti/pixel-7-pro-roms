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
    "WebUSB installer kiểu GrapheneOS cho LineageOS trên Pixel 7 Pro (cheetah): adb reboot bootloader, unlock, nạp nightly + SHA256, flash recovery, auto sideload.",
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
      lede="Bám mô hình grapheneos.org/install/web: ADB vào Fastboot (`adb reboot bootloader`), WebUSB unlock + flash recovery, rồi auto sideload zip (chờ Format data / Apply from ADB). Không khóa bootloader. Mirror Lineage không CORS — installer proxy same-origin để tự tải nightly vào cache IndexedDB + SHA256 (vẫn có nạp file tay)."
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
