// 📝 PORTFOLIO DATA - Yahan se saara data manage karo
// Bas iss file ko edit karo, baaki sab automatic update ho jayega!

export const personalInfo = {
  name: "Aryan Raj",
  title: "Backend Engineer",
  tagline: "I design and build secure, scalable backend systems.",
  bio: `Hi, I’m Aryan — a backend engineer focused on building scalable, production-ready systems.

I specialize in designing backend services that are secure, modular, and easy to evolve,
with a strong foundation in system design and clean architecture.
"
-> Java & Spring Boot
-> RESTful APIs & real-time communication
-> Authentication, authorization & secure system design
-> Cloud-native backend architecture

I aim to build systems that are not just functional today, but resilient and extensible for the future.`,

  location: "Bhopal, Madhya Pradesh",
  email: "rajaryan.codes@gmail.com",

  // Social Links
  github: "https://github.com/AryanDevCodes",
  linkedin: "https://www.linkedin.com/in/rajaryanse",
  twitter: "",
  portfolio: "",

  // Resume
  resumeUrl: "/resume.pdf",

  // Profile Photo
  profileImage: "/profile.jpg",

  // Hero Section
  heroTitle: "Hi, I'm Aryan",
  heroSubtitle: "Backend Engineer & System Architect",
  heroDescription: `I design and build secure, scalable backend systems with clean architecture, 
role-based access control, and production-grade performance.`,
  ctaLabel: "Get in Touch",

  // About Section
  aboutTitle: "Backend Engineer. System Thinker. Builder.",
  aboutDescription: `I design and build secure, high-performance, real-time web applications 
with clean architecture, role-based access control, and production-grade backend systems.`,
};

export const education = {
  degree: "B.Tech in Artificial Intelligence and Machine Learning",
  institution: "Jai Narain College of Technology",
  university: "RGPV University",
  location: "Bhopal, Madhya Pradesh",
  duration: "2022 – 2026",
  cgpa: "7.30",
  coursework: [
    "Data Structures",
    "Algorithms",
    "Database Systems",
    "Cloud Computing",
    "Software Engineering"
  ]
};

export const experience = [
  {
    role: "Java Development Intern",
    company: "Coding Raja Technologies",
    location: "Remote",
    duration: "May 2024 – June 2024",
    type: "Internship",
    achievements: [
      "Developed 3+ Java GUI desktop applications using Swing and JavaFX",
      "Applied MVC architecture and event-driven programming for responsive interfaces",
      "Built interactive UI components with JDBC-based database integration",
      "Collaborated with a 5-member remote team using Git workflows",
      "Participated in 15+ code reviews, standups, and agile sprint planning"
    ]
  }
  // Add more experiences here
];

export const stats = {
  projectsCompleted: "10+",
  certifications: 5,
  linesOfCode: 10000,
  clientSatisfaction: 95
};

// About page sections
export const aboutSections = {
  storyHeading: "My Story",
  skillsHeading: "Technical Skills",
  experienceHeading: "Experience",
  educationHeading: "Education",
  certificationsHeading: "Certifications"
};

// Home page sections
export const homeSections = {
  aboutHeading: "// About",
  aboutSubtitle: "Backend Engineer. System Thinker. Builder.",
  aboutShortBio: "I design and build secure, scalable backend systems.",
  aboutReadMore: "Read more about me",

  featuredProjectsHeading: "// Featured Projects",
  featuredProjectsSubtitle: "Things I've built",
  allProjectsButton: "View all projects",

  ctaHeading: "// Get In Touch",

  capabilities: [
    {
      title: "Architecture",
      icon: "layers",
      items: ["Domain-driven design", "API strategy & governance", "Async & event-driven", "Performance budgets"],
    },
    {
      title: "Platform",
      icon: "server",
      items: ["Spring Boot services", "AuthN/AuthZ & RBAC", "CI/CD & observability", "Cloud-native patterns"],
    },
    {
      title: "Delivery",
      icon: "shieldcheck",
      items: ["Resilience & SLIs", "Perf testing & profiling", "Incident-ready runbooks", "Docs your team can ship"],
    },
  ],
};

// Navbar links
export const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" }
];

// Footer
export const footerData = {
  tagline: "Building scalable backend systems.",
  copyright: `© ${new Date().getFullYear()} Aryan Raj. All rights reserved.`,
  builtWith: "Built with Next.js, TypeScript & Tailwind CSS"
};

// Contact page
export const contactPage = {
  heading: "// Contact",
  title: "Get In Touch",
  description: `I'm currently looking for backend engineering opportunities. Whether you 
have a question, an opportunity, or just want to say hi—I'll do my best to get back to you!`,

  infoKicker: "Get in Touch",
  infoTitle: "Connect With Me",

  links: [
    {
      icon: "Mail",
      label: "Email",
      value: "rajaryan.codes@gmail.com",
      href: "mailto:rajaryan.codes@gmail.com",
    },
    {
      icon: "Mail",
      label: "Alternate Email",
      value: "rajaryan957036@gmail.com",
      href: "mailto:rajaryan957036@gmail.com",
    },
    {
      icon: "Github",
      label: "GitHub",
      value: "AryanDevCodes",
      href: "https://github.com/AryanDevCodes",
    },
    {
      icon: "Linkedin",
      label: "LinkedIn",
      value: "rajaryanse",
      href: "https://www.linkedin.com/in/rajaryanse",
    },
  ],

  formHeading: "Send a Message",
  formDescription: "Fill out the form below and I'll get back to you as soon as possible.",
  formFields: {
    name: "Your Name",
    email: "Your Email",
    subject: "Subject",
    message: "Message",
    submitButton: "Send Message"
  },

  otherWaysKicker: "// Other Ways",
  otherWaysTitle: "More Ways to Connect",
  otherMethods: [
    {
      title: "Quick Question?",
      description: "Use the form above for fastest response",
      icon: "⚡",
    },
    {
      title: "Social Media",
      description: "Connect with me on LinkedIn or GitHub",
      icon: "🔗",
    },
    {
      title: "Direct Email",
      description: "Reach out via email",
      icon: "📧",
    },
  ],
};

// Projects page
export const projectsPage = {
  heading: "// Projects",
  badgeText: "Portfolio & Case Studies",
  title: "Things I've Built",
  description: `A collection of projects showcasing my expertise in backend engineering, 
real-time systems, and full-stack development.`,
  tags: ["Scalable", "Real-time", "Secure", "Observable", "Documented"],
  featuredKicker: "// Featured Builds",
  otherKicker: "// Other Projects",
  otherDescription: "Additional projects and experiments that showcase different aspects of my work.",
  featuredHeading: "Featured Projects",
  otherHeading: "Other Projects"
};

export const ctaSection = {
  title: "Let's build something together.",
  description: `I'm currently looking for backend engineering opportunities where I can 
contribute to meaningful products. Whether you have a question or just want to say hi, 
I'll do my best to get back to you!`,
  buttonText: "Say Hello",
  buttonLink: "mailto:rajaryan.codes@gmail.com"
};

// Metadata for SEO
export const siteMetadata = {
  title: "Aryan Raj - Backend Engineer",
  description: "Backend Engineer specializing in Java, Spring Boot, and scalable system architecture",
  keywords: ["Backend Engineer", "Java Developer", "Spring Boot", "System Architecture", "REST API"],
  author: "Aryan Raj",
  siteUrl: "",
  image: "/profile.jpg"
};
