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

import { motion } from "framer-motion";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Twitter,
  Download,
  Sparkles,
  ShieldCheck,
  Cpu,
  Server,
  Layers,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroIllustration } from "@/components/HeroIllustration";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { fetchCache } from "@/lib/fetchCache";
import { useAdmin } from "@/contexts/AdminContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55 },
  },
};

interface PersonalInfo {
  location?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  resumeUrl?: string;
}

interface HomeSections {
  allProjectsButton?: string;
  capabilities?: Array<{ title: string; icon?: string; items: string[] }>;
}


interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  roles?: Array<{ role: string }>;
}

interface SkillCategory {
  category: string;
  items: string[];
}

const MemoHeroIllustration = memo(HeroIllustration);

const TypewriterHeadline = memo(function TypewriterHeadline() {
  const typewriterPrefix = "I design ";
  const typewriterPhrases = [
    "secure, scalable backend systems.",
    "high-performance APIs.",
    "production-grade platforms.",
    "solutions for scale.",
  ];

  const typewriterSpeed = 32; // ms per char when typing
  const deleteSpeed = 28; // ms per char when deleting
  const typewriterPause = 900; // ms pause at full text
  const deletePause = 250; // ms pause before starting delete

  const [hydrated, setHydrated] = useState(false);
  const [displayedTypewriter, setDisplayedTypewriter] = useState("");
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const currentPhrase = typewriterPhrases[phraseIndex];
    const fullLength = currentPhrase.length;

    // Determine current delay based on typing or deleting
    let delay = isDeleting ? deleteSpeed : typewriterSpeed;

    // When a phrase is fully typed, pause before starting to delete
    if (!isDeleting && typewriterIndex === fullLength) {
      delay = typewriterPause;
    }

    // When a phrase is fully deleted, short pause before typing next phrase
    if (isDeleting && typewriterIndex === 0) {
      delay = deletePause;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typewriterIndex < fullLength) {
          const nextIndex = typewriterIndex + 1;
          setDisplayedTypewriter(currentPhrase.substring(0, nextIndex));
          setTypewriterIndex(nextIndex);
        } else {
          // Start deleting after pause
          setIsDeleting(true);
        }
      } else {
        if (typewriterIndex > 0) {
          const nextIndex = typewriterIndex - 1;
          setDisplayedTypewriter(currentPhrase.substring(0, nextIndex));
          setTypewriterIndex(nextIndex);
        } else {
          // Move to next phrase and start typing again
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [typewriterIndex, phraseIndex, hydrated, isDeleting]);

  // Define a set of color classes or inline styles to cycle through
  const colorClasses = [
    "bg-gradient-to-r from-primary via-primary to-accent", // original
    "bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400",
    "bg-gradient-to-r from-green-400 via-blue-500 to-purple-500",
    "bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500",
    "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500",
  ];
  const colorIndex = phraseIndex % colorClasses.length;
  const currentColorClass = colorClasses[colorIndex];

  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-display leading-tight">
      <span className="text-foreground">{typewriterPrefix}</span>
      <span className="relative inline-block">
        <span
          className={`relative z-10 ${currentColorClass} bg-clip-text text-transparent text-lg sm:text-xl md:text-2xl`}
        >
          {displayedTypewriter}
        </span>
        <span
          className={`inline-block w-[3px] h-[0.85em] ${currentColorClass} bg-clip-text text-transparent ml-1.5 animate-pulse rounded-full`}
          style={{ background: "inherit" }}
        />
      </span>
    </h1>
  );
});

export default function Index() {
  const { heroData, skills: adminSkills, socialLinks: adminSocial } = useAdmin();
  
  const [hydrated, setHydrated] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({});
  const [homeSections, setHomeSections] = useState<HomeSections>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);

  useEffect(() => {
    // Wait for global data to be ready from splash screen
    const handleDataReady = () => {
      // Load from cache immediately
      const cp = fetchCache.get<any>("/api/portfolio/personal-info");
      const cproj = fetchCache.get<{ projects: any[] }>("/api/portfolio/projects");
      const cskills = fetchCache.get<any[]>("/api/portfolio/skills");
      const cdata = fetchCache.get<any>("/api/portfolio/data");
      
      if (cp) {
        setPersonalInfo(cp);
      }
      if (cproj) {
        const projectsArray = cproj.projects || [];
        setProjects(projectsArray);
      }
      if (cskills) {
        setSkillCategories(cskills);
      }
      if (cdata) {
        setHomeSections(cdata.homeSections || {});
      }
      
      setHydrated(true);
    };

    // Check if data is already ready (splash completed before component mount)
    const cacheReady = window.__APP__?.flags.prefetchDone || (window.__APP__?.cache && Object.keys(window.__APP__.cache).length > 0);
    
    if (cacheReady) {
      handleDataReady();
    } else {
      // Wait for the event
      window.addEventListener('globalDataReady', handleDataReady, { once: true });
      
      // Fallback: force render after 9 seconds (after splash completes)
      const fallbackTimeout = setTimeout(() => {
        handleDataReady();
      }, 9000);
      
      return () => {
        window.removeEventListener('globalDataReady', handleDataReady);
        clearTimeout(fallbackTimeout);
      };
    }
  }, []);

  const featuredProjects = useMemo(() => {
    const filtered = projects.filter((p) => p.featured).slice(0, 3);
    return filtered;
  }, [projects]);

  // Remove rotating bio effect

  const capabilityIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    layers: Layers,
    architecture: Layers,
    server: Server,
    platform: Server,
    shieldcheck: ShieldCheck,
    delivery: ShieldCheck,
    cpu: Cpu,
  };

  const capabilityColumns = useMemo(() => {
    return (homeSections.capabilities || []).map((col) => {
      const key = (col.icon || col.title || "").toString().toLowerCase().replace(/\s+/g, "");
      const Icon = capabilityIconMap[key] || Cpu;
      return { ...col, icon: Icon };
    });
  }, [homeSections.capabilities]);

  if (!hydrated) return null;

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center pt-10">
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
              <motion.div variants={item} className="space-y-6">
                <TypewriterHeadline />
                <div className="max-w-xl rounded-2xl dark:border dark:border-border/60 bg-secondary/30 p-6 backdrop-blur mx-auto">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {heroData?.bio}
                  </p>
                </div>
              </motion.div>

              {/* <motion.div variants={item} className="flex flex-wrap items-center gap-3">
               
                <Button variant="outline" size="lg" className="dark:border-primary/40" asChild>
                  <Link href={personalInfo.resumeUrl || "/resume.pdf"} target="_blank">
                    <Download className="w-4 h-4 mr-2" /> Resume
                  </Link>
                </Button>
              </motion.div> */}

              <motion.div variants={item} className="flex flex-wrap items-center gap-4">
                {(() => {
                  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                    github: Github,
                    linkedin: Linkedin,
                    twitter: Twitter,
                    x: Twitter,
                    mail: Mail,
                    email: Mail,
                  };
                  const derivedSocial = [
                    personalInfo.github ? { icon: "github", url: personalInfo.github, label: "GitHub" } : null,
                    personalInfo.linkedin ? { icon: "linkedin", url: personalInfo.linkedin, label: "LinkedIn" } : null,
                    personalInfo.email ? { icon: "mail", url: `mailto:${personalInfo.email}`, label: "Email" } : null,
                  ].filter(Boolean) as any[];
                  const displaySocial = (Array.isArray(adminSocial) && adminSocial.length > 0) ? adminSocial : derivedSocial;
                  return displaySocial.map((social: any, i: number) => {
                    const Icon = iconMap[(social as any).icon?.toLowerCase?.() || "mail"] || Mail;
                    const href = (social as any).url ?? (social as any).href ?? "#";
                    const key = `${(social as any).icon || 'link'}-${href}-${(social as any).label || 'Social'}-${i}`;
                    return (
                      <motion.a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        whileHover={{ scale: 1.08, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-11 w-11 rounded-xl dark:border dark:border-border/60 bg-secondary/40 flex items-center justify-center text-muted-foreground hover:text-primary dark:hover:border-primary/50 transition"
                      >
                        <Icon className="w-4 h-4" />
                      </motion.a>
                    );
                  });
                })()}
              </motion.div>
            </motion.div>

            <div className="flex items-center justify-center">
              <MemoHeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12 sm:py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-2">Featured builds</h2>
              <p className="text-muted-foreground max-w-2xl mt-3">
                Systems where I owned architecture, performance budgets, and developer experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 self-start md:self-end">
              <Button variant="outline" asChild className="md:self-end">
                <Link href="/projects">
                  Explore projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="md:self-end">
                <Link href={personalInfo.github || "https://github.com"} target="_blank">
                  <Github className="w-4 h-4 mr-2" />
                  View all repos
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="relative rounded-3xl dark:border dark:border-border/70 bg-card/50 overflow-hidden group dark:hover:border-primary/40 transition-colors"
              >
                <div className="absolute inset-0 bg-primary/4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 flex flex-col h-full relative z-10 gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold font-display mt-1 group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.github && (
                        <Link href={project.github} target="_blank" className="w-9 h-9 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/70 dark:border dark:border-border/60 transition-colors">
                          <Github className="w-4 h-4" />
                        </Link>
                      )}
                      {project.live && (
                        <Link href={project.live} target="_blank" className="w-9 h-9 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/70 dark:border dark:border-border/60 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 5).map((tech: string) => (
                      <span key={tech} className="px-3 py-1 text-xs rounded-full bg-secondary/50 text-secondary-foreground border border-border/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      {capabilityColumns.length > 0 && (
      <section className="py-12 sm:py-16 bg-secondary/8 border-y border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
            <div>
              <p className="text-primary font-mono text-sm">// Services</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-2">Services & Expertise</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {capabilityColumns.map((col) => (
              <div key={col.title} className="p-6 rounded-3xl bg-card/50 border border-border/70 shadow-sm hover:border-border/80 hover:bg-card/60 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <col.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{col.title}</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {col.items.map((itemText: string) => (
                    <li key={itemText} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                      <span>{itemText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}


      {/* Final CTA */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-gradient-to-r from-primary/8 via-accent/6 to-terminal-purple/8 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-primary font-mono text-sm">// Collaborate</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Let's Work Together</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" className="group shadow-elegant" asChild>
                <Link href="/contact">
                  Contact me
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={`mailto:${personalInfo.email || ""}`}>
                  <Mail className="w-4 h-4 mr-2" /> Email directly
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
