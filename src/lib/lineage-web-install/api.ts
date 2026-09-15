import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import {
  FLASH_IMAGE_NAMES,
  LINEAGE_BUILDS_API,
  LINEAGE_BUILDS_API_PROXY,
  type FlashImageName,
  type LineageBuild,
  type LineageBuildFile,
  type ResolvedRelease,
} from "./types";

function asFile(raw: Record<string, unknown>): LineageBuildFile | null {
  const filename = typeof raw.filename === "string" ? raw.filename : null;
  const url = typeof raw.url === "string" ? raw.url : null;
  const sha256sum = typeof raw.sha256 === "string" ? raw.sha256 : null;
  const size = typeof raw.size === "number" ? raw.size : 0;
  if (!filename || !url || !sha256sum) return null;
  return { filename, url, sha256: sha256sum, size };
}

export function parseCheetahBuilds(builds: unknown): ResolvedRelease {
  if (!Array.isArray(builds) || builds.length === 0) {
    throw new Error("API không trả build nào cho cheetah.");
  }
  const build = builds[0] as LineageBuild;
  const files = (build.files ?? [])
    .map((f) => asFile(f as unknown as Record<string, unknown>))
    .filter((f): f is LineageBuildFile => f !== null);

  const rom = files.find(
    (f) =>
      f.filename.startsWith("lineage-") &&
      f.filename.endsWith("-cheetah-signed.zip"),
  );
  if (!rom) {
    throw new Error("Không thấy zip ROM signed cho cheetah trong build mới nhất.");
  }

  const images = {} as Record<FlashImageName, LineageBuildFile>;
  for (const name of FLASH_IMAGE_NAMES) {
    const file = files.find((f) => f.filename === name);
    if (!file) {
      throw new Error(`Thiếu ${name} trong build ${build.date}.`);
    }
    images[name] = file;
  }

  return {
    date: build.date,
    version: build.version,
    rom,
    images,
  };
}

async function fetchBuildsJson(apiUrl: string): Promise<unknown> {
  const resp = await fetch(apiUrl, { signal: AbortSignal.timeout(8_000) });
  if (!resp.ok) {
    throw new Error(`API LineageOS lỗi: ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}

export async function fetchLatestCheetahRelease(
  apiUrl: string = LINEAGE_BUILDS_API,
): Promise<ResolvedRelease> {
  return parseCheetahBuilds(await fetchBuildsJson(apiUrl));
}

/** Same-origin proxy first (no CORS), then download.lineageos.org. */
export async function fetchLatestCheetahReleaseWithFallback(): Promise<ResolvedRelease> {
  const urls = [LINEAGE_BUILDS_API_PROXY, LINEAGE_BUILDS_API];
  let last: unknown;
  for (const url of urls) {
    try {
      return await fetchLatestCheetahRelease(url);
    } catch (error) {
      last = error;
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}

export function requiredFilesOf(release: ResolvedRelease): LineageBuildFile[] {
  return [...FLASH_IMAGE_NAMES.map((n) => release.images[n]), release.rom];
}

export type HashProgress = (done: number, total: number) => void;

/**
 * Streaming SHA-256 so the ~1.4 GiB ROM zip is not copied into a single
 * ArrayBuffer (that OOM/hangs Chromium tabs).
 */
export async function sha256Hex(
  blob: Blob,
  onProgress?: HashProgress,
): Promise<string> {
  const hasher = sha256.create();
  const total = blob.size;
  if (total === 0) {
    onProgress?.(0, 0);
    return bytesToHex(hasher.digest());
  }

  if (typeof blob.stream === "function") {
    const reader = blob.stream().getReader();
    let doneBytes = 0;
    let lastYield = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;
      hasher.update(value);
      doneBytes += value.byteLength;
      onProgress?.(doneBytes, total);
      const now = Date.now();
      if (now - lastYield > 80) {
        lastYield = now;
        await new Promise((r) => setTimeout(r, 0));
      }
    }
    return bytesToHex(hasher.digest());
  }

  const buffer = new Uint8Array(await blob.arrayBuffer());
  hasher.update(buffer);
  onProgress?.(buffer.byteLength, total);
  return bytesToHex(hasher.digest());
}

export async function verifyBlobSha256(
  blob: Blob,
  expect: string,
  label: string,
  onProgress?: HashProgress,
): Promise<void> {
  const got = await sha256Hex(blob, onProgress);
  if (got !== expect.toLowerCase()) {
    throw new Error(
      `SHA256 lệch cho ${label}: expect ${expect}, got ${got}. ` +
        "Sai bản nightly hoặc file hỏng — tải lại đúng file trên trang này.",
    );
  }
}
