/**
 * Helpers for step 4 (nạp file local). Chrome's FileList is *live*: clearing
 * input.value empties any leftover FileList reference, so callers must copy
 * File objects first.
 */

export function snapshotSelectedFiles(
  list: FileList | File[] | null | undefined,
): File[] {
  if (!list || list.length === 0) return [];
  return Array.from(list);
}

/**
 * Chrome/Windows re-downloads become `boot (1).img`. Keep the canonical
 * Lineage filename so SHA256 can still run against the right metadata.
 */
export function normalizeDownloadName(name: string): string {
  const base = (name.split(/[/\\]/).pop() ?? name).trim();
  return base.replace(/ \((\d+)\)(?=\.[^./\\]+$)/u, "");
}

export function matchRequiredFile<T extends { filename: string }>(
  fileName: string,
  required: T[],
): T | undefined {
  const raw = fileName.split(/[/\\]/).pop() ?? fileName;
  const exact = required.find((f) => f.filename === raw);
  if (exact) return exact;
  const norm = normalizeDownloadName(raw);
  const lowerRaw = raw.toLowerCase();
  const lowerNorm = norm.toLowerCase();
  return required.find((f) => {
    const want = f.filename;
    const wantLower = want.toLowerCase();
    return want === norm || wantLower === lowerRaw || wantLower === lowerNorm;
  });
}

export type IngestPlan<T extends { filename: string }, F extends { name: string }> =
  {
    matched: { file: F; meta: T }[];
    unmatched: string[];
  };

export function planFileIngest<
  T extends { filename: string },
  F extends { name: string },
>(files: F[], needed: T[]): IngestPlan<T, F> {
  const unmatched: string[] = [];
  const byKey = new Map<string, { file: F; meta: T }>();
  for (const file of files) {
    const meta = matchRequiredFile(file.name, needed);
    if (!meta) {
      unmatched.push(file.name);
      continue;
    }
    byKey.set(meta.filename, { file, meta });
  }
  return { matched: [...byKey.values()], unmatched };
}

export function assertBlobSize(
  blob: { size: number },
  expected: number,
  label: string,
): void {
  if (expected > 0 && blob.size !== expected) {
    throw new Error(
      `${label}: dung lượng ${blob.size} byte, API ghi ${expected} byte. ` +
        "Sai bản nightly hoặc file tải dở — tải lại đúng 5 file trên trang này.",
    );
  }
}
