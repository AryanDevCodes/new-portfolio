"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type IntroSplashProps = {
  src?: string;
  alt?: string;
  durationMs?: number;
};

export default function IntroSplash({
  src = "/initial_screen.gif",
  alt = "Intro",
  durationMs = 1600,
}: IntroSplashProps) {
  const [visible, setVisible] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const hideTimerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);

  const isVideo = useMemo(() => /\.mp4($|\?)/i.test(currentSrc), [currentSrc]);

  const scheduleHide = () => {
    if (hideTimerRef.current != null) return;
    hideTimerRef.current = window.setTimeout(() => setVisible(false), durationMs);
  };

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  useEffect(() => {
    setVisible(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Safety: never trap the user behind the splash.
    safetyTimerRef.current = window.setTimeout(() => setVisible(false), Math.max(durationMs + 2500, 4500));

    return () => {
      if (hideTimerRef.current != null) window.clearTimeout(hideTimerRef.current);
      if (safetyTimerRef.current != null) window.clearTimeout(safetyTimerRef.current);
      hideTimerRef.current = null;
      safetyTimerRef.current = null;
      document.body.style.overflow = previousOverflow;
    };
  }, [durationMs]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent">
      {isVideo ? (
        <video
          src={currentSrc}
          className="intro-splash max-w-[92vw] max-h-[92vh] object-contain"
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={scheduleHide}
          onError={() => {
            // If the video fails too, at least don't block the UI.
            scheduleHide();
          }}
        />
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          className="intro-splash max-w-[92vw] max-h-[92vh] object-contain"
          draggable={false}
          onLoad={scheduleHide}
          onError={() => {
            // Fallback to MP4 if GIF can't be decoded/served.
            setCurrentSrc("/initial_screen.mp4");
          }}
        />
      )}

      <style>{`
        @keyframes intro-slide-in {
          0% { transform: translateX(-30vw); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .intro-splash {
          animation: intro-slide-in 520ms ease-out both;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-splash { animation: none; }
        }
      `}</style>
    </div>
  );
}
