import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { getAdminData } from "@/lib/admin-storage";

export async function GET() {
  try {
    const directPersonalInfo = await getAdminData("personalInfo" as any);
    if (directPersonalInfo && typeof directPersonalInfo === "object") {
      return NextResponse.json(directPersonalInfo);
    }

    // Back-compat: older data stored under additionalData.personalInfo
    const additionalData = (await getAdminData("additionalData" as any)) as any;
    if (additionalData && additionalData.personalInfo) {
      return NextResponse.json(additionalData.personalInfo);
    }

    return NextResponse.json({});
  } catch (error) {
    console.error("Error fetching personal info from Redis:", error);
    return NextResponse.json({ error: "Failed to fetch personal info" }, { status: 500 });
  }
}
