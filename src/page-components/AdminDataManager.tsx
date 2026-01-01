"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Database, Plus, Trash2, Save, Copy, Download, Upload } from "lucide-react";

interface RedisData {
  personalInfo?: Record<string, any>;
  projects?: any[];
  additionalProjects?: any[];
  skills?: any[];
  experience?: any[];
  education?: any[];
  certifications?: any[];
  socialLinks?: any[];
  heroData?: Record<string, any>;
  additionalData?: Record<string, any>;
}

export function AdminDataManager() {
  const [activeTab, setActiveTab] = useState<string>("personal-info");
  const [jsonData, setJsonData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [redisData, setRedisData] = useState<RedisData>({});

  const tabs = [
    { id: "personal-info", label: "Personal Info", icon: "👤" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "additional-projects", label: "Additional Projects", icon: "🧩" },
    { id: "skills", label: "Skills", icon: "💻" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "certifications", label: "Certifications", icon: "🏆" },
    { id: "social-links", label: "Social Links", icon: "🔗" },
    { id: "hero-data", label: "Hero Data", icon: "🎨" },
    { id: "additional-data", label: "Additional Data", icon: "⚙️" },
  ];

  const handleSaveData = async () => {
    if (!jsonData.trim()) {
      toast({ title: "Error", description: "Data cannot be empty", variant: "destructive" });
      return;
    }

    try {
      const parsedData = JSON.parse(jsonData);
      setLoading(true);

      const response = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: getRedisKeyForTab(activeTab),
          data: parsedData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `${activeTab} data saved to Redis`,
        });
        setJsonData("");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteData = async () => {
    if (!confirm(`Delete ${activeTab} data from Redis?`)) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/data/delete?key=${getRedisKeyForTab(activeTab)}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `${activeTab} data deleted from Redis`,
        });
        setJsonData("");
        setRedisData((prev) => ({
          ...prev,
          [activeTab]: undefined,
        }));
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete data",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("This will delete ALL data from Redis. Are you sure?")) return;

    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/data/delete?all=true",
        { method: "DELETE" }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "All data deleted from Redis",
        });
        setJsonData("");
        setRedisData({});
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete all data",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonData);
    toast({ title: "Copied", description: "JSON copied to clipboard" });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([jsonData], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeTab}-data.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getRedisKeyForTab = (tab: string): string => {
    const mapping: Record<string, string> = {
      "personal-info": "personalInfo",
      projects: "projects",
      "additional-projects": "additionalProjects",
      skills: "skills",
      experience: "experience",
      education: "education",
      certifications: "certifications",
      "social-links": "socialLinks",
      "hero-data": "heroData",
      "additional-data": "additionalData",
    };
    return mapping[tab] || tab;
  };

  const getExampleData = (tab: string): string => {
    const examples: Record<string, any> = {
      "personal-info": {
        name: "Your Name",
        email: "your.email@example.com",
        location: "City, Country",
        bio: "Your professional bio",
        github: "https://github.com/username",
        linkedin: "https://linkedin.com/in/username",
      },
      projects: [
        {
          slug: "project-slug",
          title: "Project Title",
          description: "Project description",
          tech: ["Node.js", "React", "PostgreSQL"],
          github: "https://github.com/username/repo",
          live: "https://project-url.com",
          featured: true,
        },
      ],
      "additional-projects": [
        {
          title: "Small Project",
          description: "Short description",
          tech: ["React", "TypeScript"],
          highlight: "Key impact",
        },
      ],
      skills: [
        {
          category: "Backend",
          items: ["Node.js", "Java", "Python"],
        },
      ],
      experience: [
        {
          position: "Job Title",
          company: "Company Name",
          duration: "Jan 2020 - Present",
          description: "Job description",
        },
      ],
      education: [
        {
          degree: "Bachelor of Science",
          school: "University Name",
          year: "2024",
        },
      ],
      certifications: [
        {
          title: "Certification Name",
          issuer: "Issuer Name",
          date: "2024",
        },
      ],
      "social-links": {
        github: "https://github.com/username",
        linkedin: "https://linkedin.com/in/username",
        twitter: "https://twitter.com/username",
      },
      "hero-data": {
        title: "Full Stack Developer",
        subtitle: "Building scalable web applications",
      },
      "additional-data": {
        stats: {
          projectsCount: 20,
          yearsOfExperience: 5,
        },
      },
    };

    return JSON.stringify(examples[tab] || {}, null, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display">Redis Data Manager</h2>
            <p className="text-sm text-muted-foreground">Manage all portfolio data in Redis</p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDeleteAll}
          disabled={loading}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete All Data
        </Button>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => {
                  setActiveTab(tab.id);
                  setJsonData("");
                }}
                className="whitespace-nowrap gap-2"
              >
                <span>{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* JSON Editor */}
          <div className="space-y-2">
            <Label htmlFor="json-editor" className="font-semibold">
              JSON Data
            </Label>
            <Textarea
              id="json-editor"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder={getExampleData(activeTab)}
              className="font-mono text-sm min-h-[400px] bg-card/50 border-border/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleSaveData}
              disabled={loading || !jsonData.trim()}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save to Redis
            </Button>

            <Button
              onClick={() =>
                setJsonData(JSON.stringify(JSON.parse(getExampleData(activeTab)), null, 2))
              }
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Load Example
            </Button>

            <Button
              onClick={handleCopyToClipboard}
              disabled={!jsonData.trim()}
              variant="outline"
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>

            <Button
              onClick={handleDownload}
              disabled={!jsonData.trim()}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>

            <Button
              onClick={handleDeleteData}
              disabled={loading}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete {activeTab}
            </Button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Paste valid JSON data above and click "Save to Redis" to store it. Use "Load Example" to see the expected format for this data type.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
