"use client";

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
import { useEffect, useState } from "react";
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

export default function Index() {
  const { heroData, skills: adminSkills, socialLinks: adminSocial } = useAdmin();
  
  const [hydrated, setHydrated] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({});
  const [homeSections, setHomeSections] = useState<HomeSections>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBioIndex, setActiveBioIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personalRes, projectsRes, skillsRes, dataRes] = await Promise.all([
          fetch("/api/portfolio/personal-info"),
          fetch("/api/portfolio/projects"),
          fetch("/api/portfolio/skills"),
          fetch("/api/portfolio/data"),
        ]);

        if (personalRes.ok) {
          const data = await personalRes.json();
          setPersonalInfo(data);
        }
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          setProjects(data.projects || []);
        }
        if (skillsRes.ok) {
          const data = await skillsRes.json();
          setSkillCategories(data);
        }

        if (dataRes.ok) {
          const data = await dataRes.json();
          setHomeSections(data.homeSections || {});
        }
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  // Typewriter effect for multiple texts
  const typewriterPrefix = "I design "; // or "I engineered "
  const typewriterPhrases = [
    "secure, scalable backend systems.",
    "robust cloud architectures.",
    "high-performance APIs.",
    "production-grade platforms.",
    "solutions for scale."
  ];
  /**
   * The speed of the typewriter effect, measured in milliseconds per character.
   * This constant controls how quickly each character appears in the animation.
   */
  const typewriterSpeed = 1; // ms per char
  const typewriterPause = 200; // ms pause at end
  const [displayedTypewriter, setDisplayedTypewriter] = useState("");
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    const currentPhrase = typewriterPhrases[phraseIndex];
    if (typewriterIndex < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setDisplayedTypewriter(currentPhrase.substring(0, typewriterIndex + 1));
        setTypewriterIndex(typewriterIndex + 1);
      }, Math.max(0, typewriterSpeed));
      return () => clearTimeout(timeout);
    } else {
      const pauseTimeout = setTimeout(() => {
        setTypewriterIndex(0);
        setDisplayedTypewriter("");
        setPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
      }, typewriterPause);
      return () => clearTimeout(pauseTimeout);
    }
  }, [typewriterIndex, phraseIndex, hydrated]);

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

  const capabilityColumns = (homeSections.capabilities || []).map((col) => {
    const key = (col.icon || col.title || "").toString().toLowerCase().replace(/\s+/g, "");
    const Icon = capabilityIconMap[key] || Cpu;
    return { ...col, icon: Icon };
  });

  if (!hydrated) return null;

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center pt-10">
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
              <motion.div variants={item} className="space-y-6">
                {(heroData as any)?.role && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 dark:border dark:border-primary/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">{(heroData as any).role}</p>
                  </div>
                )}
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-display leading-tight">
                  <span className="text-foreground">{typewriterPrefix}</span>
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent text-lg sm:text-xl md:text-2xl">
                      {displayedTypewriter}
                    </span>
                    <span className="inline-block w-[3px] h-[0.85em] bg-gradient-to-b from-primary to-accent ml-1.5 animate-pulse rounded-full" />
                  </span>
                </h1>
                
                <div className="max-w-xl rounded-2xl dark:border dark:border-border/60 bg-secondary/30 p-6 backdrop-blur mx-auto">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {heroData?.bio}
                  </p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex flex-wrap items-center gap-3">
               
                <Button variant="outline" size="lg" className="dark:border-primary/40" asChild>
                  <Link href={personalInfo.resumeUrl || "/resume.pdf"} target="_blank">
                    <Download className="w-4 h-4 mr-2" /> Download CV
                  </Link>
                </Button>
              </motion.div>

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
              <HeroIllustration />
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

      {/* Blog & CTA */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-border/70 bg-card/50 p-8 lg:p-10 grid lg:grid-cols-[auto_1fr] gap-8">
            <div className="space-y-4">
              <p className="text-primary font-mono text-sm">// Writing</p>
              <h3 className="text-3xl font-bold font-display">Blog & engineering notes</h3>
              <p className="text-muted-foreground leading-relaxed">
              Architecture decisions, scaling lessons, and reliability checklists. Featured posts are highlighted on the blog page.
              </p>
              <Button variant="hero" asChild className="w-fit">
              <Link href="/blog">
                Read the blog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              </Button>
            </div>
            <div className="lg:col-span-2 p-10 rounded-3xl bg-secondary/30 border border-border/60 text-base text-muted-foreground flex flex-col justify-center min-h-[180px] max-w-2xl mx-auto lg:mx-0 shadow-lg">
              <h4 className="font-semibold text-lg mb-4 text-foreground">How the Blog Works</h4>
              <ul className="space-y-4 pl-0 list-disc list-inside">
                <li><span className="font-semibold text-primary">Featured posts</span> surface first with a <span className="font-semibold text-primary">star badge</span>.</li>
                <li><span className="font-semibold text-primary">Pulled live</span> from <span className="font-semibold text-primary">Medium via RSS </span> with admin-controlled username.</li>
                <li><span className="font-semibold text-primary">Quick sort</span>: <span className="font-semibold text-primary">featured → newest</span>, for fast scanning.</li>
              </ul>
            </div>
            </div>
        </div>
      </section>

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
