import { CatalogApp } from "@/components/catalog-app";
import { Disclaimer } from "@/components/disclaimer";
import { Hero } from "@/components/hero";
import { getCatalog } from "@/data/registry";
import { notFound } from "next/navigation";

export default async function DeviceHomePage({
  params,
}: {
  params: Promise<{ device: string }>;
}) {
  const { device } = await params;
  const catalog = getCatalog(device);
  if (!catalog) notFound();
  return (
    <>
      <Hero catalog={catalog} />
      <Disclaimer catalog={catalog} />
      <CatalogApp />
    </>
  );
}
