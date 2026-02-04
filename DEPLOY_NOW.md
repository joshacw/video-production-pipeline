# 🚀 Deploy to GitHub & Vercel - Quick Start

Follow these steps to deploy your Video Production Pipeline in under 10 minutes.

## Prerequisites Checklist

- [ ] GitHub account
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- [ ] Git installed
- [ ] Node.js 18+ installed

## Step-by-Step Deployment

### 1️⃣ Get Your API Keys (5 minutes)

#### OpenAI (Required)
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Save it somewhere safe

#### Unsplash (Optional - for images)
1. Go to [unsplash.com/developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your Access Key

#### Pexels (Optional - for videos)
1. Go to [pexels.com/api](https://www.pexels.com/api/)
2. Sign up and get your API key

---

### 2️⃣ Create GitHub Repository (2 minutes)

#### Option A: Automated Script (Easiest)

```bash
cd video-production
./scripts/setup-github.sh
```

Follow the prompts to create your repository automatically.

#### Option B: Manual Setup

```bash
cd video-production

# Initialize Git
git init
git add .
git commit -m "Initial commit: Video Production Pipeline"
git branch -M main

# Create repo on GitHub (replace YOUR_USERNAME)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/video-production-pipeline.git
git push -u origin main
```

**Create repo manually at**: [github.com/new](https://github.com/new)

---

### 3️⃣ Deploy to Vercel (3 minutes)

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"
5. **Project Settings**:
   - Framework Preset: `Other`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. Click "Deploy"

---

### 4️⃣ Add Environment Variables (2 minutes)

#### In Vercel Dashboard:

1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
OPENAI_API_KEY=sk-your-key-here
UNSPLASH_API_KEY=your-key-here (optional)
PEXELS_API_KEY=your-key-here (optional)
NODE_ENV=production
```

4. Click **Save**
5. Go to **Deployments** tab
6. Click "⋯" next to latest deployment
7. Click **Redeploy** to apply environment variables

#### Using Vercel CLI:

```bash
vercel env add OPENAI_API_KEY
# Paste your key when prompted

vercel env add NODE_ENV
# Enter: production
```

---

### 5️⃣ Test Your Deployment (1 minute)

#### Test Health Endpoint:

```bash
curl https://your-app.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Test Video Generation:

```bash
curl -X POST https://your-app.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "topic": "My first AI-generated video",
      "duration": 15,
      "style": "modern",
      "platform": "youtube-shorts"
    }
  }'
```

---

## 🎉 You're Live!

Your API is now deployed at:
```
https://your-app.vercel.app
```

### API Endpoints:

- `GET /api/health` - Health check
- `POST /api/generate` - Generate single video
- `POST /api/variants` - Generate multiple variants

---

## 📝 What's Next?

### Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your domain: `videos.yourdomain.com`
3. Follow DNS instructions
4. Wait for SSL (usually < 5 minutes)

### Monitor Your API

- **Logs**: Project → Deployments → Function Logs
- **Analytics**: Project → Analytics tab
- **Usage**: Check OpenAI dashboard for API usage

### Integrate with Your Apps

```javascript
// Example: Call from your app
const response = await fetch('https://your-app.vercel.app/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    request: {
      topic: "AI productivity tips",
      duration: 30,
      style: "modern",
      platform: "instagram-reels"
    }
  })
});

const { videoSpec } = await response.json();
console.log('Video generated:', videoSpec.title);
```

---

## 💰 Cost Breakdown

### Free Tier (Vercel Hobby)
- ✅ 100 GB-hours compute/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ⚠️ 10s function timeout
- ⚠️ 1GB function memory

**Good for**: Testing, small projects (~100 videos/month)

### Pro Plan ($20/month)
- ✅ 1000 GB-hours compute
- ✅ 60s function timeout
- ✅ 3GB function memory
- ✅ Team collaboration

**Good for**: Production use (~1000 videos/month)

### API Costs
- OpenAI: ~$0.10 per video
- Unsplash/Pexels: Free

**Total Monthly (Pro + 1000 videos)**: ~$120

---

## 🐛 Troubleshooting

### "Function Timeout"
- **Free tier**: Limited to 10s (upgrade to Pro for 60s)
- **Solution**: Reduce video duration or upgrade plan

### "Environment Variables Not Found"
- **Solution**: Add variables in Vercel dashboard, then redeploy

### "Out of Memory"
- **Free tier**: 1GB limit
- **Solution**: Upgrade to Pro (3GB) or optimize code

### "Module Not Found"
- **Solution**: Ensure `package.json` has all dependencies
- Run `npm install` locally to verify
- Push changes and redeploy

---

## 📚 Additional Resources

- [Full Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Architecture Docs](./ARCHITECTURE.md) - System architecture
- [API Reference](./README.md) - Complete API documentation
- [Getting Started](./GETTING_STARTED.md) - Local development guide

---

## 🆘 Need Help?

1. Check the [troubleshooting section](#troubleshooting)
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides
3. Check Vercel logs: Project → Deployments → Logs
4. Verify environment variables are set correctly

---

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Health endpoint working
- [ ] Test video generation working
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

---

## 🎊 Congratulations!

Your Video Production Pipeline is now live and ready to generate videos automatically!

**Share your API**: `https://your-app.vercel.app`

Start generating videos at scale! 🚀
