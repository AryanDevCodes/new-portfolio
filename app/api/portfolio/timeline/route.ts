import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { getAdminData } from "@/lib/admin-storage";

export async function GET() {
  // Fetch timeline/story data from Redis
  const timeline = await getAdminData("timeline");
  return NextResponse.json(timeline || []);
}
