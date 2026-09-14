"use client";

import type { DeviceCatalog } from "@/data/types";
import { pathsFor, type DevicePaths } from "@/lib/paths";
import { createContext, useContext, type ReactNode } from "react";

type DeviceContextValue = {
  catalog: DeviceCatalog;
  paths: DevicePaths;
};

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function DeviceProvider({
  catalog,
  children,
}: {
  catalog: DeviceCatalog;
  children: ReactNode;
}) {
  const paths = pathsFor(catalog.id);
  return (
    <DeviceContext.Provider value={{ catalog, paths }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const value = useContext(DeviceContext);
  if (!value) {
    throw new Error("useDevice must be used under DeviceProvider");
  }
  return value;
}
