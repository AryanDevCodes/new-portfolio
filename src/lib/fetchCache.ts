// Simple client-side fetch cache and global portfolio prefetch

declare global {
  interface Window {
    __PORTFOLIO_CACHE__?: Record<string, any>;
    __GLOBAL_PREFETCH_DONE__?: boolean;
  }
}

export type PortfolioPrefetchKeys =
  | "/api/portfolio/personal-info"
  | "/api/portfolio/projects"
  | "/api/portfolio/skills"
  | "/api/portfolio/data"
  | "/api/portfolio/timeline"
  | "/api/portfolio/experience-education";

class FetchCache {
  private store = new Map<string, any>();

  get<T = any>(url: string): T | undefined {
    // Check in-memory cache first
    if (this.store.has(url)) {
      return this.store.get(url);
    }
    // Fallback to global cache if available
    if (typeof window !== 'undefined' && window.__PORTFOLIO_CACHE__?.[url]) {
      const data = window.__PORTFOLIO_CACHE__[url];
      this.store.set(url, data);
      return data;
    }
    return undefined;
  }

  set(url: string, data: any) {
    this.store.set(url, data);
    // Also update global cache
    if (typeof window !== 'undefined') {
      if (!window.__PORTFOLIO_CACHE__) {
        window.__PORTFOLIO_CACHE__ = {};
      }
      window.__PORTFOLIO_CACHE__[url] = data;
    }
  }

  async fetchWithCache<T = any>(url: string): Promise<T> {
    const hit = this.get<T>(url);
    if (hit !== undefined) return hit;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${url} ${res.status}`);
    const json = await res.json();
    this.set(url, json);
    return json as T;
  }
}

// Initialize global cache on window
if (typeof window !== 'undefined') {
  (window as any).__PORTFOLIO_CACHE__ = (window as any).__PORTFOLIO_CACHE__ || {};
}

export const fetchCache = new FetchCache();

export async function prefetchPortfolioData(): Promise<void> {
  // Check if splash screen already loaded data
  if (typeof window !== 'undefined' && (window as any).__GLOBAL_PREFETCH_DONE__) {
    // Sync from window cache to fetchCache
    const windowCache = (window as any).__PORTFOLIO_CACHE__;
    if (windowCache) {
      Object.keys(windowCache).forEach(key => {
        fetchCache.set(key, windowCache[key]);
      });
    }
    return;
  }

  // Fallback: Load if splash didn't complete
  const endpoints: PortfolioPrefetchKeys[] = [
    "/api/portfolio/personal-info",
    "/api/portfolio/projects",
    "/api/portfolio/skills",
    "/api/portfolio/data",
    "/api/portfolio/timeline",
    "/api/portfolio/experience-education",
  ];

  await Promise.all(
    endpoints.map(async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        fetchCache.set(url, json);
      } catch (e) {
        // swallow; safety first
      }
    })
  );

  // Signal readiness
  try {
    (window as any).__GLOBAL_PREFETCH_DONE__ = true;
    document.dispatchEvent(new Event("globalDataReady"));
  } catch {}
}

export function getCachedJSON<T = any>(url: string): T | undefined {
  return fetchCache.get<T>(url);
}
