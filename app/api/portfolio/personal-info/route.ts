import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin-storage";
import { personalInfo } from "@/data/portfolio-data";

export async function GET() {
  try {
    // Try to get additionalData from Redis (which contains personalInfo)
    const additionalData = await getAdminData("additionalData") as any;
    if (additionalData && additionalData.personalInfo) {
      return NextResponse.json(additionalData.personalInfo);
    }

    // Fallback to static data
    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error("Error fetching personal info:", error);
    // Fallback to static data on error
    return NextResponse.json(personalInfo);
  }
}
