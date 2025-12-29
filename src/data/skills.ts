export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["Java", "TypeScript", "JavaScript", "Python", "SQL"]
  },
  {
    category: "Backend",
    skills: ["Spring Boot", "Spring Security", "REST APIs", "WebSockets", "Flask", "JWT Auth"]
  },
  {
    category: "Frontend",
    skills: ["React", "Tailwind CSS", "Framer Motion", "ShadCN/UI", "HTML5", "CSS3"]
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Oracle SQL", "H2 Database"]
  },
  {
    category: "Cloud & DevOps",
    skills: ["AWS EC2", "AWS RDS", "Docker", "Git", "CI/CD", "Linux"]
  },
  {
    category: "Concepts",
    skills: ["System Design", "Microservices", "RBAC", "Real-Time Systems", "Design Patterns", "Agile"]
  }
];

export interface StaticCertification {
  title: string;
  issuer?: string;
  url?: string;
  id?: string;
  date?: string;
}

export const certifications: StaticCertification[] = [
  {
    title: "AWS Academy: Cloud Foundations",
    issuer: "AWS Academy",
    url: "https://aws.amazon.com/training/awsacademy/",
  },
  {
    title: "AWS Academy: Machine Learning Foundations",
    issuer: "AWS Academy",
    url: "https://aws.amazon.com/training/awsacademy/",
  },
  {
    title: "Core Java — PrepInsta",
    issuer: "PrepInsta",
    url: "https://prepinsta.com/java/",
  },
  {
    title: "Java Spring Boot — Infosys SpringBoard",
    issuer: "Infosys SpringBoard",
    url: "https://infyspringboard.onwingspan.com/",
  },
  {
    title: "Spring MVC — Infosys SpringBoard",
    issuer: "Infosys SpringBoard",
    url: "https://infyspringboard.onwingspan.com/",
  },
];
