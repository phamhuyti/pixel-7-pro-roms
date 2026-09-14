import { DeviceProvider } from "@/components/device-context";
import { deviceIds, getCatalog, isDeviceId } from "@/data/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return deviceIds.map((device) => ({ device }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ device: string }>;
}): Promise<Metadata> {
  const { device } = await params;
  const catalog = getCatalog(device);
  if (!catalog) return { title: "Không có máy này" };
  return {
    title: {
      default: `Custom ROM ${catalog.name}`,
      template: `%s · ${catalog.shortName}`,
    },
    description: catalog.heroLede,
  };
}

export default async function DeviceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ device: string }>;
}) {
  const { device } = await params;
  if (!isDeviceId(device)) notFound();
  const catalog = getCatalog(device);
  if (!catalog) notFound();
  return <DeviceProvider catalog={catalog}>{children}</DeviceProvider>;
}
