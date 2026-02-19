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
  ShieldCheck,
  Cpu,
  Server,
  Layers,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroIllustration } from "@/components/HeroIllustration";
import { memo, useEffect, useMemo, useState } from "react";
import { fetchCache } from "@/lib/fetchCache";
import { useAdmin } from "@/contexts/AdminContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: "easeOut" as const },
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

  // Keep headline styling classic and consistent
  const colorClasses = [
    "text-primary",
  ];
  const colorIndex = phraseIndex % colorClasses.length;
  const currentColorClass = colorClasses[colorIndex];

  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-display leading-tight">
      <span className="text-foreground">{typewriterPrefix}</span>
      <span className="relative inline-block">
        <span
          className={`relative z-10 ${currentColorClass} text-lg sm:text-xl md:text-2xl`}
        >
          {displayedTypewriter}
        </span>
        <span
          className="inline-block w-[2px] h-[0.85em] bg-primary ml-1.5 animate-pulse rounded-full"
        />
      </span>
    </h1>
  );
});

export default function Index() {
  const { heroData, socialLinks: adminSocial } = useAdmin();
  
  const [hydrated, setHydrated] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({});
  const [homeSections, setHomeSections] = useState<HomeSections>({});
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Wait for global data to be ready from splash screen
    const handleDataReady = () => {
      // Load from cache immediately
      const cp = fetchCache.get<any>("/api/portfolio/personal-info");
      const cproj = fetchCache.get<{ projects: any[] }>("/api/portfolio/projects");
      const cdata = fetchCache.get<any>("/api/portfolio/data");
      
      if (cp) {
        setPersonalInfo(cp);
      }
      if (cproj) {
        const projectsArray = cproj.projects || [];
        setProjects(projectsArray);
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
      <section className="min-h-[82vh] flex items-center relative py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8 xl:gap-16 items-center">
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
              <motion.div variants={item} className="space-y-5">
                <TypewriterHeadline />
                <div className="rounded-lg border border-border bg-card p-5 shadow-sm max-w-2xl">
                  <p className="text-muted-foreground leading-relaxed text-[15px] whitespace-pre-line max-w-[68ch]">
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
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-11 w-11 rounded-md border border-border bg-secondary/70 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition"
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
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="max-w-2xl">
              <p className="text-primary font-medium text-xs uppercase tracking-widest mb-2">Fresh Builds</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">Featured Projects</h2>
              <p className="text-muted-foreground text-base">
                A curated set of things I recently crafted and shipped.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <Button asChild size="sm">
                <Link href="/projects">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={personalInfo.github || "https://github.com"} target="_blank">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
                whileHover={{ y: -3 }}
                className="relative rounded-md border border-border bg-card overflow-hidden group hover:border-primary/30 shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-6 flex flex-col h-full relative z-10 gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold font-display mt-1 group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.github && (
                        <Link href={project.github} target="_blank" className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                          <Github className="w-4 h-4" />
                        </Link>
                      )}
                      {project.live && (
                        <Link href={project.live} target="_blank" className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
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
      <section className="py-16 sm:py-20 bg-secondary/30 border-y border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
              <p className="text-primary font-medium text-xs uppercase tracking-widest mb-2">How I Build</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Core Skills</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {capabilityColumns.map((col) => (
              <div key={col.title} className="p-6 rounded-md bg-card border border-border shadow-sm hover:shadow-md transition-all">
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
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-card border border-border p-8 md:p-12 shadow-sm">
            <div className="max-w-2xl space-y-5">
              <p className="text-primary font-medium text-xs uppercase tracking-widest">Say Hello</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display">Let’s Connect</h2>
              <p className="text-muted-foreground text-base">Always happy to talk about ideas, products, and new opportunities.</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild className="group">
                  <Link href="/contact">
                    Contact Me
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`mailto:${personalInfo.email || ""}`}>
                    <Mail className="w-4 h-4 mr-2" /> Email
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
