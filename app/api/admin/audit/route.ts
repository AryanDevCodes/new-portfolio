import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, verifySessionToken, getAuditLog } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const cookie = req.cookies.get(getSessionCookieName());
  
  // Verify admin is authenticated
  if (!cookie?.value || !verifySessionToken(cookie.value, ip).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get optional filters
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const ipFilter = searchParams.get("ip");
  const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
  const offset = parseInt(searchParams.get("offset") || "0");

  let logs = getAuditLog();
  
  // Apply filters
  if (action) {
    logs = logs.filter(log => log.action.includes(action));
  }
  if (ipFilter) {
    logs = logs.filter(log => log.ip === ipFilter);
  }
  
  // Sort by timestamp descending (newest first)
  logs = logs.sort((a, b) => b.timestamp - a.timestamp);
  
  // Paginate
  const total = logs.length;
  logs = logs.slice(offset, offset + limit);

  return NextResponse.json({
    logs,
    pagination: { limit, offset, total },
  });
}
