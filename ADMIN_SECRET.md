# Admin Panel Access (Internal Documentation)

## ⚠️ SECURITY: Keep This Secret

The admin panel URL is intentionally obfuscated to prevent unauthorized access discovery.

### Admin Panel Location

The admin panel is **NOT** at `/admin` but at a hidden URL: `/.well-known/`

This path is:
- Excluded from robots.txt
- Excluded from sitemap
- Marked with `noindex, nofollow` headers
- Protected by rate limiting and CSRF tokens
- Requires a strong password (12+ chars, uppercase, lowercase, numbers, special chars)

### Accessing the Admin Panel

1. Navigate to `https://your-domain.com/.well-known/`
2. You'll see a login screen (appears as "Not Found" in SEO)
3. Enter your admin password
4. All operations are logged and audited

### Security Features

✅ **Rate Limiting** - Max 5 login attempts per 10 minutes per IP
✅ **CSRF Protection** - All POST requests require CSRF tokens
✅ **Session Tokens** - HMAC-signed, IP-bound, 12-hour expiration
✅ **Audit Logging** - Every action is logged with timestamp, IP, and action
✅ **Request Validation** - Input sanitization to prevent XSS
✅ **API Rate Limiting** - 100 requests per minute per IP for API endpoints
✅ **X-Robots-Tag** - Explicitly tells search engines not to index
✅ **Middleware Headers** - X-Frame-Options, X-Content-Type-Options, CSP, HSTS

### Managing Data via API

If using programmatically:

```bash
# Get CSRF token first
curl -X GET https://your-domain.com/api/admin/login

# Then login with password + CSRF token
curl -X POST https://your-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "YOUR_PASSWORD", "csrfToken": "TOKEN_HERE"}'

# Now you can access /api/admin/data, /api/admin/seed, etc.
```

### Seeding Data

#### Via API

```bash
# Seed from static files (requires admin auth)
curl -X POST https://your-domain.com/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"seed": true}'

# Export data
curl https://your-domain.com/api/admin/data/export > backup.json

# Delete specific data
curl -X DELETE "https://your-domain.com/api/admin/data/delete?key=skills"

# Delete all data
curl -X DELETE "https://your-domain.com/api/admin/data/delete?all=true"
```

### Audit Logs

View all admin actions:

```bash
# Requires admin authentication
curl "https://your-domain.com/api/admin/audit" \
  -H "Cookie: admin_session=YOUR_SESSION_TOKEN"

# With filters
curl "https://your-domain.com/api/admin/audit?action=login_success&limit=50"
```

### Environment Setup

Make sure your `.env.local` has:

```env
ADMIN_PASSWORD=YourStr0ng!P@ssw0rd
ADMIN_SESSION_SECRET=random-secret-key-min-32-chars
REDIS_URL=your-upstash-redis-url
```

### Production Security Checklist

- [ ] Change ADMIN_PASSWORD to a strong, unique value
- [ ] Generate a random ADMIN_SESSION_SECRET
- [ ] Use HTTPS only (secure cookies are disabled in dev)
- [ ] Monitor `/api/admin/audit` for suspicious activity
- [ ] Regularly rotate the admin password
- [ ] Check rate limit logs for brute force attempts
- [ ] Keep session tokens httpOnly and Secure
