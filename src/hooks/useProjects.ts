import { useState, useEffect } from "react";
// Deprecated local-storage projects hook. Prefer Redis-backed API: /api/portfolio/projects
// Kept as no-op to avoid accidental usage; will be removed.
export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  repo?: string;
  demo?: string;
  image?: string;
  highlights?: string[];
}

export interface AdditionalProject {
  title: string;
  description: string;
  tech: string[];
  highlight: string;
}

const PROJECTS_KEY = "portfolio_projects_disabled";
const ADDITIONAL_KEY = "portfolio_additional_projects_disabled";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [additionalProjects, setAdditionalProjects] = useState<AdditionalProject[]>([]);

  useEffect(() => {
    setProjects([]);
    setAdditionalProjects([]);
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
  };

  const saveAdditionalProjects = (newProjects: AdditionalProject[]) => {
    setAdditionalProjects(newProjects);
  };

  const addProject = (project: Project) => {
    const updated = [...projects, project];
    saveProjects(updated);
  };

  const updateProject = (slug: string, project: Project) => {
    const updated = projects.map(p => p.slug === slug ? project : p);
    saveProjects(updated);
  };

  const deleteProject = (slug: string) => {
    const updated = projects.filter(p => p.slug !== slug);
    saveProjects(updated);
  };

  const addAdditionalProject = (project: AdditionalProject) => {
    const updated = [...additionalProjects, project];
    saveAdditionalProjects(updated);
  };

  const updateAdditionalProject = (index: number, project: AdditionalProject) => {
    const updated = [...additionalProjects];
    updated[index] = project;
    saveAdditionalProjects(updated);
  };

  const deleteAdditionalProject = (index: number) => {
    const updated = additionalProjects.filter((_, i) => i !== index);
    saveAdditionalProjects(updated);
  };

  const resetToDefaults = () => {
    setProjects([]);
    setAdditionalProjects([]);
  };

  return {
    projects,
    additionalProjects,
    addProject,
    updateProject,
    deleteProject,
    addAdditionalProject,
    updateAdditionalProject,
    deleteAdditionalProject,
    resetToDefaults,
  };
}
