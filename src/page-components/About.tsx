"use client";

declare global {
  interface Window {
    __APP__?: {
      splash: { initialized: boolean };
      cache: Record<string, any>;
      flags: { prefetchDone: boolean };
    };
  }
}

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Award, GraduationCap, Briefcase, Code2, Zap, CheckCircle2, ArrowRight, Sparkles, User, Target, BookOpen } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useEffect, useMemo, useState, useCallback, memo } from "react";
import { fetchCache } from "@/lib/fetchCache";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { certifications as staticCertifications } from "@/data/skills";
// Removed static fallbacks to ensure Redis-first data behavior

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function About() {
  const { certifications: adminCerts, skills: adminSkills, experience: adminExperience, education: adminEducation } = useAdmin();
  const [hydrated, setHydrated] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any>(null);
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    // Wait for global data to be ready from splash screen
    const handleDataReady = () => {
      // Load from cache immediately
      const cp = fetchCache.get<any>("/api/portfolio/personal-info");
      const ce = fetchCache.get<any>("/api/portfolio/experience-education");
      const cs = fetchCache.get<any[]>("/api/portfolio/skills");
      const ct = fetchCache.get<any[]>("/api/portfolio/timeline");
      
      if (cp) setPersonalInfo(cp);
      if (ce) {
        setExperience((ce as any).experience || []);
        setEducation((ce as any).education);
      }
      if (cs) setSkillCategories(cs);
      if (ct) setTimeline(Array.isArray(ct) ? ct : []);
      
      setHydrated(true);
    };

    // Check if data is already ready (splash completed before component mount)
    if (window.__APP__?.flags.prefetchDone || (window.__APP__?.cache && Object.keys(window.__APP__.cache).length > 0)) {
      handleDataReady();
    } else {
      // Wait for the event
      window.addEventListener('globalDataReady', handleDataReady, { once: true });
      
      // Fallback: force render after 6 seconds
      const fallbackTimeout = setTimeout(() => {
        handleDataReady();
      }, 6000);
      
      return () => {
        window.removeEventListener('globalDataReady', handleDataReady);
        clearTimeout(fallbackTimeout);
      };
    }
  }, []);

  const safePersonal = personalInfo ?? {};

  const displayedCerts = useMemo(() => (
    adminCerts && adminCerts.length > 0 ? adminCerts : staticCertifications
  ), [adminCerts]);

  const displaySkills = useMemo(() => (
    adminSkills && adminSkills.length > 0 ? adminSkills : skillCategories
  ), [adminSkills, skillCategories]);

  const displayExperience = useMemo(() => (
    Array.isArray(adminExperience) && adminExperience.length > 0
      ? adminExperience
      : Array.isArray(experience) && experience.length > 0
        ? experience
        : []
  ), [adminExperience, experience]);

  const displayEducation = useMemo(() => (
    Array.isArray(adminEducation) && adminEducation.length > 0
      ? adminEducation
      : Array.isArray(education) && education.length > 0
        ? education
        : []
  ), [adminEducation, education]);

  if (!hydrated) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" />
        </div>

        <div className="container px-4 mx-auto sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <motion.div 
              variants={container} 
              initial="hidden" 
              animate="show" 
              className="space-y-10"
            >
              <motion.div variants={item} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full dark:border shadow-sm">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {safePersonal.heroSubtitle || safePersonal.title || "About Me"}
                </span>
              </motion.div>

              <motion.div variants={item} className="space-y-6">
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl font-display leading-[1.1]">
                  {safePersonal.aboutTitle || "Crafting Digital Excellence"}
                </h1>
                {safePersonal.tagline && (
                  <p className="text-xl leading-relaxed opacity-80 max-w-2xl">
                    {safePersonal.tagline}
                  </p>
                )}
              </motion.div>

              <motion.div variants={item} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <p className="text-sm font-medium uppercase tracking-widest opacity-70">Location</p>
                    {safePersonal.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <p className="text-lg font-semibold">{safePersonal.location}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium uppercase tracking-widest opacity-70">Experience</p>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5" />
                      <p className="text-lg font-semibold">{displayExperience.length}+ Years</p>
                    </div>
                  </div>
                </div>

                <Button size="lg" asChild className="gap-3 w-fit">
                  <Link href="/contact">
                    {safePersonal.ctaLabel || "Get in Touch"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group"
            >
              <div className="relative rounded-2xl dark:border overflow-hidden shadow-2xl max-w-sm mx-auto">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                  src="/profile.png"
                  alt="Profile"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                  <span
                  className="signature-font"
                  style={{
                    fontSize: '4rem',
                    fontWeight: 400,
                    opacity: 0.85,
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    right: '10px',
                    textAlign: 'center',
                  }}
                  >
                  {safePersonal.name || "Aryan Raj"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-16 text-center space-y-4"
          >
            <p className="text-sm uppercase tracking-widest opacity-70">
              The Journey
            </p>
            
          </motion.div>

          {/* Timeline */}
          {timeline.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-12">
                {timeline.map((section, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg dark:border flex items-center justify-center">
                        {section.category === "Education" ? (
                          <GraduationCap className="w-6 h-6" />
                        ) : section.category === "Work" ? (
                          <Briefcase className="w-6 h-6" />
                        ) : (
                          <Target className="w-6 h-6" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold font-display">{section.category}</h3>
                    </div>

                    <div className="space-y-8 ml-4 pl-8 border-l">
                      {section.entries.map((entry: any, i: number) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-12 top-1 w-8 h-8 rounded-full dark:border-2 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xl font-semibold">{entry.heading}</h4>
                            <p className="opacity-80 leading-relaxed">{entry.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="rounded-2xl dark:border-2 border-dashed p-12 text-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl dark:border mb-4">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display">Your Journey Awaits</h3>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Certifications Gallery */}
      {displayedCerts.length > 0 && (
        <CertificatesGallery certificates={displayedCerts} />
      )}

      {/* Experience Section */}
      {displayExperience.length > 0 && (
        <section className="py-20">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto mb-16 text-center space-y-4"
            >
              <p className="text-sm uppercase tracking-widest opacity-70">
                Experience
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl font-display">
                Professional Journey
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {displayExperience.map((exp: any, i: number) => {
                // Handle both static and admin experience formats
                const experienceData = {
                  company: exp.company,
                  position: exp.position || exp.role, // Handle both formats
                  startDate: exp.startDate || (exp.duration ? exp.duration.split(" – ")[0] : ""),
                  endDate: exp.endDate || (exp.duration ? exp.duration.split(" – ")[1] : ""),
                  current: exp.current || false,
                  location: exp.location,
                  type: exp.type,
                  description: exp.description,
                  achievements: exp.achievements || []
                };

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative rounded-xl dark:border p-8 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-xl dark:border flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-8 h-8" />
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold font-display">{experienceData.position}</h3>
                          <p className="text-lg text-primary font-medium">{experienceData.company}</p>
                          {experienceData.location && (
                            <p className="text-muted-foreground flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {experienceData.location}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-mono">
                            {experienceData.startDate} - {experienceData.current ? "Present" : (experienceData.endDate || "Present")}
                          </span>
                          {experienceData.type && (
                            <span className="px-3 py-1 rounded-full bg-secondary/50 dark:border">
                              {experienceData.type}
                            </span>
                          )}
                        </div>

                        {experienceData.description && (
                          <p className="text-muted-foreground">{experienceData.description}</p>
                        )}

                        {experienceData.achievements && experienceData.achievements.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                              Key Achievements
                            </p>
                            <ul className="space-y-2">
                              {experienceData.achievements.map((achievement: string, j: number) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-3 text-sm text-muted-foreground"
                                >
                                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {displayEducation.length > 0 && (
        <section className="py-20">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto mb-16 text-center space-y-4"
            >
              <p className="text-sm uppercase tracking-widest opacity-70">
                Education
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl font-display">
                Academic Background
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {displayEducation.map((edu: any, i: number) => {
                // Handle both static and admin education formats
                const educationData = {
                  degree: edu.degree,
                  institution: edu.institution,
                  field: edu.field || edu.degree, // Use degree as field if not specified
                  startDate: edu.startDate || (edu.duration ? edu.duration.split(" – ")[0] : ""),
                  endDate: edu.endDate || (edu.duration ? edu.duration.split(" – ")[1] : ""),
                  grade: edu.grade || edu.cgpa,
                  coursework: edu.coursework || []
                };

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative rounded-xl dark:border p-8 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-xl dark:border flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold font-display">{educationData.degree}</h3>
                          <p className="text-lg text-primary font-medium">{educationData.institution}</p>
                          {educationData.field && educationData.field !== educationData.degree && (
                            <p className="text-muted-foreground">{educationData.field}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {(educationData.startDate || educationData.endDate) && (
                            <span className="font-mono">
                              {educationData.startDate} - {educationData.endDate}
                            </span>
                          )}
                          {educationData.grade && (
                            <span className="px-3 py-1 rounded-full bg-secondary/50 dark:border">
                              {educationData.grade}
                            </span>
                          )}
                        </div>

                        {educationData.coursework && educationData.coursework.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                              Key Coursework
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {educationData.coursework.map((course: string, j: number) => (
                                <span
                                  key={j}
                                  className="px-3 py-1 text-sm rounded-lg dark:border hover:shadow transition-all"
                                >
                                  {course}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {displaySkills.length > 0 && (
        <section className="py-20">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto mb-16 text-center space-y-4"
            >
              <p className="text-sm uppercase tracking-widest opacity-70">
                Expertise
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl font-display">
                Technical Mastery
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displaySkills.map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-xl dark:border p-8 hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg dark:border flex items-center justify-center">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-xl font-display">
                        {category.category}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {((category as any).items || (category as any).skills || []).map((skill: any, j: number) => (
                        <span
                          key={j}
                          className="px-4 py-2 text-sm rounded-lg dark:border hover:shadow transition-all"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold sm:text-4xl font-display">
                Let's Build Something Extraordinary
              </h2>
              <p className="text-lg opacity-80">
                Interested in collaborating or discussing innovative solutions? I'm always excited about new challenges.
              </p>
            </div>
            
            <Button size="lg" asChild className="gap-3">
              <Link href="/contact">
                Start a Conversation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Certificates Gallery Component - Professional Coverflow Style
const CertificatesGallery = memo(function CertificatesGallery({ certificates }: { certificates: any[] }) {
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate carousel
  useEffect(() => {
    if (certificates.length === 0 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % certificates.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [certificates.length, isPaused]);

  const paginate = useCallback((newDirection: number) => {
    setCurrentIndex((prev) => (prev + newDirection + certificates.length) % certificates.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  }, [certificates.length]);

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  }, []);

  const handleCertClick = useCallback((i: number, offset: number, cert: any) => {
    setCurrentIndex(i);
    if (offset === 0) setSelectedCert(cert);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCert(null);
  }, []);

  if (certificates.length === 0) return null;

  return (
    <>
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-16 text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Professional Credentials</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold font-display bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
              Certifications Gallery
            </h2>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              Showcasing my professional achievements and continuous learning journey
            </p>
          </motion.div>

          {/* Professional Coverflow Carousel */}
          <div className="max-w-7xl mx-auto relative px-4">
            <div className="relative h-[520px] md:h-[620px] flex items-center justify-center overflow-visible" 
              style={{ perspective: '3000px' }}
              onMouseEnter={() => setIsPaused(true)} 
              onMouseLeave={() => setIsPaused(false)}>
              <div className="relative w-full flex items-center justify-center">
                {certificates.map((cert: any, i: number) => {
                  let offset = i - currentIndex;
                  
                  // Create circular wrap-around effect
                  const total = certificates.length;
                  if (offset > total / 2) offset -= total;
                  if (offset < -total / 2) offset += total;
                  
                  const isVisible = Math.abs(offset) <= 2;
                  if (!isVisible) return null;
                  
                  return (
                    <motion.div 
                      key={i} 
                      onClick={() => handleCertClick(i, offset, cert)}
                      className="absolute cursor-pointer"
                      style={{ transformStyle: 'preserve-3d' }}
                      animate={{
                        x: offset * 340,
                        scale: offset === 0 ? 1.05 : 0.78,
                        rotateY: offset * -30,
                        z: offset === 0 ? 120 : -160,
                        opacity: offset === 0 ? 1 : 0.65,
                        zIndex: 10 - Math.abs(offset),
                      }}
                      transition={{ duration: 0.65, type: "spring", stiffness: 110, damping: 22 }}>
                      <div className="w-[420px] md:w-[540px]">
                        <motion.div 
                          whileHover={offset === 0 ? { y: -8, scale: 1.02 } : {}}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="relative group">
                          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border border-border/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
                            {cert.imageUrl ? (
                              <>
                                <div className="relative aspect-[16/10] overflow-hidden flex items-center justify-center p-4 md:p-6 bg-gradient-to-br from-background/10 to-transparent">
                                  <Image 
                                    src={cert.imageUrl} 
                                    alt={cert.title} 
                                    fill 
                                    className="object-contain drop-shadow-2xl" 
                                    sizes="(max-width: 768px) 420px, 540px" 
                                    priority={Math.abs(offset) === 0}
                                  />
                                </div>
                                <div className="relative px-6 py-4 md:py-5 border-t border-border/30 bg-gradient-to-r from-card/60 via-card/40 to-card/60 backdrop-blur-md">
                                  <h3 className="text-base md:text-lg font-semibold text-foreground/90 text-center tracking-wide">
                                    {cert.title}
                                  </h3>
                                  {offset === 0 && (
                                    <motion.div
                                      initial={{ scaleX: 0 }}
                                      animate={{ scaleX: 1 }}
                                      transition={{ delay: 0.2, duration: 0.4 }}
                                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-primary/60 rounded-full"
                                    />
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="relative aspect-[16/10] bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
                                <Award className="w-24 h-24 opacity-15 text-primary" />
                              </div>
                            )}
                          </div>
                          {offset === 0 && (
                            <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}\n              </div>
              
              {/* Navigation Arrows - Elegant Design */}
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(-1)}
                className="absolute left-2 md:left-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-card/80 hover:bg-card backdrop-blur-xl border border-border/50 shadow-lg hover:shadow-xl flex items-center justify-center text-foreground/70 hover:text-primary transition-all duration-300 group">
                <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(1)}
                className="absolute right-2 md:right-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-card/80 hover:bg-card backdrop-blur-xl border border-border/50 shadow-lg hover:shadow-xl flex items-center justify-center text-foreground/70 hover:text-primary transition-all duration-300 group">
                <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

              {/* Pause indicator - Subtle */}
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-xl border border-border/30 text-foreground/60 text-xs font-medium z-20 shadow-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse"></span>
                  Paused
                </motion.div>
              )}
            </div>

            {/* Refined Indicators Section */}
            <div className="mt-10 space-y-4">
              {/* Dot Indicators - Minimal & Elegant */}
              <div className="flex justify-center items-center gap-1.5">
                {certificates.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDotClick(index)}
                    className="group relative"
                  >
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-10 bg-primary shadow-lg shadow-primary/50' 
                        : 'w-1.5 bg-foreground/20 group-hover:bg-foreground/40 group-hover:w-4'
                    }`} />
                  </motion.button>
                ))}
              </div>

              {/* Progress Bar - Sleek Design */}
              <div className="max-w-xs mx-auto px-4">
                <div className="h-0.5 bg-border/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60"
                    animate={{ width: `${((currentIndex + 1) / certificates.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Counter - Professional Typography */}
              <div className="flex justify-center items-center gap-2 text-foreground/50">
                <span className="text-lg font-semibold text-foreground/70">{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="text-xs font-medium">/</span>
                <span className="text-sm font-medium">{String(certificates.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Modal - Elegant Design */}
      {selectedCert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full cursor-default"
          >
            {/* Certificate Display */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-card/20 to-card/10 backdrop-blur-sm border border-border/20">
              <div className="relative aspect-[16/10] flex items-center justify-center p-6 md:p-8">
                <Image
                  src={selectedCert.imageUrl || ''}
                  alt={selectedCert.title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </div>
              
              {/* Title Bar */}
              <div className="px-8 py-6 border-t border-border/20 bg-card/40 backdrop-blur-md">
                <h3 className="text-xl md:text-2xl font-semibold text-center text-foreground">
                  {selectedCert.title}
                </h3>
                {selectedCert.id && (
                  <p className="text-center mt-3 text-sm text-foreground/60">
                    <span className="font-mono">{selectedCert.id}</span>
                  </p>
                )}
              </div>
            </div>
            
            {/* Close Button - Elegant */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCloseModal}
              className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-11 h-11 md:w-12 md:h-12 rounded-full bg-card/90 hover:bg-card backdrop-blur-xl border border-border/50 text-foreground/70 hover:text-foreground flex items-center justify-center shadow-xl transition-all duration-300 group"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            
            {/* Close Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-foreground/40 text-sm font-medium"
            >
              Click outside to close
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
});

