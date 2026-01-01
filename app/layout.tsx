import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aryan Raj | Backend Engineer & System Architect",
  description:
    "Backend Engineer specializing in Java, Spring Boot, and scalable system architecture. Building secure, production-grade systems with modern cloud infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col bg-blue-200 dark:bg-background">
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
