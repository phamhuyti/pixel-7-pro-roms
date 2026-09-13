import { CatalogApp } from "@/components/catalog-app";
import { Disclaimer } from "@/components/disclaimer";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Disclaimer />
      <CatalogApp />
    </>
  );
}
