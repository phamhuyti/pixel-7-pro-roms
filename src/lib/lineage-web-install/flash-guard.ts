import {
  verifyBlobSha256,
  type HashProgress,
} from "./api";
import { assertBlobSize } from "./files";
import {
  FLASH_IMAGE_NAMES,
  LINEAGE_DEVICE,
  type FlashImageName,
  type LineageBuildFile,
  type ResolvedRelease,
} from "./types";

/**
 * Gate before `fastboot flash` / sideload: name+size+SHA256 of the *current*
 * nightly. Same-size partitions (boot / vendor_boot / vendor_kernel_boot are
 * all 64 MiB on cheetah) cannot be swapped — size is not enough.
 */
export async function verifyReleaseBlob(
  blob: Blob,
  meta: LineageBuildFile,
  label = meta.filename,
  onProgress?: HashProgress,
): Promise<void> {
  assertBlobSize(blob, meta.size, label);
  await verifyBlobSha256(blob, meta.sha256, label, onProgress);
}

export async function loadVerifiedFlashImages(
  loadFile: (name: string) => Promise<Blob | null>,
  release: ResolvedRelease,
): Promise<Record<FlashImageName, Blob>> {
  const blobs = {} as Record<FlashImageName, Blob>;
  for (const name of FLASH_IMAGE_NAMES) {
    const blob = await loadFile(name);
    if (!blob) {
      throw new Error(
        `Chưa nạp ${name}. Tải từ link official rồi “Nạp file đã tải”.`,
      );
    }
    await verifyReleaseBlob(blob, release.images[name], name);
    blobs[name] = blob;
  }
  return blobs;
}

export async function loadVerifiedRomZip(
  loadFile: (name: string) => Promise<Blob | null>,
  release: ResolvedRelease,
): Promise<Blob> {
  const rom = await loadFile(release.rom.filename);
  if (!rom) {
    throw new Error(
      `Chưa nạp ${release.rom.filename}. Tải + nạp file ở bước 4.`,
    );
  }
  await verifyReleaseBlob(rom, release.rom);
  return rom;
}

export function assertProductCheetah(product: string): void {
  if (product !== LINEAGE_DEVICE) {
    throw new Error(
      `Máy báo product='${product}', không phải ${LINEAGE_DEVICE} (Pixel 7 Pro). Dừng để tránh brick.`,
    );
  }
}
