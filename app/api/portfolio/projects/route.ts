import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { getAdminData } from "@/lib/admin-storage";

export async function GET() {
  try {
    const [projects, additionalProjects] = await Promise.all([
      getAdminData("projects"),
      getAdminData("additionalProjects"),
    ]);

    return NextResponse.json({
      projects: Array.isArray(projects) ? projects : [],
      additionalProjects: Array.isArray(additionalProjects) ? additionalProjects : [],
    });
  } catch (error) {
    console.error("Error fetching projects from Redis:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", projects: [], additionalProjects: [] },
      { status: 500 }
    );
  }
}
