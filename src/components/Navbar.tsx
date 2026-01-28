"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Home, User, FolderGit2, BookOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useGlobalData } from "@/contexts/GlobalDataContext";

/* ---------------- Types ---------------- */
type NavLink = {
  label: string;
  path: string;
};

type PersonalInfo = {
  resumeUrl?: string;
};

/* ---------------- Icon Helper ---------------- */
const getNavIcon = (path: string) => {
  const iconMap: Record<string, any> = {
    '/': Home,
    '/about': User,
    '/projects': FolderGit2,
    '/blog': BookOpen,
    '/contact': Mail,
  };
  const Icon = iconMap[path];
  return Icon ? <Icon className="h-4 w-4" /> : null;
};

/* ---------------- Component ---------------- */
export default function Navbar() {
  const { data: globalData } = useGlobalData();
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const pathname = usePathname();
  const brandText = "< Aryan Raj />";
  const personalInfo = (globalData.personalInfo as PersonalInfo | undefined) ?? null;
  const navLinksFromData = useMemo(() => {
    const maybeLinks = (globalData.portfolioData as any)?.navLinks;
    return Array.isArray(maybeLinks) ? maybeLinks : [];
  }, [globalData.portfolioData]);

  const fallbackNavLinks: NavLink[] = useMemo(() => ([
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ]), []);

  const navLinks = navLinksFromData.length ? navLinksFromData : fallbackNavLinks;
  const resumeUrl = personalInfo?.resumeUrl || "/resume.pdf";

  /* ---------------- Hydration ---------------- */
  useEffect(() => {
    setHydrated(true);
  }, []);

  /* ---------------- Scroll Effect ---------------- */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- Close Mobile on Route Change ---------------- */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!hydrated) return null;

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-black/40 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ---------------- LOGO ---------------- */}
          <Link href="/" className="group">
            <motion.span
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 18px rgba(99,102,241,0.6)",
              }}
              className="signature-font block select-none"
              style={{
                fontSize: "2.4rem",
                fontWeight: 2400,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                WebkitTextStroke: "1.2px transparent",
              }}
            >
              <span className="text-neutral-900 dark:text-neutral-100 drop-shadow-sm">
                {brandText}
              </span>
            </motion.span>
          </Link>

          {/* ---------------- DESKTOP NAV ---------------- */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.path ||
                pathname.startsWith(`${link.path}/`);
              const isHovered = hoveredPath === link.path;

              return (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setHoveredPath(link.path)}
                  onMouseLeave={() => setHoveredPath(null)}
                >
                  <Link
                    href={link.path}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {getNavIcon(link.path)}
                    {link.label}
                  </Link>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-primary via-primary to-accent"
                    initial={false}
                    animate={{ scaleX: isActive || isHovered ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ originX: 0 }}
                  />
                </div>
              );
            })}
          </div>

          {/* ---------------- RIGHT ACTIONS ---------------- */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2"
              asChild
            >
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                Resume
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-border/50 overflow-hidden"
            >
              <div className="py-4 space-y-2 backdrop-blur-md">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.path}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 ${
                        pathname === link.path
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {getNavIcon(link.path)}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="px-4 pt-2">
                  <Button className="w-full gap-2" asChild>
                    <a href={resumeUrl} target="_blank">
                      <Download className="h-4 w-4" />
                      Download Resume
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
