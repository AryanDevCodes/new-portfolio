import { useState, useEffect } from "react";
import { projects as defaultProjects, additionalProjects as defaultAdditional, Project } from "@/data/projects";

export interface AdditionalProject {
  title: string;
  description: string;
  tech: string[];
  highlight: string;
}

const PROJECTS_KEY = "portfolio_projects";
const ADDITIONAL_KEY = "portfolio_additional_projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [additionalProjects, setAdditionalProjects] = useState<AdditionalProject[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem(PROJECTS_KEY);
    const storedAdditional = localStorage.getItem(ADDITIONAL_KEY);
    
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      setProjects(defaultProjects);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(defaultProjects));
    }
    
    if (storedAdditional) {
      setAdditionalProjects(JSON.parse(storedAdditional));
    } else {
      setAdditionalProjects(defaultAdditional);
      localStorage.setItem(ADDITIONAL_KEY, JSON.stringify(defaultAdditional));
    }
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(newProjects));
  };

  const saveAdditionalProjects = (newProjects: AdditionalProject[]) => {
    setAdditionalProjects(newProjects);
    localStorage.setItem(ADDITIONAL_KEY, JSON.stringify(newProjects));
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
    setProjects(defaultProjects);
    setAdditionalProjects(defaultAdditional);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(defaultProjects));
    localStorage.setItem(ADDITIONAL_KEY, JSON.stringify(defaultAdditional));
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
