# 🚀 Deploy QA Engineering Playbook to Vercel

## ✅ Quick Deploy (Recommended)

### Option 1: Vercel Dashboard (Easiest - 2 minutes)

1. **Visit Vercel**
   ```
   https://vercel.com/signup
   ```
   - Click "Continue with GitHub"
   - Authorize Vercel to access your repositories

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Find `qa-engineering-playbook` in the list
   - Click "Import"

3. **Configure Project** (Already Done!)
   - Vercel auto-detects everything from `vercel.json`
   - Project Name: `qa-engineering-playbook`
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: (none needed - static site)
   - Output Directory: `./`

4. **Deploy**
   - Click "Deploy" button
   - Wait 20-30 seconds ⏱️
   - Done! 🎉

5. **Your Live Site**
   ```
   https://qa-engineering-playbook.vercel.app
   ```
   (or `https://qa-engineering-playbook-[your-username].vercel.app`)

---

## Option 2: Vercel CLI (For Terminal Users)

### Install & Deploy

```bash
# Navigate to project
cd qa-engineering-playbook

# Deploy using npx (no install needed)
npx vercel

# Follow the prompts:
# - Log in to Vercel (opens browser)
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? qa-engineering-playbook
# - In which directory is your code located? ./
# - Want to override settings? No

# For production deployment
npx vercel --prod
```

**Done!** Your site is live at the URL shown in the terminal.

---

## 📋 Verification Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL
- [ ] Dark mode toggle works
- [ ] All modules are visible
- [ ] Search functionality works
- [ ] Lesson content loads correctly
- [ ] Progress tracking saves
- [ ] Responsive on mobile

---

## 🎨 Custom Domain (Optional)

### Add Your Own Domain

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Enter your domain (e.g., `qa-playbook.com`)
5. Follow DNS configuration instructions
6. Wait for DNS propagation (5-30 minutes)

**Done!** Your site is now at `https://your-domain.com`

---

## 🔄 Auto-Deploy on Git Push

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
echo "// Updated" >> app.js

# Commit and push
git add .
git commit -m "Update content"
git push origin main

# Vercel automatically deploys!
# Check deployment at: https://vercel.com/dashboard
```

---

## 🐛 Troubleshooting

### Site Not Loading?

1. Check Vercel Dashboard → Deployments
2. Look for build errors
3. Verify `index.html` exists in root
4. Check browser console for errors

### Missing Content?

1. Ensure all files are committed to Git
2. Check `docs/` folder exists
3. Verify `app.js` and `styles.css` loaded

### 404 Errors?

1. Check `vercel.json` routing configuration
2. Ensure all links use relative paths
3. Verify file paths are correct

---

## 📊 Deployment Stats

- **Build Time:** ~20-30 seconds
- **Bundle Size:** ~50KB (HTML + CSS + JS)
- **Content:** 40+ lessons (~5MB markdown)
- **Performance:**
  - Lighthouse Score: 95+
  - First Contentful Paint: < 1s
  - Time to Interactive: < 2s

---

## 🚀 Next Steps

After deployment:

1. **Share the URL** with your team
2. **Add to GitHub README** (already done!)
3. **Share on LinkedIn/Twitter**
4. **Gather feedback** and iterate
5. **Keep content updated** (auto-deploys on push)

---

## 🎉 Congratulations!

Your QA Engineering Playbook is now live and accessible to anyone worldwide!

**Live URL:** Check your Vercel dashboard for the exact URL.

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/IKImranKhanIK/qa-engineering-playbook/issues

---

**Built with ❤️ for the QA community**
