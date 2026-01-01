import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Save, FileText, RotateCcw } from "lucide-react";

export function HeroDataEditor() {
  const { heroData, updateHeroData } = useAdmin();
  const [formData, setFormData] = useState({
    tagline: heroData?.tagline ?? "",
    bio: heroData?.bio ?? "",
    role: (heroData as any)?.role ?? "",
    currentFocus: (heroData as any)?.currentFocus ?? "",
    location: (heroData as any)?.location ?? "",
    timezone: (heroData as any)?.timezone ?? "",
    strength: (heroData as any)?.strength ?? "",
    techStack: (heroData as any)?.techStack ?? "",
    availability: (heroData as any)?.availability ?? "",
    availability_status: (heroData as any)?.availability_status ?? "",
    description: (heroData as any)?.description ?? "",
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData({
      tagline: heroData?.tagline ?? "",
      bio: heroData?.bio ?? "",
      role: (heroData as any)?.role ?? "",
      currentFocus: (heroData as any)?.currentFocus ?? "",
      location: (heroData as any)?.location ?? "",
      timezone: (heroData as any)?.timezone ?? "",
      strength: (heroData as any)?.strength ?? "",
      techStack: (heroData as any)?.techStack ?? "",
      availability: (heroData as any)?.availability ?? "",
      availability_status: (heroData as any)?.availability_status ?? "",
      description: (heroData as any)?.description ?? "",
    });
    setIsDirty(false);
  }, [heroData]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setIsDirty(true);
  };

  const handleSave = () => {
    updateHeroData(formData);
    toast({ title: "Saved", description: "Hero data updated successfully" });
    setIsDirty(false);
  };

  const handleReset = () => {
    setFormData({
      tagline: heroData?.tagline ?? "",
      bio: heroData?.bio ?? "",
      role: (heroData as any)?.role ?? "",
      currentFocus: (heroData as any)?.currentFocus ?? "",
      location: (heroData as any)?.location ?? "",
      timezone: (heroData as any)?.timezone ?? "",
      strength: (heroData as any)?.strength ?? "",
      techStack: (heroData as any)?.techStack ?? "",
      availability: (heroData as any)?.availability ?? "",
      availability_status: (heroData as any)?.availability_status ?? "",
      description: (heroData as any)?.description ?? "",
    });
    setIsDirty(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Home Page Hero Section
        </CardTitle>
        <p className="text-sm text-muted-foreground">Edit your home page hero content: tagline and bio that display on the home page.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="font-semibold">Role</Label>
            <Input
              id="role"
              value={formData.role || ""}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="e.g., Backend Engineer"
              className="focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="font-semibold">Location</Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g., Bhopal, India"
              className="focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone" className="font-semibold">Timezone</Label>
            <Input
              id="timezone"
              value={formData.timezone || ""}
              onChange={(e) => handleChange("timezone", e.target.value)}
              placeholder="e.g., IST (UTC+5:30)"
              className="focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availability_status" className="font-semibold">Availability Status</Label>
            <Input
              id="availability_status"
              value={formData.availability_status || ""}
              onChange={(e) => handleChange("availability_status", e.target.value)}
              placeholder="e.g., Open to opportunities"
              className="focus:border-primary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline" className="font-semibold">
            Tagline
          </Label>
          <Input
            id="tagline"
            value={formData.tagline || ""}
            onChange={(e) => handleChange("tagline", e.target.value)}
            placeholder="e.g., Backend Engineer · System Architect"
            className="focus:border-primary/50"
          />
          <p className="text-xs text-muted-foreground">
            Short headline displayed prominently on home page. Max 100 characters recommended.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentFocus" className="font-semibold">Current Focus</Label>
          <Textarea
            id="currentFocus"
            value={formData.currentFocus || ""}
            onChange={(e) => handleChange("currentFocus", e.target.value)}
            placeholder="What you're working on right now"
            rows={2}
            className="focus:border-primary/50"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="strength" className="font-semibold">Strength</Label>
            <Input
              id="strength"
              value={formData.strength || ""}
              onChange={(e) => handleChange("strength", e.target.value)}
              placeholder="e.g., System design, performance"
              className="focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="techStack" className="font-semibold">Tech Stack</Label>
            <Input
              id="techStack"
              value={formData.techStack || ""}
              onChange={(e) => handleChange("techStack", e.target.value)}
              placeholder="e.g., Java, Spring Boot, React"
              className="focus:border-primary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability" className="font-semibold">Availability</Label>
          <Input
            id="availability"
            value={formData.availability || ""}
            onChange={(e) => handleChange("availability", e.target.value)}
            placeholder="e.g., Full-time, Freelance"
            className="focus:border-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-semibold">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Short supporting line for the hero section"
            rows={3}
            className="focus:border-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="font-semibold">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio || ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Hi, I'm Aryan 👋 Backend engineer focused on building scalable, production-grade systems..."
            rows={8}
            className="focus:border-primary/50"
          />
          <p className="text-xs text-muted-foreground">
            Full bio displayed on home page. Supports line breaks and emoji.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-border">
          {isDirty && (
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            variant="terminal"
            disabled={!isDirty}
            className="disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
