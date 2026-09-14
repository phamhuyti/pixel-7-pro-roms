import { InstallHub } from "@/components/install-hub";
import { getCatalog } from "@/data/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ device: string }>;
}): Promise<Metadata> {
  const catalog = getCatalog((await params).device);
  if (!catalog) return { title: "Cài đặt" };
  return {
    title: "Cài đặt",
    description: `Mở khóa bootloader và flash custom ROM trên ${catalog.name}. Wiki official thắng nếu lệch.`,
  };
}

export default async function InstallPage({
  params,
}: {
  params: Promise<{ device: string }>;
}) {
  const catalog = getCatalog((await params).device);
  if (!catalog) notFound();
  return <InstallHub catalog={catalog} />;
}
