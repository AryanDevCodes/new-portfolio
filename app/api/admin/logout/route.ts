import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, logAuditEvent } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  logAuditEvent("logout", ip, "SUCCESS");
  
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
