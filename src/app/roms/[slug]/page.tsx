import { RomDetail } from "@/components/rom-detail";
import { getRom, roms } from "@/data/roms";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return roms.map((rom) => ({ slug: rom.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rom = getRom(slug);
  if (!rom) return { title: "Không tìm thấy ROM" };
  return {
    title: rom.name,
    description: rom.tagline,
  };
}

export default async function RomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rom = getRom(slug);
  if (!rom) notFound();
  return <RomDetail rom={rom} />;
}
