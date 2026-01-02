"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { prefetchPortfolioData, fetchCache, getCachedJSON } from "@/lib/fetchCache";

export type GlobalData = {
  personalInfo?: any;
  projects?: { projects: any[]; additionalProjects: any[] };
  skills?: any[];
  portfolioData?: any;
  timeline?: any[];
  experienceEducation?: { experience: any[]; education: any[] };
};

type GlobalDataContextValue = {
  isReady: boolean;
  data: GlobalData;
};

const GlobalDataContext = createContext<GlobalDataContextValue>({ isReady: false, data: {} });

export function GlobalDataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<GlobalData>({});

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await prefetchPortfolioData();
      if (cancelled) return;
      setData({
        personalInfo: getCachedJSON("/api/portfolio/personal-info"),
        projects: getCachedJSON("/api/portfolio/projects"),
        skills: getCachedJSON("/api/portfolio/skills"),
        portfolioData: getCachedJSON("/api/portfolio/data"),
        timeline: getCachedJSON("/api/portfolio/timeline"),
        experienceEducation: getCachedJSON("/api/portfolio/experience-education"),
      });
      setReady(true);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ isReady: ready, data }), [ready, data]);
  return <GlobalDataContext.Provider value={value}>{children}</GlobalDataContext.Provider>;
}

export function useGlobalData() {
  return useContext(GlobalDataContext);
}
