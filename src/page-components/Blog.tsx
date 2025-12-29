"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Calendar, Clock, BookOpen, Rss, Settings, Star, Sparkles } from "lucide-react";
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

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mediumSettings, featuredPosts } = useAdmin();
  const mediumUsername = mediumSettings.username;

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
          thumbnail: item.thumbnail || extractImage(item.description) || "",
          description: stripHtml(item.description).slice(0, 200) + "...",
          categories: item.categories || [],
          isFeatured: featuredPosts.includes(item.link),
        }));
        
        // Sort: featured posts first, then by date
        const sortedPosts = formattedPosts.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        });
        
        setPosts(sortedPosts);
      } else {
        setError("No posts found. Make sure the Medium username is correct.");
      }
    } catch (err) {
      setError("Failed to fetch blog posts. Please try again later.");
      console.error("Error fetching Medium feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const extractImage = (html: string): string => {
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : "";
  };

  const stripHtml = (html: string): string => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (description: string): number => {
    const wordsPerMinute = 200;
    const words = description.split(/\s+/).length * 5; // Multiply since we only have snippet
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

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

  return (
    <>
      <section className="pt-16 pb-16 px-0 sm:px-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12]">
          <div className="absolute top-[-15%] left-[5%] w-[360px] h-[360px] bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] right-[12%] w-[420px] h-[420px] bg-accent/18 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 -mx-8"
          >
            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur shadow-[0_25px_60px_-35px_rgba(0,0,0,0.55)] overflow-hidden">
              <div className="flex flex-col gap-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-mono text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>blog.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <Rss className="w-4 h-4 text-primary" />
                    Medium RSS feed
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gradient-animated">Blog & Articles</h1>
                  <p className="text-base text-muted-foreground max-w-2xl">
                    Thoughts, tutorials, and notes on building resilient products, realtime systems, and developer experience.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Architecture", "Realtime", "DX", "Learning"].map((pill) => (
                    <div key={pill} className="rounded-xl border border-border bg-card/80 px-3 py-2 text-center text-xs font-mono text-muted-foreground">
                      {pill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchPosts} variant="terminal">
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Not Configured State */}
          {!loading && !error && !mediumUsername && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-bold mb-2">Medium Username Not Configured</h3>
              <p className="text-muted-foreground mb-6">
                To display your Medium blog posts, please configure your Medium username in the settings.
              </p>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          {!loading && !error && posts.length > 0 && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Featured Posts Section */}
              {posts.some(p => p.isFeatured) && (
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <Star className="w-5 h-5 text-primary fill-primary animate-pulse" />
                    <h2 className="text-2xl font-bold font-display">Featured Articles</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                  </motion.div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {posts.filter(p => p.isFeatured).map((post, idx) => (
                      <motion.div
                        key={post.link}
                        variants={item}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group h-full"
                        >
                          <motion.div whileHover={{ y: -6 }} className="h-full">
                            <Card className="h-full overflow-hidden border border-primary/40 bg-card/70 hover:border-primary/60 transition-all duration-300 shadow-sm">
                              {post.thumbnail && (
                                <div className="relative h-36 overflow-hidden bg-muted">
                                  <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-mono inline-flex items-center gap-1 shadow">
                                    <Star className="w-3 h-3 fill-current" />
                                    Featured
                                  </div>
                                </div>
                              )}
                              <CardContent className="p-4 space-y-2">
                                <h3 className="text-base font-semibold font-display group-hover:text-primary transition-colors line-clamp-2">
                                  {post.title}
                                </h3>
                                <p className="text-muted-foreground text-xs line-clamp-2">
                                  {post.description}
                                </p>
                                {post.categories.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {post.categories.slice(0, 2).map((cat) => (
                                      <span key={cat} className="tech-tag text-xs">{cat}</span>
                                    ))}
                                  </div>
                                )}
                                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.pubDate)}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{estimateReadTime(post.description)} min</span>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Articles / Latest Articles Section */}
              {posts.some(p => !p.isFeatured) && (
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-8"
                  >
                    <h2 className="text-2xl font-bold font-display">
                      {posts.some(p => p.isFeatured) ? "Latest Articles" : "All Articles"}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                  </motion.div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {posts.filter(p => !p.isFeatured).map((post, idx) => (
                      <motion.div
                        key={post.link}
                        variants={item}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                      >
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group h-full"
                        >
                          <motion.div whileHover={{ y: -6 }} className="h-full">
                            <Card className="h-full overflow-hidden border border-border/60 bg-card/70 hover:border-primary/30 transition-all duration-300 shadow-sm">
                              {post.thumbnail && (
                                <div className="relative h-32 overflow-hidden bg-muted">
                                  <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                </div>
                              )}
                              <CardContent className="p-4 space-y-2">
                                <h3 className="text-base font-semibold font-display group-hover:text-primary transition-colors line-clamp-2">
                                  {post.title}
                                </h3>
                                <p className="text-muted-foreground text-xs line-clamp-2">
                                  {post.description}
                                </p>
                                {post.categories.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {post.categories.slice(0, 2).map((cat) => (
                                      <span key={cat} className="tech-tag text-xs">{cat}</span>
                                    ))}
                                  </div>
                                )}
                                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.pubDate)}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{estimateReadTime(post.description)} min</span>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-bold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">
                Blog posts from Medium will appear here.
              </p>
              <Button asChild variant="terminal">
                <a
                  href={`https://medium.com/@${mediumUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Medium Profile
                </a>
              </Button>
            </motion.div>
          )}

          {/* CTA */}
          {!loading && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <Button asChild variant="terminal" size="lg">
                <a
                  href={`https://medium.com/@${mediumUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read More on Medium
                </a>
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
