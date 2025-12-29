import { Metadata } from "next";
import Blog from "@/page-components/Blog";

export const metadata: Metadata = {
  title: "Blog | Aryan Raj",
  description: "Read articles about backend engineering, system architecture, and software development.",
};

export default function BlogPage() {
  return <Blog />;
}
