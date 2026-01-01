"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type LoadingContextValue = {
  startLoading: () => void;
  stopLoading: () => void;
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  const startLoading = () => setCount((c) => c + 1);
  const stopLoading = () => setCount((c) => Math.max(0, c - 1));

  // Show loader on route changes briefly; components can also call start/stop
  useEffect(() => {
    // ignore initial mount
    if (!pathname) return;
    startLoading();
    const t = setTimeout(() => stopLoading(), 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const value = useMemo(() => ({ startLoading, stopLoading, isLoading: count > 0 }), [count]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {value.isLoading && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/60 dark:bg-background/60 backdrop-blur-sm transition-opacity">
          <style>{`
            @keyframes progressAnim { 0% { width: 0% } 50% { width: 60% } 100% { width: 100% } }
            @keyframes dots { 0% { content: ''; } 33% { content: '.' } 66% { content: '..' } 100% { content: '...' } }
          `}</style>
          <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
            <div style={{ animation: 'progressAnim 2s linear infinite' }} className="h-full bg-gradient-to-r from-primary to-accent" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-4 p-6 rounded-2xl bg-card/70 backdrop-blur-md border border-border">
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute w-20 h-20 rounded-full border-4 border-primary/20 animate-spin" />
              <div className="absolute w-14 h-14 rounded-full border-4 border-accent/30" style={{ transform: 'rotate(25deg)' }} />
              <div className="absolute w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white font-bold">AR</div>
            </div>

            <div className="text-sm text-muted-foreground">Loading content<span className="ml-1">…</span></div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    return {
      startLoading: () => {},
      stopLoading: () => {},
      isLoading: false,
    };
  }
  return ctx;
}
