import { UnlockGuideView } from "@/components/unlock-guide-view";
import { getCatalog } from "@/data/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ device: string }>;
}): Promise<Metadata> {
  const catalog = getCatalog((await params).device);
  if (!catalog) return { title: "Mở khóa bootloader" };
  return {
    title: "Mở khóa bootloader",
    description: catalog.unlockGuide.summary,
  };
}

export default async function UnlockPage({
  params,
}: {
  params: Promise<{ device: string }>;
}) {
  const catalog = getCatalog((await params).device);
  if (!catalog) notFound();
  return <UnlockGuideView catalog={catalog} />;
}
