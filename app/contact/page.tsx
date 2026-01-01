import { Metadata } from "next";
import Contact from "@/page-components/Contact";

export const metadata: Metadata = {
  title: "Contact | Aryan Raj",
  description: "Contact Aryan Raj for backend engineering, system architecture, or collaboration opportunities.",
};

export const dynamic = "force-static";
export const revalidate = 300;

export default function ContactPage() {
  return <Contact />;
}
