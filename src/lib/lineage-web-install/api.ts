import {
  FLASH_IMAGE_NAMES,
  LINEAGE_BUILDS_API,
  type FlashImageName,
  type LineageBuild,
  type LineageBuildFile,
  type ResolvedRelease,
} from "./types";

function asFile(raw: Record<string, unknown>): LineageBuildFile | null {
  const filename = typeof raw.filename === "string" ? raw.filename : null;
  const url = typeof raw.url === "string" ? raw.url : null;
  const sha256 = typeof raw.sha256 === "string" ? raw.sha256 : null;
  const size = typeof raw.size === "number" ? raw.size : 0;
  if (!filename || !url || !sha256) return null;
  return { filename, url, sha256, size };
}

export async function fetchLatestCheetahRelease(): Promise<ResolvedRelease> {
  const resp = await fetch(LINEAGE_BUILDS_API);
  if (!resp.ok) {
    throw new Error(`API LineageOS lỗi: ${resp.status} ${resp.statusText}`);
  }
  const builds = (await resp.json()) as LineageBuild[];
  if (!Array.isArray(builds) || builds.length === 0) {
    throw new Error("API không trả build nào cho cheetah.");
  }
  const build = builds[0];
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

export function requiredFilesOf(release: ResolvedRelease): LineageBuildFile[] {
  return [...FLASH_IMAGE_NAMES.map((n) => release.images[n]), release.rom];
}

export async function sha256Hex(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyBlobSha256(
  blob: Blob,
  expect: string,
  label: string,
): Promise<void> {
  const got = await sha256Hex(blob);
  if (got !== expect.toLowerCase()) {
    throw new Error(
      `SHA256 lệch cho ${label}: expect ${expect}, got ${got}`,
    );
  }
}
