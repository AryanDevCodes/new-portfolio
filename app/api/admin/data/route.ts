import { NextRequest, NextResponse } from "next/server";
import { getAdminData, setAdminData } from "@/lib/admin-storage";
import { requireAdminAuth, logAuditEvent, checkAPIRateLimit } from "@/lib/admin-middleware";
import { promises as fs } from "fs";
import path from "path";

type DataKey =
  | "mediumSettings"
  | "featuredPosts"
  | "certifications"
  | "skills"
  | "heroData"
  | "socialLinks"
  | "experience"
  | "education";

const keyToFile: Record<DataKey, string> = {
  mediumSettings: path.join(process.cwd(), "src", "data", "admin", "medium-settings.json"),
  featuredPosts: path.join(process.cwd(), "src", "data", "admin", "featured-posts.json"),
  certifications: path.join(process.cwd(), "src", "data", "admin", "certifications.json"),
  skills: path.join(process.cwd(), "src", "data", "admin", "skills.json"),
  heroData: path.join(process.cwd(), "src", "data", "admin", "hero.json"),
  socialLinks: path.join(process.cwd(), "src", "data", "admin", "social-links.json"),
  experience: path.join(process.cwd(), "src", "data", "admin", "experience.json"),
  education: path.join(process.cwd(), "src", "data", "admin", "education.json"),
};

async function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  
  // Check API rate limit
  const rateLimit = checkAPIRateLimit(ip);
  if (!rateLimit.allowed) {
    logAuditEvent("api_data_read", ip, "RATE_LIMITED");
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key") as DataKey | null;
  if (!key || !(key in keyToFile)) {
    logAuditEvent("api_data_read", ip, "INVALID_KEY");
    return NextResponse.json({ error: "Invalid or missing key" }, { status: 400 });
  }

  // Try Redis first (production with REDIS_URL)
  const redisData = await getAdminData(key);
  if (redisData !== null && redisData !== undefined) {
    logAuditEvent("api_data_read", ip, `SUCCESS_REDIS_${key}`);
    return NextResponse.json({ data: redisData });
  }

  // Fallback to filesystem (local dev with NEXT_PUBLIC_PERSIST_TO_FILES=true)
  const file = keyToFile[key];
  try {
    const raw = await fs.readFile(file, "utf8");
    const data = JSON.parse(raw);
    logAuditEvent("api_data_read", ip, `SUCCESS_FILE_${key}`);
    return NextResponse.json({ data });
  } catch (e: any) {
    if (e && (e.code === "ENOENT" || e.code === "ERR_MODULE_NOT_FOUND")) {
      logAuditEvent("api_data_read", ip, `NO_DATA_${key}`);
      return NextResponse.json({ data: null });
    }
    logAuditEvent("api_data_read", ip, `ERROR_${key}`);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  
  // Require admin authentication
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.response;
  }

  // Check API rate limit
  const rateLimit = checkAPIRateLimit(ip);
  if (!rateLimit.allowed) {
    logAuditEvent("api_data_write", ip, "RATE_LIMITED");
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const key = body?.key as DataKey | undefined;
    const data = body?.data;
    
    if (!key || !(key in keyToFile)) {
      logAuditEvent("api_data_write", ip, "INVALID_KEY");
      return NextResponse.json({ error: "Invalid or missing key" }, { status: 400 });
    }

    // Try Redis first (production with REDIS_URL)
    await setAdminData(key, data);
    logAuditEvent("api_data_write", ip, `SUCCESS_${key}`);

    // Also try filesystem if enabled (local dev)
    if (process.env.NEXT_PUBLIC_PERSIST_TO_FILES === "true") {
      const file = keyToFile[key];
      try {
        await ensureDir(file);
        await fs.writeFile(file, JSON.stringify(data ?? null, null, 2), "utf8");
      } catch {}
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    logAuditEvent("api_data_write", ip, "ERROR");
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 });
  }
}
