// Simple client-side fetch cache with unified namespace

declare global {
  interface Window {
    __APP__?: {
      splash: { initialized: boolean };
      cache: Record<string, any>;
      flags: { prefetchDone: boolean };
    };
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
  private store = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  get<T = any>(url: string): T | undefined {
    // Check in-memory cache first
    const cached = this.store.get(url);
    if (cached) {
      // Check if cache is still valid
      if (Date.now() - cached.timestamp < this.TTL) {
        return cached.data;
      } else {
        this.store.delete(url); // Remove stale cache
      }
    }
    // Fallback to global cache if available
    if (typeof window !== 'undefined' && window.__APP__?.cache?.[url]) {
      const data = window.__APP__.cache[url];
      this.store.set(url, { data, timestamp: Date.now() });
      return data;
    }
    return undefined;
  }

  set(url: string, data: any) {
    this.store.set(url, { data, timestamp: Date.now() });
    // Also update global cache
    if (typeof window !== 'undefined') {
      if (!window.__APP__) {
        window.__APP__ = {
          splash: { initialized: false },
          cache: {},
          flags: { prefetchDone: false }
        };
      }
      window.__APP__.cache[url] = data;
    }
  }

  clear() {
    this.store.clear();
    if (typeof window !== 'undefined' && window.__APP__) {
      window.__APP__.cache = {};
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

// Initialize global namespace on window
if (typeof window !== 'undefined' && !(window as any).__APP__) {
  (window as any).__APP__ = {
    splash: { initialized: false },
    cache: {},
    flags: { prefetchDone: false }
  };
}

export const fetchCache = new FetchCache();

export async function prefetchPortfolioData(): Promise<void> {
  // Check if splash screen already loaded data
  if (typeof window !== 'undefined' && window.__APP__?.flags.prefetchDone) {
    // Data already loaded by splash screen
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
    if (window.__APP__) {
      window.__APP__.flags.prefetchDone = true;
    }
    document.dispatchEvent(new Event("globalDataReady"));
  } catch {}
}

export function getCachedJSON<T = any>(url: string): T | undefined {
  return fetchCache.get<T>(url);
}
