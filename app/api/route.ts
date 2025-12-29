import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/auth";

/**
 * Catch-all route for unknown /api/* requests
 * Returns 404 to hide API structure
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  logAuditEvent("unknown_api_request", ip, `GET ${req.nextUrl.pathname}`);
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  logAuditEvent("unknown_api_request", ip, `POST ${req.nextUrl.pathname}`);
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  logAuditEvent("unknown_api_request", ip, `DELETE ${req.nextUrl.pathname}`);
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  logAuditEvent("unknown_api_request", ip, `PATCH ${req.nextUrl.pathname}`);
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  logAuditEvent("unknown_api_request", ip, `PUT ${req.nextUrl.pathname}`);
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
