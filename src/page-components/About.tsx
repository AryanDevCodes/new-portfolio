"use client";

import { motion } from "framer-motion";
import { MapPin, Award, GraduationCap, Briefcase, Code2, Zap, CheckCircle2, ArrowRight, Sparkles, User, Target, BookOpen } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
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
    setHydrated(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personalRes, expEduRes, skillsRes, timelineRes] = await Promise.all([
          fetch("/api/portfolio/personal-info"),
          fetch("/api/portfolio/experience-education"),
          fetch("/api/portfolio/skills"),
          fetch("/api/portfolio/timeline"),
        ]);

        if (personalRes.ok) {
          const data = await personalRes.json();
          setPersonalInfo(data);
        }
        if (expEduRes.ok) {
          const data = await expEduRes.json();
          setExperience(data.experience || []);
          setEducation(data.education);
        }
        if (skillsRes.ok) {
          const data = await skillsRes.json();
          setSkillCategories(data);
        }
        if (timelineRes.ok) {
          const data = await timelineRes.json();
          setTimeline(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    fetchData();
  }, []);

  const safePersonal = personalInfo ?? {};

  const displayedCerts = (adminCerts && adminCerts.length > 0) ? adminCerts : [];
  const displaySkills = (adminSkills && adminSkills.length > 0) ? adminSkills : skillCategories;
  const displayExperience = (Array.isArray(adminExperience) && adminExperience.length > 0)
    ? adminExperience
    : (Array.isArray(experience) && experience.length > 0)
      ? experience
      : [];
  const displayEducation = (Array.isArray(adminEducation) && adminEducation.length > 0)
    ? adminEducation
    : (Array.isArray(education) && Array.isArray(education) && education.length > 0)
      ? education
      : [];

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

      {/* Certifications */}
      {displayedCerts.length > 0 && (
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
                Credentials
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl font-display">
                Certifications & Achievements
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCerts.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative rounded-xl dark:border p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg dark:border flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 flex-1">
                      {cert.url ? (
                        <Link href={cert.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg text-primary hover:text-primary/80 transition-colors" style={{ textDecoration: 'none' }}>
                          {cert.title}
                        </Link>
                      ) : (
                        <h3 className="font-semibold text-lg">{cert.title}</h3>
                      )}
                      {cert.issuer && (
                        <p className="text-sm opacity-70">{cert.issuer}</p>
                      )}
                      {cert.date && (
                        <p className="text-sm font-mono opacity-70">{cert.date}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
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