import { TopicGuideView } from "@/components/topic-guide-view";
import { deviceIds, getCatalog } from "@/data/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SLUG = "hotspot-6ghz";

export function generateStaticParams() {
  return deviceIds
    .filter((device) => Boolean(getCatalog(device)?.topicGuides?.[SLUG]))
    .map((device) => ({ device }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ device: string }>;
}): Promise<Metadata> {
  const catalog = getCatalog((await params).device);
  const guide = catalog?.topicGuides?.[SLUG];
  if (!guide) return { title: "Hotspot 6GHz" };
  return {
    title: guide.title,
    description: guide.summary,
  };
}

export default async function Hotspot6GhzPage({
  params,
}: {
  params: Promise<{ device: string }>;
}) {
  const catalog = getCatalog((await params).device);
  const guide = catalog?.topicGuides?.[SLUG];
  if (!catalog || !guide) notFound();
  return <TopicGuideView catalog={catalog} guide={guide} slug={SLUG} />;
}
