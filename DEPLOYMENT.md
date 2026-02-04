# Deployment Guide - Video Production Pipeline

This guide will walk you through deploying the Video Production Pipeline to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- API keys:
  - OpenAI API key (required)
  - Unsplash API key (optional)
  - Pexels API key (optional)

## Step 1: Create GitHub Repository

### Option A: Using GitHub CLI

```bash
# Navigate to project
cd video-production

# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Video Production Pipeline"

# Create GitHub repo (replace YOUR_USERNAME)
gh repo create video-production-pipeline --public --source=. --remote=origin

# Push to GitHub
git push -u origin main
```

### Option B: Using GitHub Website

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `video-production-pipeline`
3. Description: "Automated video production pipeline using Remotion and AI"
4. Public or Private (your choice)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

Then in your terminal:

```bash
cd video-production
git init
git add .
git commit -m "Initial commit: Video Production Pipeline"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/video-production-pipeline.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? video-production-pipeline
# - In which directory is your code located? ./
# - Want to override settings? No

# Deploy to production
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
5. Click "Deploy"

## Step 3: Configure Environment Variables

### In Vercel Dashboard

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | `sk-...` | ✅ Yes |
| `UNSPLASH_API_KEY` | Your key | ⚠️ Optional |
| `PEXELS_API_KEY` | Your key | ⚠️ Optional |
| `NODE_ENV` | `production` | ✅ Yes |

4. Click "Save"

### Using Vercel CLI

```bash
# Add environment variables
vercel env add OPENAI_API_KEY
vercel env add UNSPLASH_API_KEY
vercel env add PEXELS_API_KEY
vercel env add NODE_ENV

# Pull environment variables locally
vercel env pull
```

## Step 4: Test Your Deployment

### Health Check

```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

### Generate a Video

```bash
curl -X POST https://your-app.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "topic": "Test video",
      "duration": 15,
      "style": "modern",
      "platform": "youtube-shorts",
      "options": {
        "includeVoiceover": true,
        "includeCaptions": true,
        "includeMusic": true
      }
    }
  }'
```

## Step 5: Set Up Custom Domain (Optional)

### In Vercel Dashboard

1. Go to "Settings" → "Domains"
2. Add your domain (e.g., `videos.yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate to provision

### Using Vercel CLI

```bash
vercel domains add videos.yourdomain.com
```

## API Endpoints

Your deployed API will be available at:

```
https://your-app.vercel.app/api/health        # Health check
https://your-app.vercel.app/api/generate      # Generate video
https://your-app.vercel.app/api/variants      # Generate variants
```

## Deployment Architecture

### Serverless Functions

Vercel automatically converts your API routes to serverless functions:

```
video-production/
├── api/
│   ├── health.ts       → /api/health
│   ├── generate.ts     → /api/generate
│   └── variants.ts     → /api/variants
```

### Function Configuration

In `vercel.json`:
- **Memory**: 3008 MB (maximum for Hobby plan)
- **Timeout**: 300 seconds (5 minutes)
- **Runtime**: Node.js 18

## Monitoring & Logs

### View Logs

**Vercel Dashboard**:
1. Go to your project
2. Click "Deployments"
3. Select a deployment
4. Click "Function Logs"

**Vercel CLI**:
```bash
vercel logs
```

### Analytics

Vercel provides built-in analytics:
1. Go to "Analytics" tab
2. View requests, performance, errors

## Cost Considerations

### Vercel Free Tier

- ✅ 100 GB-hours of compute per month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ⚠️ Function timeout: 10s (Pro: 60s)
- ⚠️ Function memory: 1024 MB (Pro: 3008 MB)

### For Production

Upgrade to **Vercel Pro** ($20/month) for:
- 1000 GB-hours compute
- Longer function timeouts (60s)
- More memory (3008 MB)
- Better performance

### API Costs

- OpenAI API: ~$0.10 per video
- Unsplash: Free (50 requests/hour)
- Pexels: Free (unlimited)

**Monthly estimate** (1000 videos):
- Vercel: $20/month (Pro plan)
- OpenAI: ~$100/month
- **Total: ~$120/month**

## Troubleshooting

### "Function Timeout"

If your functions are timing out:

1. **Upgrade to Pro**: Get 60s timeout
2. **Reduce video duration**: Generate shorter videos
3. **Use webhooks**: For long-running tasks

### "Out of Memory"

If functions run out of memory:

1. **Check vercel.json**: Ensure `memory: 3008`
2. **Upgrade to Pro**: Required for 3008 MB
3. **Optimize code**: Reduce memory usage

### "API Key Not Found"

1. Check environment variables in Vercel dashboard
2. Redeploy after adding variables
3. Verify variable names match code

### "Module Not Found"

1. Ensure all dependencies are in `package.json`
2. Run `npm install` locally to verify
3. Redeploy

## CI/CD Workflow

Vercel automatically:
1. Detects pushes to GitHub
2. Builds your project
3. Runs preview deployment (for branches)
4. Deploys to production (for main branch)

### Preview Deployments

Every pull request gets a unique preview URL:
```
https://video-production-pipeline-git-feature-branch.vercel.app
```

## Security Best Practices

### Environment Variables
- ✅ Store all secrets in Vercel environment variables
- ✅ Never commit `.env` to Git
- ✅ Rotate API keys regularly
- ✅ Use different keys for dev/prod

### CORS
- Configure allowed origins in production
- Validate request origins
- Rate limit API endpoints

### API Keys
- Monitor usage in OpenAI dashboard
- Set spending limits
- Use separate keys per environment

## Scaling Strategies

### Vertical Scaling
- Upgrade Vercel plan for more resources
- Use faster API keys (OpenAI tier 2+)

### Horizontal Scaling
- Implement job queue (Bull + Redis)
- Use background workers
- Batch process during off-peak hours

### Caching
- Cache API responses (Redis)
- Store generated assets (S3/R2)
- Implement CDN for assets

## Alternative Deployment Options

### AWS Lambda

Deploy as Lambda functions:
```bash
# Use Serverless Framework
npm install -g serverless
serverless deploy
```

### Railway

Simple alternative to Vercel:
```bash
# Install Railway CLI
npm i -g @railway/cli
railway login
railway init
railway up
```

### Self-Hosted

Deploy on your own server:
```bash
# Build for production
npm run build

# Start server
NODE_ENV=production npm run server
```

## Maintenance

### Regular Tasks
- Monitor error rates in Vercel dashboard
- Check API usage and costs
- Update dependencies monthly
- Review and rotate API keys

### Updating

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Test locally
npm run demo single

# Deploy
vercel --prod
```

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [GitHub Actions with Vercel](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)

## Quick Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Add environment variable
vercel env add VARIABLE_NAME

# Remove deployment
vercel remove [deployment-url]

# List deployments
vercel ls
```

---

## Next Steps After Deployment

1. ✅ Test all API endpoints
2. ✅ Set up custom domain
3. ✅ Configure monitoring/alerts
4. ✅ Document your API
5. ✅ Share with users
6. ✅ Collect feedback
7. ✅ Iterate and improve

---

**Your video production pipeline is now live! 🚀**

Share your API at: `https://your-app.vercel.app/api/generate`
