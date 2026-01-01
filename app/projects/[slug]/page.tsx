import { Metadata } from "next";
import { projects } from "@/data/projects";
import ProjectDetail from "@/page-components/ProjectDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project ? `${project.title} | Aryan Raj` : "Project | Aryan Raj",
    description: project?.longDescription || "Project details",
  };
}

// Pre-render all project detail pages for fast navigation
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamic = "force-static";
export const revalidate = 300;

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectDetail slug={slug} />;
}
