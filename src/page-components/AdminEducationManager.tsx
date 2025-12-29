import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmin, Education } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Save, RotateCcw, GraduationCap } from "lucide-react";

export function EducationManager() {
  const { education, updateEducation } = useAdmin();
  const safeEducation = Array.isArray(education) ? education : [];
  console.log("👁️  EducationManager received education:", education, "Safe:", safeEducation);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({});
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setFormData({});
    setShowForm(false);
    setEditingIndex(null);
  };

  const startEdit = (index: number) => {
    setFormData({ ...safeEducation[index] });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.institution || !formData.degree || !formData.field || !formData.startDate) {
      toast({ title: "Required fields missing", variant: "destructive" });
      return;
    }

    const newEducation = [...safeEducation];
    if (editingIndex !== null) {
      newEducation[editingIndex] = formData as Education;
    } else {
      newEducation.push({ ...formData, id: Date.now().toString() } as Education);
    }
    
    updateEducation(newEducation);
    toast({ title: "Success", description: `Education ${editingIndex !== null ? 'updated' : 'added'}` });
    resetForm();
  };

  const handleDelete = (index: number) => {
    const newEducation = safeEducation.filter((_, i) => i !== index);
    updateEducation(newEducation);
    toast({ title: "Deleted", description: "Education entry removed" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Education History
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Manage your education entries</p>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} variant="terminal">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border bg-muted/50 space-y-4"
            >
              <h3 className="font-semibold">{editingIndex !== null ? "Edit Education" : "New Education"}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input value={formData.institution || ""} onChange={e => setFormData({...formData, institution: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input value={formData.degree || ""} onChange={e => setFormData({...formData, degree: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input value={formData.field || ""} onChange={e => setFormData({...formData, field: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Input value={formData.grade || ""} onChange={e => setFormData({...formData, grade: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.startDate || ""} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={formData.endDate || ""} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Coursework (one per line)</Label>
                <Textarea value={formData.coursework?.join("\n") || ""} onChange={e => setFormData({...formData, coursework: e.target.value.split("\n")})} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetForm}><RotateCcw className="w-4 h-4 mr-2" />Cancel</Button>
                <Button onClick={handleSave} variant="terminal"><Save className="w-4 h-4 mr-2" />Save</Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {safeEducation.map((edu, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <h4 className="font-bold">{edu.degree}</h4>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
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
