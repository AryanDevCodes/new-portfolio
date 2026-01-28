"use client";

declare global {
  interface Window {
    __APP__?: {
      splash: { initialized: boolean };
      cache: Record<string, any>;
      flags: { prefetchDone: boolean };
    };
  }
}

import { useState, useEffect } from "react";
import { fetchCache } from "@/lib/fetchCache";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactPage, setContactPage] = useState<any>(null);
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const safeContactPage = contactPage ?? {};
  const safePersonalInfo = personalInfo ?? {};

  const contactLinkIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    mail: Mail,
    email: Mail,
    linkedin: Linkedin,
    github: Github,
  };

  const derivedContactLinks = [
    safePersonalInfo.email ? { icon: "Mail", label: "Email", value: safePersonalInfo.email, href: `mailto:${safePersonalInfo.email}` } : null,
    safePersonalInfo.linkedin ? { icon: "Linkedin", label: "LinkedIn", href: safePersonalInfo.linkedin } : null,
    safePersonalInfo.github ? { icon: "Github", label: "GitHub", href: safePersonalInfo.github } : null,
  ].filter(Boolean) as any[];

  const contactLinks = (Array.isArray(safeContactPage.links) && safeContactPage.links.length > 0)
    ? safeContactPage.links
    : derivedContactLinks;

  useEffect(() => {
    const handleDataReady = () => {
      const cdata = fetchCache.get<any>("/api/portfolio/data");
      const cp = fetchCache.get<any>("/api/portfolio/personal-info");
      
      if (cdata) setContactPage(cdata.contactPage);
      if (cp) setPersonalInfo(cp);
      
      setHydrated(true);
    };

    if (window.__APP__?.flags.prefetchDone || (window.__APP__?.cache && Object.keys(window.__APP__.cache).length > 0)) {
      handleDataReady();
    } else {
      window.addEventListener('globalDataReady', handleDataReady, { once: true });
      
      const fallbackTimeout = setTimeout(() => {
        handleDataReady();
      }, 6000);
      
      return () => {
        window.removeEventListener('globalDataReady', handleDataReady);
        clearTimeout(fallbackTimeout);
      };
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });

      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!hydrated) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl space-y-4"
          >
            <p className="text-primary font-medium text-sm">// Get In Touch</p>
            <h1 className="text-4xl sm:text-5xl font-bold font-display">
              {safeContactPage.title || "Let's Connect"}
            </h1>
            <p className="text-base text-muted-foreground max-w-xl">
              {safeContactPage.description || "Have a question or want to work together? Drop me a message and I'll get back to you soon."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="pb-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-2 lg:order-1"
            >
              {isSubmitted ? (
                <div className="rounded-2xl border border-green-500/50 bg-green-500/5 p-8 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-2xl font-bold font-display">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. I'll get back to you within 24-48 hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="gap-2 mt-4"
                  >
                    <Mail className="w-4 h-4" />
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="rounded-lg border-border/50 bg-secondary/30"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="rounded-lg border-border/50 bg-secondary/30"
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="rounded-lg border-border/50 bg-secondary/30"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me more..."
                      rows={6}
                      className="rounded-lg border-border/50 bg-secondary/30 resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Mail className="w-4 h-4" />
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    I respond within 24-48 hours
                  </p>
                </form>
              )}
            </motion.div>

            {/* Right: Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="order-1 lg:order-2 space-y-6"
            >
              {/* Contact Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Quick Contact</h3>
                {contactLinks.map((link: any, idx: number) => {
                  const Icon = contactLinkIconMap[(link.icon || "mail").toString().toLowerCase()] || Mail;
                  const href = link.href || link.url;
                  return (
                    <motion.a
                      key={`${href}-${idx}`}
                      href={href}
                      target={href?.startsWith("mailto") ? undefined : "_blank"}
                      rel={href?.startsWith("mailto") ? undefined : "noopener noreferrer"}
                      whileHover={{ x: 4 }}
                      className="group flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/40 hover:border-primary/30 hover:bg-card/60 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">{link.label}</p>
                        {link.value && (
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {link.value}
                          </p>
                        )}
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Response Time Card */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                <p className="text-sm font-medium text-primary">Fast Response</p>
                <p className="text-xs text-muted-foreground">
                  I typically respond within 24-48 hours. Looking forward to hearing from you!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
