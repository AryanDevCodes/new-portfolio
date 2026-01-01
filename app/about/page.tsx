import { Metadata } from "next";
import About from "@/page-components/About";

export const metadata: Metadata = {
  title: "About | Aryan Raj",
  description: "Learn more about Aryan Raj, backend engineer and system architect, and his journey in building scalable, secure systems.",
};

export const dynamic = "force-static";
export const revalidate = 300;

export default function AboutPage() {
  return <About />;
}
