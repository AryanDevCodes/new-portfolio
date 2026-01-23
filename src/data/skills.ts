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
  imageUrl?: string;
}

export const certifications: StaticCertification[] = [
  {
    title: "Core Java Certificate",
    imageUrl: "/certificates/core-java.jpg",
  },
  {
    title: "Java Spring Boot Certificate",
    imageUrl: "/certificates/SpringBoot.jpg",
  },
  {
    title: "Spring MVC Certificate",
    imageUrl: "/certificates/spring-mvc.jpg",
  },
  {
    title: "HTML Certificate",
    imageUrl: "/certificates/html.jpg",
  },
  {
    title: "CSS Certificate",
    imageUrl: "/certificates/css.jpg",
  },
  {
    title: "JavaScript Certificate",
    imageUrl: "/certificates/javaScript.jpg",
  },
  {
    title: "SQL Certificate",
    imageUrl: "/certificates/SQL.jpg",
  },
  {
    title: "Java Internship Certificate",
    imageUrl: "/certificates/JAVA_INTERNSHIP.jpg",
  },
];
