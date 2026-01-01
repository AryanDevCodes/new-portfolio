"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Clock, BookOpen, ArrowRight } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  thumbnail: string;
  description: string;
  categories: string[];
  isFeatured?: boolean;
}

const RSS_TO_JSON_API = "https://api.rss2json.com/v1/api.json";

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

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mediumSettings, featuredPosts } = useAdmin();
  const mediumUsername = mediumSettings.username;

  // UI state: category filter and pagination
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [itemsToShow, setItemsToShow] = useState(6);

  // Utility: strip HTML from RSS descriptions to produce clean excerpts
  const stripHtml = (html: string) => {
    if (!html) return "";
    try {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    } catch (e) {
      return html.replace(/<[^>]+>/g, "");
    }
  };

  // Utility: extract first image src from HTML content
  const extractImageFromHtml = (html: string) => {
    if (!html) return "";
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const img = doc.querySelector("img");
      return img?.getAttribute("src") || "";
    } catch (e) {
      const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
      return m && m[1] ? m[1] : "";
    }
  };

  useEffect(() => {
    if (mediumUsername) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [mediumUsername]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(`https://medium.com/feed/@${mediumUsername}`)}`
      );
      const data = await response.json();
      
      if (data.status === "ok" && data.items) {
        const formattedPosts: BlogPost[] = data.items.map((item: any) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          author: item.author,
          thumbnail:
            item.thumbnail ||
            extractImageFromHtml(item.description || item.content || "") ||
            (item.enclosure && (item.enclosure.link || item.enclosure.url)) ||
            "",
          description: item.description,
          categories: item.categories || [],
        }));

        if (Array.isArray(featuredPosts) && featuredPosts.length > 0) {
          const featuredTitles = (featuredPosts as any[]).map((p: any) => p.title);
          formattedPosts.forEach((p) => {
            if (featuredTitles.includes(p.title)) {
              p.isFeatured = true;
            }
          });
        }

        setPosts(formattedPosts);
      } else {
        setError("Failed to load blog posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Error loading blog posts");
    } finally {
      setLoading(false);
    }
  };

  // Apply category filtering before splitting featured/regular
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((p) => p.categories && p.categories.includes(selectedCategory));
  }, [posts, selectedCategory]);

  const featuredPosts_ = useMemo(() => filteredPosts.filter((p) => p.isFeatured), [filteredPosts]);
  const regularPostsAll = useMemo(() => filteredPosts.filter((p) => !p.isFeatured), [filteredPosts]);
  const regularPosts = useMemo(() => regularPostsAll.slice(0, itemsToShow), [regularPostsAll, itemsToShow]);

  // Collect unique categories for the filter UI
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => (p.categories || []).forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [posts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const estimateReadTime = (description: string) => {
    const text = stripHtml(description || "");
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.ceil(words / 200);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden py-20">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-[-10%] left-[5%] w-[420px] h-[420px] bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] right-[8%] w-[480px] h-[480px] bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full dark:border dark:border-primary/30 bg-primary/5 w-fit mx-auto">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Blog & Insights</span>
            </motion.div>

            <motion.div variants={item} className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight font-display">
                Latest Articles
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
                Thoughts on backend architecture, system design, and software engineering best practices.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[200px] rounded-2xl bg-card/40 dark:border dark:border-border/50 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 space-y-4"
            >
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-lg text-muted-foreground">{error}</p>
              <p className="text-sm text-muted-foreground">Check back soon for new articles.</p>
            </motion.div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 space-y-4"
            >
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-lg text-muted-foreground">No blog posts yet</p>
              <p className="text-sm text-muted-foreground">Connect a Medium account to display articles here.</p>
            </motion.div>
          ) : (
            <>
              {/* Category filter */}
              {categories.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setItemsToShow(6);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${!selectedCategory ? "bg-primary text-white" : "bg-card/40"}`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCategory(c);
                        setItemsToShow(6);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCategory === c ? "bg-primary text-white" : "bg-card/40"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
              {/* Featured Posts */}
              {featuredPosts_.length > 0 && (
                <div className="mb-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4 mb-8"
                  >
                    <p className="text-primary font-mono text-sm uppercase tracking-widest">// Featured</p>
                    <h2 className="text-2xl sm:text-3xl font-bold font-display">Must Read</h2>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredPosts_.map((post, i) => (
                      <motion.a
                        key={post.link}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="group rounded-2xl dark:border dark:border-border/50 bg-card/40 backdrop-blur-md overflow-hidden dark:hover:border-primary/30 hover:bg-card/60 transition-all duration-300"
                        whileHover={{ y: -4 }}
                      >
                        {post.thumbnail ? (
                          <div className="relative h-[200px] w-full overflow-hidden bg-secondary/50">
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                          </div>
                        ) : (
                          <div className="relative h-[200px] w-full overflow-hidden bg-gradient-to-r from-primary/5 to-accent/5 flex items-center justify-center">
                            <span className="text-2xl font-bold text-muted-foreground">{post.title?.slice(0, 2).toUpperCase()}</span>
                          </div>
                        )}
                        <div className="p-6 space-y-3">
                          <h3 className="text-lg font-bold font-display group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{stripHtml(post.description)}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono pt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(post.pubDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {estimateReadTime(post.description)} min read
                            </span>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Posts */}
              {regularPosts.length > 0 && (
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4 mb-8"
                  >
                    <p className="text-primary font-mono text-sm uppercase tracking-widest">// All Articles</p>
                    <h2 className="text-2xl sm:text-3xl font-bold font-display">Recent Posts</h2>
                  </motion.div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularPosts.map((post, i) => (
                      <motion.a
                        key={post.link}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="group block rounded-2xl dark:border dark:border-border/50 bg-card/40 backdrop-blur-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        whileHover={{ y: -4 }}
                      >
                        <div className="relative h-44 w-full overflow-hidden bg-secondary/50">
                          {post.thumbnail ? (
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/5 to-accent/5">
                              <span className="text-lg font-semibold text-muted-foreground">{post.title?.slice(0, 2).toUpperCase()}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 sm:p-5 space-y-2">
                          <h3 className="text-base font-bold font-display group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{stripHtml(post.description)}</p>
                          <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground font-mono">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(post.pubDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {estimateReadTime(post.description)} min read
                              </span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                  {regularPostsAll.length > itemsToShow && (
                    <div className="mt-6 text-center">
                      <Button onClick={() => setItemsToShow((s) => s + 6)} size="lg">
                        Load more
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display">More Content Coming</h2>
            <p className="text-lg text-muted-foreground">
              Subscribe to stay updated on new articles about backend architecture and system design.
            </p>
            <Button size="lg" asChild className="gap-2">
              <a href="https://medium.com" target="_blank" rel="noopener noreferrer">
                Follow on Medium
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}