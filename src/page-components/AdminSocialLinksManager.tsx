import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmin, SocialLink } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Save, RotateCcw, Link as LinkIcon } from "lucide-react";

const ICON_OPTIONS = ["github", "linkedin", "twitter", "mail", "globe", "link"];

export function SocialLinksManager() {
  const { socialLinks, updateSocialLinks } = useAdmin();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<SocialLink>({ label: "", url: "", icon: "" });
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setFormData({ label: "", url: "", icon: "" });
    setShowForm(false);
    setEditingIndex(null);
  };

  const startEdit = (index: number) => {
    setFormData({ ...socialLinks[index] });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.label.trim() || !formData.url.trim()) {
      toast({ 
        title: "Required fields missing", 
        description: "Please enter both label and URL", 
        variant: "destructive" 
      });
      return;
    }

    try {
      // Validate URL
      new URL(formData.url);
    } catch {
      toast({ 
        title: "Invalid URL", 
        description: "Please enter a valid URL", 
        variant: "destructive" 
      });
      return;
    }

    if (editingIndex !== null) {
      const newLinks = [...socialLinks];
      newLinks[editingIndex] = formData;
      updateSocialLinks(newLinks);
      toast({ title: "Updated", description: "Social link updated successfully" });
    } else {
      updateSocialLinks([...socialLinks, formData]);
      toast({ title: "Added", description: "Social link added successfully" });
    }
    resetForm();
  };

  const handleDelete = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    updateSocialLinks(newLinks);
    toast({ title: "Deleted", description: "Social link removed successfully" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" />
            Social Links
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Manage your social media and web links</p>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button 
              onClick={() => setShowForm(true)} 
              variant="terminal"
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border border-border bg-muted/50 space-y-4 mb-6"
            >
              <h3 className="font-semibold text-sm">
                {editingIndex !== null ? "Edit Social Link" : "New Social Link"}
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="social-label">Label</Label>
                  <Input
                    id="social-label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., GitHub, LinkedIn"
                  />
                  <p className="text-xs text-muted-foreground">Display name for the link</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social-url">URL</Label>
                  <Input
                    id="social-url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://github.com/yourname"
                    type="url"
                  />
                  <p className="text-xs text-muted-foreground">Full URL with protocol</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="social-icon">Icon (optional)</Label>
                <div className="flex gap-2 flex-wrap">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.icon === icon
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Choose an icon or leave empty for default</p>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={resetForm} size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="terminal" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  {editingIndex !== null ? "Update" : "Save"}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {socialLinks.length > 0 && (
        <div className="space-y-3">
          {socialLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{link.label}</h4>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                      {link.icon && (
                        <p className="text-xs text-primary mt-1">Icon: {link.icon}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(index)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(index)}
                      className="h-8 w-8 hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
