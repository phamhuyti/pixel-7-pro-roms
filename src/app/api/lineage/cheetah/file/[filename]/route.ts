import { resolveOfficialCheetahFile } from "@/lib/lineage-web-install/proxy";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/** Long enough for the ~1.4 GiB ROM zip on hosts that honor maxDuration. */
export const maxDuration = 3600;

type RouteCtx = { params: Promise<{ filename: string }> };

/**
 * Stream one official cheetah nightly file through the app origin so the
 * browser can cache it in IndexedDB (mirrorbits / community mirrors lack CORS).
 * Filename is resolved against download.lineageos.org — never a client URL.
 */
export async function GET(_req: Request, ctx: RouteCtx) {
  const raw = (await ctx.params).filename;
  const filename = decodeURIComponent(raw);

  let file;
  try {
    file = await resolveOfficialCheetahFile(filename);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = message.includes("không có trong nightly")
      ? 404
      : message.includes("không hợp lệ")
        ? 400
        : 502;
    return NextResponse.json({ error: message }, { status });
  }

  let upstream: Response;
  try {
    upstream = await fetch(file.url, {
      redirect: "follow",
      cache: "no-store",
      headers: { Accept: "application/octet-stream" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Không tải được mirror: ${error.message}`
            : "Không tải được mirror LineageOS.",
      },
      { status: 502 },
    );
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      {
        error: `Mirror LineageOS lỗi: ${upstream.status} ${upstream.statusText}`,
      },
      { status: 502 },
    );
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    upstream.headers.get("Content-Type") ?? "application/octet-stream",
  );
  const length = upstream.headers.get("Content-Length");
  if (length) headers.set("Content-Length", length);
  else if (file.size > 0) headers.set("Content-Length", String(file.size));
  headers.set(
    "Content-Disposition",
    `attachment; filename="${file.filename}"`,
  );
  headers.set("Cache-Control", "private, max-age=300");
  headers.set("X-Lineage-Filename", file.filename);
  headers.set("X-Lineage-Sha256", file.sha256);

  return new NextResponse(upstream.body, { status: 200, headers });
}
