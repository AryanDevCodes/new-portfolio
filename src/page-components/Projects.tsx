"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, ChevronRight, Star, Code2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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
      }
    };

    fetchData();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);

  if (!hydrated) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="container px-4 mx-auto sm:px-6 lg:px-8 relative">
          <motion.div 
            variants={container} 
            initial="hidden" 
            animate="show" 
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <motion.div variants={item} className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full dark:border shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{safeProjectsPage.badgeText}</span>
            </motion.div>

            <motion.div variants={item} className="space-y-6">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl font-display">
                {safeProjectsPage.title}
              </h1>
              <p className="text-xl leading-relaxed opacity-80 max-w-2xl mx-auto">
                {safeProjectsPage.description}
              </p>
            </motion.div>

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
      <section className="py-20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto mb-16 text-center space-y-4"
          >
            <p className="text-sm uppercase tracking-widest opacity-70">
              {safeProjectsPage.featuredKicker}
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl font-display">
              {safeProjectsPage.featuredHeading}
            </h2>
          </motion.div>

          <div className="space-y-8">
            {featuredProjects.map((project, i) => (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative overflow-hidden rounded-2xl dark:border p-8 hover:shadow-lg transition-all duration-300"
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
                          Case Study
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
        <section className="py-20">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto mb-16 text-center space-y-4"
            >
              <p className="text-sm uppercase tracking-widest opacity-70">
                {safeProjectsPage.otherKicker}
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl font-display">
                {safeProjectsPage.otherHeading}
              </h2>
              <p className="text-lg opacity-80 max-w-xl mx-auto">
                {safeProjectsPage.otherDescription}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalProjects.map((proj, i) => (
                <motion.div
                  key={proj.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group relative rounded-xl dark:border p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold font-display group-hover:opacity-90 transition-opacity">
                        {proj.title}
                      </h3>
                      {proj.highlight && (
                        <span className="text-xs px-3 py-1.5 rounded-full font-medium">
                          {proj.highlight}
                        </span>
                      )}
                    </div>
                    <p className="opacity-80 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex flex-wrap gap-2">
                      {proj.tech?.slice(0, 3).map((t: string, j: number) => (
                        <span 
                          key={j} 
                          className="px-3 py-1.5 text-xs rounded-lg dark:border"
                        >
                          {t}
                        </span>
                      ))}
                      {proj.tech?.length > 3 && (
                        <span className="px-3 py-1.5 text-xs opacity-70">
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
      <section className="py-20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold sm:text-4xl font-display">
                Interested in my work?
              </h2>
              <p className="text-lg opacity-80">
                View my other projects below or visit GitHub for more.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-3" asChild>
                <a href="https://github.com/AryanDevCodes" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
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