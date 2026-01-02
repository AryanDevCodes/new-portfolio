"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, ChevronRight, Code2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchCache } from "@/lib/fetchCache";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type ProjectItem = {
  slug: string;
  title: string;
  description?: string;
  longDescription?: string;
  tech?: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  roles?: Array<{ role: string }>;
  overview?: string;
  highlights?: string[];
  challenges?: string[];
  duration?: string;
  team?: string;
  role?: string;
};

export default function ProjectDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = fetchCache.get<{ projects: ProjectItem[] }>("/api/portfolio/projects");
    if (cached) {
      setProjects(cached.projects || []);
      setLoading(false);
    }
    const fetchProjects = async () => {
      try {
        if (!cached) {
          const res = await fetch("/api/portfolio/projects");
          if (res.ok) {
            const data = await res.json();
            fetchCache.set("/api/portfolio/projects", data);
            setProjects(data.projects || []);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const project = projects.find((p) => p.slug === slug);

  if (loading) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading project...</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="min-h-[50vh] flex flex-col items-center justify-center relative py-20">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Project not found</p>
          <Button asChild className="gap-2">
            <Link href="/projects">
              <ChevronRight className="w-4 h-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden py-20">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-[-10%] left-[5%] w-[420px] h-[420px] bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] right-[8%] w-[480px] h-[480px] bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl space-y-8">
            <motion.div variants={item} className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2 h-auto p-0 text-muted-foreground hover:text-primary" asChild>
                <Link href="/projects">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back to Projects</span>
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={item} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-4 flex-1">
                  {project.roles?.[0]?.role && (
                    <p className="text-xs font-mono text-primary uppercase tracking-widest">{project.roles?.[0]?.role}</p>
                  )}
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight font-display">
                    {project.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl font-light">
                    {project.longDescription || project.description}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-3">
              {project.github && (
                <Button className="gap-2" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    View Code
                  </a>
                </Button>
              )}
              {project.live && (
                <Button variant="outline" className="gap-2" asChild>
                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-12"
            >
              {/* Overview */}
              {project.overview && (
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold font-display">Overview</h2>
                  <p className="text-base text-muted-foreground leading-relaxed">{project.overview}</p>
                </div>
              )}

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold font-display">Key Features</h2>
                  <div className="space-y-3">
                    {project.highlights.map((highlight: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-primary mt-1.5 flex-shrink-0">▸</span>
                        <p className="text-muted-foreground">{highlight}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges */}
              {project.challenges && project.challenges.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold font-display">Challenges</h2>
                  <div className="space-y-3">
                    {project.challenges.map((challenge, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex items-start gap-3"
                      >
                        <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{challenge}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Tech Stack */}
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold font-display">Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech?.map((tech, i) => (
                    <motion.span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Project Info */}
              {project.duration && (
                <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-6 space-y-3">
                  <p className="font-mono text-xs text-primary uppercase tracking-widest">Project Info</p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {project.duration && (
                      <div>
                        <p className="font-medium text-foreground">Duration</p>
                        <p>{project.duration}</p>
                      </div>
                    )}
                    {project.team && (
                      <div>
                        <p className="font-medium text-foreground">Team Size</p>
                        <p>{project.team}</p>
                      </div>
                    )}
                    {project.role && (
                      <div>
                        <p className="font-medium text-foreground">My Role</p>
                        <p>{project.role}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="space-y-2">
                {project.github && (
                  <Button className="w-full gap-2" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      GitHub Repository
                    </a>
                  </Button>
                )}
                {project.live && (
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Visit Live Site
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-16 sm:py-24 relative overflow-hidden border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 mb-12"
          >
            <p className="text-primary font-mono text-sm uppercase tracking-widest">// More Projects</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Check Out Other Projects</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects
              .filter((p) => p.slug !== slug && p.featured)
              .slice(0, 2)
              .map((proj, i) => (
                <motion.div
                  key={proj.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-6 hover:border-primary/30 hover:bg-card/60 transition-all"
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/projects/${proj.slug}`} className="space-y-3">
                    <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{proj.description}</p>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link href="/projects">
                <span>View All Projects</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
