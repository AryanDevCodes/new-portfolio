"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, MapPin, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  Github,
  Linkedin,
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactPage, setContactPage] = useState<any>(null);
  const [personalInfo, setPersonalInfo] = useState<any>(null);

  const safeContactPage = contactPage ?? {
    heading: "// Contact",
    title: "Get In Touch",
    description: "",
    links: [],
    formHeading: "Send a Message",
    formDescription: "",
    formFields: { name: "Name", email: "Email", subject: "Subject", message: "Message", submitButton: "Send" },
  };
  const safePersonalInfo = personalInfo ?? { location: "", email: "" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataRes, personalRes] = await Promise.all([
          fetch("/api/portfolio/data"),
          fetch("/api/portfolio/personal-info"),
        ]);

        if (dataRes.ok) {
          const data = await dataRes.json();
          setContactPage(data.contactPage);
        }
        if (personalRes.ok) {
          const data = await personalRes.json();
          setPersonalInfo(data);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
  };

  return (
    <>
      {/* Header */}
      <section className="py-18 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.14]">
          <div className="absolute top-[-15%] left-[5%] w-[320px] h-[320px] bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] right-[10%] w-[380px] h-[380px] bg-accent/22 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl rounded-2xl border border-border bg-card/70 backdrop-blur p-6 sm:p-8 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.55)]"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-mono text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>{safeContactPage.heading}</span>
            </motion.div>
            <motion.h1 variants={item} className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 font-display">
              {safeContactPage.title}
            </motion.h1>
            <motion.p variants={item} className="text-lg text-muted-foreground">
              {safeContactPage.description}
            </motion.p>
            <motion.div variants={item} className="mt-5 flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{safePersonalInfo.location}</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-8 sm:py-12 pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6 font-display">Connect with me</h2>

              <div className="space-y-4">
                {safeContactPage.links && safeContactPage.links.map((link: any, i: number) => {
                  const Icon = iconMap[link.icon] || Mail;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card/70 border border-border hover:border-primary/30 hover:-translate-y-1 transition-all group shadow-sm"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium group-hover:text-primary transition-colors text-sm sm:text-base">
                          {link.label}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">
                          {link.value}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Direct Email CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 shadow-sm"
              >
                <h3 className="font-bold text-lg mb-2">Prefer a direct email?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Feel free to reach out directly at my email address.
                </p>
                <Button variant="terminal" asChild>
                  <a href={`mailto:${safePersonalInfo.email}`}>
                    <Mail className="w-4 h-4" />
                    {safePersonalInfo.email}
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display">Quick message</h2>
                <span className="text-xs font-mono text-muted-foreground">Avg response &lt; 24h</span>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 flex justify-center"
                  >
                    <CheckCircle className="w-16 h-16 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thanks for reaching out. I'll get back to you as soon as possible.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What's this about?"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message here..."
                      className="mt-2 min-h-[150px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
