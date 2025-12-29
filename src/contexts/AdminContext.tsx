"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { certifications as staticCerts } from "@/data/skills";
import { personalInfo, education as staticEducation, experience as staticExperience } from "@/data/portfolio-data";

interface MediumSettings {
  username: string;
  profileUrl: string;
}

interface FeaturedPost {
  link: string;
  featured: boolean;
}

export interface Certification {
  title: string;
  issuer?: string;
  date?: string; // ISO or display string
  url?: string;  // credential URL
  id?: string;   // optional credential ID
}

export interface Skill {
  category: string;
  items: string[];
}

export interface HeroData {
  bio?: string;
  tagline?: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon?: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  coursework?: string[];
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  mediumSettings: MediumSettings;
  updateMediumSettings: (settings: MediumSettings) => void;
  featuredPosts: string[];
  toggleFeaturedPost: (postLink: string) => void;
  certifications: Certification[];
  addCertification: (cert: Certification) => void;
  updateCertification: (index: number, cert: Certification) => void;
  removeCertification: (index: number) => void;
  skills: Skill[];
  updateSkills: (skills: Skill[]) => void;
  heroData: HeroData;
  updateHeroData: (data: HeroData) => void;
  socialLinks: SocialLink[];
  updateSocialLinks: (links: SocialLink[]) => void;
  experience: Experience[];
  updateExperience: (exp: Experience[]) => void;
  education: Education[];
  updateEducation: (edu: Education[]) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Server-based auth; password checked via API; session stored in httpOnly cookie

const DEFAULT_MEDIUM_SETTINGS: MediumSettings = {
  username: "",
  profileUrl: ""
};

const loadArray = <T,>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mediumSettings, setMediumSettings] = useState<MediumSettings>(DEFAULT_MEDIUM_SETTINGS);
  const [featuredPosts, setFeaturedPosts] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [heroData, setHeroData] = useState<HeroData>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [experience, setExperience] = useState<Experience[]>(() => {
    const stored = loadArray<Experience>("admin_experience");
    if (stored.length > 0) {
      console.log("📌 Experience loaded from localStorage:", stored);
      return stored;
    }
    // Seed with default experience from static data
    const seeded = staticExperience.map((exp: any, idx) => ({
      company: exp.company,
      position: exp.role,
      startDate: exp.duration?.split(" – ")?.[0] || "",
      endDate: exp.duration?.split(" – ")?.[1] === "Present" ? undefined : exp.duration?.split(" – ")?.[1],
      current: exp.duration?.includes("Present") || false,
      achievements: exp.achievements || [],
      description: exp.achievements?.[0] || "",
    }));
    console.log("🌱 Experience seeded from staticExperience:", seeded);
    return seeded;
  });
  const [education, setEducation] = useState<Education[]>(() => {
    const stored = loadArray<Education>("admin_education");
    if (stored.length > 0) {
      console.log("📌 Education loaded from localStorage:", stored);
      return stored;
    }
    // Seed with default education from static data
    const seeded = [{
      institution: staticEducation.institution,
      degree: staticEducation.degree,
      field: staticEducation.degree,
      startDate: staticEducation.duration?.split(" – ")?.[0] || "2022",
      endDate: staticEducation.duration?.split(" – ")?.[1] || "2026",
      grade: staticEducation.cgpa,
      coursework: staticEducation.coursework || [],
    }];
    console.log("🌱 Education seeded from staticEducation:", seeded);
    return seeded;
  });

  // Always persist to backend (Redis or files as fallback)
  const persistToBackend = async (key: string, data: unknown) => {
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data })
      });
    } catch {}
  };

  const updateExperience = (exp: Experience[]) => {
    const safe = Array.isArray(exp) ? exp : [];
    setExperience(safe);
    localStorage.setItem('admin_experience', JSON.stringify(safe));
    persistToBackend("experience", safe);
  };

  const updateEducation = (edu: Education[]) => {
    const safe = Array.isArray(edu) ? edu : [];
    setEducation(safe);
    localStorage.setItem('admin_education', JSON.stringify(safe));
    persistToBackend("education", safe);
  };

  useEffect(() => {
    const saved = localStorage.getItem("medium_settings");
    if (saved) {
      setMediumSettings(JSON.parse(saved));
    }
    
    const savedFeatured = localStorage.getItem("featured_posts");
    if (savedFeatured) {
      setFeaturedPosts(JSON.parse(savedFeatured));
    }

    const savedCerts = localStorage.getItem("admin_certs");
    if (savedCerts) {
      try {
        const parsed = JSON.parse(savedCerts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCertifications(parsed);
        } else {
          setCertifications(staticCerts);
          localStorage.setItem("admin_certs", JSON.stringify(staticCerts));
        }
      } catch {
        setCertifications(staticCerts);
        localStorage.setItem("admin_certs", JSON.stringify(staticCerts));
      }
    } else {
      setCertifications(staticCerts);
      localStorage.setItem("admin_certs", JSON.stringify(staticCerts));
    }

    const savedSkills = localStorage.getItem("admin_skills");
    if (savedSkills) {
      try {
        setSkills(JSON.parse(savedSkills));
      } catch {}
    }

    const savedHero = localStorage.getItem("admin_hero");
    if (savedHero) {
      try {
        setHeroData(JSON.parse(savedHero));
      } catch {}
    } else {
      // Seed initial hero data from portfolio-data
      const initialHero: HeroData = {
        bio: personalInfo.bio,
        tagline: personalInfo.tagline,
      };
      setHeroData(initialHero);
      localStorage.setItem("admin_hero", JSON.stringify(initialHero));
    }

    const savedSocial = localStorage.getItem("admin_social");
    if (savedSocial) {
      try {
        setSocialLinks(JSON.parse(savedSocial));
      } catch {}
    } else {
      // Seed initial social links from portfolio-data
      const initialSocial: SocialLink[] = [
        { label: "GitHub", url: personalInfo.github, icon: "github" },
        { label: "LinkedIn", url: personalInfo.linkedin, icon: "linkedin" },
      ];
      if (personalInfo.twitter) {
        initialSocial.push({ label: "Twitter", url: personalInfo.twitter, icon: "twitter" });
      }
      setSocialLinks(initialSocial);
      localStorage.setItem("admin_social", JSON.stringify(initialSocial));
    }

    // Try loading from backend (Redis first, then files)
    const loadFromBackend = async () => {
      try {
        const keys = [
          "mediumSettings",
          "featuredPosts",
          "certifications",
          "skills",
          "heroData",
          "socialLinks",
          "experience",
          "education",
        ] as const;
        for (const key of keys) {
          try {
            const res = await fetch(`/api/admin/data?key=${key}`, { cache: "no-store" });
            if (!res.ok) continue;
            const { data } = await res.json();
            if (data == null) {
              console.log(`⏭️  Skipping ${key} - no data from API (Redis likely empty)`);
              continue;
            }
            
            // Only override experience/education if they contain actual data (non-empty array)
            if ((key === "education" || key === "experience") && Array.isArray(data) && data.length === 0) {
              console.log(`⏭️  Skipping empty ${key} array from backend`);
              continue;
            }
            
            console.log(`📡 Loading ${key} from backend:`, data);
            switch (key) {
              case "mediumSettings": setMediumSettings(data); break;
              case "featuredPosts": Array.isArray(data) && setFeaturedPosts(data); break;
              case "certifications": Array.isArray(data) && setCertifications(data); break;
              case "skills": Array.isArray(data) && setSkills(data); break;
              case "heroData": setHeroData(data); break;
              case "socialLinks": Array.isArray(data) && setSocialLinks(data); break;
              case "experience": Array.isArray(data) && setExperience(data); break;
              case "education": Array.isArray(data) && setEducation(data); break;
            }
          } catch (error) {
            console.log(`⚠️  Error loading ${key}:`, error);
          }
        }
      } catch {}
    };
    loadFromBackend();

    const initAuth = async () => {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        const data = await res.json();
        setIsAuthenticated(!!data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    };
    initAuth();
  }, []);

  // Persist slices when they change to ensure localStorage stays in sync
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('medium_settings', JSON.stringify(mediumSettings));
      }
    } catch {}
  }, [mediumSettings]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('featured_posts', JSON.stringify(featuredPosts));
      }
    } catch {}
  }, [featuredPosts]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_certs', JSON.stringify(certifications));
      }
    } catch {}
  }, [certifications]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_skills', JSON.stringify(skills));
      }
    } catch {}
  }, [skills]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_hero', JSON.stringify(heroData));
      }
    } catch {}
  }, [heroData]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_social', JSON.stringify(socialLinks));
      }
    } catch {}
  }, [socialLinks]);

  // Persist experience to localStorage whenever it changes (including initial seeding)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && experience.length > 0) {
        localStorage.setItem('admin_experience', JSON.stringify(experience));
        // Also persist to backend to prevent loadFromBackend from overwriting
        persistToBackend("experience", experience);
      }
    } catch {}
  }, [experience]);

  // Persist education to localStorage whenever it changes (including initial seeding)
  useEffect(() => {
    console.log("📝 Education state changed, persisting:", education);
    try {
      if (typeof window !== 'undefined' && education.length > 0) {
        console.log("💾 Saving education to localStorage and backend");
        localStorage.setItem('admin_education', JSON.stringify(education));
        // Also persist to backend to prevent loadFromBackend from overwriting
        persistToBackend("education", education);
      }
    } catch {}
  }, [education]);

  const login = async (password: string): Promise<boolean> => {
    try {
      // First, get CSRF token
      const csrfRes = await fetch("/api/admin/login", {
        method: "GET",
      });
      if (!csrfRes.ok) return false;
      const { csrfToken } = await csrfRes.json();
      
      // Then, submit login with CSRF token
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, csrfToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.ok) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try { await fetch("/api/admin/logout", { method: "POST" }); } catch {}
    setIsAuthenticated(false);
  };

  const updateMediumSettings = (settings: MediumSettings) => {
    setMediumSettings(settings);
    localStorage.setItem("medium_settings", JSON.stringify(settings));
    persistToBackend("mediumSettings", settings);
  };

  const toggleFeaturedPost = (postLink: string) => {
    setFeaturedPosts((prev) => {
      const newFeatured = prev.includes(postLink)
        ? prev.filter((link) => link !== postLink)
        : [...prev, postLink];
      localStorage.setItem("featured_posts", JSON.stringify(newFeatured));
      persistToBackend("featuredPosts", newFeatured);
      return newFeatured;
    });
  };

  const addCertification = (cert: Certification) => {
    if (!isAuthenticated) return;
    setCertifications((prev) => {
      const next = [...prev, cert];
      localStorage.setItem("admin_certs", JSON.stringify(next));
      persistToBackend("certifications", next);
      return next;
    });
  };

  const updateCertification = (index: number, cert: Certification) => {
    if (!isAuthenticated) return;
    setCertifications((prev) => {
      const next = [...prev];
      next[index] = cert;
      localStorage.setItem("admin_certs", JSON.stringify(next));
      persistToBackend("certifications", next);
      return next;
    });
  };

  const removeCertification = (index: number) => {
    if (!isAuthenticated) return;
    setCertifications((prev) => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem("admin_certs", JSON.stringify(next));
      persistToBackend("certifications", next);
      return next;
    });
  };

  const updateSkills = (newSkills: Skill[]) => {
    setSkills(newSkills);
    localStorage.setItem("admin_skills", JSON.stringify(newSkills));
    persistToBackend("skills", newSkills);
  };

  const updateHeroData = (data: HeroData) => {
    setHeroData(data);
    localStorage.setItem("admin_hero", JSON.stringify(data));
    persistToBackend("heroData", data);
  };

  const updateSocialLinks = (links: SocialLink[]) => {
    setSocialLinks(links);
    localStorage.setItem("admin_social", JSON.stringify(links));
    persistToBackend("socialLinks", links);
  };

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      mediumSettings, 
      updateMediumSettings,
      featuredPosts,
      toggleFeaturedPost,
      certifications,
      addCertification,
      updateCertification,
      removeCertification,
      skills,
      updateSkills,
      heroData,
      updateHeroData,
      socialLinks,
      updateSocialLinks,
      experience,
      updateExperience,
      education,
      updateEducation,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
