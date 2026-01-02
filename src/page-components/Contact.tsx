"use client";

declare global {
  interface Window {
    __PORTFOLIO_CACHE__?: Record<string, any>;
    __GLOBAL_PREFETCH_DONE__?: boolean;
  }
}

import { useState, useEffect } from "react";
import { fetchCache } from "@/lib/fetchCache";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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
    safePersonalInfo.linkedin ? { icon: "Linkedin", label: "LinkedIn", value: "Connect", href: safePersonalInfo.linkedin } : null,
    safePersonalInfo.github ? { icon: "Github", label: "GitHub", value: "Explore", href: safePersonalInfo.github } : null,
  ].filter(Boolean) as any[];

  const contactLinks = (Array.isArray(safeContactPage.links) && safeContactPage.links.length > 0)
    ? safeContactPage.links
    : derivedContactLinks;

  const otherMethods = (Array.isArray(safeContactPage.otherMethods) && safeContactPage.otherMethods.length > 0)
    ? safeContactPage.otherMethods
    : [
        {
          title: "Quick Question?",
          description: "Use the form above for fastest response",
          icon: "⚡"
        },
        {
          title: "Social Media",
          description: safeContactPage.socialDescription || "Connect with me on LinkedIn or GitHub",
          icon: "🔗"
        },
        {
          title: "Direct Email",
          description: safePersonalInfo.email ? `Reach out directly at ${safePersonalInfo.email}` : "Reach out via email",
          icon: "📧"
        },
      ];

  useEffect(() => {
    // Wait for global data to be ready from splash screen
    const handleDataReady = () => {
      // Load from cache immediately
      const cdata = fetchCache.get<any>("/api/portfolio/data");
      const cp = fetchCache.get<any>("/api/portfolio/personal-info");
      
      if (cdata) setContactPage(cdata.contactPage);
      if (cp) setPersonalInfo(cp);
      
      setHydrated(true);
    };

    // Check if data is already ready (splash completed before component mount)
    if (window.__GLOBAL_PREFETCH_DONE__ || (window.__PORTFOLIO_CACHE__ && Object.keys(window.__PORTFOLIO_CACHE__).length > 0)) {
      handleDataReady();
    } else {
      // Wait for the event
      window.addEventListener('globalDataReady', handleDataReady, { once: true });
      
      // Fallback: force render after 6 seconds
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
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });

      // Reset success state after 5 seconds
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
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden py-20">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-[-10%] left-[5%] w-[400px] h-[400px] bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-15%] right-[10%] w-[450px] h-[450px] bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 w-fit mx-auto">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">{safeContactPage.heading}</span>
            </motion.div>

            <motion.div variants={item} className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight font-display">
                {safeContactPage.title}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
                {safeContactPage.description}
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {contactLinks.map((contact: any, i: number) => {
                const Icon = contactLinkIconMap[(contact.icon || "mail").toString().toLowerCase()] || Mail;
                const href = contact.href || contact.url || "#";
                return (
                  <motion.a
                    key={`${contact.label || 'contact'}-${i}`}
                    href={href}
                    target={href?.startsWith("mailto") ? undefined : "_blank"}
                    rel={href?.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    whileHover={{ y: -4 }}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/30 hover:bg-card/60 transition-all"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{contact.label}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <p className="text-primary font-mono text-sm uppercase tracking-widest mb-2">{safeContactPage.infoKicker || safeContactPage.heading}</p>
                <h2 className="text-2xl sm:text-3xl font-bold font-display">{safeContactPage.infoTitle || safeContactPage.title}</h2>
              </div>

              <div className="space-y-4">
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
                      className="group block p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/30 hover:bg-card/60 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground font-medium">{link.label}</p>
                          {link.value && (
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors break-all">
                              {link.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Response Time */}
              <motion.div
                whileHover={{ y: -2 }}
                className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-2"
              >
                <p className="text-sm text-primary font-medium">Response Time &lt; 24 hours</p>
                <p className="text-sm text-muted-foreground">
                  
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-md p-6 sm:p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center py-8"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto"
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-display">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. I'll get back to you as soon as possible.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="gap-2"
                    >
                      Send Another Message
                      <Mail className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-primary font-mono text-sm uppercase tracking-widest">{safeContactPage.formHeading}</p>
                      <h3 className="text-2xl font-bold font-display">Send me a message</h3>
                    </div>

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
                        className="rounded-lg border-border/50 bg-secondary/30 placeholder:text-muted-foreground/50"
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
                        className="rounded-lg border-border/50 bg-secondary/30 placeholder:text-muted-foreground/50"
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
                        className="rounded-lg border-border/50 bg-secondary/30 placeholder:text-muted-foreground/50"
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
                        placeholder="Tell me more about your project or opportunity..."
                        rows={5}
                        className="rounded-lg border-border/50 bg-secondary/30 placeholder:text-muted-foreground/50 resize-none"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full gap-2 bg-primary hover:bg-primary/90"
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
                      I'll get back to you within 24-48 hours. Looking forward to connecting!
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Contact Methods */}
      {Array.isArray(otherMethods) && otherMethods.length > 0 && (
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center space-y-8"
          >
            <div className="space-y-2">
              <p className="text-primary font-mono text-sm uppercase tracking-widest">{safeContactPage.otherWaysKicker}</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display">{safeContactPage.otherWaysTitle}</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              {otherMethods.map((method: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-4 space-y-3 hover:border-primary/30 transition-colors"
                  whileHover={{ y: -4 }}
                >
                  <div className="text-3xl">{method.icon}</div>
                  <h3 className="font-semibold font-display">{method.title}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      )}
    </>
  );
}
