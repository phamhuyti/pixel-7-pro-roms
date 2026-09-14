import { RomDetail } from "@/components/rom-detail";
import { deviceIds, getCatalog, getRom } from "@/data/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return deviceIds.flatMap((device) => {
    const catalog = getCatalog(device);
    if (!catalog) return [];
    return catalog.roms.map((rom) => ({ device, slug: rom.slug }));
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
  if (!rom) return { title: "Không tìm thấy ROM" };
  return { title: rom.name, description: rom.tagline };
}

export default async function RomPage({
  params,
}: {
  params: Promise<{ device: string; slug: string }>;
}) {
  const { device, slug } = await params;
  const catalog = getCatalog(device);
  const rom = catalog ? getRom(catalog, slug) : undefined;
  if (!catalog || !rom) notFound();
  return <RomDetail rom={rom} catalog={catalog} />;
}
