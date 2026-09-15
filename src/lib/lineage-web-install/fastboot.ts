"use client";

import {
  FastbootDevice,
  FastbootError,
  setDebugLevel,
} from "android-fastboot";
import type { FlashImageName } from "./types";
import { FLASH_IMAGE_NAMES } from "./types";

setDebugLevel(1);

export { FastbootDevice, FastbootError };

export function webUsbAvailable(): boolean {
  return typeof navigator !== "undefined" && "usb" in navigator;
}

export async function ensureConnected(
  device: FastbootDevice,
  onStatus: (msg: string) => void,
): Promise<void> {
  if (!device.isConnected) {
    onStatus("Kết nối WebUSB — chọn thiết bị ở Fastboot Mode…");
    await device.connect();
  }
}

export async function assertCheetahUnlocked(
  device: FastbootDevice,
): Promise<{ product: string; unlocked: string }> {
  const product = (await device.getVariable("product")) ?? "";
  const unlocked = (await device.getVariable("unlocked")) ?? "";
  if (product !== "cheetah") {
    throw new Error(
      `Máy báo product='${product}', không phải cheetah (Pixel 7 Pro). Dừng để tránh brick.`,
    );
  }
  if (unlocked.toLowerCase() !== "yes") {
    throw new Error(
      `Bootloader chưa unlock (unlocked=${unlocked}). Bấm Unlock trước, hoặc mở khóa theo guide catalog.`,
    );
  }
  return { product, unlocked };
}

export async function unlockBootloader(
  device: FastbootDevice,
  onStatus: (msg: string) => void,
): Promise<string> {
  await ensureConnected(device, onStatus);
  const unlocked = await device.getVariable("unlocked");
  if (unlocked === "yes") {
    return "Bootloader đã unlock sẵn.";
  }
  onStatus("Gửi lệnh unlock… xác nhận trên máy (volume + nguồn).");
  try {
    await device.runCommand("flashing unlock");
  } catch (error) {
    if (error instanceof FastbootError && error.status === "FAIL") {
      throw new Error(
        "Unlock bị từ chối trên máy. Chọn UNLOCK THE BOOTLOADER rồi thử lại.",
        { cause: error },
      );
    }
    throw error;
  }
  return "Đã gửi unlock. Máy có thể wipe và reboot — vào lại Fastboot rồi tiếp.";
}

export async function flashRecoveryImages(
  device: FastbootDevice,
  blobs: Record<FlashImageName, Blob>,
  onStatus: (msg: string, progress?: number) => void,
  onReconnect: () => Promise<void>,
): Promise<void> {
  await ensureConnected(device, onStatus);
  await assertCheetahUnlocked(device);

  const early: FlashImageName[] = [
    "boot.img",
    "dtbo.img",
    "vendor_kernel_boot.img",
  ];
  for (const name of early) {
    const partition = name.replace(/\.img$/, "");
    onStatus(`Flash ${partition}…`, 0);
    await device.flashBlob(partition, blobs[name], (p: number) => {
      onStatus(`Flash ${partition}…`, p);
    });
  }

  onStatus("Reboot bootloader trước khi flash recovery…");
  await device.reboot("bootloader", true, onReconnect);
  await assertCheetahUnlocked(device);

  onStatus("Flash Lineage Recovery (vendor_boot)…", 0);
  await device.flashBlob("vendor_boot", blobs["vendor_boot.img"], (p: number) => {
    onStatus("Flash Lineage Recovery (vendor_boot)…", p);
  });
}

export function missingFlashImages(
  blobs: Partial<Record<FlashImageName, Blob>>,
): FlashImageName[] {
  return FLASH_IMAGE_NAMES.filter((n) => !blobs[n]);
}
