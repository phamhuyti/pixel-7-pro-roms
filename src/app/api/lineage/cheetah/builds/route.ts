import { NextResponse } from "next/server";
import { LINEAGE_BUILDS_API } from "@/lib/lineage-web-install/types";

export const dynamic = "force-dynamic";

/** Same-origin proxy when the browser cannot call download.lineageos.org. */
export async function GET() {
  try {
    const resp = await fetch(LINEAGE_BUILDS_API, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    if (!resp.ok) {
      return NextResponse.json(
        { error: `API LineageOS lỗi: ${resp.status} ${resp.statusText}` },
        { status: 502 },
      );
    }
    const data: unknown = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Không gọi được API LineageOS.",
      },
      { status: 502 },
    );
  }
}
