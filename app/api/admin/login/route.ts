import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, getSessionCookieName, checkRateLimit, logAuditEvent, verifyCSRFToken, generateCSRFToken, getCSRFTokenCookieName, detectSuspiciousActivity } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";
  
  // Check rate limiting
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    logAuditEvent("login_attempt", ip, "BLOCKED_RATE_LIMIT");
    return NextResponse.json({ error: "Too many attempts. Try later." }, { status: 429 });
  }

  // Check for suspicious activity
  const suspicious = detectSuspiciousActivity(ip);
  if (suspicious.suspicious) {
    logAuditEvent("login_attempt", ip, `SUSPICIOUS_ACTIVITY: ${suspicious.reasons.join(", ")}`);
    console.warn(`[SECURITY] Suspicious login attempt from ${ip}:`, suspicious.reasons);
  }

  // Verify CSRF token
  const body = await req.json().catch(() => null);
  const csrfToken = body?.csrfToken ?? "";
  if (!csrfToken || !verifyCSRFToken(csrfToken)) {
    logAuditEvent("login_attempt", ip, "INVALID_CSRF_TOKEN");
    return NextResponse.json({ error: "Invalid request. Please refresh and try again." }, { status: 403 });
  }

  const password = body?.password ?? "";
  const configured = process.env.ADMIN_PASSWORD ?? "";

  if (!configured) {
    logAuditEvent("login_attempt", ip, "ERROR_NO_PASSWORD_CONFIGURED");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  if (password !== configured) {
    logAuditEvent("login_attempt", ip, "FAILED_INVALID_PASSWORD");
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // Successful login
  logAuditEvent("login_success", ip, "SUCCESS");
  const token = createSessionToken(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 12 * 60 * 60, // 12h
  });
  return res;
}

// GET endpoint to get CSRF token
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const csrfToken = generateCSRFToken();
  const res = NextResponse.json({ csrfToken });
  res.cookies.set(getCSRFTokenCookieName(), csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 30 * 60, // 30 minutes
  });
  return res;
}
