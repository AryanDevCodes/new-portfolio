import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin-storage";

export async function GET() {
  try {
    const keys = ["skills", "certifications", "heroData", "socialLinks", "experience", "education", "mediumSettings", "featuredPosts", "additionalData"];
    
    const exportData: Record<string, any> = {};
    
    await Promise.all(
      keys.map(async (key) => {
        try {
          const data = await getAdminData(key as any);
          exportData[key] = data;
        } catch (error) {
          console.error(`Failed to export ${key}:`, error);
          exportData[key] = null;
        }
      })
    );

    return NextResponse.json(exportData);
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
