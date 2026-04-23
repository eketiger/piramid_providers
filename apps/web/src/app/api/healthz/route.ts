import { NextResponse } from "next/server";

// Liveness endpoint for CloudFront/load balancer + uptime checks.
// Intentionally cheap — no DB, no downstream API call. If Next.js can render
// this route we consider the web runtime healthy.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "@piramid/web",
      uptimeMs: process.uptime() * 1000,
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
      time: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
