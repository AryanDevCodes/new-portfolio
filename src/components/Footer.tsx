"use client";

import { Github, Linkedin, Mail, Twitter, Terminal, Code2, Heart, Cpu, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAdmin } from "@/contexts/AdminContext";
import type { SocialLink } from "@/contexts/AdminContext";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

// Types
interface PersonalInfo {
  name?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  location?: string;
}

interface FooterData {
  tagline?: string;
  copyright?: string;
  builtWith?: string;
}

interface NavLink {
  path: string;
  label: string;
  icon?: string;
}



// Custom Hook for Footer Data
const useFooterData = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({});
  const [footerData, setFooterData] = useState<FooterData>({});
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personalRes, dataRes] = await Promise.all([
          fetch("/api/portfolio/personal-info"),
          fetch("/api/portfolio/data"),
        ]);

        if (personalRes.ok) {
          const data = await personalRes.json();
          setPersonalInfo(data);
        }

        if (dataRes.ok) {
          const data = await dataRes.json();
          setFooterData(data.footerData || {});
          setNavLinks(Array.isArray(data.navLinks) ? data.navLinks : []);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { personalInfo, footerData, navLinks, loading };
};

// Icon Mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  mail: Mail,
  email: Mail,
  terminal: Terminal,
  code: Code2,
  cpu: Cpu,
  sparkles: Sparkles,
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Sub-components
const BrandSection = ({ personalInfo }: { personalInfo: PersonalInfo }) => {
  const firstName = personalInfo.name?.split(" ")[0] || "Portfolio";

  return (
    <div className="space-y-2">
      <Link href="/" className="inline-flex items-center gap-2 group">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-accent/15 flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/10">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10" />
        </div>
        <div className="flex flex-col">
          <span className="font-mono font-bold text-lg tracking-tight">
            {firstName}
            <span className="text-primary animate-pulse">_</span>
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            &gt; backend_engineer
          </span>
        </div>
      </Link>
    </div>
  );
};

const QuickLinksSection = ({ navLinks }: { navLinks: NavLink[] }) => {
  if (navLinks.length === 0) return null;

  const commonLinks = [
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ];

  const displayLinks = navLinks.length > 0 ? navLinks : commonLinks;

  return (
    <div className="space-y-2">
      <h4 className="font-mono font-semibold text-xs text-primary/80 uppercase tracking-wider">
        // Navigation
      </h4>
      <nav className="grid grid-cols-2 gap-1">
        {displayLinks.map((link, index) => (
          <motion.div
            key={`${link.path}-${link.label}`}
            variants={itemVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={link.path}
              className="group flex items-center gap-1.5 p-1.5 rounded-md hover:bg-secondary/50 transition-all duration-300 hover:shadow-sm hover:shadow-primary/5"
            >
              <div className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-125 transition-transform" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {link.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </nav>
    </div>
  );
};

const ConnectSection = ({ socialLinks }: { socialLinks: SocialLink[] }) => {
  if (socialLinks.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-mono font-semibold text-xs text-primary/80 uppercase tracking-wider">
        // Connect
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {socialLinks.map((social, index) => {
          const Icon = iconMap[String(social.icon ?? '').toLowerCase()] || Mail;
          return (
            <motion.a
              key={`${social.icon ?? social.label}-${index}`}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              initial="hidden"
              animate="show"
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
              aria-label={social.label}
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-secondary/80 to-secondary/40 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all duration-300 shadow-sm shadow-secondary/20 group-hover:shadow-primary/20">
                <Icon className="w-3.5 h-3.5" />
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

const TechStackBadge = () => {
  const techStack = ["Next.js", "TypeScript", "Tailwind"];
  
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <Code2 className="w-3 h-3 text-primary" />
      {techStack.map((tech) => (
        <span
          key={tech}
          className="px-1.5 py-0.5 text-xs rounded-full bg-secondary/50 text-muted-foreground border border-secondary/50"
        >
          {tech}
        </span>
      ))}
    </div>
  );
};

const FooterBottom = ({ footerData }: { footerData: FooterData }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-6 pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono">
          © {currentYear} {footerData.copyright || "All rights reserved."}
        </span>
        <Heart className="w-2.5 h-2.5 text-red-500 animate-pulse" />
      </div>
      
      <div className="flex items-center gap-2">
        {footerData.builtWith ? (
          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            {footerData.builtWith}
          </span>
        ) : (
          <TechStackBadge />
        )}
      </div>
    </div>
  );
};

// Main Footer Component
export function Footer() {
  const { socialLinks: adminSocial } = useAdmin();
  const { personalInfo, footerData, navLinks, loading } = useFooterData();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Derive social links from personal info if admin social links are empty
  const derivedSocialLinks = useMemo(() => {
    const links = [
      personalInfo.github && { icon: "github", url: personalInfo.github, label: "GitHub" },
      personalInfo.linkedin && { icon: "linkedin", url: personalInfo.linkedin, label: "LinkedIn" },
      personalInfo.email && { icon: "mail", url: `mailto:${personalInfo.email}`, label: "Email" },
    ].filter(Boolean) as SocialLink[];

    return links;
  }, [personalInfo]);

  const displaySocialLinks = (Array.isArray(adminSocial) && adminSocial.length > 0)
    ? adminSocial
    : derivedSocialLinks;

  if (!hydrated || loading) {
    return (
      <footer className="border-t border-border bg-gradient-to-b from-card/70">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="animate-pulse flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary/30" />
              <span className="text-muted-foreground text-xs">Loading...</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-gradient-to-b from-card/70 via-card/50 to-card/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-3">
            <BrandSection personalInfo={personalInfo} />
            {footerData.tagline && (
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                {footerData.tagline}
              </p>
            )}
            <div className="flex items-center gap-1">
              <div className="h-0.5 w-6 bg-gradient-to-r from-primary to-accent rounded-full" />
              <div className="h-0.5 w-3 bg-gradient-to-r from-accent to-primary/50 rounded-full" />
              <div className="h-0.5 w-1.5 bg-gradient-to-r from-primary/50 to-accent/30 rounded-full" />
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div variants={itemVariants} transition={{ delay: 0.1 }}>
            <QuickLinksSection navLinks={navLinks} />
          </motion.div>

          {/* Connect Column */}
          <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
            <ConnectSection socialLinks={displaySocialLinks} />
            
            {/* Contact Info */}
            {personalInfo.email && (
              <div className="mt-4 space-y-1">
                <h4 className="font-mono font-semibold text-xs text-primary/80 uppercase tracking-wider">
                  // Get in touch
                </h4>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center gap-1.5 p-1.5 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-all group"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground">
                    {personalInfo.email}
                  </span>
                </a>
              </div>
            )}
          </motion.div>
        </div>

        

        {/* Decorative Elements */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-muted-foreground/30">
          <div className="w-1 h-1 rounded-full bg-primary/20" />
          <span className="font-mono">{personalInfo.location || "Remote"}</span>
        </div>
      </motion.div>
    </footer>
  );
}