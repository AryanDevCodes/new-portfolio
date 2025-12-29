import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin-storage";
import { education, experience } from "@/data/portfolio-data";

export async function GET() {
  try {
    const [redisExperience, redisEducation] = await Promise.all([
      getAdminData("experience"),
      getAdminData("education"),
    ]);

    return NextResponse.json({
      experience: redisExperience || experience,
      education: redisEducation || education,
    });
  } catch (error) {
    console.error("Error fetching experience/education:", error);
    // Fallback to static data on error
    return NextResponse.json({
      experience,
      education,
    });
  }
}
