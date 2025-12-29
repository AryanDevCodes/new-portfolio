"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Twitter,
  Download,
  Sparkles,
  MapPin,
  Clock3,
  ShieldCheck,
  Cpu,
  Server,
  Layers,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
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
  location: string;
  github?: string;
  linkedin?: string;
  email: string;
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
  const heroRef = useRef<HTMLDivElement>(null);
  
  const [hydrated, setHydrated] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    location: "Bhopal, Madhya Pradesh",
    email: "rajaryan.codes@gmail.com",
  });
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personalRes, projectsRes, skillsRes] = await Promise.all([
          fetch("/api/portfolio/personal-info"),
          fetch("/api/portfolio/projects"),
          fetch("/api/portfolio/skills"),
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
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const displaySkills = (adminSkills && adminSkills.length > 0) ? adminSkills : skillCategories;
  const capabilityColumns = [
    {
      title: "Architecture",
      icon: Layers,
      items: ["Domain-driven design", "API strategy & governance", "Async & event-driven", "Performance budgets"],
    },
    {
      title: "Platform",
      icon: Server,
      items: ["Spring Boot services", "AuthN/AuthZ & RBAC", "CI/CD & observability", "Cloud-native patterns"],
    },
    {
      title: "Delivery",
      icon: ShieldCheck,
      items: ["Resilience & SLIs", "Perf testing & profiling", "Incident-ready runbooks", "Docs your team can ship"]
    }
  ];
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  if (!hydrated) return null;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="min-h-[90vh] flex flex-col justify-center relative overflow-hidden bg-gradient-to-b from-background via-background/80 to-background"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div style={{ x: springX, y: springY }} className="gradient-orb gradient-orb-1 w-[520px] h-[520px] -top-24 -left-24" />
          <motion.div style={{ x: springX, y: springY }} className="gradient-orb gradient-orb-2 w-[640px] h-[640px] top-1/3 -right-40" />
          <motion.div style={{ x: springX, y: springY }} className="gradient-orb gradient-orb-3 w-[420px] h-[420px] bottom-0 left-1/3" />
        </div>

        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)` }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center pt-10">
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
              <motion.div variants={item} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                Open to backend/platform roles
              </motion.div>

              <motion.div variants={item} className="space-y-4">
                <p className="text-muted-foreground font-mono text-sm">Backend Engineer · System Architect</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight font-display leading-tight">
                  {heroData?.tagline ?? "Building resilient backend systems that stay fast under pressure."}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  {heroData?.bio ?? "I design and ship Spring Boot services with clear APIs, observability baked-in, and security-first defaults. Focused on uptime, latency, and developer experience."}
                </p>
              </motion.div>

              <motion.div variants={item} className="flex flex-wrap items-center gap-3">
                <Button variant="hero" size="lg" className="group magnetic-hover shadow-elegant" asChild>
                  <Link href="/projects">
                    View Projects
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-primary/40" asChild>
                  <Link href="/resume.pdf" target="_blank">
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
                  const defaultSocial = [
                    { icon: "github", url: personalInfo.github, label: "GitHub" },
                    { icon: "linkedin", url: personalInfo.linkedin, label: "LinkedIn" },
                    { icon: "mail", url: `mailto:${personalInfo.email}`, label: "Email" },
                  ];
                  const displaySocial = (Array.isArray(adminSocial) && adminSocial.length > 0) ? adminSocial : defaultSocial;
                  return displaySocial.map((social, i) => {
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
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  });
                })()}
              </motion.div>
            </motion.div>

            <div className="grid gap-4">
              <div className="p-5 rounded-3xl glass border-primary/20 backdrop-blur-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current focus</p>
                    <p className="text-lg font-semibold">Reliability & API experience</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-secondary/50 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Based in</p>
                      <p className="font-semibold">{personalInfo.location}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 flex items-center gap-3">
                    <Clock3 className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Timezone</p>
                      <p className="font-semibold">UTC+05:30 (IST)</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Strength</p>
                      <p className="font-semibold">Secure APIs & RBAC</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Stack</p>
                      <p className="font-semibold">Java · Spring · Postgres</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl border border-border/70 bg-background/60">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Now</p>
                    <p className="font-semibold">Available for backend roles</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono">Open to discuss</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Shipping resilient services, tightening observability, and improving API DX with strong contracts and docs your team can use tomorrow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Featured Projects */}
      <section className="py-18 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-primary font-mono text-sm">// Case studies</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-2">Featured builds</h2>
              <p className="text-muted-foreground max-w-2xl mt-3">
                Systems where I owned architecture, performance budgets, and developer experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 self-start md:self-end">
              <Button variant="outline" asChild className="md:self-end">
                <Link href="/projects">
                  View all projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="md:self-end">
                <Link href="https://github.com/AryanDevCodes" target="_blank">
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
                className="relative rounded-3xl border border-border/80 bg-card/70 overflow-hidden group hover:border-primary/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 flex flex-col h-full relative z-10 gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">{project.roles?.[0]?.role || "Backend / Platform"}</p>
                      <h3 className="text-xl font-semibold font-display mt-1 group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.github && (
                        <Link href={project.github} target="_blank" className="w-9 h-9 rounded-xl bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 border border-border/70">
                          <Github className="w-4 h-4" />
                        </Link>
                      )}
                      {project.live && (
                        <Link href={project.live} target="_blank" className="w-9 h-9 rounded-xl bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 border border-border/70">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 5).map((tech) => (
                      <span key={tech} className="px-3 py-1 text-xs rounded-full bg-secondary/70 text-secondary-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Security · Performance · DX</span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 sm:py-22 bg-secondary/10 border-y border-border/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
            <div>
              <p className="text-primary font-mono text-sm">// Services</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-2">What I deliver</h2>
              <p className="text-muted-foreground max-w-2xl mt-3">
                Architecture clarity, operational excellence, and codebases teams enjoy maintaining.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {capabilityColumns.map((col) => (
              <div key={col.title} className="p-6 rounded-3xl bg-card border border-border/70 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <col.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">{col.title}</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {col.items.map((itemText) => (
                    <li key={itemText} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                      <span>{itemText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Blog & CTA */}
      <section className="py-16 sm:py-22">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border/70 bg-card/70 p-8 lg:p-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
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
            <div className="p-5 rounded-2xl bg-secondary/10 border border-border/60 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Featured posts surface first with a star badge.
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                Pulled live from Medium via RSS with admin-controlled username.
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Quick sort: featured → newest, for fast scanning.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-18 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-gradient-to-r from-primary/12 via-accent/10 to-terminal-purple/12 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-primary font-mono text-sm">// Collaborate</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Ready to make your backend sturdier?</h2>
            <p className="text-muted-foreground text-lg">
              Let’s talk about performance budgets, API ergonomics, and the observability you need to sleep at night.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" className="group shadow-elegant" asChild>
                <Link href="/contact">
                  Contact me
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="mailto:rajaryan.codes@gmail.com">
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
