import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmin, Experience } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Save, RotateCcw, Briefcase } from "lucide-react";

export function ExperienceManager() {
  const { experience, updateExperience } = useAdmin();
  const safeExperience = Array.isArray(experience) ? experience : [];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [persistOk, setPersistOk] = useState<boolean | null>(null);

  const resetForm = () => {
    setFormData({});
    setShowForm(false);
    setEditingIndex(null);
  };

  const startEdit = (index: number) => {
    setFormData({ ...safeExperience[index] });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.company || !formData.position || !formData.startDate) {
      toast({ title: "Required fields missing", variant: "destructive" });
      return;
    }

    const newExperience = [...safeExperience];
    if (editingIndex !== null) {
      newExperience[editingIndex] = formData as Experience;
    } else {
      newExperience.push({ ...formData, id: Date.now().toString() } as Experience);
    }
    setSaving(true);
    const ok = await updateExperience(newExperience);
    setPersistOk(ok);
    setSaving(false);
    toast({ title: ok ? "Saved to Redis" : "Saved locally", description: `Experience ${editingIndex !== null ? 'updated' : 'added'}` , variant: ok ? undefined : "destructive"});
    resetForm();
  };

  const handleDelete = async (index: number) => {
    const newExperience = safeExperience.filter((_, i) => i !== index);
    setSaving(true);
    const ok = await updateExperience(newExperience);
    setPersistOk(ok);
    setSaving(false);
    toast({ title: ok ? "Deleted" : "Delete failed (local only)", description: "Experience entry removed", variant: ok ? undefined : "destructive" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Work Experience
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Manage your professional experience entries</p>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} variant="terminal">
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border bg-muted/50 space-y-4"
            >
              <h3 className="font-semibold">{editingIndex !== null ? "Edit Experience" : "New Experience"}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={formData.company || ""} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input value={formData.position || ""} onChange={e => setFormData({...formData, position: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.startDate || ""} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={formData.endDate || ""} onChange={e => setFormData({...formData, endDate: e.target.value})} disabled={formData.current} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={formData.current || false} onCheckedChange={c => setFormData({...formData, current: c, endDate: c ? undefined : formData.endDate})} />
                <Label>I currently work here</Label>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Achievements (one per line)</Label>
                <Textarea value={formData.achievements?.join("\n") || ""} onChange={e => setFormData({...formData, achievements: e.target.value.split("\n")})} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetForm}><RotateCcw className="w-4 h-4 mr-2" />Cancel</Button>
                <Button onClick={handleSave} variant="terminal" disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </div>
              {persistOk !== null && (
                <p className={`text-xs ${persistOk ? 'text-green-600' : 'text-destructive'} mt-2`}>
                  {persistOk ? 'Saved to server' : 'Server save failed; data cached locally'}
                </p>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {safeExperience.map((exp, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <h4 className="font-bold">{exp.position}</h4>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => startEdit(index)}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
