import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { getAdminData } from "@/lib/admin-storage";

export async function GET() {
  try {
    // Get skills from Redis
    const redisSkills = await getAdminData("skills");
    if (redisSkills) {
      return NextResponse.json(redisSkills);
    }

    // Return empty array if not found in Redis
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching skills from Redis:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}
