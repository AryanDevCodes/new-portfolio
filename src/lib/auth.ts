import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const CSRF_TOKEN_COOKIE = "csrf_token";
const DEFAULT_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours
const AUDIT_LOG: Array<{ timestamp: number; action: string; ip: string; userId?: string; result: string }> = [];

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getCSRFTokenCookieName() {
  return CSRF_TOKEN_COOKIE;
}

// Audit logging
export function logAuditEvent(action: string, ip: string, result: string, userId?: string) {
  const event = { timestamp: Date.now(), action, ip, result, userId };
  AUDIT_LOG.push(event);
  // Keep last 1000 events only
  if (AUDIT_LOG.length > 1000) {
    AUDIT_LOG.shift();
  }

}

export function getAuditLog() {
  return AUDIT_LOG;
}

// CSRF Token management
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();
const CSRF_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export function generateCSRFToken() {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + CSRF_EXPIRY_MS;
  csrfTokens.set(token, { token, expiresAt });
  return token;
}

export function verifyCSRFToken(token: string) {
  const entry = csrfTokens.get(token);
  if (!entry || entry.expiresAt < Date.now()) {
    return false;
  }
  csrfTokens.delete(token); // One-time use
  return true;
}

export function createSessionToken(ip: string, maxAgeMs: number = DEFAULT_MAX_AGE_MS) {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret";
  const iat = Date.now();
  const exp = iat + maxAgeMs;
  const nonce = crypto.randomUUID();
  const payload = `${iat}.${exp}.${ip}.${nonce}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const token = Buffer.from(`${payload}.${hmac}`).toString("base64url");
  return token;
}

export function verifySessionToken(token: string, ip: string) {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret";
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(".");
    if (parts.length !== 5) return { valid: false };
    const [iatStr, expStr, ipStr, nonce, hmac] = parts;
    const payload = `${iatStr}.${expStr}.${ipStr}.${nonce}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hmac))) {
      return { valid: false };
    }
    const exp = Number(expStr);
    if (Number.isNaN(exp) || Date.now() > exp) {
      return { valid: false, expired: true };
    }
    // Optional: bind to IP
    if (ipStr !== ip) {
      // tolerate proxies: don't fail hard, but reduce assurance
      return { valid: true, weakBinding: true };
    }
    return { valid: true };
  } catch {
    return { valid: false };
  }
}

// Simple in-memory rate limiter per IP
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

export function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAt: entry.resetAt };
  }
  entry.count += 1;
  attempts.set(ip, entry);
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

// Validate admin password strength
export function validateAdminPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!password || password.length < 12) {
    errors.push("Password must be at least 12 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letters");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letters");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain numbers");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain special characters (!@#$%^&*)");
  }
  return { valid: errors.length === 0, errors };
}

// Detect suspicious patterns
export function detectSuspiciousActivity(ip: string): { suspicious: boolean; reasons: string[] } {
  const reasons: string[] = [];
  // Check for rapid requests from same IP
  const entry = attempts.get(ip);
  if (entry && entry.count > MAX_ATTEMPTS - 1) {
    reasons.push("Multiple failed login attempts");
  }
  return { suspicious: reasons.length > 0, reasons };
}
