import { Metadata } from "next";
import Projects from "@/page-components/Projects";

export const metadata: Metadata = {
  title: "Projects | Aryan Raj",
  description: "Explore my portfolio of backend engineering projects built with Java, Spring Boot, and modern cloud technologies.",
};

export default function ProjectsPage() {
  return <Projects />;
}
