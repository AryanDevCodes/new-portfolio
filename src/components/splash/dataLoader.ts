const DATA_ENDPOINTS = [
  '/api/portfolio/personal-info',
  '/api/portfolio/projects',
  '/api/portfolio/skills',
  '/api/portfolio/experience-education',
  '/api/portfolio/timeline',
  '/api/portfolio/data'
];

export async function prefetchPortfolioData(signal?: AbortSignal): Promise<void> {
  const app = (window as any).__APP__;
  
  const promises = DATA_ENDPOINTS.map(async url => {
    try {
      const res = await fetch(url, { cache: 'no-store', signal });
      
      if (!res.ok) {
        return null;
      }
      
      const data = await res.json();
      
      if (data && app.cache) {
        app.cache[url] = data;
      }
      
      return data;
    } catch (err: any) {
      return null;
    }
  });
  
  await Promise.all(promises);
}
