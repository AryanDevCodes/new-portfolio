import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, verifySessionToken, logAuditEvent as auditLog } from "@/lib/auth";

// Re-export for convenience
export const logAuditEvent = auditLog;

/**
 * Middleware to protect admin endpoints
 * Usage: Call at the start of any protected route handler
 */
export async function requireAdminAuth(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const cookie = req.cookies.get(getSessionCookieName());
  
  if (!cookie?.value) {
    logAuditEvent("unauthorized_access", ip, "NO_SESSION");
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  
  const validation = verifySessionToken(cookie.value, ip);
  if (!validation.valid) {
    logAuditEvent("unauthorized_access", ip, validation.expired ? "SESSION_EXPIRED" : "INVALID_SESSION");
    const res = NextResponse.json({ error: "Session expired" }, { status: 401 });
    res.cookies.set(getSessionCookieName(), "", { maxAge: 0 });
    return { authorized: false, response: res };
  }
  
  return { authorized: true, ip, userAgent: req.headers.get("user-agent") ?? "unknown" };
}

/**
 * Validate and sanitize input to prevent injection attacks
 */
export function validateInput(data: unknown, schema: Record<string, string>) {
  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["Invalid input"] };
  }
  
  const errors: string[] = [];
  const validated: Record<string, unknown> = {};
  
  for (const [key, type] of Object.entries(schema)) {
    const value = (data as Record<string, unknown>)[key];
    
    if (type === "string") {
      if (typeof value !== "string") {
        errors.push(`${key} must be a string`);
      } else if (value.length > 5000) {
        errors.push(`${key} too long (max 5000 chars)`);
      } else {
        // Basic XSS prevention
        validated[key] = sanitizeString(value);
      }
    } else if (type === "array") {
      if (!Array.isArray(value)) {
        errors.push(`${key} must be an array`);
      } else {
        validated[key] = value;
      }
    } else if (type === "number") {
      const num = Number(value);
      if (isNaN(num)) {
        errors.push(`${key} must be a number`);
      } else {
        validated[key] = num;
      }
    } else if (type === "boolean") {
      if (typeof value !== "boolean") {
        errors.push(`${key} must be a boolean`);
      } else {
        validated[key] = value;
      }
    }
  }
  
  return { valid: errors.length === 0, errors, data: validated };
}

/**
 * Sanitize string to prevent XSS
 */
function sanitizeString(str: string): string {
  return str
    .replace(/[<>\"'&]/g, (c) => {
      const escapeMap: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#x27;",
        "&": "&amp;",
      };
      return escapeMap[c] || c;
    })
    .trim();
}

/**
 * Rate limit for API endpoints (separate from login)
 */
const apiRateLimits = new Map<string, { count: number; resetAt: number }>();
const API_WINDOW_MS = 60 * 1000; // 1 minute
const API_MAX_REQUESTS = 100;

export function checkAPIRateLimit(ip: string) {
  const now = Date.now();
  const entry = apiRateLimits.get(ip);
  
  if (!entry || entry.resetAt <= now) {
    apiRateLimits.set(ip, { count: 1, resetAt: now + API_WINDOW_MS });
    return { allowed: true, remaining: API_MAX_REQUESTS - 1 };
  }
  
  if (entry.count >= API_MAX_REQUESTS) {
    return { allowed: false, retryAfter: entry.resetAt };
  }
  
  entry.count += 1;
  apiRateLimits.set(ip, entry);
  return { allowed: true, remaining: API_MAX_REQUESTS - entry.count };
}
