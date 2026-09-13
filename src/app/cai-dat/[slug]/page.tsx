import { FlashGuideView } from "@/components/flash-guide-view";
import { flashGuideSlugs, getFlashGuide } from "@/data/flash";
import { getRom } from "@/data/roms";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return flashGuideSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rom = getRom(slug);
  const guide = getFlashGuide(slug);
  if (!rom || !guide) return { title: "Không có hướng dẫn flash" };
  return {
    title: `Flash ${rom.name}`,
    description: guide.summary,
  };
}

export default async function FlashRomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rom = getRom(slug);
  const guide = getFlashGuide(slug);
  if (!rom || !guide) notFound();
  return <FlashGuideView rom={rom} guide={guide} />;
}
