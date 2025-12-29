import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin-storage";
import { projects, additionalProjects } from "@/data/projects";

export async function GET() {
  try {
    // Try to get from Redis first
    const additionalData = await getAdminData("additionalData") as any;
    if (additionalData && additionalData.projects) {
      return NextResponse.json({
        projects: additionalData.projects,
        additionalProjects,
      });
    }

    // Fallback to static data
    return NextResponse.json({
      projects,
      additionalProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    // Fallback to static data on error
    return NextResponse.json({
      projects,
      additionalProjects,
    });
  }
}
