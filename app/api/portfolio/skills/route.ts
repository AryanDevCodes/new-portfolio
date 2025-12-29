import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin-storage";
import { skillCategories } from "@/data/skills";

export async function GET() {
  try {
    // Try to get from Redis first
    const redisSkills = await getAdminData("skills");
    if (redisSkills) {
      return NextResponse.json(redisSkills);
    }

    // Fallback to static data
    const adminSkills = skillCategories.map((cat) => ({
      category: cat.category,
      items: cat.skills,
    }));
    return NextResponse.json(adminSkills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    // Fallback to static data on error
    const adminSkills = skillCategories.map((cat) => ({
      category: cat.category,
      items: cat.skills,
    }));
    return NextResponse.json(adminSkills);
  }
}
