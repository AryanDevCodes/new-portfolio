"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Award, GraduationCap, Briefcase, Sparkles, BarChart3, Cpu } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import profileImage from "@/assets/profile.jpg";
import { useEffect, useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function About() {
  const { certifications: adminCerts, skills: adminSkills, experience: adminExperience, education: adminEducation } = useAdmin();
  const [hydrated, setHydrated] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any>(null);
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personalRes, expEduRes, skillsRes, certsRes] = await Promise.all([
          fetch("/api/portfolio/personal-info"),
          fetch("/api/portfolio/experience-education"),
          fetch("/api/portfolio/skills"),
          fetch("/api/portfolio/certifications"),
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
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const safePersonal = personalInfo ?? {
    aboutTitle: "About",
    bio: "",
    location: "",
  };

  const displayedCerts = (adminCerts && adminCerts.length > 0)
    ? adminCerts
    : [];
  const displaySkills = (adminSkills && adminSkills.length > 0) ? adminSkills : skillCategories;
  const displayExperience = (Array.isArray(adminExperience) && adminExperience.length > 0) ? adminExperience : experience;
  const displayEducation = (Array.isArray(adminEducation) && adminEducation.length > 0) ? adminEducation : (education ? [education] : []);
  
  // Helper to get property safely with fallback
  const getExpField = (exp: any, adminField: string, staticField: string) => {
    return exp[adminField] !== undefined ? exp[adminField] : exp[staticField];
  };
  
  const getEduField = (edu: any, adminField: string, staticField: string) => {
    return edu[adminField] !== undefined ? edu[adminField] : edu[staticField];
  };

  if (!hydrated) {
    return null;
  }
  return (
    <>
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]">
          <div className="absolute top-[-10%] left-[-5%] w-[320px] h-[320px] bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] right-[10%] w-[380px] h-[380px] bg-accent/25 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            {/* Left Content */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-5"
            >
              <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs sm:text-sm font-mono text-muted-foreground backdrop-blur">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>// About Me</span>
              </motion.div>

              <motion.h1
                variants={item}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight font-display"
              >
                {safePersonal.aboutTitle}
              </motion.h1>

              <motion.p
                variants={item}
                className="text-lg text-muted-foreground max-w-3xl font-mono"
              >
                {(safePersonal.bio || "").split(/\n|\\n/)[1] || ""}
              </motion.p>

              <motion.div
                variants={item}
                className="flex flex-wrap items-center gap-4 text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{safePersonal.location}</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2 text-sm font-mono">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span>{(skillCategories || []).reduce((acc, cur) => acc + (cur.skills?.length || 0), 0)} skills mapped</span>
                </div>
              </motion.div>

              <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
                {["Systems Design", "Realtime", "APIs", "Cloud", "DX", "Data"]
                  .map((label) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm"
                    >
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground font-mono">{label}</span>
                    </div>
                  ))}
              </motion.div>
            </motion.div>

            {/* Right - Profile Image + Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="relative group mx-auto max-w-[320px]">
                <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-r from-primary/30 via-primary/15 to-accent/25 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="relative rounded-[24px] border border-border/60 bg-card/70 backdrop-blur overflow-hidden shadow-[0_25px_60px_-35px_rgba(0,0,0,0.55)]">
                  <div className="relative h-[320px] w-full">
                    <img
                      src={profileImage.src}
                      alt={safePersonal.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-border border-t border-border bg-card/80 text-center">
                    <div className="p-4">
                      <p className="text-xs font-mono text-muted-foreground">Experience</p>
                      <p className="text-xl font-bold">{displayExperience.length}+ yrs</p>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-mono text-muted-foreground">Projects</p>
                      <p className="text-xl font-bold">{skillCategories.length * 3}+ builds</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl space-y-4"
          >
            {personalInfo && personalInfo.bio && personalInfo.bio.split(/\n|\\n/).map((line: string, idx: number) => {
              if (!line.trim()) return null;
              if (idx === 0) {
                return (
                  <span key={idx} className="block text-2xl sm:text-3xl font-bold text-gradient-animated font-display">
                    {line.trim()}
                  </span>
                );
              }
              if (line.trim().startsWith("•")) {
                return (
                  <div key={idx} className="flex items-start gap-3 rounded-xl border border-border bg-card/70 px-4 py-3">
                    <span className="mt-1 text-primary">▹</span>
                    <span className="text-base text-muted-foreground leading-relaxed">{line.replace(/^•\s*/, "")}</span>
                  </div>
                );
              }
              return (
                <span key={idx} className="block text-base text-muted-foreground leading-relaxed">
                  {line.trim()}
                </span>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-[20%] left-[10%] w-[280px] h-[280px] bg-primary/40 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] right-[8%] w-[320px] h-[320px] bg-accent/30 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-display">My Journey</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
          </motion.div>

          <div className="relative">
            {/* Timeline Line - Gradient */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-accent md:-translate-x-1/2" />

            <div className="space-y-12">
              {personalInfo && personalInfo.story && personalInfo.story.map((phase: any, i: number) => (
                <motion.div
                  key={phase.category}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Dot - Animated */}
                  <motion.div
                    whileInView={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6 }}
                    className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent md:-translate-x-1/2 mt-2 ring-2 ring-background"
                  />

                  {/* Content */}
                  <div className={`flex-1 pl-12 md:pl-0 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="p-6 rounded-2xl bg-card/70 border border-border hover:border-primary/30 transition-all shadow-[0_8px_30px_-20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_-25px_rgba(0,0,0,0.4)]"
                    >
                      <span className="text-primary font-mono text-sm">
                        {phase.entries[0].heading}
                      </span>
                      <h3 className="text-xl font-bold mt-2 mb-3 font-display">{phase.category}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {phase.entries[0].description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-card/50 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-1/4 right-[5%] w-[300px] h-[300px] bg-primary/35 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-display">Technical Skills</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySkills.map((category, i) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl bg-card/70 border border-border hover:border-primary/40 transition-all shadow-sm hover:shadow-[0_12px_40px_-25px_rgba(0,0,0,0.4)] group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-primary to-accent" />
                  <h3 className="font-mono font-semibold text-primary text-lg">
                    {category.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {((category as any).items || (category as any).skills || []).map((skill: string, idx: number) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 + idx * 0.02 }}
                      whileHover={{ scale: 1.08, y: -2 }}
                      className="px-3 py-1.5 text-sm rounded-lg bg-secondary/70 text-secondary-foreground hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 hover:text-primary transition-all cursor-default font-mono"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-12"
          >
            <span className="text-primary font-mono">//</span> Experience
          </motion.h2>

          <div className="space-y-6 max-w-3xl">
            {displayExperience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{getExpField(exp, 'position', 'role')}</h3>
                        <p className="text-primary font-mono text-sm">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{getExpField(exp, 'startDate', 'duration') 
                          ? (getExpField(exp, 'current', '') ? `${getExpField(exp, 'startDate', 'duration')} - Present` : `${getExpField(exp, 'startDate', '')} - ${getExpField(exp, 'endDate', '') || 'Present'}`)
                          : getExpField(exp, 'duration', 'Unknown')}</span>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {(exp.achievements || []).map((achievement: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">▹</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section className="py-20 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-8">
                <span className="text-primary font-mono">//</span> Education
              </h2>
              <div className="space-y-4">
                {displayEducation.map((edu, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-card border border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{getEduField(edu, 'field', 'degree')}</h3>
                        <p className="text-primary font-mono text-sm">{(edu as any).institution}</p>
                        {(edu as any).university && <p className="text-muted-foreground text-sm">{(edu as any).university}</p>}
                        {((edu as any).grade || (edu as any).cgpa) && <p className="text-sm text-muted-foreground">Grade: {(edu as any).grade || (edu as any).cgpa}</p>}
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {
                              (edu as any).startDate !== undefined
                                ? `${(edu as any).startDate} - ${(edu as any).endDate || 'Present'}`
                                : (edu as any).duration
                            }
                          </span>
                          {(edu as any).location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {(edu as any).location}
                            </span>
                          )}
                        </div>
                        {(edu.coursework && edu.coursework.length > 0) && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {edu.coursework.map((course: string) => (
                              <span
                                key={course}
                                className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-8">
                <span className="text-primary font-mono">//</span> Certifications
              </h2>
              <div className="space-y-3">
                {displayedCerts.map((cert, i) => (
                  <motion.div
                    key={(cert as any).title ?? cert}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-card border border-border flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    {('url' in cert && (cert as any).url) ? (
                      <a
                        href={(cert as any).url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline underline-offset-4"
                        title={(cert as any).issuer ? `${(cert as any).issuer}` : undefined}
                      >
                        {(cert as any).title}
                      </a>
                    ) : (
                      <span className="text-sm">{(cert as any).title ?? cert}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
