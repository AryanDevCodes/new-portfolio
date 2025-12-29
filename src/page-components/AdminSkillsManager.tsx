import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmin, Skill } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Save, RotateCcw, Zap } from "lucide-react";

export function SkillsManager() {
  const { skills, updateSkills } = useAdmin();
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [formData, setFormData] = useState<Skill>({ category: "", items: [] });
  const [newSkill, setNewSkill] = useState("");

  const resetForm = () => {
    setFormData({ category: "", items: [] });
    setNewSkill("");
    setEditingCategory(null);
  };

  const startEdit = (index: number) => {
    setFormData({ ...skills[index] });
    setEditingCategory(index);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setFormData({
      ...formData,
      items: [...formData.items, newSkill.trim()],
    });
    setNewSkill("");
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!formData.category.trim()) {
      toast({ title: "Category required", description: "Please enter a category name", variant: "destructive" });
      return;
    }
    if (formData.items.length === 0) {
      toast({ title: "Skills required", description: "Please add at least one skill", variant: "destructive" });
      return;
    }

    if (editingCategory !== null) {
      const newSkills = [...skills];
      newSkills[editingCategory] = formData;
      updateSkills(newSkills);
      toast({ title: "Updated", description: "Skill category updated successfully" });
    } else {
      updateSkills([...skills, formData]);
      toast({ title: "Added", description: "New skill category added successfully" });
    }
    resetForm();
  };

  const handleDelete = (index: number) => {
    updateSkills(skills.filter((_, i) => i !== index));
    toast({ title: "Deleted", description: "Skill category removed" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Skills Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">Add and manage technical skills by category.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category Name</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Languages, Frontend, Backend"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-input">Add Skill</Label>
            <div className="flex gap-2">
              <Input
                id="skill-input"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                placeholder="e.g., React, TypeScript, Node.js"
              />
              <Button onClick={handleAddSkill} variant="secondary" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {formData.items.length > 0 && (
            <div className="space-y-2">
              <Label>Skills in Category ({formData.items.length})</Label>
              <div className="flex flex-wrap gap-2">
                {formData.items.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/70 text-secondary-foreground text-sm"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(idx)}
                      className="ml-1 text-destructive hover:text-destructive/80"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleSave} variant="terminal">
              <Save className="w-4 h-4 mr-2" />
              {editingCategory !== null ? "Update Category" : "Add Category"}
            </Button>
            {editingCategory !== null && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {skills.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">No skill categories yet</CardContent>
          </Card>
        ) : (
          skills.map((category, idx) => (
            <Card key={`${category.category}-${idx}`} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <h3 className="font-semibold text-lg">{category.category}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {category.items.map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(idx)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(idx)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
