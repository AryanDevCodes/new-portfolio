"use client";

import { Github, Linkedin, Mail, Twitter, Terminal, Code2, Heart, Cpu, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAdmin } from "@/contexts/AdminContext";
import type { SocialLink } from "@/contexts/AdminContext";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGlobalData } from "@/contexts/GlobalDataContext";

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
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// Sub-components
const BrandSection = ({ personalInfo }: { personalInfo: PersonalInfo }) => {
  const firstName = personalInfo.name?.split(" ")[0] || "Portfolio";

  return (
    <div className="space-y-2">
      <Link href="/" className="inline-flex items-center gap-2 group">
        <div className="relative">
          <div className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center transition-colors duration-200 group-hover:bg-secondary/80">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-lg tracking-tight text-foreground">{firstName}</span>
          <span className="text-xs text-muted-foreground">Building modern backend experiences</span>
        </div>
      </Link>
    </div>
  );
};

const QuickLinksSection = ({ navLinks }: { navLinks: NavLink[] }) => {
  if (navLinks.length === 0) return null;

  const commonLinks = useMemo(() => ([
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ]), []);

  const displayLinks = useMemo(() => (
    navLinks.length > 0 ? navLinks : commonLinks
  ), [navLinks, commonLinks]);

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-xs text-foreground uppercase tracking-wide">
        Navigation
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
              className="group flex items-center gap-1.5 p-1.5 rounded-md hover:bg-secondary transition-colors duration-200"
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
      <h4 className="font-semibold text-xs text-foreground uppercase tracking-wide">
        Connect
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
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
              aria-label={social.label}
            >
              <div className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all duration-200">
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
  const techStack = useMemo(() => ["Next.js", "TypeScript", "Tailwind"], []);
  
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>
          © {currentYear} {footerData.copyright || "All rights reserved."}
        </span>
        <Heart className="w-2.5 h-2.5 text-red-500" />
      </div>
      
      <div className="flex items-center gap-2">
        {footerData.builtWith ? (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
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
  const { data: globalData } = useGlobalData();
  const [hydrated, setHydrated] = useState(false);

  const personalInfo = (globalData.personalInfo as PersonalInfo | undefined) ?? {};
  const portfolioData = (globalData.portfolioData as any) ?? {};
  const footerData: FooterData = portfolioData.footerData || {};
  const navLinks: NavLink[] = Array.isArray(portfolioData.navLinks) ? portfolioData.navLinks : [];

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

  if (!hydrated) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-card relative overflow-hidden">

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
              <div className="h-0.5 w-6 bg-primary rounded-full" />
              <div className="h-0.5 w-3 bg-primary/60 rounded-full" />
              <div className="h-0.5 w-1.5 bg-primary/40 rounded-full" />
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
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wide">
                  Get in touch
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

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/60 pt-4">
                  <div className="text-xs text-muted-foreground">{personalInfo.location || "Remote"}</div>
                  <FooterBottom footerData={footerData} />
                </div>
      </motion.div>
    </footer>
  );
}