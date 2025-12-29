import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Block admin paths from search engines
  if (request.nextUrl.pathname.startsWith("/.well-known") || 
      request.nextUrl.pathname.startsWith("/api/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  }

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  
  return response;
}

export const config = {
  matcher: ["/:path*"],
};
