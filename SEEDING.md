# Data Seeding to Redis

## Overview
This feature allows you to manage portfolio data in Redis with four capabilities:
1. **Automatic Import** - From static TypeScript files (`src/data/`)
2. **JSON File Upload** - Upload a custom JSON file with portfolio data
3. **Export/Backup** - Download current Redis data as JSON
4. **Delete Data** - Remove specific keys or clear all Redis data

## What Gets Uploaded

The seeding process uploads the following data to Redis:

1. **Skills** - All skill categories and items
2. **Certifications** - All certifications
3. **Hero Data** - Bio and tagline
4. **Social Links** - GitHub, LinkedIn, Twitter, Email
5. **Experience** - Work experience entries
6. **Education** - Education details
7. **Medium Settings** - Medium blog configuration
8. **Featured Posts** - Featured blog posts

## How to Use

### Method 1: Programmatic API

This is the recommended way to seed data. See API examples below.

### Method 2: UI-Based (If Accessible)
   - Click **Delete All Data** (red button)
   - Confirm in the dialog
   - All 8 data keys will be removed from Redis

### Method 2: API Endpoints

#### Import from Static Files
```bash
# PowerShell
Invoke-WebRequest -Method POST -Uri "http://localhost:3000/api/admin/seed" -UseBasicParsing

# Production
curl -X POST https://your-domain.vercel.app/api/admin/seed
```

#### Upload JSON File
```bash
# PowerShell
$json = Get-Content 'portfolio-data.json' -Raw
Invoke-WebRequest -Method POST -Uri "http://localhost:3000/api/admin/seed/upload" `
  -Body $json -ContentType "application/json" -UseBasicParsing

# cURL
curl -X POST https://your-domain.vercel.app/api/admin/seed/upload \
  -H "Content-Type: application/json" \
  -d @portfolio-data.json
```

#### Delete Data
```bash
# Delete a specific key
# PowerShell
Invoke-WebRequest -Method DELETE `
  -Uri "http://localhost:3000/api/admin/data/delete?key=skills" -UseBasicParsing

# cURL
curl -X DELETE "https://your-domain.vercel.app/api/admin/data/delete?key=skills"

# Delete all data
# PowerShell
Invoke-WebRequest -Method DELETE `
  -Uri "http://localhost:3000/api/admin/data/delete?all=true" -UseBasicParsing

# cURL
curl -X DELETE "https://your-domain.vercel.app/api/admin/data/delete?all=true"
```

#### Export Data
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/data/export" `
  -OutFile "backup.json"

# cURL
curl https://your-domain.vercel.app/api/admin/data/export > backup.json
```

## JSON File Format

### Sample Structure
See [sample-portfolio-data.json](sample-portfolio-data.json) for a complete example.

```json
{
  "skills": [
    {
      "category": "Languages",
      "items": ["Java", "TypeScript", "Python"]
    }
  ],
  "certifications": [
    {
      "title": "AWS Academy: Cloud Foundations",
      "issuer": "AWS Academy",
      "url": "https://aws.amazon.com/training/",
      "date": "2024"
    }
  ],
  "heroData": {
    "bio": "Your bio text here",
    "tagline": "Your tagline"
  },
  "socialLinks": [
    {
      "label": "GitHub",
      "url": "https://github.com/username",
      "icon": "Github"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Jan 2024",
      "endDate": "Present",
      "current": true,
      "achievements": ["Achievement 1", "Achievement 2"],
      "description": "Job description"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "field": "Field of Study",
      "startDate": "2020",
      "endDate": "2024",
      "grade": "CGPA/Percentage",
      "coursework": ["Course 1", "Course 2"]
    }
  ],
  "mediumSettings": {
    "username": "your-medium-username",
    "profileUrl": "https://medium.com/@username"
  },
  "featuredPosts": []
}
```

### Field Descriptions

#### Skills
- `category`: Category name (e.g., "Languages", "Backend")
- `items`: Array of skill names

#### Certifications
- `title`: Certification name
- `issuer`: Issuing organization
- `url`: Credential URL (optional)
- `date`: Issue date (optional)
- `id`: Credential ID (optional)

#### Experience
- `company`: Company name
- `position`: Job title
- `startDate`: Start date (any format)
- `endDate`: End date (omit if current)
- `current`: Boolean, true if currently working
- `achievements`: Array of achievements/responsibilities
- `description`: Brief job description

#### Education
- `institution`: School/College name
- `degree`: Degree name
- `field`: Field of study
- `startDate`: Start year
- `endDate`: End year (omit if ongoing)
- `grade`: CGPA/Percentage
- `coursework`: Array of relevant courses

## Response Example
```json
{
  "success": true,
  "message": "Successfully uploaded 8 data sections from JSON file",
  "details": {
    "skills": "2 items",
    "certifications": "1 items",
    "socialLinks": "3 items",
    "experience": "1 items",
    "education": "1 items",
    "heroData": "✓",
    "mediumSettings": "✓",
    "featuredPosts": "0 items"
  },
  "uploaded": ["skills", "certifications", "heroData", ...],
  "skipped": []
}
```

## Important Notes

- **Safe Operation**: All upload methods can be run multiple times
- **Overwrites**: Uploading will replace existing data in Redis
- **Partial Updates**: JSON uploads can include only specific keys (e.g., just "skills" and "experience")
- **Validation**: Invalid keys i

### Clean Slate
1. Export current data for backup (optional)
2. Delete all data from Redis
3. Import fresh data from static files or upload new JSONn JSON files are skipped with a warning
- **Backup First**: Use Export before making major changes
- **Format Flexibility**: JSON uploads support any date format for dates

## Workflow Examples

### Initial Setup
1. Run automatic import from static files
2. Edit via admin panel
3. Export to JSON for backup

### Bulk Updates
1. Export current data to JSON
2. Edit JSON file in your editor
3. Upload modified JSON file

### Restore from Backup
1. Have backup JSON file ready
2. Upload via admin panel or API
3. Verify changes in admin panel

## Data Transformation

When importing from static files, the following transformations occur:

- **Experience**: `role` → `position`, `duration` → `startDate`/`endDate`
- **Education**: Single object → Array format
- **Social**: Individual fields → Array of link objects
- **Skills**: Already compatible, direct copy

JSON uploads use the admin schema directly (no transformation needed).

## Verification

After seeding, verify data is in Redis:
```bash
# Check education
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/data?key=education" -UseBasicParsing

# Check experience
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/data?key=experience" -UseBasicParsing
```

## Deployment Checklist

When deploying to Vercel:
1. Set `REDIS_URL` environment variable in Vercel dashboard
2. Deploy the application
3. Run the seed endpoint once: `POST https://your-domain.vercel.app/api/admin/seed`
4. All data is now persisted in Redis
5. Edit data via admin panel - changes persist across deployments

## Troubleshooting

**Upload says "No valid data keys found":**
- Check your JSON structure matches the expected format
- Ensure keys are: skills, certifications, heroData, socialLinks, experience, education, mediumSettings, featuredPosts
- JSON must be valid (use a JSON validator)

**File upload not working in admin panel:**
- Ensure file is .json extension
- Check file is valid JSON (no trailing commas, proper quotes)
- File size should be reasonable (<1MB)
- Check browser console for errors

**Export downloads empty/null values:**
- Seed data first using import or upload
- Check Redis connection is working
- Verify REDIS_URL environment variable is set

**Changes not visible after upload:**
- Refresh the page completely (Ctrl+Shift+R)
- Check AdminContext is loading from backend
- Verify data was saved: GET /api/admin/da

**Delete confirmation not showing:**
- Ensure browser allows dialogs
- Check browser console for errors
- Try refreshing the admin panel

**Accidentally deleted all data:**
- Don't panic! Use the import from static files button
- Or upload a backup JSON file
- Data will be restored immediatelyta?key=skills

**"Success" but data didn't change:**
- Check which keys were in "uploaded" vs "skipped" in response
- Verify Redis is connected (check server logs)
- Try exporting to see current Redis state
