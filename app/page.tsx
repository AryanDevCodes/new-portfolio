import { Metadata } from "next";
import Index from "@/page-components/Index";

export const metadata: Metadata = {
  title: "Aryan Raj | Backend Engineer & System Architect",
  description: "I design and build secure, scalable backend systems with clean architecture, role-based access control, and production-grade performance.",
};

// Prefer static generation for faster loads
export const dynamic = "force-static";
export const revalidate = 300;

export default function Home() {
  return <Index />;
}
