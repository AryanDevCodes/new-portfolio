"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/contexts/AdminContext";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Lock, LogOut, Plus, Trash2, Edit, RotateCcw, Terminal, Shield, Rss, ExternalLink, Save, Star, Award, Zap, FileText, Link as LinkIcon, Database } from "lucide-react";
import type { Certification } from "@/contexts/AdminContext";
import { SkillsManager } from "./AdminSkillsManager";
import { HeroDataEditor } from "./AdminHeroDataEditor";
import { SocialLinksManager } from "./AdminSocialLinksManager";
import { ExperienceManager } from "./AdminExperienceManager";
import { EducationManager } from "./AdminEducationManager";
import { DataSeeder } from "./DataSeeder";
import type { AdditionalProject } from "@/contexts/AdminContext";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const success = await login(password);
    if (success) {
      toast({ title: "Welcome!", description: "Successfully logged into admin panel" });
    } else {
      setError("Invalid password");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.1]">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-accent/25 rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="dark:border dark:border-border bg-card/80 backdrop-blur shadow-[0_25px_60px_-35px_rgba(0,0,0,0.55)]">
          <CardHeader className="text-center pb-6">
            <motion.div
              className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center shadow-[0_8px_30px_-12px_rgba(59,130,246,0.4)]"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Shield className="w-10 h-10 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold font-display">Admin Access</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">Enter your password to unlock</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="password" className="font-semibold">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-10 bg-card/70 border-border/60 focus:border-primary/50"
                    autoFocus
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-sm font-medium"
                  >
                    ✗ {error}
                  </motion.p>
                )}
              </div>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[0_12px_30px_-12px_rgba(59,130,246,0.5)] inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Unlock
                  </>
                )}
              </motion.button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function MediumSettingsForm() {
  const { mediumSettings, updateMediumSettings } = useAdmin();
  const [username, setUsername] = useState(mediumSettings.username);
  const [profileUrl, setProfileUrl] = useState(mediumSettings.profileUrl);

  const handleSave = () => {
    updateMediumSettings({ username, profileUrl });
    toast({ title: "Saved", description: "Medium settings updated successfully" });
  };

  useEffect(() => {
    setUsername(mediumSettings.username);
    setProfileUrl(mediumSettings.profileUrl);
  }, [mediumSettings]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rss className="w-5 h-5 text-primary" />
          Medium Blog Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="medium-username">Medium Username</Label>
          <Input
            id="medium-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourmediumusername"
          />
          <p className="text-xs text-muted-foreground">
            Enter your Medium username (without @). Example: johndoe
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medium-profile">Profile URL (optional)</Label>
          <Input
            id="medium-profile"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="https://medium.com/@yourname"
          />
        </div>

        {username && (
          <div className="p-3 rounded-lg bg-muted/50 dark:border dark:border-border">
            <p className="text-sm text-muted-foreground mb-1">RSS Feed URL:</p>
            <code className="text-xs font-mono text-primary break-all">
              https://medium.com/feed/@{username}
            </code>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleSave} variant="terminal">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
          {username && (
            <Button asChild variant="outline">
              <a
                href={`https://medium.com/@${username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface BlogPost {
  title: string;
  link: string;
  thumbnail: string;
  description: string;
  pubDate: string;
  categories: string[];
}

function FeaturedBlogsManager() {
  const { mediumSettings, featuredPosts, toggleFeaturedPost } = useAdmin();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const featuredPostsSet = useMemo(() => new Set(featuredPosts), [featuredPosts]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!mediumSettings.username) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumSettings.username}`
        );
        const data = await response.json();
        
        if (data.status === "ok") {
          setPosts(data.items);
        } else {
          setError("Failed to fetch blog posts");
        }
      } catch (err) {
        setError("Error fetching posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [mediumSettings.username]);

  const handleToggleFeatured = (postLink: string) => {
    toggleFeaturedPost(postLink);
    toast({ 
      title: featuredPostsSet.has(postLink) ? "Removed from Featured" : "Added to Featured",
      description: "Blog post feature status updated" 
    });
  };

  if (!mediumSettings.username) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="space-y-3">
            <p className="text-destructive font-semibold">Medium Username Not Configured</p>
            <p className="text-muted-foreground text-sm">
              Please set your Medium username in the <span className="font-mono text-primary">Medium Blog</span> tab first to manage featured posts.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-pulse text-muted-foreground">Loading blog posts...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-destructive">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Make sure your Medium username is set correctly in the Medium Blog tab.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Featured Blog Posts Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Mark blog posts as featured to display them at the top of your blog page with a star badge.
          </p>
        </CardHeader>
      </Card>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No blog posts found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => {
            const isFeatured = featuredPostsSet.has(post.link);
            return (
              <Card key={post.link} className={`hover:border-primary/30 transition-colors ${isFeatured ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {post.thumbnail && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <img 
                          src={post.thumbnail} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold line-clamp-2 flex items-center gap-2">
                            {post.title}
                            {isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {post.description.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>
                        <Button
                          variant={isFeatured ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleFeatured(post.link)}
                          className="flex-shrink-0"
                        >
                          <Star className={`w-4 h-4 mr-2 ${isFeatured ? 'fill-current' : ''}`} />
                          {isFeatured ? "Featured" : "Feature"}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {post.categories.slice(0, 3).map((cat) => (
                          <span key={cat} className="tech-tag text-xs">{cat}</span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.pubDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CertificationsManager() {
  const { certifications, addCertification, updateCertification, removeCertification } = useAdmin();
  const [form, setForm] = useState<Certification>({ title: "", date: "", id: "", imageUrl: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const resetForm = () => {
    setForm({ title: "", date: "", id: "", imageUrl: "" });
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (!form.title?.trim()) {
      toast({ title: "Title required", description: "Please enter certification title", variant: "destructive" });
      return;
    }
    if (editingIndex !== null) {
      updateCertification(editingIndex, form);
      toast({ title: "Updated", description: "Certification updated successfully" });
    } else {
      addCertification(form);
      toast({ title: "Added", description: "Certification added successfully" });
    }
    resetForm();
  };

  const startEdit = (index: number) => {
    setForm(certifications[index] ?? { title: "" });
    setEditingIndex(index);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Certifications
          </CardTitle>
          <p className="text-sm text-muted-foreground">Manage your certifications. Place certificate images in <code className="text-xs bg-muted px-1 rounded">/public/certificates/</code> and use path like <code className="text-xs bg-muted px-1 rounded">/certificates/cert-name.jpg</code></p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cert-title">Title</Label>
              <Input id="cert-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., AWS Cloud Practitioner" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-date">Date</Label>
              <Input id="cert-date" value={form.date ?? ""} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g., Jan 2025" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-id">Credential ID (optional)</Label>
              <Input id="cert-id" value={form.id ?? ""} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="ABC-123-XYZ" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cert-image">Certificate Image Path</Label>
              <Input id="cert-image" value={form.imageUrl ?? ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/certificates/my-certificate.jpg" />
              <p className="text-xs text-muted-foreground">Upload images to /public/certificates/ folder and use path: /certificates/filename.jpg</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} variant="terminal">
              <Save className="w-4 h-4 mr-2" />
              {editingIndex !== null ? "Update Certification" : "Add Certification"}
            </Button>
            {editingIndex !== null && (
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {certifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">No certifications added yet</CardContent>
          </Card>
        ) : (
          certifications.map((c, i) => (
            <Card key={`${c.title}-${i}`} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-6 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {c.imageUrl && (
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{c.title}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-3">
                      {c.date && <span>{c.date}</span>}
                      {c.id && <span>ID: {c.id}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(i)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { removeCertification(i); toast({ title: "Removed", description: "Certification deleted" }); }}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function ProjectForm({ 
  project, 
  onSave, 
  onCancel 
}: { 
  project?: Project; 
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Project>>(project || {
    slug: "",
    title: "",
    description: "",
    longDescription: "",
    tech: [],
    github: "",
    live: "",
    highlights: [],
    problem: "",
    architecture: "",
    challenges: [],
    learnings: [],
    featured: false,
    overview: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug || !formData.title) {
      toast({ title: "Error", description: "Slug and title are required", variant: "destructive" });
      return;
    }
    onSave(formData as Project);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL-friendly)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            placeholder="my-project"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Project Title"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief project description..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Long Description</Label>
        <Textarea
          id="longDescription"
          value={formData.longDescription}
          onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
          placeholder="Detailed project description..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            value={formData.github}
            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="live">Live URL (optional)</Label>
          <Input
            id="live"
            value={formData.live || ""}
            onChange={(e) => setFormData({ ...formData, live: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tech">Technologies (comma-separated)</Label>
        <Input
          id="tech"
          value={formData.tech?.join(", ") || ""}
          onChange={(e) => setFormData({ ...formData, tech: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
          placeholder="React, TypeScript, Node.js..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="highlights">Highlights (one per line)</Label>
        <Textarea
          id="highlights"
          value={formData.highlights?.join("\n") || ""}
          onChange={(e) => setFormData({ ...formData, highlights: e.target.value.split("\n").filter(Boolean) })}
          placeholder="Key achievement 1&#10;Key achievement 2..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="overview">Overview</Label>
        <Textarea
          id="overview"
          value={formData.overview || ""}
          onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
          placeholder="Project overview..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="problem">Problem Statement</Label>
        <Textarea
          id="problem"
          value={formData.problem}
          onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
          placeholder="What problem does this solve..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="architecture">Architecture</Label>
        <Textarea
          id="architecture"
          value={formData.architecture}
          onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
          placeholder="Technical architecture details..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="challenges">Challenges (one per line)</Label>
        <Textarea
          id="challenges"
          value={formData.challenges?.join("\n") || ""}
          onChange={(e) => setFormData({ ...formData, challenges: e.target.value.split("\n").filter(Boolean) })}
          placeholder="Challenge 1&#10;Challenge 2..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="learnings">Learnings (one per line)</Label>
        <Textarea
          id="learnings"
          value={formData.learnings?.join("\n") || ""}
          onChange={(e) => setFormData({ ...formData, learnings: e.target.value.split("\n").filter(Boolean) })}
          placeholder="Learning 1&#10;Learning 2..."
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
        />
        <Label htmlFor="featured">Featured Project</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="terminal">
          {project ? "Update Project" : "Create Project"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function AdditionalProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project?: AdditionalProject;
  onSave: (project: AdditionalProject) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<AdditionalProject>(project || {
    title: "",
    description: "",
    tech: [],
    highlight: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Project Title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tech">Technologies (comma-separated)</Label>
        <Input
          id="tech"
          value={formData.tech.join(", ")}
          onChange={(e) => setFormData({ ...formData, tech: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
          placeholder="React, TypeScript..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="highlight">Highlight</Label>
        <Input
          id="highlight"
          value={formData.highlight}
          onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
          placeholder="Key achievement..."
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="terminal">
          {project ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function AdminDashboard() {
  const {
    logout,
    projects,
    additionalProjects,
    addProject,
    updateProject,
    deleteProject,
    addAdditionalProject,
    updateAdditionalProject,
    deleteAdditionalProject,
    resetProjects,
  } = useAdmin();

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [editingAdditionalIndex, setEditingAdditionalIndex] = useState<number | null>(null);

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      updateProject(editingProject.slug, project);
      toast({ title: "Success", description: "Project updated successfully" });
    } else {
      addProject(project);
      toast({ title: "Success", description: "Project created successfully" });
    }
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (slug: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(slug);
      toast({ title: "Deleted", description: "Project removed successfully" });
    }
  };

  const handleSaveAdditional = (project: AdditionalProject) => {
    if (editingAdditionalIndex !== null) {
      updateAdditionalProject(editingAdditionalIndex, project);
      toast({ title: "Success", description: "Project updated successfully" });
    } else {
      addAdditionalProject(project);
      toast({ title: "Success", description: "Project created successfully" });
    }
    setShowAdditionalForm(false);
    setEditingAdditionalIndex(null);
  };

  const handleDeleteAdditional = (index: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteAdditionalProject(index);
      toast({ title: "Deleted", description: "Project removed successfully" });
    }
  };

  const handleReset = () => {
    if (confirm("This will clear all projects. Continue?")) {
      resetProjects();
      toast({ title: "Cleared", description: "Projects cleared" });
    }
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-mono">Admin Panel</h1>
                <p className="text-muted-foreground text-sm">Manage your portfolio projects</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <Tabs defaultValue="featured" className="space-y-6">
            <TabsList className="grid w-full max-w-full grid-cols-6 sm:grid-cols-7 lg:grid-cols-12">
              <TabsTrigger value="featured" className="text-xs">Featured</TabsTrigger>
              <TabsTrigger value="additional" className="text-xs">Additional</TabsTrigger>
              <TabsTrigger value="blogs" className="text-xs">Blogs</TabsTrigger>
              <TabsTrigger value="medium" className="text-xs">Medium</TabsTrigger>
              <TabsTrigger value="certs" className="text-xs">Certs</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
              <TabsTrigger value="hero" className="text-xs">Hero</TabsTrigger>
              <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
              <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
              <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
              <TabsTrigger value="redis" className="text-xs font-bold text-primary">Redis</TabsTrigger>
              <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-6">
              {showProjectForm || editingProject ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingProject ? "Edit Project" : "New Featured Project"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectForm
                      project={editingProject || undefined}
                      onSave={handleSaveProject}
                      onCancel={() => {
                        setShowProjectForm(false);
                        setEditingProject(null);
                      }}
                    />
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Button onClick={() => setShowProjectForm(true)} variant="terminal">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Featured Project
                  </Button>

                  <div className="grid gap-4">
                    {projects.map((project) => (
                      <Card key={project.slug} className="hover:border-primary/30 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold font-mono">{project.title}</h3>
                                {project.featured && (
                                  <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">Featured</span>
                                )}
                              </div>
                              <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {project.tech.slice(0, 5).map((t) => (
                                  <span key={t} className="tech-tag text-xs">{t}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingProject(project)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProject(project.slug)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              {showAdditionalForm || editingAdditionalIndex !== null ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingAdditionalIndex !== null ? "Edit Project" : "New Additional Project"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AdditionalProjectForm
                      project={editingAdditionalIndex !== null ? additionalProjects[editingAdditionalIndex] : undefined}
                      onSave={handleSaveAdditional}
                      onCancel={() => {
                        setShowAdditionalForm(false);
                        setEditingAdditionalIndex(null);
                      }}
                    />
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Button onClick={() => setShowAdditionalForm(true)} variant="terminal">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Additional Project
                  </Button>

                  <div className="grid gap-4">
                    {additionalProjects.map((project, index) => (
                      <Card key={index} className="hover:border-primary/30 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="text-lg font-bold font-mono">{project.title}</h3>
                              <p className="text-muted-foreground text-sm">{project.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {project.tech.map((t) => (
                                  <span key={t} className="tech-tag text-xs">{t}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingAdditionalIndex(index)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAdditional(index)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="blogs" className="space-y-6">
              <FeaturedBlogsManager />
            </TabsContent>

            <TabsContent value="medium" className="space-y-6">
              <MediumSettingsForm />
            </TabsContent>

            <TabsContent value="certs" className="space-y-6">
              <CertificationsManager />
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <SkillsManager />
            </TabsContent>

            <TabsContent value="hero" className="space-y-6">
              <HeroDataEditor />
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <SocialLinksManager />
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <ExperienceManager />
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <EducationManager />
            </TabsContent>

            <TabsContent value="redis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Redis Data Manager
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    All portfolio data is automatically saved to Redis through the tabs above. Use the specific tabs to manage each data type.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">👤 Personal Info</h4>
                      <p className="text-sm text-muted-foreground">Stored in Redis with key: <code className="text-primary font-mono text-xs">personalInfo</code></p>
                      <p className="text-xs text-muted-foreground">Contains: name, email, location, bio, social links</p>
                    </div>
                    <div className="p-4 rounded-lg border border-accent/20 bg-accent/5 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">📁 Projects</h4>
                      <p className="text-sm text-muted-foreground">Stored in Redis with key: <code className="text-primary font-mono text-xs">projects</code></p>
                      <p className="text-xs text-muted-foreground">Featured & additional projects with full details</p>
                    </div>
                    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">💻 Skills</h4>
                      <p className="text-sm text-muted-foreground">Stored in Redis with key: <code className="text-primary font-mono text-xs">skills</code></p>
                      <p className="text-xs text-muted-foreground">Organized by category with individual skills</p>
                    </div>
                    <div className="p-4 rounded-lg border border-accent/20 bg-accent/5 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">💼 Experience</h4>
                      <p className="text-sm text-muted-foreground">Stored in Redis with key: <code className="text-primary font-mono text-xs">experience</code></p>
                      <p className="text-xs text-muted-foreground">Job positions, companies, and descriptions</p>
                    </div>
                    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">🎓 Education</h4>
                      <p className="text-sm text-muted-foreground">Stored in Redis with key: <code className="text-primary font-mono text-xs">education</code></p>
                      <p className="text-xs text-muted-foreground">Degrees, institutions, and years</p>
                    </div>
                    <div className="p-4 rounded-lg border border-accent/20 bg-accent/5 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">🏆 Certifications</h4>
                      <p className="text-sm text-muted-foreground">Stored in Redis with key: <code className="text-primary font-mono text-xs">certifications</code></p>
                      <p className="text-xs text-muted-foreground">Professional certifications with dates</p>
                    </div>
                    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">🔗 Social Links</h4>
                      <p className="text-sm text-muted-foreground">Stored in Redis with key: <code className="text-primary font-mono text-xs">socialLinks</code></p>
                      <p className="text-xs text-muted-foreground">GitHub, LinkedIn, Twitter, and more</p>
                    </div>
                    <div className="p-4 rounded-lg border border-accent/20 bg-accent/5 space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">🎨 Hero Data</h4>
                      <p className="text-sm text-muted-foreground">Stored in Redis with key: <code className="text-primary font-mono text-xs">heroData</code></p>
                      <p className="text-xs text-muted-foreground">Hero section title and subtitle</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-3">
                    <p className="text-sm font-semibold">📋 How to Manage Data:</p>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>Click on the relevant tab above (Skills, Experience, Education, etc.)</li>
                      <li>Add, edit, or delete entries using the form</li>
                      <li>Click "Save" to automatically store to Redis</li>
                      <li>All changes are persisted immediately to Redis</li>
                      <li>Hard refresh your browser (Ctrl+Shift+R) to see updates on the website</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                    <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-2">⚠️ Important:</p>
                    <p className="text-sm text-muted-foreground">
                      All data is stored in Redis. Please use the specific tabs above to add or remove items. For backups or exports, use the Data tab.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <DataSeeder />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}

export default function Admin() {
  const [hydrated, setHydrated] = useState(false);
  const { isAuthenticated } = useAdmin();
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  return isAuthenticated ? <AdminDashboard /> : <LoginForm />;
}