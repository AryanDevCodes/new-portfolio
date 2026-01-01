import { Metadata } from "next";
import Blog from "@/page-components/Blog";

export const metadata: Metadata = {
  title: "Blog | Aryan Raj",
  description: "Read articles about backend engineering, system architecture, and software development.",
};

export const dynamic = "force-static";
export const revalidate = 300;

export default function BlogPage() {
  return <Blog />;
}
