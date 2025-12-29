import { Metadata } from "next";
import Admin from "@/page-components/Admin";

export const metadata: Metadata = {
  title: "Not Found",
  robots: "noindex, nofollow",
  description: "This page does not exist.",
};

export default function AdminPage() {
  return <Admin />;
}
