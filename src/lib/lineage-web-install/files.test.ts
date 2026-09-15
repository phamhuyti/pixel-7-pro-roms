import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  parseCheetahBuilds,
  sha256Hex,
  verifyBlobSha256,
} from "./api";
import {
  assertBlobSize,
  matchRequiredFile,
  normalizeDownloadName,
  planFileIngest,
  snapshotSelectedFiles,
} from "./files";

describe("normalizeDownloadName", () => {
  it("strips Chrome/Windows (N) suffixes", () => {
    assert.equal(normalizeDownloadName("boot (1).img"), "boot.img");
    assert.equal(
      normalizeDownloadName("lineage-23.2-20260915-nightly-cheetah-signed (2).zip"),
      "lineage-23.2-20260915-nightly-cheetah-signed.zip",
    );
  });

  it("keeps canonical names and uses basename", () => {
    assert.equal(normalizeDownloadName("boot.img"), "boot.img");
    assert.equal(normalizeDownloadName("C:\\\\Users\\\\a\\\\Downloads\\\\dtbo.img"), "dtbo.img");
  });
});

describe("matchRequiredFile / planFileIngest", () => {
  const needed = [
    { filename: "boot.img" },
    { filename: "dtbo.img" },
    { filename: "lineage-23.2-20260915-nightly-cheetah-signed.zip" },
  ];

  it("matches exact and (N) names, case-insensitive", () => {
    assert.equal(matchRequiredFile("boot.img", needed)?.filename, "boot.img");
    assert.equal(matchRequiredFile("boot (1).img", needed)?.filename, "boot.img");
    assert.equal(matchRequiredFile("DTBO.IMG", needed)?.filename, "dtbo.img");
  });

  it("ignores unrelated files and last-wins duplicates", () => {
    const plan = planFileIngest(
      [
        { name: "notes.txt" },
        { name: "boot.img" },
        { name: "boot (1).img" },
        { name: "dtbo.img" },
      ],
      needed,
    );
    assert.deepEqual(plan.unmatched, ["notes.txt"]);
    assert.equal(plan.matched.length, 2);
    const boot = plan.matched.find((m) => m.meta.filename === "boot.img");
    assert.equal(boot?.file.name, "boot (1).img");
  });
});

describe("snapshotSelectedFiles", () => {
  it("copies File objects so a later FileList clear cannot empty the array", () => {
    const files = [
      new File(["a"], "boot.img", { type: "application/octet-stream" }),
      new File(["b"], "dtbo.img", { type: "application/octet-stream" }),
    ];
    const snap = snapshotSelectedFiles(files);
    files.pop();
    assert.equal(snap.length, 2);
    assert.equal(snap[0]?.name, "boot.img");
    assert.equal(snapshotSelectedFiles(null).length, 0);
  });
});

describe("assertBlobSize", () => {
  it("accepts matching size and rejects mismatch", () => {
    assertBlobSize({ size: 16 }, 16, "dtbo.img");
    assert.throws(
      () => assertBlobSize({ size: 10 }, 16, "dtbo.img"),
      /dtbo\.img: dung lượng 10 byte/,
    );
  });
});

describe("sha256Hex", () => {
  it("matches the NIST empty and abc vectors", async () => {
    assert.equal(
      await sha256Hex(new Blob([])),
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
    assert.equal(
      await sha256Hex(new Blob(["abc"])),
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("reports progress and verifyBlobSha256 rejects a bad digest", async () => {
    const ticks: number[] = [];
    await sha256Hex(new Blob(["abc"]), (done, total) => {
      ticks.push(done, total);
    });
    assert.ok(ticks.length >= 2);
    await assert.rejects(
      verifyBlobSha256(new Blob(["abc"]), "00".repeat(32), "abc"),
      /SHA256 lệch cho abc/,
    );
  });

  it("streams a larger blob to the same digest as WebCrypto", async () => {
    const data = new Uint8Array(256 * 1024);
    data.fill(7);
    const streamed = await sha256Hex(new Blob([data]));
    const native = Buffer.from(
      await crypto.subtle.digest("SHA-256", data),
    ).toString("hex");
    assert.equal(streamed, native);
  });
});

describe("parseCheetahBuilds", () => {
  it("reads the official API shape fixture", () => {
    const raw = JSON.parse(
      readFileSync(new URL("./builds-fixture.json", import.meta.url), "utf8"),
    ) as unknown;
    const release = parseCheetahBuilds(raw);
    assert.equal(release.version, "23.2");
    assert.equal(release.images["boot.img"]?.filename, "boot.img");
    assert.match(release.rom.filename, /^lineage-.*-cheetah-signed\.zip$/);
  });
});
