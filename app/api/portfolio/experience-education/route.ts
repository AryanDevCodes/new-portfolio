import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { getAdminData } from "@/lib/admin-storage";

export async function GET() {
  try {
    const [redisExperience, redisEducation] = await Promise.all([
      getAdminData("experience"),
      getAdminData("education"),
    ]);

    return NextResponse.json({
      experience: redisExperience || [],
      education: redisEducation || [],
    });
  } catch (error) {
    console.error("Error fetching experience/education from Redis:", error);
    return NextResponse.json({ error: "Failed to fetch experience/education" }, { status: 500 });
  }
}
