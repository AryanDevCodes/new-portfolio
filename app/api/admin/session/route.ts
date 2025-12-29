import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, verifySessionToken, logAuditEvent } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const cookie = req.cookies.get(getSessionCookieName());
  
  if (!cookie?.value) {
    logAuditEvent("session_check", ip, "NO_SESSION");
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  
  const validation = verifySessionToken(cookie.value, ip);
  
  if (!validation.valid) {
    logAuditEvent("session_check", ip, validation.expired ? "SESSION_EXPIRED" : "INVALID_SESSION");
    const res = NextResponse.json({ authenticated: false }, { status: 200 });
    // Clear invalid session cookie
    res.cookies.set(getSessionCookieName(), "", { maxAge: 0 });
    return res;
  }
  
  if (validation.weakBinding) {
    logAuditEvent("session_check", ip, "WEAK_IP_BINDING");
    console.warn(`[SECURITY] Session IP binding weak for ${ip}`);
  }
  
  logAuditEvent("session_check", ip, "VALID");
  return NextResponse.json({ authenticated: true }, { status: 200 });
}
