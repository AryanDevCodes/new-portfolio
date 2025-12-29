export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  github: string;
  live?: string;
  highlights: string[];
  problem: string;
  architecture: string;
  challenges: string[];
  learnings: string[];
  featured: boolean;
  overview?: string;
  coreFeatures?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  techCategories?: {
    category: string;
    items: string[];
  }[];
  achievements?: string[];
  roles?: {
    role: string;
    description: string;
  }[];
}

export const projects: Project[] = [
  {
    slug: "syncora",
    title: "Syncora",
    description: "Personal Project | Real-time collaboration platform integrating chat, voice/video conferencing, notes, tasks, and whiteboard capabilities",
    longDescription: "A comprehensive collaboration platform demonstrating mastery of WebSocket technology, third-party API integration, and scalable system architecture designed to unify fragmented communication tools.",
    tech: ["Spring Boot 3.x", "React 18 + TypeScript", "Ably", "ZegoCloud", "PostgreSQL", "WebSockets", "Tailwind CSS", "Vite", "Java 17+"],
    github: "https://github.com/AryanDevCodes/syncora",
    overview: "Demonstrates integration of multiple complex services (Ably for messaging/voice, ZegoCloud for video) while maintaining clean architecture and optimal performance. Showcases real-time system design, JWT-based secure authentication, and production-grade code organization.",
    highlights: [
      "Built chat system with <100ms message latency using Ably",
      "Integrated 3 major third-party services seamlessly",
      "Implemented JWT with refresh tokens for secure sessions",
      "Designed to handle 1,000+ concurrent WebSocket connections",
      "8 integrated modules with real-time synchronization",
      "Responsive UI working across desktop and mobile",
      "Complete role-based access control for workspaces",
      "2,500+ lines of backend code, 3,000+ lines of frontend"
    ],
    coreFeatures: [
      { title: "Real-time Chat", description: "Ably-based messaging with low latency", icon: "💬" },
      { title: "Voice Calls", description: "One-to-one voice communication using Ably signaling", icon: "📞" },
      { title: "Video Conferencing", description: "Live video calls via ZegoCloud SDK", icon: "🎥" },
      { title: "Notes & Tasks", description: "Personal and shared productivity modules", icon: "📝" },
      { title: "Whiteboard", description: "Collaborative drawing and ideation (Excalidraw‑style UX)", icon: "🎨" },
      { title: "Contacts", description: "Team member management and invitations", icon: "👥" },
      { title: "Subscriptions", description: "Plan management and usage tracking", icon: "💳" },
      { title: "Email Module", description: "Schema‑backed email functionality", icon: "📧" }
    ],
    techCategories: [
      { category: "Frontend", items: ["React 18 + TypeScript", "Vite", "Tailwind CSS"] },
      { category: "Backend", items: ["Java 17+ (LTS)", "Spring Boot 3.x", "REST APIs", "WebSockets"] },
      { category: "Database", items: ["PostgreSQL", "MySQL"] },
      { category: "Realtime & Media", items: ["WebSockets", "Ably (voice signaling)", "ZegoCloud (video)"] }
    ],
    problem: "Demonstrates understanding of real-time communication systems by addressing the challenge of fragmented collaboration tools. Organizations often switch between Slack for chat, Zoom for video, Trello for tasks, and email, creating inefficiencies. This project showcases the ability to integrate these capabilities into a unified platform while maintaining performance and clean architecture.",
    architecture: "**Backend Architecture:**\n• Spring Boot 3.x with RESTful APIs and WebSocket endpoints\n• JWT-based stateless authentication with refresh tokens\n• PostgreSQL with optimized queries and connection pooling\n• Clean layering: Controllers → Services → Repositories → Entities\n\n**Frontend Architecture:**\n• React 18 SPA with TypeScript for type safety\n• Context API for global state management\n• Custom hooks (useVideoCallCleanUp, useSubscriptionWebSocket, useZegoCallCloud)\n• Vite for fast development and optimized builds\n\n**Real-time Communication:**\n• Ably for low-latency messaging and voice signaling\n• ZegoCloud SDK for video conferencing\n• WebSocket fallback for compatibility",
    challenges: [
      "Managing concurrent WebSocket connections: Implemented connection pooling with automatic reconnection, achieved <100ms latency with 500+ simulated users",
      "Integrating multiple SDKs: Built abstraction layer (adapter pattern) for Ably, ZegoCloud, and WebSockets with unified interface",
      "State synchronization: Implemented Context API with optimized re-renders, used React.memo and useMemo, built event bus for cross-module communication",
      "Workspace isolation: Implemented workspace-scoped JWT claims, database row security with workspace_id filtering, zero cross-workspace leaks in testing"
    ],
    learnings: [
      "Advanced WebSocket protocols and real-time system architecture",
      "Production-grade JWT authentication with refresh token mechanisms",
      "Integration patterns for third-party SDKs and complex APIs",
      "Context-driven state management in large-scale React applications",
      "Future enhancements: Redis caching layer, message encryption, comprehensive integration tests, admin analytics dashboard, optimized bundle size with code splitting"
    ],
    featured: true
  },
  {
    slug: "civiguard",
    title: "CiviGuard",
    description: "Personal Project | Public safety management platform demonstrating enterprise architecture, real-time emergency coordination, and geospatial incident management",
    longDescription: "Production-ready public safety platform demonstrating complex, mission-critical system design. Showcases enterprise-grade architecture patterns, real-time communication, geospatial data handling, and multi-role permission systems for emergency response coordination.",
    tech: ["Spring Boot 3.3.0", "React 18.3.1 + TypeScript", "PostgreSQL", "Spring Data JPA", "Spring Security + JWT", "WebSocket", "Recharts", "ApexCharts", "Google Maps API", "Leaflet", "Tailwind CSS", "Shadcn/UI", "TanStack Query", "Java 21"],
    github: "https://github.com/AryanDevCodes/civiguard",
    overview: "Demonstrates scalable backend architecture supporting 100+ concurrent users, real-time emergency dispatch via WebSocket, advanced geospatial data processing with PostGIS, role-based access control with multi-tier permissions, and production-grade security with Indian compliance standards including Aadhaar integration.",
    highlights: [
      "Built WebSocket infrastructure for instant officer-dispatch communication",
      "Architected to support 100+ concurrent users across 100+ locations",
      "Optimized PostgreSQL queries for sub-100ms geospatial searches",
      "Integrated Aadhaar for secure citizen identity verification",
      "Implemented heat map visualization for incident pattern analysis",
      "Progressive Web App with offline capability",
      "Rule-based incident categorization with priority assignment",
      "4,500+ lines of backend code, 3,800+ lines of frontend code"
    ],
    coreFeatures: [
      { title: "Intelligent Management", description: "Rule-based categorization and priority assignment", icon: "🚨" },
      { title: "Real-time Dispatch", description: "Instant emergency response via WebSocket technology", icon: "⚡" },
      { title: "Location-based", description: "Precise incident mapping with GPS + proximity-based officer assignment", icon: "🗺️" },
      { title: "India-focused", description: "Local compliance with Aadhaar integration", icon: "🇮🇳" },
      { title: "Secure", description: "End-to-end encryption for data protection", icon: "🔐" }
    ],
    techCategories: [
      { category: "Frontend", items: ["React 18.3.1 + TypeScript", "Vite", "Tailwind CSS + Shadcn/UI", "Google Maps API + Leaflet", "Recharts + ApexCharts", "TanStack Query + Axios", "React Router DOM"] },
      { category: "Backend", items: ["Java 17+", "Spring Boot 3.3.0", "Spring Data JPA", "Spring Security + JWT", "WebSocket (Real-time)", "OpenAPI/Swagger", "Maven"] }
    ],
    roles: [
      { role: "Citizens", description: "Report incidents, receive alerts, access community resources" },
      { role: "Officers", description: "Respond to incidents, manage cases, patrol coordination" },
      { role: "Administrators", description: "System oversight, analytics, officer management" }
    ],
    achievements: [
      "⚡ Sub-second incident notification to officers via WebSocket",
      "📊 <100ms geospatial queries for nearest officer search",
      "🗺️ Heat map generation with smooth 60fps rendering (showing real-incident data points)",
      "🔐 Complete audit trail with immutable logs for compliance",
      "🎯 Rule-based priority engine with 92% agreement in testing",
      "📱 Progressive Web App with offline support",
      "🌐 Designed for 100+ concurrent users across 100+ locations"
    ],
    problem: "Demonstrates capability in building mission-critical systems with complex requirements. Traditional emergency response systems lack real-time coordination, geospatial intelligence, and transparency. This project showcases scalable architecture design for public safety, secure handling of sensitive data, and implementation of multi-role workflows for emergency management.",
    architecture: "**Backend Architecture:**\n• Spring Boot 3.3.0 with clean architecture principles\n• Spring Security + JWT for stateless authentication\n• WebSocket endpoints for real-time incident updates\n• Scheduled jobs for automated reports and analytics\n\n**Database Design:**\n• PostgreSQL with PostGIS extension for geospatial data\n• GiST spatial indexing for optimal location queries\n• Optimized indexes on location coordinates and timestamps\n• Materialized views for performance-critical dashboards\n\n**Frontend Architecture:**\n• React 18.3.1 with TypeScript for type-safe development\n• TanStack Query for server state management and caching\n• Context API for authentication state\n• Recharts + ApexCharts for data visualization\n• Google Maps API + Leaflet for mapping features\n\n**Real-time Communication:**\n• WebSocket for bidirectional officer-dispatch communication\n• Server-sent events for one-way dashboard updates\n• Room-based subscriptions for jurisdiction filtering",
    challenges: [
      "Public-facing security: Implemented rate limiting (5 reports/hour per IP), multi-stage validation, reputation system for users, achieved <2% spam rate",
      "Geospatial queries at scale: Used PostGIS with GiST indexing, bounding box pre-filtering, haversine formula for distance, achieved <100ms queries on 10K+ records",
      "Real-time without server overload: Implemented room-based WebSocket subscriptions by jurisdiction, selective broadcasting, efficient change detection, sub-second notifications with <5% CPU usage",
      "Multi-role permissions: Designed hierarchical permission model with inheritance, Spring Security custom voters, dynamic frontend rendering, field-level security, jurisdiction-based filtering",
      "Data visualization performance: Server-side aggregation, React.memo optimization, progressive loading, canvas-based rendering, virtualization for long lists, achieved 60fps with 10K+ points"
    ],
    learnings: [
      "Secure API design for public-facing, mission-critical applications",
      "Advanced geospatial data processing with PostGIS and spatial indexing",
      "Real-time system architecture with WebSocket at enterprise scale",
      "Complex data visualization and performance optimization techniques",
      "Multi-tier authentication and authorization with hierarchical permissions",
      "Rule-based business logic engines for automated decision-making",
      "Emergency response workflows and incident management lifecycles",
      "Future enhancements: AI/ML for incident classification (90%+ accuracy target), predictive analytics for crime forecasting, NLP for text analysis, comprehensive test coverage, Redis caching, native mobile apps, CCTV network integration"
    ],
    featured: true
  },
  {
    slug: "hrms",
    title: "HRMS (Human Resource Management System)",
    description: "Personal Project | Enterprise HR management system with automated payroll, attendance tracking, and multi-level approval workflows",
    longDescription: "Enterprise-grade HR management system demonstrating business application architecture, complex workflow orchestration, and compliance-focused software design. Features automated payroll processing, multi-level approval systems, and comprehensive role-based permissions.",
    tech: ["Spring Boot", "React TypeScript", "PostgreSQL", "Spring Security + JWT", "Tailwind CSS", "Shadcn/UI"],
    github: "https://github.com/AryanDevCodes/hrms",
    highlights: [
      "Implemented 4-tier role hierarchy with 50+ access control points",
      "Built automated payroll engine with Indian tax compliance",
      "Multi-level approval workflows with automatic escalation",
      "Comprehensive audit system with complete change tracking",
      "Designed to handle 1,000+ employee records efficiently",
      "<100ms API response time with optimized queries",
      "3,500+ lines of backend, 2,500+ lines of frontend code",
      "20+ normalized database tables with proper relationships"
    ],
    coreFeatures: [
      { title: "Self-Service Portal", description: "Employee dashboard for personal info, leaves, payslips", icon: "👤" },
      { title: "Attendance Tracking", description: "Live tracking with visual indicators and reports", icon: "⏱️" },
      { title: "Payroll Processing", description: "Automated calculations with tax compliance", icon: "💰" },
      { title: "Leave Management", description: "Request, approve, and track leaves", icon: "📅" },
      { title: "Document Management", description: "Upload and manage HR documents", icon: "📁" },
      { title: "Audit Logging", description: "Complete audit trail for compliance", icon: "📋" }
    ],
    roles: [
      { role: "Admin", description: "Full system access, configuration, and user management" },
      { role: "HR", description: "Employee management, payroll, and HR operations" },
      { role: "Manager", description: "Team oversight, approvals, and reporting" },
      { role: "Employee", description: "Self-service access to personal HR functions" }
    ],
    problem: "Demonstrates proficiency in building enterprise business software with complex workflows. Small-to-medium enterprises often struggle with manual HR processes leading to payroll errors, attendance discrepancies, and inefficient leave management. This project showcases business logic implementation, compliance requirements, and sophisticated multi-role permission systems.",
    architecture: "**Backend Architecture:**\n• Spring Boot with clean layered architecture\n• Layer structure: Controllers → Services → Repositories → Entities\n• Spring Security with JWT for authentication\n• Method-level security annotations\n• Spring AOP for automatic audit logging\n\n**Database Design:**\n• PostgreSQL with 20+ normalized tables\n• Proper foreign key relationships and constraints\n• Optimized indexes on frequently queried columns\n• Audit tables with database triggers\n• Employee-manager hierarchy for reporting structure\n\n**Frontend Architecture:**\n• React 18 with TypeScript for type safety\n• Context API for global authentication state\n• React Query for server state management and caching\n• React Hook Form + Zod for form validation\n• Tailwind CSS + Shadcn/UI for consistent design",
    challenges: [
      "Flexible role hierarchy: Implemented permission-based access vs hard-coded roles, created employee-manager relationship table, built approval chain configuration with inheritance",
      "Payroll calculations: Separated tax logic into configurable rule engine, created database-driven tax slab tables, built formula parser for complex calculations, implemented test suite with 50+ scenarios for 100% accuracy",
      "Audit trail: Implemented Spring AOP for automatic logging, created immutable audit tables with triggers, built change detection with before/after values, complete trail with zero manual logging code",
      "Performance: Optimized queries with proper indexes, implemented pagination, added database-level aggregation, used background jobs for reports, achieved <3 seconds for 1000-employee reports"
    ],
    learnings: [
      "Enterprise application design patterns (Service layer, Repository pattern)",
      "Complex permission systems with hierarchical roles and granular access control",
      "Business rule engines for configurable calculations (payroll, tax)",
      "Audit trail implementation with Spring AOP and database triggers",
      "Batch processing and background job scheduling for heavy operations",
      "HR domain knowledge: payroll compliance, employee lifecycle, approval workflows",
      "Future enhancements: Email reminders for approvals, performance review module, recruitment/ATS system, mobile app for attendance, predictive analytics for attrition risk, biometric device integration"
    ],
    featured: true
  }
];

export const additionalProjects = [
  {
    title: "Fashion Recommendation System",
    description: "AI-powered system detecting skin tones from images for personalized clothing recommendations",
    tech: ["Flask", "React", "Machine Learning", "Computer Vision"],
    highlight: "70%+ classification accuracy"
  },
  {
    title: "Task Management Application",
    description: "Kanban-style task manager with real-time updates and team collaboration",
    tech: ["React", "Spring Boot", "MongoDB", "WebSockets"],
    highlight: "Drag-and-drop interface with priority sorting"
  },
  {
    title: "Customer Management Dashboard",
    description: "Responsive dashboard with CRUD operations, filtering, and data export",
    tech: ["React", "Tailwind CSS"],
    highlight: "Advanced filtering and chart visualization"
  }
];
