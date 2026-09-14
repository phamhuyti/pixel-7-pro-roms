import { RootOverviewView } from "@/components/root-overview-view";
import { getCatalog } from "@/data/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ device: string }>;
}): Promise<Metadata> {
  const catalog = getCatalog((await params).device);
  if (!catalog) return { title: "Magisk và KernelSU" };
  return {
    title: "Magisk và KernelSU",
    description: `Root ${catalog.name}. Không hướng dẫn giả Play Integrity.`,
  };
}

export default async function RootOverviewPage({
  params,
}: {
  params: Promise<{ device: string }>;
}) {
  const catalog = getCatalog((await params).device);
  if (!catalog) notFound();
  return <RootOverviewView catalog={catalog} />;
}
