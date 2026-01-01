import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { getAdminData } from "@/lib/admin-storage";

export async function GET() {
  try {
    // Get all portfolio data from Redis
    const additionalData = await getAdminData("additionalData") as any;

    if (additionalData) {
      return NextResponse.json({
        stats: additionalData.stats || {},
        contactPage: additionalData.contactPage || {},
        projectsPage: additionalData.projectsPage || {},
        homeSections: additionalData.homeSections || {},
        aboutSections: additionalData.aboutSections || {},
        navLinks: additionalData.navLinks || [],
        footerData: additionalData.footerData || {},
        ctaSection: additionalData.ctaSection || {},
        siteMetadata: additionalData.siteMetadata || {},
      });
    }

    // Return empty objects if not found in Redis
    return NextResponse.json({
      stats: {},
      contactPage: {},
      projectsPage: {},
      homeSections: {},
      aboutSections: {},
      navLinks: [],
      footerData: {},
      ctaSection: {},
      siteMetadata: {},
    });
  } catch (error) {
    console.error("Error fetching portfolio data from Redis:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}

