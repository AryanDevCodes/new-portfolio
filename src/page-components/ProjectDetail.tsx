"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, ChevronRight, Terminal, Code2, Cpu, Database, Layers, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function ProjectDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/portfolio/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
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
      <section className="py-20 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="py-20 text-center">
        <p className="text-muted-foreground">Project not found</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.14]">
          <div className="absolute top-[-10%] left-[8%] w-[340px] h-[340px] bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-18%] right-[6%] w-[420px] h-[420px] bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="rounded-2xl border border-border bg-card/70 backdrop-blur shadow-[0_25px_60px_-35px_rgba(0,0,0,0.55)] overflow-hidden"
          >
            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <motion.div variants={item} className="flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm" asChild className="gap-2 font-mono text-muted-foreground hover:text-primary">
                  <Link href="/projects">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-primary">cd</span> ../projects
                  </Link>
                </Button>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-mono text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>{project.slug}.tsx</span>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-primary" />
                    <span className="font-mono text-sm text-muted-foreground">const project =</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-gradient-animated">
                    {project.title}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
                    {project.longDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                  <Button variant="outline" className="gap-2 font-mono" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      git clone
                    </a>
                  </Button>
                  {project.live && (
                    <Button variant="terminal" className="gap-2 font-mono" asChild>
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        live preview
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>

              <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card/80 px-4 py-3">
                  <p className="text-xs text-muted-foreground font-mono">Type</p>
                  <p className="text-sm font-semibold">{project.description.split("|")[0]}</p>
                </div>
                <div className="rounded-xl border border-border bg-card/80 px-4 py-3">
                  <p className="text-xs text-muted-foreground font-mono">Stack breadth</p>
                  <p className="text-sm font-semibold">{project.tech.length}+ tools</p>
                </div>
                <div className="rounded-xl border border-border bg-card/80 px-4 py-3">
                  <p className="text-xs text-muted-foreground font-mono">Live</p>
                  <p className="text-sm font-semibold">{project.live ? "Available" : "Repo only"}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      {project.overview && (
        <section className="py-8 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="code-block"
            >
              <div className="code-block-header">
                <Code2 className="w-4 h-4" />
                <span>README.md</span>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {project.overview}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Core Features */}
      {project.coreFeatures && (
        <section className="py-12 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                <Cpu className="w-6 h-6 text-terminal-cyan" />
                <span className="font-mono text-primary">//</span> Core Features
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(project.coreFeatures || []).map((feature: any, i: number) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="feature-card group"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold mb-2 font-display group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack */}
      <section className="py-12 border-t border-border/50 bg-card/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-1/3 right-[5%] w-[300px] h-[300px] bg-primary/35 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-3"
          >
            <Layers className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold font-display">Tech Stack</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
          </motion.div>

          {project.techCategories ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(project.techCategories || []).map((category: any, i: number) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl bg-card/70 border border-border/60 hover:border-primary/30 transition-all shadow-sm hover:shadow-[0_12px_30px_-15px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Database className="w-4 h-4 text-primary" />
                    <span className="font-mono font-semibold text-primary text-sm">{category.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(category.items || []).map((tech: string) => (
                      <span
                        key={tech}
                        className="tech-tag text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3"
            >
              {(project.tech || []).map((tech: string, idx: number) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="tech-tag-lg hover:border-primary/50 hover:bg-primary/10 transition-all"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Highlights & Achievements */}
      <section className="py-12 border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute bottom-0 left-[5%] w-[320px] h-[320px] bg-accent/30 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold font-display">Highlights</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
              </div>
              <div className="space-y-3">
                {(project.highlights || []).map((highlight: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-card/70 border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.2)]"
                  >
                    <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            {project.achievements && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🏆</span>
                  <h2 className="text-2xl font-bold font-display">Achievements</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                </div>
                <div className="space-y-3">
                  {(project.achievements || []).map((achievement: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-primary/8 to-accent/5 border border-primary/25 hover:border-primary/40 transition-all shadow-sm hover:shadow-[0_8px_20px_-10px_rgba(59,130,246,0.2)]"
                    >
                      <span className="text-sm text-muted-foreground leading-relaxed">{achievement}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Back to Projects Button */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
