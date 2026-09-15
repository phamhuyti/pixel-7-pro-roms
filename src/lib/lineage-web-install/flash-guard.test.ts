import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { sha256Hex, parseCheetahBuilds } from "./api";
import { matchRequiredFile, planFileIngest } from "./files";
import {
  assertProductCheetah,
  loadVerifiedFlashImages,
  loadVerifiedRomZip,
  verifyReleaseBlob,
} from "./flash-guard";
import { FLASH_IMAGE_NAMES, type ResolvedRelease } from "./types";

async function metaFor(
  filename: string,
  blob: Blob,
): Promise<{ filename: string; url: string; sha256: string; size: number }> {
  return {
    filename,
    url: `https://example.invalid/${filename}`,
    sha256: await sha256Hex(blob),
    size: blob.size,
  };
}

describe("assertProductCheetah", () => {
  it("allows cheetah and rejects other Pixel products", () => {
    assertProductCheetah("cheetah");
    assert.throws(() => assertProductCheetah("panther"), /panther/);
    assert.throws(() => assertProductCheetah("lynx"), /lynx/);
    assert.throws(() => assertProductCheetah(""), /không phải cheetah/);
  });
});

describe("wrong-file flash guard", () => {
  it("rejects a 64 MiB-class swap: vendor_boot bytes named as boot.img", async () => {
    // Cheetah boot / vendor_boot / vendor_kernel_boot are the same size;
    // size checks alone would accept this swap.
    const boot = new Blob([new Uint8Array(64).fill(1)]);
    const vendorBoot = new Blob([new Uint8Array(64).fill(2)]);
    assert.equal(boot.size, vendorBoot.size);

    const bootMeta = await metaFor("boot.img", boot);
    await verifyReleaseBlob(boot, bootMeta);

    await assert.rejects(
      verifyReleaseBlob(vendorBoot, bootMeta, "boot.img"),
      /SHA256 lệch cho boot\.img/,
    );
  });

  it("rejects a matching name with the wrong size before hashing", async () => {
    const expected = new Blob([new Uint8Array(16).fill(3)]);
    const tooSmall = new Blob([new Uint8Array(9).fill(3)]);
    const meta = await metaFor("dtbo.img", expected);
    await assert.rejects(
      verifyReleaseBlob(tooSmall, meta),
      /dtbo\.img: dung lượng 9 byte/,
    );
  });

  it("rejects a stale nightly cached under the same filename", async () => {
    const current = new Blob([new Uint8Array(32).fill(4)]);
    const lastWeek = new Blob([new Uint8Array(32).fill(5)]);
    const currentMeta = await metaFor("boot.img", current);
    await assert.rejects(
      verifyReleaseBlob(lastWeek, currentMeta),
      /SHA256 lệch cho boot\.img/,
    );
  });

  it("does not treat a panther ROM zip as the cheetah nightly", () => {
    const needed = [
      { filename: "boot.img" },
      { filename: "lineage-23.2-20260915-nightly-cheetah-signed.zip" },
    ];
    assert.equal(
      matchRequiredFile(
        "lineage-23.2-20260915-nightly-panther-signed.zip",
        needed,
      ),
      undefined,
    );
    const plan = planFileIngest(
      [{ name: "lineage-23.2-20260915-nightly-panther-signed.zip" }],
      needed,
    );
    assert.deepEqual(plan.matched, []);
    assert.equal(plan.unmatched.length, 1);
  });

  it("loadVerifiedFlashImages refuses a store that swapped boot and vendor_boot", async () => {
    const files: Record<string, Blob> = {
      "boot.img": new Blob([new Uint8Array(8).fill(10)]),
      "dtbo.img": new Blob([new Uint8Array(8).fill(11)]),
      "vendor_kernel_boot.img": new Blob([new Uint8Array(8).fill(12)]),
      "vendor_boot.img": new Blob([new Uint8Array(8).fill(13)]),
    };
    const release: ResolvedRelease = {
      date: "2026-09-15",
      version: "23.2",
      rom: await metaFor("lineage-23.2-20260915-nightly-cheetah-signed.zip", new Blob(["rom"])),
      images: {
        "boot.img": await metaFor("boot.img", files["boot.img"]!),
        "dtbo.img": await metaFor("dtbo.img", files["dtbo.img"]!),
        "vendor_kernel_boot.img": await metaFor(
          "vendor_kernel_boot.img",
          files["vendor_kernel_boot.img"]!,
        ),
        "vendor_boot.img": await metaFor("vendor_boot.img", files["vendor_boot.img"]!),
      },
    };

    const ok = await loadVerifiedFlashImages(
      async (name) => files[name] ?? null,
      release,
    );
    assert.equal(FLASH_IMAGE_NAMES.every((n) => ok[n] instanceof Blob), true);

    const swapped = {
      ...files,
      "boot.img": files["vendor_boot.img"]!,
      "vendor_boot.img": files["boot.img"]!,
    };
    await assert.rejects(
      loadVerifiedFlashImages(async (name) => swapped[name] ?? null, release),
      /SHA256 lệch cho boot\.img/,
    );
  });

  it("loadVerifiedRomZip refuses a panther payload stored as the cheetah zip name", async () => {
    const cheetahZip = new Blob(["cheetah-rom"]);
    const pantherZip = new Blob(["panther-rom"]);
    const release = parseCheetahBuilds(
      JSON.parse(
        readFileSync(new URL("./builds-fixture.json", import.meta.url), "utf8"),
      ),
    );
    const store: Record<string, Blob> = {
      [release.rom.filename]: pantherZip,
    };
    await assert.rejects(
      loadVerifiedRomZip(async (name) => store[name] ?? null, {
        ...release,
        rom: { ...release.rom, sha256: await sha256Hex(cheetahZip), size: cheetahZip.size },
      }),
      /SHA256 lệch/,
    );
  });

  it("never returns flash blobs when any image is missing", async () => {
    const release = parseCheetahBuilds(
      JSON.parse(
        readFileSync(new URL("./builds-fixture.json", import.meta.url), "utf8"),
      ),
    );
    await assert.rejects(
      loadVerifiedFlashImages(async () => null, release),
      /Chưa nạp boot\.img/,
    );
  });
});
