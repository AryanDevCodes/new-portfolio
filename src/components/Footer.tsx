"use client";

import { Github, Linkedin, Mail, Twitter, Terminal } from "lucide-react";
import Link from "next/link";
import { useAdmin } from "@/contexts/AdminContext";
import { useEffect, useState } from "react";

export function Footer() {
  const { socialLinks: adminSocial } = useAdmin();
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [footerData, setFooterData] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);

  const safePersonalInfo = personalInfo ?? { name: "Portfolio", github: "", linkedin: "", email: "" };
  const safeFooterData = footerData ?? { tagline: "", copyright: "", builtWith: "" };

  useEffect(() => {
    setHydrated(true);
  }, []);

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
          setFooterData(data.footerData);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchData();
  }, []);

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    x: Twitter,
    mail: Mail,
    email: Mail,
  };

  const defaultSocial = personalInfo ? [
    { icon: "github", href: safePersonalInfo.github, label: "GitHub" },
    { icon: "linkedin", href: safePersonalInfo.linkedin, label: "LinkedIn" },
    { icon: "mail", href: `mailto:${safePersonalInfo.email}`, label: "Email" },
  ] : [];

  const displaySocial = (Array.isArray(adminSocial) && adminSocial.length > 0)
    ? adminSocial
    : defaultSocial;

  if (!hydrated) return null;

  return (
    <footer className="border-t border-border bg-gradient-to-b from-card/70 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute bottom-0 right-[5%] w-[400px] h-[400px] bg-primary/30 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/15 flex items-center justify-center group-hover:shadow-[0_8px_24px_-12px_rgba(59,130,246,0.4)] transition-all">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
              <span className="font-mono font-bold text-xl leading-tight">
                {safePersonalInfo.name.split(" ")[0]}
                <span className="text-primary animate-pulse">.</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {safeFooterData.tagline}
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-mono font-semibold text-sm text-primary">
              // quick links
            </h4>
            <nav className="flex flex-col gap-2 space-y-0">
              {["Home", "About", "Projects", "Contact"].map((link) => (
                <Link
                  key={link}
                  href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-xs">→</span>
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-mono font-semibold text-sm text-primary">
              // connect
            </h4>
            <div className="flex gap-3">
              {displaySocial.map((social, i) => {
                const Icon = iconMap[(social as any).icon?.toLowerCase?.() || "mail"] || Mail;
                const href = (social as any).url ?? (social as any).href ?? "#";
                const key = `${(social as any).icon || 'link'}-${href}-${(social as any).label || 'Social'}-${i}`;
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-secondary/70 flex items-center justify-center text-muted-foreground hover:bg-gradient-to-br hover:from-primary hover:to-accent hover:text-primary-foreground transition-all shadow-sm hover:shadow-[0_8px_24px_-12px_rgba(59,130,246,0.5)] hover:-translate-y-1"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-mono">
            {safeFooterData.copyright}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <span className="text-primary font-semibold">Next.js</span>
            <span className="text-primary font-semibold">TypeScript</span>
            <span className="text-primary font-semibold">Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
