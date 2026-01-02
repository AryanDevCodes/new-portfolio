import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aryan Raj | Backend Engineer & System Architect",
  description:
    "Backend Engineer specializing in Java, Spring Boot, and scalable system architecture. Building secure, production-grade systems with modern cloud infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div id="initial-splash" aria-hidden="true" suppressHydrationWarning>
          <canvas id="splash-particles" className="splash-particles" width="0" height="0" suppressHydrationWarning></canvas>
          <div className="splash-gradient-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
          <div className="splash-crossfade"></div>
          <div className="initial-splash-wrap">
            <div className="splash-logo-container">
              <img
                src="/intro-splash.png"
                alt=""
                className="initial-splash-media"
                draggable={false}
              />
              <div className="logo-glow"></div>
            </div>
            <div className="initial-splash-text" style={{ ["--chars" as any]: 17 }}>
              <span className="typewriter">  &lt;  Aryan Raj  /&gt;</span>
            </div>
            <div className="splash-tagline">
              <span className="tagline-text">Backend Engineer • System Architect</span>
            </div>
            <div className="splash-progress">
              <div className="splash-progress-bar"></div>
              <div className="progress-shimmer"></div>
            </div>
          </div>
          <style>{`
            @font-face {
              font-family: 'BrotherlandSignature';
              src: url('/brotherland-signature-font/BrotherlandsignatureBold-rg7jA.otf') format('opentype');
              font-display: swap;
            }

            @keyframes splash-hide {
              0% { 
                opacity: 1; 
                visibility: visible; 
                pointer-events: auto; 
                transform: scale(1);
                filter: blur(0px);
                clip-path: circle(100% at 50% 50%);
              }
              50% {
                opacity: 0.6;
                transform: scale(1.15);
                filter: blur(6px);
                clip-path: circle(120% at 50% 50%);
              }
              100% { 
                opacity: 0; 
                visibility: hidden; 
                pointer-events: none; 
                transform: scale(1.5);
                filter: blur(20px);
                clip-path: circle(180% at 50% 50%);
              }
            }

            @keyframes crossfade-reveal {
              0% { opacity: 0; backdrop-filter: blur(0px); }
              50% { opacity: 0.85; backdrop-filter: blur(12px); }
              100% { opacity: 1; backdrop-filter: blur(30px); }
            }

            @keyframes splash-image-slide-in {
              0% { 
                transform: translateY(-40px) scale(0.88); 
                opacity: 0;
                filter: blur(8px);
              }
              50% { 
                transform: translateY(8px) scale(1.04);
                filter: blur(0px);
              }
              100% { 
                transform: translateY(0) scale(1); 
                opacity: 1;
                filter: blur(0px);
              }
            }

            @keyframes typing {
              from { width: 0; }
              to { width: calc((var(--chars) * 1ch) + ((var(--chars) - 1) * var(--ls))); }
            }

            @keyframes blink {
              0%, 100% { border-color: transparent; }
              50% { border-color: currentColor; }
            }

            @keyframes progress-fill {
              0% { transform: scaleX(0); opacity: 0.8; }
              100% { transform: scaleX(1); opacity: 1; }
            }

            @keyframes pulse-glow {
              0%, 100% { opacity: 0.4; transform: scale(1); filter: blur(40px); }
              50% { opacity: 0.8; transform: scale(1.15); filter: blur(50px); }
            }

            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }

            @keyframes float-orb {
              0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
              33% { transform: translate(40px, -40px) scale(1.15) rotate(120deg); }
              66% { transform: translate(-30px, 30px) scale(0.9) rotate(240deg); }
            }

            @keyframes fade-in-up {
              0% { opacity: 0; transform: translateY(24px); filter: blur(4px); }
              100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
            }

            @keyframes logo-glow-pulse {
              0%, 100% { opacity: 0.4; filter: blur(45px); transform: scale(1); }
              50% { opacity: 0.9; filter: blur(60px); transform: scale(1.2); }
            }

            @keyframes status-blink {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }

            @keyframes particles-fade {
              0% { opacity: 0.6; }
              100% { opacity: 0; }
            }

            #initial-splash {
              position: fixed;
              inset: 0;
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              background: 
                radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.04) 0%, transparent 60%),
                linear-gradient(135deg, 
                  rgba(15, 23, 42, 0.98) 0%, 
                  rgba(30, 41, 59, 0.96) 50%, 
                  rgba(15, 23, 42, 0.98) 100%);
              backdrop-filter: blur(0px);
              transition: backdrop-filter 800ms cubic-bezier(0.4, 0, 0.2, 1);
            }

            .splash-crossfade {
              position: absolute;
              inset: 0;
              background: linear-gradient(135deg, 
                rgba(15, 23, 42, 0.95) 0%,
                rgba(30, 41, 59, 0.92) 100%);
              opacity: 0;
              pointer-events: none;
              z-index: 10;
              backdrop-filter: blur(0px);
            }

            .splash-particles {
              position: absolute;
              inset: 0;
              pointer-events: none;
              opacity: 0.6;
              transition: opacity 600ms ease-out;
            }

            .splash-gradient-orbs {
              position: absolute;
              inset: 0;
              pointer-events: none;
              overflow: hidden;
            }

            .orb {
              position: absolute;
              border-radius: 50%;
              filter: blur(90px);
              opacity: 0.35;
              will-change: transform;
              transition: opacity 800ms ease-out, filter 800ms ease-out;
            }

            .orb-1 {
              width: 700px;
              height: 700px;
              top: -250px;
              left: -150px;
              background: radial-gradient(circle, rgba(99, 102, 241, 0.5), transparent 60%);
              animation: float-orb 25s cubic-bezier(0.45, 0, 0.55, 1) infinite;
            }

            .orb-2 {
              width: 600px;
              height: 600px;
              bottom: -200px;
              right: -150px;
              background: radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 60%);
              animation: float-orb 30s cubic-bezier(0.45, 0, 0.55, 1) infinite 6s;
            }

            .orb-3 {
              width: 500px;
              height: 500px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 60%);
              animation: float-orb 22s cubic-bezier(0.45, 0, 0.55, 1) infinite 3s;
            }

            /* variant 2: warmer tones */
            #initial-splash.bg-variant-2 .orb-1 {
              background: radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent);
            }
            #initial-splash.bg-variant-2 .orb-2 {
              background: radial-gradient(circle, rgba(251, 146, 60, 0.3), transparent);
            }

            /* variant 3: cooler tones */
            #initial-splash.bg-variant-3 .orb-1 {
              background: radial-gradient(circle, rgba(14, 165, 233, 0.4), transparent);
            }
            #initial-splash.bg-variant-3 .orb-2 {
              background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent);
            }

            .splash-logo-container {
              position: relative;
              display: inline-block;
            }

            .logo-glow {
              position: absolute;
              inset: -20%;
              background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%);
              animation: logo-glow-pulse 3s ease-in-out infinite;
              pointer-events: none;
              z-index: -1;
            }

            .splash-progress {
              position: relative;
              width: 340px;
              height: 4px;
              background: rgba(255, 255, 255, 0.04);
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 
                inset 0 1px 3px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(99, 102, 241, 0.1);
              margin-top: 28px;
              opacity: 0;
              border: 1px solid rgba(99, 102, 241, 0.1);
            }

            .splash-progress-bar {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              background: linear-gradient(90deg, 
                rgba(99, 102, 241, 1), 
                rgba(139, 92, 246, 1) 50%,
                rgba(16, 185, 129, 1));
              transform-origin: left;
              transform: scaleX(0);
              border-radius: 12px;
              box-shadow: 
                0 0 30px rgba(99, 102, 241, 0.6),
                0 0 60px rgba(99, 102, 241, 0.3);
              transition: box-shadow 400ms ease;
            }

            .progress-shimmer {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, 
                transparent, 
                rgba(255, 255, 255, 0.3), 
                transparent);
              transform: translateX(-100%);
              opacity: 0;
            }

            .splash-tagline {
              opacity: 0;
              margin-top: 12px;
            }

            .tagline-text {
              font-size: 14px;
              font-weight: 500;
              letter-spacing: 1.5px;
              color: rgba(255, 255, 255, 0.7);
              text-transform: uppercase;
              display: inline-block;
            }



            #initial-splash .initial-splash-wrap {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 14px;
              padding: 24px;
              text-align: center;
            }

            #initial-splash .initial-splash-media {
              width: 500px;
              height: 500px;
              max-width: min(500px, 90vw);
              max-height: min(500px, 60vh);
              object-fit: contain;
              display: block;
              /* Default: show centered (no animation) to avoid flashing in no-JS */
              transform: translateX(0);
              opacity: 1;
              will-change: transform, opacity;
            }

            #initial-splash .initial-splash-text {
              /* Typing width needs to account for letter-spacing */
              --ls: 1.5px;
              font-family: 'BrotherlandSignature', var(--font-display);
              font-size: 80px;
              font-weight: 700;
              line-height: 1.05;
              letter-spacing: var(--ls);
              color: hsl(var(--foreground));
              width: fit-content;
              max-width: min(640px, 90vw);
              text-align: center;
            }

            #initial-splash .typewriter {
              display: inline-block;
              white-space: nowrap;
              overflow: hidden;
              width: 0;
              border-right: 3px solid currentColor;
              box-sizing: content-box;
              padding: 10px;
            }

            /* Refined animation sequence with professional timing */
            #initial-splash.splash-animate .initial-splash-media {
              animation: splash-image-slide-in 1600ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
            }

            #initial-splash.splash-animate .logo-glow {
              animation: logo-glow-pulse 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }

            #initial-splash.splash-animate .typewriter {
              animation:
                typing 1800ms steps(var(--chars)) 500ms forwards,
                blink 700ms step-end infinite 500ms;
            }

            #initial-splash.splash-animate .splash-tagline {
              animation: fade-in-up 1000ms ease-out 1800ms forwards;
            }

            #initial-splash.splash-animate .splash-progress {
              opacity: 1;
              animation: fade-in-up 800ms ease-out 2200ms forwards;
            }

            #initial-splash.splash-animate .splash-progress-bar {
              animation: progress-fill 3500ms cubic-bezier(0.4, 0, 0.2, 1) 2400ms forwards;
            }

            #initial-splash.splash-animate .progress-shimmer {
              opacity: 1;
              animation: shimmer 2.5s ease-in-out 2600ms infinite;
            }

            /* Sophisticated exit transition - much faster */
            #initial-splash.splash-ready {
              animation: splash-hide 500ms cubic-bezier(0.4, 0, 0.6, 1) forwards;
            }

            #initial-splash.splash-ready .splash-crossfade {
              animation: crossfade-reveal 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            #initial-splash.splash-ready .splash-particles {
              animation: particles-fade 400ms ease-out forwards;
            }

            #initial-splash.splash-ready .orb {
              opacity: 0;
              filter: blur(120px);
            }

            @media (prefers-reduced-motion: reduce) {
              #initial-splash { animation: splash-hide 200ms linear forwards; animation-delay: 2400ms; }
              #initial-splash .initial-splash-media { animation: none; }
            }
          `}</style>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  const el = document.getElementById('initial-splash');
  if (!el) return;
  
  // For development: clear session storage to always show splash
  // Comment out the next line to restore session-based behavior (splash shows once per session)
  sessionStorage.removeItem('splashShown');
  
  // Check if splash was already shown in this session
  const splashShown = sessionStorage.getItem('splashShown');
  
  // If splash was already shown, hide it immediately and skip
  if (splashShown === 'true') {
    el.style.display = 'none';
    document.body.classList.add('page-revealed');
    return;
  }
  
  // Mark that splash will be shown
  sessionStorage.setItem('splashShown', 'true');
  
  // Initialize global cache
  if (!window.__PORTFOLIO_CACHE__) {
    window.__PORTFOLIO_CACHE__ = {};
  }

  const variants = ["bg-variant-2", "bg-variant-3", ""];
  const pick = variants[Math.floor(Math.random() * variants.length)];
  if (pick) el.classList.add(pick);

  // Particle system
  const canvas = document.getElementById('splash-particles');
  let animationId;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    // Set dimensions after render to avoid hydration mismatch
    requestAnimationFrame(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    const particles = [];
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = 'rgba(99, 102, 241, ' + this.opacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    for (let i = 0; i < 50; i++) particles.push(new Particle());
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.15 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();
  }

  // Data loading
  const dataEndpoints = [
    '/api/portfolio/personal-info',
    '/api/portfolio/projects',
    '/api/portfolio/skills',
    '/api/portfolio/experience-education',
    '/api/portfolio/timeline',
    '/api/portfolio/data'
  ];

  // Start animations
  const img = el.querySelector('img');
  let imageReady = false;
  let allDataLoaded = false;
  let animationStarted = false;

  const startAnimations = () => {
    if (!animationStarted && imageReady) {
      animationStarted = true;
      // Add class after a microtask to avoid hydration mismatch
      setTimeout(() => {
        el.classList.add('splash-animate');
      }, 0);
      setTimeout(loadAllData, 800);
    }
  };

  const onImageReady = () => {
    imageReady = true;
    startAnimations();
  };
  
  if (img && img.complete) onImageReady();
  else if (img) {
    img.addEventListener('load', onImageReady, { once: true });
    img.addEventListener('error', onImageReady, { once: true });
  } else {
    imageReady = true;
    startAnimations();
  }

  // Load all portfolio data in parallel (much faster)
  async function loadAllData() {
    const promises = dataEndpoints.map(url => 
      fetch(url, { cache: 'no-store' })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && window.__PORTFOLIO_CACHE__) {
            window.__PORTFOLIO_CACHE__[url] = data;
          }
        })
        .catch(err => console.error('Failed to load:', url, err))
    );
    
    await Promise.all(promises);

    allDataLoaded = true;
    window.__GLOBAL_PREFETCH_DONE__ = true;
    
    // Dispatch event immediately
    window.dispatchEvent(new Event('globalDataReady'));
    
    setTimeout(hideScreen, 200); // Much faster exit
  }

  function hideScreen() {
    el.classList.add('splash-ready');
    
    // Start page reveal immediately
    document.body.classList.add('page-revealed');
    
    // Remove splash from DOM quickly
    setTimeout(() => {
      if (el && el.parentNode) {
        el.style.display = 'none';
      }
      if (animationId) cancelAnimationFrame(animationId);
    }, 500);
  }

  // Safety timeout
  setTimeout(() => {
    if (!allDataLoaded) hideScreen();
  }, 8000);
})();`,
          }}
        />

        <Providers>
          <div id="root-content" className="min-h-screen flex flex-col bg-blue-200 dark:bg-background">
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
