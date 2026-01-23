"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Project } from "@/data/projects";

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
  imageUrl?: string; // certificate image for gallery display
}

export interface Skill {
  category: string;
  items: string[];
}

export interface AdditionalProject {
  title: string;
  description: string;
  tech: string[];
  highlight: string;
}

export interface HeroData {
  bio?: string;
  tagline?: string;
  role?: string;
  currentFocus?: string;
  location?: string;
  timezone?: string;
  strength?: string;
  techStack?: string;
  availability?: string;
  availability_status?: string;
  description?: string;
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
  clearAllLocalStorage: () => void; // For emergency cache clearing
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
  updateExperience: (exp: Experience[]) => Promise<boolean>;
  education: Education[];
  updateEducation: (edu: Education[]) => Promise<boolean>;
  projects: Project[];
  additionalProjects: AdditionalProject[];
  addProject: (project: Project) => void;
  updateProject: (slug: string, project: Project) => void;
  deleteProject: (slug: string) => void;
  addAdditionalProject: (project: AdditionalProject) => void;
  updateAdditionalProject: (index: number, project: AdditionalProject) => void;
  deleteAdditionalProject: (index: number) => void;
  resetProjects: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Server-based auth; password checked via API; session stored in httpOnly cookie

const DEFAULT_MEDIUM_SETTINGS: MediumSettings = {
  username: "",
  profileUrl: ""
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mediumSettings, setMediumSettings] = useState<MediumSettings>(DEFAULT_MEDIUM_SETTINGS);
  const [featuredPosts, setFeaturedPosts] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [heroData, setHeroData] = useState<HeroData>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [additionalProjects, setAdditionalProjects] = useState<AdditionalProject[]>([]);

  // Always persist to backend (Redis or files as fallback)
  const persistToBackend = async (key: string, data: unknown) => {
    try {
      const response = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to persist ${key}: ${response.status} ${errorText}`);
      } else {
      }
    } catch (error) {
      throw error; // Re-throw so callers know it failed
    }
  };

  const updateExperience = async (exp: Experience[]) => {
    const safe = Array.isArray(exp) ? exp : [];
    setExperience(safe);
    localStorage.setItem('admin_experience', JSON.stringify(safe));
    try {
      await persistToBackend("experience", safe);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateEducation = async (edu: Education[]) => {
    const safe = Array.isArray(edu) ? edu : [];
    setEducation(safe);
    localStorage.setItem('admin_education', JSON.stringify(safe));
    try {
      await persistToBackend("education", safe);
      return true;
    } catch (error) {
      return false;
    }
  };

  const addProject = (project: Project) => {
    if (!isAuthenticated) return;
    const next = [...projects, project];
    setProjects(next);
    try { localStorage.setItem('admin_projects', JSON.stringify(next)); } catch {}
    persistToBackend("projects", next);
  };

  const updateProject = (slug: string, project: Project) => {
    if (!isAuthenticated) return;
    const next = projects.map((p) => (p.slug === slug ? project : p));
    setProjects(next);
    try { localStorage.setItem('admin_projects', JSON.stringify(next)); } catch {}
    persistToBackend("projects", next);
  };

  const deleteProject = (slug: string) => {
    if (!isAuthenticated) return;
    const next = projects.filter((p) => p.slug !== slug);
    setProjects(next);
    try { localStorage.setItem('admin_projects', JSON.stringify(next)); } catch {}
    persistToBackend("projects", next);
  };

  const addAdditionalProject = (project: AdditionalProject) => {
    if (!isAuthenticated) return;
    const next = [...additionalProjects, project];
    setAdditionalProjects(next);
    try { localStorage.setItem('admin_additional_projects', JSON.stringify(next)); } catch {}
    persistToBackend("additionalProjects", next);
  };

  const updateAdditionalProject = (index: number, project: AdditionalProject) => {
    if (!isAuthenticated) return;
    const next = [...additionalProjects];
    next[index] = project;
    setAdditionalProjects(next);
    try { localStorage.setItem('admin_additional_projects', JSON.stringify(next)); } catch {}
    persistToBackend("additionalProjects", next);
  };

  const deleteAdditionalProject = (index: number) => {
    if (!isAuthenticated) return;
    const next = additionalProjects.filter((_, i) => i !== index);
    setAdditionalProjects(next);
    try { localStorage.setItem('admin_additional_projects', JSON.stringify(next)); } catch {}
    persistToBackend("additionalProjects", next);
  };

  const resetProjects = () => {
    if (!isAuthenticated) return;
    setProjects([]);
    setAdditionalProjects([]);
    try {
      localStorage.removeItem('admin_projects');
      localStorage.removeItem('admin_additional_projects');
    } catch {}
    persistToBackend("projects", []);
    persistToBackend("additionalProjects", []);
  };

  useEffect(() => {
    // Try loading from backend (Redis first), then fallback to localStorage
    const loadData = async () => {
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
          "projects",
          "additionalProjects",
        ] as const;

        await Promise.all(keys.map(async (key) => {
          try {
            // Try Redis first (parallelized for faster hydration)
            const res = await fetch(`/api/admin/data?key=${key}`, { cache: "no-store" });
            if (res.ok) {
              const { data } = await res.json();
              if (data != null && data !== undefined) {
                switch (key) {
                  case "mediumSettings": setMediumSettings(data); break;
                  case "featuredPosts": Array.isArray(data) && setFeaturedPosts(data); break;
                  case "certifications": Array.isArray(data) && setCertifications(data); break;
                  case "skills": Array.isArray(data) && setSkills(data); break;
                  case "heroData": setHeroData(data); break;
                  case "socialLinks": Array.isArray(data) && setSocialLinks(data); break;
                  case "experience": Array.isArray(data) && setExperience(data); break;
                  case "education": Array.isArray(data) && setEducation(data); break;
                  case "projects": Array.isArray(data) && setProjects(data); break;
                  case "additionalProjects": Array.isArray(data) && setAdditionalProjects(data); break;
                }
                return;
              }
            }
          } catch (error) {
          }

          try {
            const localStorageKey = key === "mediumSettings" ? "medium_settings" :
                                   key === "featuredPosts" ? "featured_posts" :
                                   key === "certifications" ? "admin_certs" :
                                   key === "skills" ? "admin_skills" :
                                   key === "heroData" ? "admin_hero" :
                                   key === "socialLinks" ? "admin_social" :
                                   key === "experience" ? "admin_experience" :
                                   key === "education" ? "admin_education" :
                                   key === "projects" ? "admin_projects" :
                                   "admin_additional_projects";

            const localData = localStorage.getItem(localStorageKey);
            if (localData) {
              const parsed = JSON.parse(localData);
              if (parsed != null && parsed !== undefined) {
                switch (key) {
                  case "mediumSettings": setMediumSettings(parsed); break;
                  case "featuredPosts": Array.isArray(parsed) && setFeaturedPosts(parsed); break;
                  case "certifications": Array.isArray(parsed) && setCertifications(parsed); break;
                  case "skills": Array.isArray(parsed) && setSkills(parsed); break;
                  case "heroData": setHeroData(parsed); break;
                  case "socialLinks": Array.isArray(parsed) && setSocialLinks(parsed); break;
                  case "experience": Array.isArray(parsed) && setExperience(parsed); break;
                  case "education": Array.isArray(parsed) && setEducation(parsed); break;
                  case "projects": Array.isArray(parsed) && setProjects(parsed); break;
                  case "additionalProjects": Array.isArray(parsed) && setAdditionalProjects(parsed); break;
                }
              }
            }
          } catch (error) {
          }
        }));

        // Don't clear localStorage - let it serve as fallback when Redis fails
        // The loading logic prefers Redis when available, falls back to localStorage
      } catch (error) {
      }
    };
    loadData();

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

  // Persist experience to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_experience', JSON.stringify(experience));
      }
    } catch (error) {
    }
  }, [experience]);

  // Persist education to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_education', JSON.stringify(education));
      }
    } catch (error) {
    }
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

  const clearAllLocalStorage = () => {
    const keys = [
      'medium_settings',
      'featured_posts',
      'admin_certs',
      'admin_skills',
      'admin_hero',
      'admin_social',
      'admin_experience',
      'admin_education',
      'admin_projects',
      'admin_additional_projects'
    ];
    keys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
      }
    });
    // Reset state to empty
    setMediumSettings({ username: "", profileUrl: "" });
    setFeaturedPosts([]);
    setCertifications([]);
    setSkills([]);
    setHeroData({});
    setSocialLinks([]);
    setExperience([]);
    setEducation([]);
    setProjects([]);
    setAdditionalProjects([]);
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
      clearAllLocalStorage,
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
      projects,
      additionalProjects,
      addProject,
      updateProject,
      deleteProject,
      addAdditionalProject,
      updateAdditionalProject,
      deleteAdditionalProject,
      resetProjects,
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
