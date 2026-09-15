import { parseCheetahBuilds } from "./api";
import { LINEAGE_BUILDS_API, type LineageBuildFile } from "./types";

const SAFE_FILENAME = /^[A-Za-z0-9._+-]+$/;

/** Reject path tricks before looking the name up in the builds API. */
export function isSafeLineageFilename(filename: string): boolean {
  return (
    filename.length > 0 &&
    filename.length < 200 &&
    !filename.includes("/") &&
    !filename.includes("\\") &&
    !filename.includes("..") &&
    SAFE_FILENAME.test(filename)
  );
}

export function findReleaseFile(
  releaseFiles: LineageBuildFile[],
  filename: string,
): LineageBuildFile | null {
  if (!isSafeLineageFilename(filename)) return null;
  return releaseFiles.find((f) => f.filename === filename) ?? null;
}

/**
 * Resolve a cheetah nightly file against the official builds API only.
 * Never takes a raw upstream URL from the client (SSRF).
 */
export async function resolveOfficialCheetahFile(
  filename: string,
): Promise<LineageBuildFile> {
  if (!isSafeLineageFilename(filename)) {
    throw new Error(`Tên file không hợp lệ: ${filename}`);
  }
  const resp = await fetch(LINEAGE_BUILDS_API, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!resp.ok) {
    throw new Error(`API LineageOS lỗi: ${resp.status} ${resp.statusText}`);
  }
  const release = parseCheetahBuilds(await resp.json());
  const files = [
    release.rom,
    ...Object.values(release.images),
  ];
  const file = findReleaseFile(files, filename);
  if (!file) {
    throw new Error(
      `${filename} không có trong nightly ${release.date}. ` +
        "Chỉ proxy đúng 5 file của bản mới nhất.",
    );
  }
  return file;
}
