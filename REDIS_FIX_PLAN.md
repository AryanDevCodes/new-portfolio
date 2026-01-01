# Complete Fix Plan: Redis Data Persistence

## What's Wrong

Your Admin Panel saves data to **localStorage only**, not Redis:

1. **Projects** (Featured & Additional) - NO Redis persistence
2. **Personal Info** - NO dedicated manager
3. **Hero Data** - Manager exists but incomplete fields
4. **Additional sections** - No dedicated UI managers

---

## Step-by-Step Fix

### STEP 1: Fix useProjects Hook (Critical)

Make projects save to Redis via AdminContext.

**File:** `hooks/useProjects.ts`

```typescript
// Add AdminContext integration
import { useAdmin } from "@/contexts/AdminContext";

export function useProjects() {
  const { projects: contextProjects, additionalProjects: contextAdditional, 
          updateProjects: updateContextProjects, updateAdditionalProjects: updateContextAdditional } = useAdmin();
  
  const [projects, setProjects] = useState<Project[]>(contextProjects || []);
  const [additionalProjects, setAdditionalProjects] = useState<AdditionalProject[]>(contextAdditional || []);

  // Update functions now save to BOTH local state AND Redis via AdminContext
  const addProject = (project: Project) => {
    const updated = [...projects, project];
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
    updateContextProjects(updated); // ← NEW: This calls persistToBackend()!
  };

  const updateProject = (slug: string, project: Project) => {
    const updated = projects.map(p => p.slug === slug ? project : p);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
    updateContextProjects(updated); // ← NEW!
  };

  const deleteProject = (slug: string) => {
    const updated = projects.filter(p => p.slug !== slug);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
    updateContextProjects(updated); // ← NEW!
  };

  // Same for additional projects
  const addAdditionalProject = (project: AdditionalProject) => {
    const updated = [...additionalProjects, project];
    setAdditionalProjects(updated);
    localStorage.setItem("additionalProjects", JSON.stringify(updated));
    updateContextAdditional(updated); // ← NEW!
  };

  // ... rest of functions
}
```

---

### STEP 2: Add Projects to AdminContext

Add project management functions to AdminContext.

**File:** `src/contexts/AdminContext.tsx`

Add to state:
```typescript
const [projects, setProjects] = useState<Project[]>([]);
const [additionalProjects, setAdditionalProjects] = useState<AdditionalProject[]>([]);

// Add update functions:
const updateProjects = (projs: Project[]) => {
  const safe = Array.isArray(projs) ? projs : [];
  setProjects(safe);
  localStorage.setItem('admin_projects', JSON.stringify(safe));
  persistToBackend("projects", safe);
};

const updateAdditionalProjects = (projs: AdditionalProject[]) => {
  const safe = Array.isArray(projs) ? projs : [];
  setAdditionalProjects(safe);
  localStorage.setItem('admin_additional_projects', JSON.stringify(safe));
  persistToBackend("additionalProjects", safe);
};
```

Add to return context:
```typescript
projects,
additionalProjects,
updateProjects,
updateAdditionalProjects,
```

Load from Redis on mount:
```typescript
useEffect(() => {
  // ... existing code ...
  
  // Load projects
  const projData = await getAdminData("projects");
  if (projData) setProjects(projData);
  
  const adjData = await getAdminData("additionalProjects");
  if (adjData) setAdditionalProjects(adjData);
}, []);
```

---

### STEP 3: Update API to Handle Projects

**File:** `app/api/admin/data/route.ts`

Add to DataKey type:
```typescript
type DataKey =
  | "mediumSettings"
  | "featuredPosts"
  | "certifications"
  | "skills"
  | "heroData"
  | "socialLinks"
  | "experience"
  | "education"
  | "projects"              // ← NEW
  | "additionalProjects";   // ← NEW

const keyToFile: Record<DataKey, string> = {
  // ... existing ...
  projects: path.join(process.cwd(), "src", "data", "admin", "projects.json"),
  additionalProjects: path.join(process.cwd(), "src", "data", "admin", "additional-projects.json"),
};
```

---

### STEP 4: Fix Portfolio API to Read Projects

**File:** `app/api/portfolio/projects/route.ts`

Change from reading `additionalData.projects` to reading `projects` and `additionalProjects` keys:

```typescript
import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin-storage";

export async function GET() {
  try {
    const [featured, additional] = await Promise.all([
      getAdminData("projects"),
      getAdminData("additionalProjects"),
    ]);

    return NextResponse.json({
      featured: featured || [],
      additional: additional || [],
    });
  } catch (error) {
    console.error("Error fetching projects from Redis:", error);
    return NextResponse.json({ 
      error: "Failed to fetch projects",
      featured: [],
      additional: []
    }, { status: 500 });
  }
}
```

---

### STEP 5: Update HeroDataEditor

Ensure all 9 new fields have input fields.

**File:** `src/page-components/AdminHeroDataEditor.tsx`

Add input fields for:
- role
- currentFocus
- location
- timezone
- strength
- techStack
- availability
- availability_status
- description

Example:
```tsx
<div className="space-y-2">
  <Label htmlFor="role">Role (e.g., Full Stack Developer)</Label>
  <Input
    id="role"
    value={form.role || ""}
    onChange={(e) => setForm({...form, role: e.target.value})}
    placeholder="Your professional title"
  />
</div>

<div className="space-y-2">
  <Label htmlFor="currentFocus">Current Focus (e.g., Building AI Tools)</Label>
  <Textarea
    id="currentFocus"
    value={form.currentFocus || ""}
    onChange={(e) => setForm({...form, currentFocus: e.target.value})}
    placeholder="What you're currently working on"
    rows={2}
  />
</div>

{/* Continue for location, timezone, strength, techStack, availability, availability_status, description */}
```

---

### STEP 6: Create Personal Info Manager

Create dedicated manager for personal info.

**File:** `src/page-components/AdminPersonalInfoManager.tsx`

```typescript
"use client";

import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export function AdminPersonalInfoManager() {
  const [form, setForm] = useState<PersonalInfo>({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  });

  const handleSave = async () => {
    // Save via API
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          key: "personalInfo",
          data: form 
        })
      });
      toast({ title: "Saved", description: "Personal info updated" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.name || ""}
              onChange={(e) => setForm({...form, name: e.target.value})}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm({...form, email: e.target.value})}
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone || ""}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location || ""}
              onChange={(e) => setForm({...form, location: e.target.value})}
              placeholder="City, Country"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={form.bio || ""}
            onChange={(e) => setForm({...form, bio: e.target.value})}
            placeholder="Tell visitors about yourself..."
            rows={4}
          />
        </div>

        <Button onClick={handleSave} variant="terminal">
          <Save className="w-4 h-4 mr-2" />
          Save Personal Info
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

### STEP 7: Add Personal Info Manager to Admin.tsx

**File:** `src/page-components/Admin.tsx`

Import:
```tsx
import { AdminPersonalInfoManager } from "./AdminPersonalInfoManager";
```

Add tab in TabsList:
```tsx
<TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
```

Add content:
```tsx
<TabsContent value="personal" className="space-y-6">
  <AdminPersonalInfoManager />
</TabsContent>
```

---

## Implementation Order

1. ✅ Update useProjects.ts → call AdminContext
2. ✅ Add projects to AdminContext.tsx
3. ✅ Update API route (/api/admin/data)
4. ✅ Fix portfolio projects API
5. ✅ Complete HeroDataEditor
6. ✅ Create AdminPersonalInfoManager
7. ✅ Add tab to Admin.tsx
8. Test end-to-end

---

## Expected Result After Fix

```
Admin Panel (Add Featured Project)
    ↓
useProjects.addProject()
    ↓
updateContextProjects() [AdminContext]
    ↓
persistToBackend("projects", data)
    ↓
POST /api/admin/data {key: "projects", data: [...]}
    ↓
setAdminData("projects", [...])
    ↓
Redis SET admin:projects ✅
    ↓
GET /api/portfolio/projects
    ↓
getAdminData("projects")
    ↓
Redis GET admin:projects ✅
    ↓
Projects display on UI ✅
```

---

## Quick Test After Fix

1. Add a new project in Admin Panel
2. Check Network tab: Should see `POST /api/admin/data`
3. Refresh page: Project should still appear
4. Hard refresh: Project should still appear (proving Redis persistence)
