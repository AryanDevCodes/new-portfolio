'use client';

import { useEffect, useRef, useState } from 'react';
import { prefetchPortfolioData } from './dataLoader';

const APP_NAMESPACE = '__APP__';

type AppGlobal = {
  splash: {
    initialized: boolean;
  };
  cache: Record<string, unknown>;
  flags: {
    prefetchDone: boolean;
  };
};

function getApp(): AppGlobal {
  const win = window as any;
  if (!win[APP_NAMESPACE]) {
    win[APP_NAMESPACE] = {
      splash: { initialized: false },
      cache: {},
      flags: { prefetchDone: false },
    } satisfies AppGlobal;
  }
  return win[APP_NAMESPACE];
}

export function useSplashController() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Prevent duplicate exits & setState-after-unmount
  const hasExitedRef = useRef(false);

  useEffect(() => {
    const app = getApp();

    // Guard against double initialization
    if (app.splash.initialized) {
      setIsVisible(false);
      return;
    }
    app.splash.initialized = true;

    let abortController: AbortController | null = null;
    let safetyTimeout: ReturnType<typeof setTimeout>;

    const exitSplash = () => {
      if (hasExitedRef.current) {
        return;
      }
      hasExitedRef.current = true;

      setIsExiting(true);
      document.body.classList.add('page-revealed');

      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    };

    const startSplash = async () => {
      setIsAnimating(true);

      const startTime = Date.now();
      const MIN_DURATION = 4000; // Minimum 4 seconds

      // Abortable prefetch
      abortController = new AbortController();
      const dataPromise = prefetchPortfolioData(abortController.signal)
        .then(() => {
          app.flags.prefetchDone = true;
          window.dispatchEvent(new Event('globalDataReady'));
        })
        .catch(error => {
          if ((error as Error).name !== 'AbortError') {
            console.error('❌ Prefetch failed:', error);
          }
        });

      const minDurationPromise = new Promise(resolve => 
        setTimeout(resolve, MIN_DURATION)
      );
      
      // Wait for BOTH data loading AND minimum duration
      await Promise.all([dataPromise, minDurationPromise]);
      
      exitSplash();
    };

    startSplash();

    // Hard safety exit (10s - slightly longer than min duration)
    safetyTimeout = setTimeout(() => {
      if (!app.flags.prefetchDone) {
        console.error('❌ Data still not loaded after timeout');
      }
      exitSplash();
    }, 10000);

    return () => {
      abortController?.abort();
      clearTimeout(safetyTimeout);
      hasExitedRef.current = true;
    };
  }, []);

  return {
    isVisible,
    isAnimating,
    isExiting,
  };
}
