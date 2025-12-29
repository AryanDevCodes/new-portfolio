import { Metadata } from "next";
import Index from "@/page-components/Index";

export const metadata: Metadata = {
  title: "Aryan Raj | Backend Engineer & System Architect",
  description: "I design and build secure, scalable backend systems with clean architecture, role-based access control, and production-grade performance.",
};

export default function Home() {
  return <Index />;
}
