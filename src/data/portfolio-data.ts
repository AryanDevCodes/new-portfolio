// 📝 PORTFOLIO DATA - Yahan se saara data manage karo
// Bas iss file ko edit karo, baaki sab automatic update ho jayega!

export const personalInfo = {
  name: "Aryan Raj",
  title: "Backend Engineer",
  tagline: "I design and build secure, scalable backend systems.",
  bio: `Hi, I’m Aryan 👋  
Backend engineer focused on building scalable, production-grade systems.

• Java & Spring Boot  
• RESTful APIs & real-time communication  
• Authentication & secure system design  
• Cloud-native architecture`,

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

  // About Section
  aboutTitle: "Backend Engineer. System Thinker. Builder.",
  aboutDescription: `I design and build secure, high-performance, real-time web applications 
with clean architecture, role-based access control, and production-grade backend systems.`,

  story: [
    {
      category: "Early Curiosity & Self-Learning",
      entries: [
        {
          heading: "Before 2022",
          description: "My interest in technology started early, driven by curiosity about how applications and digital systems work behind the scenes. With limited resources, I began learning independently using my phone—experimenting with mod APKs, exploring application behavior, customizing code, and learning through online content. This phase shaped my problem-solving mindset and technical curiosity."
        }
      ]
    },
    {
      category: "Stepping Into Engineering",
      entries: [
        {
          heading: "2022 — B.Tech (AIML)",
          description: "In 2022, I moved to a new state to pursue my B.Tech in Artificial Intelligence & Machine Learning. While the curriculum focused on AIML, my long-term goal was clear—to become a strong software developer capable of building real-world systems."
        }
      ]
    },
    {
      category: "Choosing Java as My Core Stack",
      entries: [
        {
          heading: "2023–2024",
          description: "After studying industry trends, I deliberately chose Java as my primary language due to its widespread adoption in production systems. Without formal coaching, I learned Java from scratch using documentation, YouTube, handwritten notes, and consistent practice—building a strong foundation in Core Java, Advanced Java, web fundamentals, and database connectivity."
        }
      ]
    },
    {
      category: "Backend Engineering with Spring Boot",
      entries: [
        {
          heading: "2024–2025",
          description: "I transitioned into backend development using Spring and Spring Boot, where I built RESTful APIs, implemented JWT-based authentication and authorization, handled security concerns, and managed backend workflows. Alongside backend development, I developed intermediate frontend skills to deliver complete end-to-end applications."
        }
      ]
    },
    {
      category: "Reality Check: DSA Matters",
      entries: [
        {
          heading: "2025",
          description: "A key realization in my journey was the importance of Data Structures & Algorithms. Underestimating DSA early on led to missed interview opportunities. This experience reshaped my approach toward engineering preparation and problem-solving."
        }
      ]
    },
    {
      category: "Present Focus: Strong Fundamentals & Scale",
      entries: [
        {
          heading: "2025–Present",
          description: "Today, I actively combine DSA practice with development, focusing on writing efficient, scalable, and maintainable systems. My goal is to continuously strengthen engineering fundamentals while building secure, production-ready applications."
        }
      ]
    }
  ],
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

  ctaHeading: "// Get In Touch"
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
  }
};

// Projects page
export const projectsPage = {
  heading: "// Projects",
  title: "Things I've Built",
  description: `A collection of projects showcasing my expertise in backend engineering, 
real-time systems, and full-stack development.`,
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
