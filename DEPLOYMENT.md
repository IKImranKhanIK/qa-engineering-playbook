# Deployment Guide

This guide explains how to deploy your QA Engineering Playbook web application.

## Local Development

### Method 1: Direct File Open
The simplest method - just open the file:
1. Navigate to the project folder
2. Double-click `index.html`
3. Your default browser will open the app

**Pros:** Instant, no setup
**Cons:** Some features may not work (file:// protocol limitations)

### Method 2: Python HTTP Server
If you have Python installed:
```bash
cd qa-engineering-playbook
python3 -m http.server 8000
```
Then visit: http://localhost:8000

**Pros:** Works like a real web server
**Cons:** Requires Python installed

### Method 3: Node.js HTTP Server
If you have Node.js installed:
```bash
npx http-server . -p 8000
```
Then visit: http://localhost:8000

**Pros:** Fast, supports hot reload
**Cons:** Requires Node.js

### Method 4: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

**Pros:** Auto-refresh on changes
**Cons:** Requires VS Code

---

## Online Deployment (Free Hosting)

### Option 1: GitHub Pages (Recommended)

**Setup:**
1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/qa-playbook.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to "Pages"
   - Source: Deploy from branch "main"
   - Folder: / (root)
   - Click "Save"

4. Your site will be live at:
   `https://YOUR-USERNAME.github.io/qa-playbook/`

**Pros:**
- Free
- Automatic deploys on git push
- Custom domain support
- HTTPS included

**Cons:**
- Public repositories only (for free tier)
- May take a few minutes for first deploy

---

### Option 2: Netlify

**Setup:**
1. Go to [netlify.com](https://netlify.com)
2. Sign up (free account)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: `.` (root)
6. Click "Deploy"

Your site will be live at: `https://random-name.netlify.app`

**Custom Domain (optional):**
- Go to Site settings → Domain management
- Add your custom domain

**Pros:**
- Extremely fast CDN
- Automatic HTTPS
- Custom domains (free)
- Form handling
- Deploy previews for PRs

**Cons:**
- None really, it's great for static sites

---

### Option 3: Vercel

**Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up (free account)
3. Click "Import Project"
4. Import from GitHub
5. Select your repository
6. Framework preset: "Other"
7. Click "Deploy"

Your site will be live at: `https://qa-playbook.vercel.app`

**Pros:**
- Fastest CDN
- Automatic HTTPS
- Custom domains (free)
- Serverless functions (if needed later)

**Cons:**
- Bandwidth limits on free tier (generous though)

---

### Option 4: Cloudflare Pages

**Setup:**
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up (free account)
3. Create a project
4. Connect to Git
5. Select your repository
6. Build settings:
   - Build command: (none)
   - Build output directory: `/`
7. Deploy

Your site will be live at: `https://qa-playbook.pages.dev`

**Pros:**
- Cloudflare's global network
- Unlimited bandwidth (free)
- Automatic HTTPS
- Fast deployments

**Cons:**
- Slightly more complex dashboard

---

## Deployment Comparison

| Feature | GitHub Pages | Netlify | Vercel | Cloudflare |
|---------|--------------|---------|--------|------------|
| **Price** | Free | Free | Free | Free |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ |
| **HTTPS** | ✅ | ✅ | ✅ | ✅ |
| **Bandwidth** | 100 GB/month | 100 GB/month | 100 GB/month | Unlimited |
| **Build Time** | ~1-2 min | ~30 sec | ~30 sec | ~30 sec |
| **Ease of Use** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Recommendation:**
- **For simplicity:** Netlify
- **For speed:** Vercel
- **For unlimited bandwidth:** Cloudflare Pages
- **For GitHub integration:** GitHub Pages

---

## Custom Domain Setup

### Step 1: Buy a Domain
Purchase from:
- Namecheap (~$10/year)
- Google Domains (~$12/year)
- Cloudflare (~$8/year)

### Step 2: Configure DNS

**For Netlify/Vercel/Cloudflare:**
They provide instructions in their dashboard. Generally:
1. Add your domain in the platform
2. Update your DNS nameservers to point to the platform
3. Wait for DNS propagation (5-60 minutes)

**For GitHub Pages:**
1. In repository settings → Pages → Custom domain
2. Enter your domain (e.g., `qa-playbook.com`)
3. In your DNS provider, add a CNAME record:
   ```
   Type: CNAME
   Name: www
   Value: YOUR-USERNAME.github.io
   ```
4. For apex domain (no www), add A records:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

---

## Updating Your Site

### GitHub Pages / Netlify / Vercel / Cloudflare
All these platforms auto-deploy when you push to GitHub:

```bash
# Make your changes to files
git add .
git commit -m "Update content"
git push origin main
```

Your site updates automatically in 30-120 seconds!

---

## Troubleshooting

### Site Not Loading
- Check if build succeeded (check deployment logs)
- Verify `index.html` is in root directory
- Check browser console for errors (F12)

### Styles Not Working
- Verify `styles.css` and `app.js` are in the same directory as `index.html`
- Check file paths are relative (not absolute)
- Clear browser cache (Ctrl+Shift+R)

### Progress Not Saving
- Ensure JavaScript is enabled
- Check localStorage is not blocked
- Try different browser

### Templates Not Loading
- Ensure `templates/` folder is deployed
- Check file paths in `app.js`
- Verify markdown files exist

---

## Performance Optimization

### Enable Caching
Add a `netlify.toml` file (for Netlify):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

### Compress Images
If you add images later, use:
- [TinyPNG](https://tinypng.com/)
- [ImageOptim](https://imageoptim.com/)

### Minify Assets
For production, minify CSS/JS:
```bash
npx minify styles.css > styles.min.css
npx minify app.js > app.min.js
```

Then update `index.html` to reference `.min.css` and `.min.js` files.

---

## Security

### Content Security Policy
Add to `index.html` `<head>`:
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src 'self' https://fonts.gstatic.com;">
```

### HTTPS Only
All recommended platforms provide HTTPS automatically. Always use HTTPS in production.

---

## Monitoring

### Google Analytics (Optional)
Add to `index.html` before `</head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your tracking ID.

---

## Need Help?

- **GitHub Pages:** https://docs.github.com/pages
- **Netlify:** https://docs.netlify.com
- **Vercel:** https://vercel.com/docs
- **Cloudflare:** https://developers.cloudflare.com/pages

---

**You're all set! Your QA Engineering Playbook is ready to share with the world. 🚀**
