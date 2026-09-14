import { FlashGuideView } from "@/components/flash-guide-view";
import { deviceIds, getCatalog, getRom } from "@/data/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return deviceIds.flatMap((device) => {
    const catalog = getCatalog(device);
    if (!catalog) return [];
    return Object.keys(catalog.flashGuides).map((slug) => ({ device, slug }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ device: string; slug: string }>;
}): Promise<Metadata> {
  const { device, slug } = await params;
  const catalog = getCatalog(device);
  const rom = catalog ? getRom(catalog, slug) : undefined;
  const guide = catalog?.flashGuides[slug];
  if (!rom || !guide) return { title: "Không có hướng dẫn flash" };
  return { title: `Flash ${rom.name}`, description: guide.summary };
}

export default async function FlashRomPage({
  params,
}: {
  params: Promise<{ device: string; slug: string }>;
}) {
  const { device, slug } = await params;
  const catalog = getCatalog(device);
  const rom = catalog ? getRom(catalog, slug) : undefined;
  const guide = catalog?.flashGuides[slug];
  if (!catalog || !rom || !guide) notFound();
  return <FlashGuideView catalog={catalog} rom={rom} guide={guide} />;
}
