import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatBuildMark } from "./build-info";

describe("formatBuildMark", () => {
  it("includes sha and UTC stamp", () => {
    assert.equal(
      formatBuildMark("2bedb15", "2026-09-15T15:22:00.000Z"),
      "bản web 2bedb15 · 15/09/2026 15:22 UTC",
    );
  });

  it("falls back when time is missing", () => {
    assert.equal(formatBuildMark("docker", ""), "bản web docker");
  });
});
