import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
import { logAuditEvent } from "@/lib/auth";

/**
 * Catch-all route for /api/admin/* requests that don't match specific endpoints
 * Returns 404 to hide the existence of admin routes
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  logAuditEvent("admin_discovery_attempt", ip, `GET ${req.nextUrl.pathname}`);
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  logAuditEvent("admin_discovery_attempt", ip, `POST ${req.nextUrl.pathname}`);
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  logAuditEvent("admin_discovery_attempt", ip, `DELETE ${req.nextUrl.pathname}`);
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  logAuditEvent("admin_discovery_attempt", ip, `PATCH ${req.nextUrl.pathname}`);
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
