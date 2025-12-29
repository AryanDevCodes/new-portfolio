"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Terminal, ArrowRight, Sparkles, Layers } from "lucide-react";
import { useEffect, useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsPage, setProjectsPage] = useState<any>(null);
  const [additionalProjects, setAdditionalProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const safeProjectsPage = projectsPage ?? {
    heading: "// Projects",
    title: "Things I've Built",
    description: "",
    featuredHeading: "Featured Projects",
    otherHeading: "Other Projects",
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, dataRes] = await Promise.all([
          fetch("/api/portfolio/projects"),
          fetch("/api/portfolio/data"),
        ]);

        if (projectsRes.ok) {
          const data = await projectsRes.json();
          setProjects(data.projects || []);
          setAdditionalProjects(data.additionalProjects || []);
        }
        if (dataRes.ok) {
          const data = await dataRes.json();
          setProjectsPage(data.projectsPage);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);

  if (!hydrated) return null;

  return (
    <>
      {/* Header with terminal styling */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12]">
          <div className="absolute top-[-15%] left-[5%] w-[420px] h-[420px] bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-25%] right-[8%] w-[480px] h-[480px] bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs sm:text-sm font-mono text-muted-foreground backdrop-blur">
              <Terminal className="w-4 h-4 text-primary" />
              <span>{safeProjectsPage.heading}</span>
            </motion.div>
            <motion.h1 variants={item} className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-display leading-tight">
              <span className="text-gradient-animated">{safeProjectsPage.title}</span>
            </motion.h1>
            <motion.p variants={item} className="text-lg text-muted-foreground font-mono max-w-3xl">
              <span className="text-primary">// </span>{safeProjectsPage.description}
            </motion.p>

            <motion.div variants={item} className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {["Product-ready", "Realtime", "Secure", "Observable"].map((tag) => (
                <div key={tag} className="rounded-xl border border-border bg-card/70 px-3 py-2 text-center text-xs font-mono text-muted-foreground">
                  {tag}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between gap-4 mb-6"
          >
            <div>
              <p className="text-sm font-mono text-primary">// Featured builds</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display">{safeProjectsPage.featuredHeading}</h2>
            </div>
            <Link href="/projects" className="hidden sm:inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary">
              view all repos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group h-full"
              >
                <div className="h-full rounded-2xl border border-border bg-card/70 backdrop-blur shadow-[0_25px_60px_-35px_rgba(0,0,0,0.55)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-gradient-to-r from-card to-card/60">
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {project.slug}.tsx
                    </div>
                    <Link 
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:text-primary/80"
                    >
                      details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl border border-primary/20">
                        {project.coreFeatures?.[0]?.icon || "🚀"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold font-display group-hover:text-primary transition-colors truncate">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" asChild className="h-10 w-10">
                          <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                        {project.live && (
                          <Button variant="terminal" size="icon" asChild className="h-10 w-10">
                            <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label="Live">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.longDescription}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 8).map((tech: string) => (
                        <span
                          key={tech}
                          className="tech-tag text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 8 && (
                        <span className="tech-tag text-xs text-muted-foreground">+{project.tech.length - 8}</span>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {project.highlights.slice(0, 4).map((highlight: string, j: number) => (
                        <div key={j} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">▹</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Projects */}
      <section className="py-16 border-t border-border/60 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-sm font-mono text-primary">// More shipped work</p>
              <h3 className="text-2xl font-bold font-display flex items-center gap-2">
                <Layers className="w-5 h-5 text-terminal-purple" /> Other projects
              </h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono hidden sm:block">Curated highlights and experiments</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {additionalProjects.map((proj) => (
              <div key={proj.title} className="rounded-xl border border-border bg-card/70 p-4 hover:border-primary/40 hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold">{proj.title}</p>
                  <span className="text-xs font-mono text-muted-foreground">{proj.highlight}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground font-mono">
                  {proj.tech.map((t: string) => (
                    <span key={t} className="rounded-lg border border-border px-2 py-1 bg-card/60">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
