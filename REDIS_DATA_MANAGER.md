# Redis Data Manager - Admin Control Panel Guide

## Overview
Your portfolio is now **100% managed through the Admin Panel** with all data automatically saved to Redis. Each manager component has built-in CRUD operations that directly persist to Redis.

## Access the Admin Panel

1. Navigate to: `http://localhost:3000/admin`
2. Enter your admin password (set in environment variables)
3. Use the tabs to manage different aspects of your portfolio

## How It Works

Each tab in the Admin Panel manages a specific data type and automatically saves changes to Redis:

| Tab | Manages | Redis Key |
|-----|---------|-----------|
| **Featured** | Featured projects with details | `projects` |
| **Additional** | Additional/side projects | `projects` |
| **Blogs** | Featured blog posts from Medium | `featuredPosts` |
| **Medium** | Medium account settings | `mediumSettings` |
| **Skills** | Programming skills by category | `skills` |
| **Certs** | Professional certifications | `certifications` |
| **Hero** | Hero section title & subtitle | `heroData` |
| **Social** | Social media links | `socialLinks` |
| **Experience** | Job positions and experience | `experience` |
| **Education** | Degrees and education | `education` |
| **Redis** | Data overview & info | (view-only) |
| **Data** | Seed demo data | (utilities) |

## Step-by-Step Usage

### Adding Data (Example: Skills)

1. Click the **"Skills"** tab
2. Click **"Add Skill Category"** button
3. Enter category name (e.g., "Backend")
4. Enter skills (comma-separated: "Node.js, Python, Java")
5. Click **"Save to Redis"**
6. Hard refresh browser (Ctrl+Shift+R) to see changes

### Adding a Project

1. Click **"Featured"** tab (for featured projects) or **"Additional"** (for side projects)
2. Click **"Add Featured Project"** or **"Add Additional Project"**
3. Fill in all details:
   - Project title and slug
   - Description and long description
   - Technologies used
   - GitHub link and live demo URL
   - Highlights, challenges, learnings
4. Toggle **"Featured Project"** if needed
5. Click **"Create Project"**
6. Hard refresh browser to see updates

### Managing Certifications

1. Click **"Certs"** tab
2. Add new or edit existing certifications
3. Include: Title, Issuer, Date, Credential URL (optional)
4. Click **"Save"**

### Setting Social Links

1. Click **"Social"** tab
2. Add GitHub, LinkedIn, Twitter, and other profiles
3. Click **"Save"**

### Configuring Medium Blog

1. Click **"Medium"** tab
2. Enter your Medium username (without @)
3. Blog posts will appear in the **"Blogs"** tab
4. Click **"Blogs"** tab to mark posts as featured

## Data Types & Structure

### Personal Info
```json
{
  "name": "Your Name",
  "email": "your@email.com",
  "location": "City, Country",
  "bio": "Professional summary",
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username"
}
```

### Skills
```json
[
  {
    "category": "Backend",
    "items": ["Node.js", "Python", "Java", "Go"]
  },
  {
    "category": "Frontend",
    "items": ["React", "Vue.js", "TypeScript"]
  }
]
```

### Projects
```json
[
  {
    "slug": "ecommerce-app",
    "title": "E-Commerce Platform",
    "description": "Full-stack e-commerce solution",
    "tech": ["React", "Node.js", "PostgreSQL"],
    "github": "https://github.com/username/project",
    "live": "https://demo.com",
    "featured": true
  }
]
```

### Experience
```json
[
  {
    "position": "Senior Developer",
    "company": "Tech Company",
    "duration": "Jan 2022 - Present",
    "description": "Led backend development"
  }
]
```

### Education
```json
[
  {
    "degree": "Bachelor of Computer Science",
    "school": "University Name",
    "year": "2020"
  }
]
```

### Certifications
```json
[
  {
    "title": "AWS Certified Solutions Architect",
    "issuer": "Amazon",
    "date": "2023",
    "url": "https://credential.url"
  }
]
```

## Important Notes

⚠️ **Critical Information:**
- **NO STATIC DATA** - All data is ONLY in Redis
- Changes are automatically saved to Redis
- Hard refresh browser (Ctrl+Shift+R) to see updates on website
- Blog data fetches from Medium RSS feed
- All other data is 100% controlled through Redis

## Workflow

1. **Log into Admin Panel** → `http://localhost:3000/admin`
2. **Select a Tab** (Featured, Skills, Experience, etc.)
3. **Add/Edit/Delete Data** using the form
4. **Save** - changes automatically go to Redis
5. **Hard Refresh Website** (Ctrl+Shift+R) to see live updates

## API Endpoints (For Advanced Users)

### Fetch Data
```bash
GET /api/portfolio/personal-info
GET /api/portfolio/skills
GET /api/portfolio/projects
GET /api/portfolio/experience-education
GET /api/portfolio/certifications
GET /api/portfolio/data
```

### Save Data via Admin Panel
- Simply use the forms in each tab
- Changes are auto-saved to Redis
- No manual API calls needed

### Delete Data
```bash
DELETE /api/admin/data/delete?key=skills
DELETE /api/admin/data/delete?all=true  # Delete everything
```

## Troubleshooting

### Changes not showing on website?
→ Hard refresh: `Ctrl + Shift + R` (browser cache)

### "Save failed" error?
→ Check if Redis connection is working
→ Verify required fields are filled

### Data disappeared?
→ Check Redis connection in terminal logs
→ All data is ONLY in Redis (no fallback)

### Need to start fresh?
→ Go to **Redis** tab
→ Click "Clear All Redis Data"
→ Confirm deletion

## Best Practices

✅ **DO:**
- Save changes frequently
- Hard refresh after making changes
- Back up important data
- Use meaningful project slugs (lowercase, hyphens)

❌ **DON'T:**
- Edit JSON directly (use the forms)
- Delete Redis data without backup
- Leave empty required fields
- Use spaces in project slugs

---

All your portfolio data is now managed through this intuitive Admin Panel with automatic Redis persistence! 🚀

