import { SwitchOverviewView } from "@/components/switch-overview-view";
import { getCatalog } from "@/data/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ device: string }>;
}): Promise<Metadata> {
  const catalog = getCatalog((await params).device);
  if (!catalog) return { title: "Flash khi đang ở custom ROM" };
  return {
    title: "Flash khi đang ở custom ROM",
    description: catalog.switchOverview.summary,
  };
}

export default async function SwitchRomPage({
  params,
}: {
  params: Promise<{ device: string }>;
}) {
  const catalog = getCatalog((await params).device);
  if (!catalog) notFound();
  return <SwitchOverviewView catalog={catalog} />;
}
