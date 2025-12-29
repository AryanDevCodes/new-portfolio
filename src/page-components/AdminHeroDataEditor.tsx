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
  const [formData, setFormData] = useState({ bio: heroData?.bio ?? "", tagline: heroData?.tagline ?? "" });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData({ bio: heroData?.bio ?? "", tagline: heroData?.tagline ?? "" });
    setIsDirty(false);
  }, [heroData]);

  const handleChange = (field: "bio" | "tagline", value: string) => {
    setFormData({ ...formData, [field]: value });
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!formData.tagline.trim() || !formData.bio.trim()) {
      toast({ 
        title: "Required fields", 
        description: "Please fill in both tagline and bio", 
        variant: "destructive" 
      });
      return;
    }
    updateHeroData(formData);
    toast({ title: "Saved", description: "Hero data updated successfully" });
    setIsDirty(false);
  };

  const handleReset = () => {
    setFormData({ bio: heroData?.bio ?? "", tagline: heroData?.tagline ?? "" });
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
        <div className="space-y-2">
          <Label htmlFor="tagline" className="font-semibold">
            Tagline <span className="text-destructive">*</span>
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
          <Label htmlFor="bio" className="font-semibold">
            Bio / Description <span className="text-destructive">*</span>
          </Label>
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
