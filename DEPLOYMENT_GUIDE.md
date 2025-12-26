# 🚀 Deployment Guide - E-Ticketing App

## Quick Deploy Options

Your Next.js e-ticketing app can be deployed to several platforms. **Vercel is recommended** (easiest, made by Next.js creators).

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Supabase database is set up and accessible
- [ ] All tickets table columns exist (run `supabase/add-payment-schema.sql`)
- [ ] Environment variables are ready
- [ ] Payment mode is set correctly (mock vs live)
- [ ] Code is pushed to GitHub

---

## 🎯 Option 1: Vercel (Recommended - FREE)

**Best for:** Quick deployment, automatic HTTPS, global CDN

### Step 1: Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "Add New Project"**
4. **Import your repository:** Select `VK383/eticketing`
5. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://axlxihwwdtencrftjuwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Payment Mode (use 'mock' for testing, 'live' for production)
NEXT_PUBLIC_PAYMENT_MODE=mock

# PhonePe (only needed if using 'live' mode)
NEXT_PUBLIC_PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_API_ENDPOINT=https://api.phonepe.com/apis/hermes

# App URL (Vercel will provide this - update after first deploy)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://eticketing-abc123.vercel.app`

### Step 5: Update App URL

1. Copy your Vercel URL
2. Go to Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` with your Vercel URL
4. Redeploy (Settings → Deployments → Click "..." → Redeploy)

✅ **Done! Your app is live!**

---

## 🎯 Option 2: Netlify (Alternative - FREE)

**Best for:** Simple deployment, good for static sites

### Steps:

1. **Go to [Netlify](https://netlify.com)**
2. **Connect GitHub** repository
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Framework: Next.js
4. **Add environment variables** (same as Vercel)
5. **Deploy**

---

## 🎯 Option 3: Railway (FREE Tier)

**Best for:** Apps needing databases, background jobs

### Steps:

1. Go to [Railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub
3. Select your repository
4. Add environment variables
5. Deploy automatically

---

## 🌐 Custom Domain Setup (Optional)

### With Vercel:

1. **Buy domain** from Namecheap, GoDaddy, etc.
2. In Vercel project → **Settings** → **Domains**
3. Add your domain (e.g., `eticketing.com`)
4. Update DNS records as shown by Vercel
5. Wait 24-48 hours for propagation

---

## 📋 Post-Deployment Checklist

After deploying:

- [ ] **Test booking flow** - Create a ticket
- [ ] **Test payment** (mock mode should work instantly)
- [ ] **Test QR scanner** at `/admin/scan`
- [ ] **Check admin dashboard** at `/admin` (password: admin123)
- [ ] **Test ticket download** feature
- [ ] **Verify database updates** in Supabase

---

## 🔒 Production Security (Important!)

### 1. Change Admin Password

Create a secure password hash system instead of hardcoded `admin123`:

**Option A: Use environment variable** (quick fix)

In `.env.local`:
```env
ADMIN_PASSWORD=your_secure_password_here
```

In `app/admin/page.tsx`:
```typescript
if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
```

**Option B: Implement proper auth** (recommended for production)
- Use [NextAuth.js](https://next-auth.js.org/)
- Or Supabase Auth

### 2. Enable PhonePe Production Mode

When ready for real payments:

```env
NEXT_PUBLIC_PAYMENT_MODE=live
NEXT_PUBLIC_PHONEPE_MERCHANT_ID=your_production_merchant_id
PHONEPE_SALT_KEY=your_production_salt_key
PHONEPE_API_ENDPOINT=https://api.phonepe.com/apis/hermes
```

### 3. Enable Supabase RLS Policies

Ensure Row Level Security is properly configured in Supabase.

### 4. Monitor Your App

- **Vercel Analytics** (free) - Enable in project settings
- **Supabase Dashboard** - Monitor database usage
- **Error tracking** - Consider Sentry for production

---

## 🐛 Common Deployment Issues

### "Build Failed"

**Problem:** Missing dependencies or build errors

**Solution:**
```bash
# Test build locally first
npm run build

# Fix any TypeScript errors
# Then commit and push
```

### "Environment Variables Not Working"

**Problem:** Variables not loading

**Solution:**
- Ensure they're in Vercel/Netlify settings
- Prefix with `NEXT_PUBLIC_` for client-side variables
- Redeploy after adding variables

### "Database Connection Failed"

**Problem:** Can't connect to Supabase

**Solution:**
- Check Supabase URL is correct
- Verify anon key is valid
- Ensure Supabase project is not paused

### "Payment Not Working"

**Problem:** PhonePe errors

**Solution:**
- Use `NEXT_PUBLIC_PAYMENT_MODE=mock` for testing
- Verify PhonePe production credentials for live mode
- Check callback URLs are whitelisted

---

## 📊 Monitoring & Analytics

### Free Tools to Add:

1. **Vercel Analytics** - User insights, performance
2. **Google Analytics** - Traffic tracking
3. **Supabase Dashboard** - Database monitoring
4. **Uptime Robot** - Monitor uptime (free)

---

## 🔄 Continuous Deployment

Once deployed, any push to `main` branch auto-deploys:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Vercel/Netlify automatically deploys in 2-3 minutes!
```

---

## 💰 Cost Estimates

### Free Tier Limits:

**Vercel Free:**
- 100GB bandwidth/month
- 100 builds/day
- ✅ **More than enough for 5000+ tickets/event**

**Supabase Free:**
- 500MB database
- 50,000 monthly active users
- 2GB file storage
- ✅ **Perfect for your use case**

**Total Cost:** $0/month for small-medium events

### If You Scale:

**Vercel Pro:** $20/month (unlimited bandwidth)
**Supabase Pro:** $25/month (8GB database, 100GB bandwidth)

---

## 🎉 Quick Start - Deploy Now!

**5-Minute Deployment:**

1. Push code to GitHub (already done ✅)
2. Go to [vercel.com](https://vercel.com)
3. Import `VK383/eticketing`
4. Add environment variables
5. Deploy!

Your app will be live at: `https://eticketing-[random].vercel.app`

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase Docs:** https://supabase.com/docs

---

**Ready to deploy?** Start with Vercel - it's the easiest and fastest option! 🚀
