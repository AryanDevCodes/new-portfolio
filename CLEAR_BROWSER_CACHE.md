# Clear Browser Cache and localStorage

## Option 1: Using Browser DevTools (Recommended)

1. **Open your portfolio in browser** (e.g., http://localhost:3000)
2. **Press F12** to open DevTools
3. **Go to Application tab** (or Storage tab)
4. **Expand Storage → Local Storage**
5. **Select http://localhost:3000**
6. **Right-click each of these keys and delete them:**
   - `admin_certs`
   - `admin_education`
   - `admin_experience`
   - `admin_hero`
   - `admin_skills`
   - `admin_social`
   - `featured_posts`
   - `medium_settings`

7. **Hard Refresh** the page: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)

## Option 2: Using Browser Console

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Run this command:**
   ```javascript
   ['admin_certs', 'admin_education', 'admin_experience', 'admin_hero', 'admin_skills', 'admin_social', 'featured_posts', 'medium_settings'].forEach(key => localStorage.removeItem(key));
   ```
4. **Hard Refresh**: `Ctrl + Shift + R`

## Option 3: Using the Application Code

Since we updated AdminContext.tsx, you can also:

1. In your code, call the new `clearAllLocalStorage()` function from any component using `useAdmin()` hook
2. This will automatically clear localStorage and reset all state to empty

## Option 4: Full Clean Start

Run these commands in your terminal:

```powershell
# Stop the dev server (Ctrl+C)

# Clear build/cache
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Restart dev server
npm run dev
```

Then open the browser and clear localStorage using Option 1 or 2.

## Verify Cache is Cleared

1. **Hard Refresh** your portfolio: `Ctrl + Shift + R`
2. Open **DevTools → Application → Local Storage**
3. Verify the portfolio-related keys are **gone**
4. Open **DevTools → Network tab**
5. Check the API calls:
   - Requests to `/api/portfolio/*` should return **empty arrays/objects**
   - If you see data, localStorage is still cached

## Expected Behavior After Clear

✅ Portfolio page shows **empty state** (no data displayed)  
✅ Admin Panel shows **empty forms**  
✅ Browser console shows: `🧹 Redis is empty - clearing localStorage to prevent stale data`  

## Why This Happens

1. You deleted data from Redis ✅
2. But **localStorage in the browser** still had old cached data 
3. AdminContext was loading from both sources
4. We've now updated it to **clear localStorage when Redis is completely empty**

The next time you refresh with the updated code, it will automatically clear stale cache!
