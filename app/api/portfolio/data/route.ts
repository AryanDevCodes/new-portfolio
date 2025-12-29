import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin-storage";
import {
  stats,
  contactPage,
  projectsPage,
  homeSections,
  aboutSections,
  navLinks,
  footerData,
  ctaSection,
  siteMetadata,
} from "@/data/portfolio-data";

export async function GET() {
  try {
    // Try to get from Redis first
    const additionalData = await getAdminData("additionalData") as any;

    if (additionalData) {
      return NextResponse.json({
        stats: additionalData.stats || stats,
        contactPage: additionalData.contactPage || contactPage,
        projectsPage: additionalData.projectsPage || projectsPage,
        homeSections: additionalData.homeSections || homeSections,
        aboutSections: additionalData.aboutSections || aboutSections,
        navLinks: additionalData.navLinks || navLinks,
        footerData: additionalData.footerData || footerData,
        ctaSection: additionalData.ctaSection || ctaSection,
        siteMetadata: additionalData.siteMetadata || siteMetadata,
      });
    }

    // Fallback to static data
    return NextResponse.json({
      stats,
      contactPage,
      projectsPage,
      homeSections,
      aboutSections,
      navLinks,
      footerData,
      ctaSection,
      siteMetadata,
    });
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    // Fallback to static data on error
    return NextResponse.json({
      stats,
      contactPage,
      projectsPage,
      homeSections,
      aboutSections,
      navLinks,
      footerData,
      ctaSection,
      siteMetadata,
    });
  }
}
