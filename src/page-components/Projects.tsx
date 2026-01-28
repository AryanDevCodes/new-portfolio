"use client";

declare global {
  interface Window {
    __APP__?: {
      splash: { initialized: boolean };
      cache: Record<string, any>;
      flags: { prefetchDone: boolean };
    };
  }
}

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, ChevronRight, Star, Code2, Sparkles } from "lucide-react";
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

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsPage, setProjectsPage] = useState<any>(null);
  const [additionalProjects, setAdditionalProjects] = useState<any[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const safeProjectsPage = projectsPage ?? {};

  useEffect(() => {
    // Wait for global data to be ready from splash screen
    const handleDataReady = () => {
      // Load from cache immediately
      const cachedProjects = fetchCache.get<{ projects: any[]; additionalProjects: any[] }>(
        "/api/portfolio/projects"
      );
      const cachedData = fetchCache.get<any>("/api/portfolio/data");
      
      if (cachedProjects) {
        setProjects(cachedProjects.projects || []);
        setAdditionalProjects(cachedProjects.additionalProjects || []);
      }
      if (cachedData) {
        setProjectsPage(cachedData.projectsPage);
      }
      
      setHydrated(true);
    };

    // Check if data is already ready (splash completed before component mount)
    if (window.__APP__?.flags.prefetchDone || (window.__APP__?.cache && Object.keys(window.__APP__.cache).length > 0)) {
      handleDataReady();
    } else {
      // Wait for the event
      window.addEventListener('globalDataReady', handleDataReady, { once: true });
      
      // Fallback: force render after 6 seconds
      const fallbackTimeout = setTimeout(() => {
        handleDataReady();
      }, 6000);
      
      return () => {
        window.removeEventListener('globalDataReady', handleDataReady);
        clearTimeout(fallbackTimeout);
      };
    }
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);

  if (!hydrated) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl space-y-5"
          >
            <h1 className="text-4xl sm:text-5xl font-bold font-display">
              {safeProjectsPage.title || "My Projects"}
            </h1>
            <p className="text-base text-muted-foreground">
              {safeProjectsPage.description || "A collection of projects showcasing my technical abilities."}
            </p>

            {Array.isArray(safeProjectsPage.tags) && safeProjectsPage.tags.length > 0 && (
              <motion.div variants={item} className="flex flex-wrap justify-center gap-3 pt-4">
                {safeProjectsPage.tags.map((tag: string) => (
                  <span 
                    key={tag} 
                    className="px-4 py-2 text-sm rounded-lg dark:border shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="pb-20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:gap-12">
            {featuredProjects.map((project, i) => (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 p-6 lg:p-8 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-8">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        {project.roles?.[0]?.role && (
                          <span className="text-xs font-medium uppercase tracking-widest opacity-70">
                            {project.roles?.[0]?.role}
                          </span>
                        )}
                        {project.featured && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full">
                            <Star className="w-3 h-3" />
                            <span className="text-xs font-medium">Featured</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold sm:text-3xl font-display group-hover:opacity-90 transition-opacity">
                        {project.title}
                      </h3>
                      <p className="text-lg leading-relaxed opacity-80 max-w-3xl">
                        {project.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 lg:flex-col">
                      {project.github && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                            Code
                          </a>
                        </Button>
                      )}
                      {project.live && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                          <a href={project.live} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            Live
                          </a>
                        </Button>
                      )}
                      <Button size="sm" className="gap-2" asChild>
                        <Link href={`/projects/${project.slug}`}>
                           Study
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-3 gap-8 pt-8 border-t">
                    {/* Tech Stack */}
                    <div className="space-y-4">
                      <p className="text-sm font-medium uppercase tracking-widest opacity-70">
                        Tech Stack
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech?.slice(0, 5).map((tech: string, j: number) => (
                          <motion.span
                            key={j}
                            className="px-3 py-1.5 text-sm rounded-lg dark:border"
                            whileHover={{ scale: 1.05 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                        {project.tech?.length > 5 && (
                          <span className="px-3 py-1.5 text-sm rounded-lg opacity-70">
                            +{project.tech.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Highlights */}
                    {project.highlights && project.highlights.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-sm font-medium uppercase tracking-widest opacity-70">
                          Key Features
                        </p>
                        <ul className="space-y-3">
                          {project.highlights?.slice(0, 3).map((highlight: string, j: number) => (
                            <li key={j} className="flex items-start gap-3">
                              <span className="mt-1.5 flex-shrink-0">•</span>
                              <span className="opacity-90">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Project Info
                    <div className="space-y-4">
                      <p className="text-sm font-medium uppercase tracking-widest opacity-70">
                        Project Info
                      </p>
                      <div className="space-y-3 text-sm">
                        {project.duration && (
                          <p className="opacity-90">Duration: {project.duration}</p>
                        )}
                        {project.team && (
                          <p className="opacity-90">Team: {project.team}</p>
                        )}
                      </div>
                    </div> */}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Other Projects */}
      {additionalProjects.length > 0 && (
        <section className="pb-20">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="mb-10 space-y-3">
              <p className="text-primary font-medium text-sm">// More Work</p>
              <h2 className="text-3xl font-bold font-display">
                {safeProjectsPage.otherHeading || "Other Projects"}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{additionalProjects.map((proj, i) => (
                <motion.div
                  key={proj.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="group relative rounded-xl border border-border/50 p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  <div className="space-y-3 flex-1">
                    <h3 className="text-lg font-bold font-display">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tech?.slice(0, 3).map((t: string, j: number) => (
                        <span 
                          key={j} 
                          className="px-2.5 py-1 text-xs rounded-md bg-secondary/50 text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                      {proj.tech?.length > 3 && (
                        <span className="px-2.5 py-1 text-xs text-muted-foreground/70">
                          +{proj.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl space-y-6"
          >
            <div className="space-y-3">
              <p className="text-primary font-medium text-sm">// More on GitHub</p>
              <h2 className="text-3xl font-bold font-display">
                Explore More Projects
              </h2>
              <p className="text-base text-muted-foreground">
                Visit my GitHub to see more of my work and contributions.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button size="lg" className="gap-2" asChild>
                <a href="https://github.com/AryanDevCodes" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  View All Repos
                </a>
              </Button>
              <Button variant="outline" size="lg" className="gap-3" asChild>
                <Link href="/contact">
                  <Code2 className="w-5 h-5" />
                  Start a Project
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}