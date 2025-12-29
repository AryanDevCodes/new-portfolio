"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  JavaIcon, SpringBootIcon, ReactIcon, AWSIcon, DockerIcon,
  PostgreSQLIcon, GitIcon, TypeScriptIcon, JavaScriptIcon,
  MongoDBIcon, PythonIcon, TailwindIcon, LinuxIcon, HibernateIcon
} from "./TechIcons";

interface IconPosition {
  angle: number;
  orbitRadius: number;
  angularSpeed: number;
  size: number;
}

export function HeroIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [icons, setIcons] = useState<IconPosition[]>([]);

  // Initialize icons
  useEffect(() => {
    const initialIcons: IconPosition[] = [
      { angle: 30, orbitRadius: 90, angularSpeed: 0.8, size: 56 },   // Java
      { angle: 210, orbitRadius: 90, angularSpeed: 0.75, size: 52 }, // Spring Boot
      { angle: 60, orbitRadius: 140, angularSpeed: 0.6, size: 60 },  // React
      { angle: 180, orbitRadius: 140, angularSpeed: 0.58, size: 56 },// TypeScript
      { angle: 300, orbitRadius: 140, angularSpeed: 0.62, size: 52 },// JavaScript
      { angle: 45, orbitRadius: 190, angularSpeed: 0.5, size: 58 },  // Python
      { angle: 135, orbitRadius: 190, angularSpeed: 0.48, size: 56 },// Tailwind
      { angle: 225, orbitRadius: 190, angularSpeed: 0.52, size: 64 },// AWS
      { angle: 315, orbitRadius: 190, angularSpeed: 0.5, size: 60 }, // Docker
      { angle: 20, orbitRadius: 240, angularSpeed: 0.4, size: 62 },  // MongoDB
      { angle: 92, orbitRadius: 240, angularSpeed: 0.42, size: 68 }, // PostgreSQL
      { angle: 164, orbitRadius: 240, angularSpeed: 0.38, size: 58 },// Git
      { angle: 236, orbitRadius: 240, angularSpeed: 0.41, size: 54 },// Linux
      { angle: 308, orbitRadius: 240, angularSpeed: 0.39, size: 50 },// Hibernate
    ];
    setIcons(initialIcons);
  }, []);

  // Animate orbit using requestAnimationFrame
  useEffect(() => {
    if (icons.length === 0) return;

    let animationFrame: number;

    const animate = () => {
      setIcons((prevIcons) =>
        prevIcons.map((icon) => {
          let newAngle = icon.angle + icon.angularSpeed;
          if (newAngle >= 360) newAngle -= 360;
          return { ...icon, angle: newAngle };
        })
      );
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [icons.length]);

  const iconComponents = [
    JavaIcon, SpringBootIcon, ReactIcon, TypeScriptIcon, JavaScriptIcon,
    PythonIcon, TailwindIcon, AWSIcon, DockerIcon, MongoDBIcon,
    PostgreSQLIcon, GitIcon, LinuxIcon, HibernateIcon
  ];

  return (
    <div ref={containerRef} className="relative w-full h-[600px] flex items-center justify-center overflow-visible bg-transparent">
      {/* Background blobs - now transparent/removed to blend with page */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-transparent blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full bg-transparent blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0], y: [0, 40, 0], rotate: [90, 0, 90] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sun */}
      <div
        className="absolute z-10"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Sun glow */}
        <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400/40 via-orange-400/30 to-red-400/20 blur-3xl" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
        {/* Sun core */}
        <motion.div
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 shadow-2xl flex items-center justify-center"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 360] 
          }}
          transition={{ 
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 30, repeat: Infinity, ease: "linear" }
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/50 to-transparent" />
          <div className="text-3xl">☀️</div>
        </motion.div>
      </div>

      {/* Orbits */}
      {[90, 140, 190, 240].map((radius, i) => (
        <div
          key={`orbit-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
          style={{
            width: radius * 2,
            height: radius * 2,
            borderColor: "rgba(255,255,255,0.2)",
            borderStyle: i % 2 === 0 ? "dashed" : "solid",
            borderWidth: "1px",
          }}
        />
      ))}

      {/* Orbiting icons */}
      {icons.map((icon, index) => {
        const IconComponent = iconComponents[index];
        const angleRad = (icon.angle * Math.PI) / 180;
        const x = Math.cos(angleRad) * icon.orbitRadius;
        const y = Math.sin(angleRad) * icon.orbitRadius;

        return (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2 z-20"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              width: icon.size,
              height: icon.size,
            }}
          >
            {/* Planet glow trail */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-cyan-500/60 to-blue-500/60 rounded-full blur-xl opacity-60`}
            />

            {/* Planet body */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-cyan-500/60 to-blue-500/60 rounded-2xl blur-lg group-hover:blur-xl transition-all`}
              />
              <motion.div
                className={`relative w-full h-full rounded-2xl bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-2xl border-2 border-white/50 p-2 group-hover:border-cyan-400/60 transition-all`}
                whileHover={{
                  borderColor: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
                }}
              >
                <IconComponent />
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Asteroid belt / stars */}
      {[...Array(20)].map((_, i) => {
        const randomAngle = (i * 18) + (i * 0.5); // Fixed angle calculation
        const randomRadius = 280 + (i * 2); // Fixed radius calculation
        const angleRad = (randomAngle * Math.PI) / 180;
        const x = Math.round(Math.cos(angleRad) * randomRadius * 100) / 100; // Round to 2 decimals
        const y = Math.round(Math.sin(angleRad) * randomRadius * 100) / 100; // Round to 2 decimals

        return (
          <motion.div
            key={`star-${i}`}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/40 rounded-full"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.5, 1] }}
            transition={{
              duration: 2 + (i % 4) * 0.5,
              repeat: Infinity,
              delay: (i % 5) * 0.4,
            }}
          />
        );
      })}

      {/* Comet */}
      <motion.div
        className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-lg"
        style={{
          boxShadow:
            "0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)",
        }}
        animate={{
          x: [-100, 600],
          y: [50, 400],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 8,
          ease: "linear",
        }}
      />
    </div>
  );
}
