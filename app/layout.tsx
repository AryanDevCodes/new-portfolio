import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import  SplashScreen  from "@/components/splash/SplashScreen";
import localFont from "next/font/local";

const brotherlandFont = localFont({
  src: [
    {
      path: "../public/brotherland-signature-font/BrotherlandsignatureBold-rg7jA.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-brotherland",
  display: "swap",
  preload: true,
  fallback: ["cursive", "system-ui"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Aryan Raj | Backend Engineer & System Architect",
  description:
    "Backend Engineer specializing in Java, Spring Boot, and scalable system architecture. Building secure, production-grade systems with modern cloud infrastructure.",
  keywords: ["Backend Engineer", "Java", "Spring Boot", "System Architecture", "Aryan Raj"],
  authors: [{ name: "Aryan Raj" }],
  creator: "Aryan Raj",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Aryan Raj | Backend Engineer",
    description: "Backend Engineer specializing in Java, Spring Boot, and scalable system architecture.",
    siteName: "Aryan Raj Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aryan Raj | Backend Engineer",
    description: "Backend Engineer specializing in Java, Spring Boot, and scalable system architecture.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={brotherlandFont.variable}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {/* Splash is intentionally outside Providers to avoid hydration coupling */}
        <SplashScreen />

        <Providers>
          <div
            id="root-content"
            className="min-h-screen flex flex-col bg-background text-foreground"
          >
            <Navbar />
            <main className="flex-1 pt-2 md:pt-4">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
