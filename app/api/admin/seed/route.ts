import { NextResponse } from "next/server";
import { setAdminData } from "@/lib/admin-storage";
import { personalInfo, education, experience, stats, aboutSections, homeSections, navLinks, footerData, contactPage, projectsPage, ctaSection, siteMetadata } from "@/data/portfolio-data";
import { skillCategories, certifications } from "@/data/skills";
import { projects, additionalProjects } from "@/data/projects";
import { timeline } from "@/data/timeline";
import type { Skill, Certification, HeroData, SocialLink, Experience, Education } from "@/contexts/AdminContext";

export async function POST() {
  try {
    // Transform static data to admin format

    // 1. Skills (already compatible)
    const adminSkills: Skill[] = skillCategories.map((cat) => ({
      category: cat.category,
      items: cat.skills,
    }));

    // 2. Certifications (already compatible)
    const adminCertifications: Certification[] = certifications.map((cert) => ({
      title: cert.title,
      issuer: cert.issuer,
      url: cert.url,
      id: cert.id,
      date: cert.date,
    }));

    // 3. Hero Data
    const heroData: HeroData = {
      bio: personalInfo.bio,
      tagline: personalInfo.tagline,
      role: personalInfo.heroSubtitle || personalInfo.title,
      description: personalInfo.heroDescription,
      location: personalInfo.location,
    };

    // 4. Social Links
    const socialLinks: SocialLink[] = [
      { label: "GitHub", url: personalInfo.github || "", icon: "Github" },
      { label: "LinkedIn", url: personalInfo.linkedin || "", icon: "Linkedin" },
      { label: "Twitter", url: personalInfo.twitter || "", icon: "Twitter" },
      { label: "Email", url: `mailto:${personalInfo.email}`, icon: "Mail" },
    ].filter((link) => link.url && link.url !== "" && link.url !== "mailto:");

    // 5. Experience - transform from static to admin format
    const adminExperience: Experience[] = experience.map((exp: any) => ({
      company: exp.company,
      position: exp.role, // Map 'role' to 'position'
      startDate: exp.duration?.split(" – ")[0] || "Unknown",
      endDate: exp.duration?.split(" – ")[1] === "Present" ? undefined : exp.duration?.split(" – ")[1],
      current: exp.duration?.includes("Present") || false,
      achievements: exp.achievements || [],
      description: exp.achievements?.[0] || "",
    }));

    // 6. Education - transform from static object to admin array format
    const adminEducation: Education[] = [
      {
        institution: education.institution,
        degree: education.degree,
        field: education.degree, // Use degree as field
        startDate: education.duration?.split(" – ")[0] || "2022",
        endDate: education.duration?.split(" – ")[1] || "2026",
        grade: education.cgpa,
        coursework: education.coursework || [],
      },
    ];

    // 7. Medium Settings (default)
    const mediumSettings = {
      username: "",
      profileUrl: "",
    };

    // 8. Featured Posts (empty by default)
    const featuredPosts: string[] = [];

    // 9. Store additional data that doesn't fit admin interface
    const additionalData = {
      stats,
      aboutSections,
      homeSections,
      navLinks,
      footerData,
      contactPage,
      projectsPage,
      ctaSection,
      siteMetadata,
    };

    // Save all data to Redis
    await Promise.all([
      setAdminData("personalInfo" as any, personalInfo),
      setAdminData("skills", adminSkills),
      setAdminData("certifications", adminCertifications),
      setAdminData("heroData", heroData),
      setAdminData("socialLinks", socialLinks),
      setAdminData("experience", adminExperience),
      setAdminData("education", adminEducation),
      setAdminData("projects" as any, projects),
      setAdminData("additionalProjects" as any, additionalProjects),
      setAdminData("mediumSettings", mediumSettings),
      setAdminData("featuredPosts", featuredPosts),
      setAdminData("additionalData" as any, additionalData),
      setAdminData("timeline", timeline),
    ]);

    return NextResponse.json({
      success: true,
      message: "Successfully seeded all data to Redis",
      details: {
        skills: adminSkills.length + " categories",
        certifications: adminCertifications.length + " items",
        socialLinks: socialLinks.length + " links",
        experience: adminExperience.length + " entries",
        education: adminEducation.length + " entries",
        personalInfo: "✓",
        projects: projects.length + " items",
        additionalProjects: additionalProjects.length + " items",
        heroData: "✓",
        mediumSettings: "✓",
        featuredPosts: "✓",
        additionalData: "✓ (story, stats, pages, nav/footer, metadata)",
        timeline: timeline.length + " sections",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
