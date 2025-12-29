# Vercel KV Setup for Admin Data Persistence

## Quick Start

### 1. Add Vercel KV to Your Project

In Vercel, go to your project settings and add **Vercel KV** from the Marketplace:
- Visit: https://vercel.com/integrations/upstash-redis
- Click "Add Integration"
- Select your project and authorize

### 2. Vercel Auto-Populates Environment Variables

Once you've added KV, Vercel automatically creates these in your environment:
- `KV_URL` — Redis connection string
- `KV_REST_API_URL` — REST endpoint
- `KV_REST_API_TOKEN` — Auth token

These are already imported in `lib/admin-storage.ts` via the `@vercel/kv` SDK.

### 3. Install Dependency (Already in package.json)

```bash
npm install @vercel/kv
```

If not installed yet:
```bash
npm install @vercel/kv
```

### 4. Deploy to Vercel

Push your code:
```bash
git add .
git commit -m "Add Vercel KV persistence for admin data"
git push
```

Vercel will automatically:
- Use the KV environment variables
- Persist admin data (skills, socialLinks, heroData, etc.) to Redis
- Serve it on every request across all browsers/sessions

## How It Works

1. **Admin Form Edits** → UpdateContext (state + localStorage)
2. **State Change** → POST /api/admin/data
3. **API Route** → Checks KV first; if available, saves to Redis; also saves to files if `NEXT_PUBLIC_PERSIST_TO_FILES=true` locally
4. **Next Request** → GET /api/admin/data → Loads from KV (or files locally)

## Local Development (Optional File Persistence)

To test persistence locally with file writes instead of KV:

```bash
# Create .env.local
echo "NEXT_PUBLIC_PERSIST_TO_FILES=true" >> .env.local

# Run dev server
npm run dev
```

This will write JSON to `src/data/admin/*.json` on every admin edit, and reads from there on mount.

## Storage Usage

Each data slice (skills, socialLinks, heroData, etc.) is lightweight JSON:
- **Skills**: ~2KB (typical)
- **Social Links**: ~200 bytes
- **Hero Data**: ~500 bytes
- **Experience**: ~1–3KB per entry
- **Education**: ~1–2KB per entry
- **Total**: Well under 30MB free tier

You won't hit limits for years with typical usage.

## Troubleshooting

- **KV not saving?** Check Vercel KV status in project settings → Integrations.
- **Reads not working?** Verify `KV_URL`, `KV_REST_API_URL`, and `KV_REST_API_TOKEN` are set in Vercel environment.
- **Local dev without KV?** Set `NEXT_PUBLIC_PERSIST_TO_FILES=true` in `.env.local` to use file-based persistence instead.

## Next Steps

- Admin panel now persists data across browsers and deployments.
- Consider adding an "Export" button in Admin to download all data as JSON.
- If you need audit trails later, upgrade to Postgres (Neon, Supabase, etc.).
