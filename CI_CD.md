# CI/CD Configuration - Automated Deployments

This project is configured for automatic deployments from GitHub to Vercel.

## 🚀 Automatic Deployment Overview

### **Default Behavior (Vercel Built-in)**

When you connect your repo to Vercel:

```
Push to main     → Deploys to Production automatically
Push to dev      → Deploys to Preview automatically
Open Pull Request → Unique Preview URL for each PR
```

**No configuration needed!** Vercel handles this automatically.

---

## 📋 Deployment Workflows

### **1. Production Deployment**

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Vercel automatically:
# 1. Detects push to main
# 2. Runs build
# 3. Deploys to production
# 4. Updates https://your-app.vercel.app
```

**Timeline:**
- Push detected: ~5 seconds
- Build time: ~30-60 seconds
- Deployment: ~10 seconds
- **Total: ~1-2 minutes**

---

### **2. Preview Deployments**

```bash
# Create feature branch
git checkout -b feature/new-endpoint
git add .
git commit -m "Add new API endpoint"
git push origin feature/new-endpoint

# Vercel automatically:
# 1. Detects branch push
# 2. Creates preview deployment
# 3. Generates unique URL
# URL: https://your-app-git-feature-new-endpoint.vercel.app
```

---

### **3. Pull Request Previews**

```bash
# Create PR on GitHub
gh pr create --title "Add new feature"

# Vercel automatically:
# 1. Detects PR
# 2. Deploys preview
# 3. Comments on PR with URL
```

Example PR comment:
```
🚀 Preview deployment ready!

✅ Preview: https://your-app-abc123.vercel.app
📝 Inspect: https://vercel.com/your-org/your-app/abc123
```

---

## ⚙️ GitHub Actions (Optional Enhanced CI/CD)

We've included GitHub Actions workflows for additional checks:

### **Workflow 1: CI - Type Check & Tests**
**File:** `.github/workflows/ci.yml`

Runs on every push and PR:
- ✅ TypeScript type checking
- ✅ Dependency verification
- ✅ Build validation

### **Workflow 2: Vercel Deploy**
**File:** `.github/workflows/vercel-deploy.yml`

Advanced deployment with:
- ✅ Type checking before deploy
- ✅ Custom build steps
- ✅ PR comments with preview URLs
- ✅ Production vs Preview logic

---

## 🔐 Setting Up GitHub Actions (Optional)

If you want to use the GitHub Actions workflows:

### **Step 1: Get Vercel Credentials**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Get credentials
cat .vercel/project.json
```

You'll see:
```json
{
  "orgId": "team_xxxxx",
  "projectId": "prj_xxxxx"
}
```

### **Step 2: Add GitHub Secrets**

Go to: `https://github.com/joshacw/video-production-pipeline/settings/secrets/actions`

Add these secrets:

| Secret Name | Value | Where to Get |
|------------|-------|--------------|
| `VERCEL_TOKEN` | `xxx...` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `team_xxx` | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `prj_xxx` | From `.vercel/project.json` |

### **Step 3: Enable Workflows**

Push the workflow files:
```bash
git add .github/
git commit -m "Add GitHub Actions workflows"
git push
```

GitHub Actions will automatically run on the next push!

---

## 📊 Deployment Status

### **Check Deployment Status**

**Vercel Dashboard:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. See all deployments with status

**GitHub:**
1. Go to your repo
2. Click "Actions" tab
3. See workflow runs

**Vercel CLI:**
```bash
vercel ls
```

---

## 🔄 Deployment Flow Diagram

```
┌─────────────────────────────────────────────┐
│  Developer: git push origin main            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  GitHub: Receives push event               │
│  - Triggers webhook to Vercel              │
│  - Triggers GitHub Actions (if enabled)    │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│ GitHub       │  │ Vercel           │
│ Actions      │  │ - Clones repo    │
│ - Type check │  │ - Installs deps  │
│ - Tests      │  │ - Builds project │
│ - Lint       │  │ - Deploys        │
└──────────────┘  └────────┬─────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Deployment Complete   │
              │  ✅ Live on Vercel     │
              │  📧 Email notification │
              └────────────────────────┘
```

---

## 🎯 Deployment Environments

### **Production**
- **Branch:** `main`
- **URL:** `https://your-app.vercel.app`
- **Custom Domain:** `https://videos.yourdomain.com` (if configured)
- **Trigger:** Push to `main` branch

### **Preview/Staging**
- **Branch:** `dev` or any feature branch
- **URL:** `https://your-app-git-dev.vercel.app`
- **Trigger:** Push to any branch except `main`

### **Pull Request Previews**
- **URL:** `https://your-app-git-pr-123.vercel.app`
- **Trigger:** Opening/updating a PR
- **Cleanup:** Auto-deleted when PR is closed/merged

---

## 🚦 Branch Protection Rules (Recommended)

Set up on GitHub to enforce quality:

1. Go to: `Settings` → `Branches` → `Add rule`
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require approvals (for teams)
   - ✅ Require conversation resolution

---

## 🔧 Customizing Deployments

### **Environment Variables per Branch**

In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Set scope for each variable:
   - **Production** (main branch only)
   - **Preview** (all other branches)
   - **Development** (local only)

Example:
```
OPENAI_API_KEY (Production) = sk-prod-xxx
OPENAI_API_KEY (Preview)    = sk-test-xxx
```

### **Custom Build Commands**

Edit `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "framework": null
}
```

### **Ignore Builds**

Skip deployment for specific commits:
```bash
git commit -m "docs: update README [skip ci]"
```

Or in `vercel.json`:
```json
{
  "github": {
    "silent": true,
    "autoAlias": false
  }
}
```

---

## 📈 Monitoring Deployments

### **Deployment Logs**

View in Vercel Dashboard:
1. Go to project
2. Click **Deployments**
3. Click a deployment
4. View **Build Logs** and **Function Logs**

### **Slack/Discord Notifications**

Set up in Vercel:
1. **Settings** → **Integrations**
2. Add Slack or Discord
3. Get notifications for:
   - Successful deployments
   - Failed builds
   - Domain changes

### **Status Badges**

Add to README:
```markdown
[![Deployment Status](https://vercel.com/api/deployments/YOUR_DEPLOYMENT_ID/badge)](https://your-app.vercel.app)
```

---

## 🐛 Troubleshooting

### **Deployment Failed**

1. Check Vercel build logs
2. Verify environment variables are set
3. Ensure all dependencies in `package.json`
4. Check for TypeScript errors locally

### **GitHub Action Failed**

1. Go to **Actions** tab in GitHub
2. Click failed workflow
3. Expand failed step
4. Check error message

### **Preview Not Generating**

1. Check Vercel GitHub integration is enabled
2. Verify webhook is active
3. Check branch protection rules

---

## 🚀 Quick Commands

```bash
# Check deployment status
vercel ls

# View recent deployments
vercel ls --count 10

# Roll back to previous deployment
vercel rollback

# Check logs
vercel logs

# Trigger manual deploy
vercel --prod

# Remove old deployments
vercel rm [deployment-url]
```

---

## 📋 Deployment Checklist

Before pushing to main:

- [ ] Code tested locally
- [ ] TypeScript compiles without errors
- [ ] Environment variables documented
- [ ] API endpoints tested
- [ ] Documentation updated
- [ ] Commit message is clear
- [ ] Preview deployment tested

---

## 🎉 Summary

Your project now has:

✅ **Automatic deployments** from GitHub to Vercel
✅ **Branch-based environments** (main = prod, others = preview)
✅ **PR preview URLs** with automatic comments
✅ **GitHub Actions** for CI/CD (optional)
✅ **Type checking** before deployment
✅ **Zero-downtime deployments**
✅ **Instant rollback** capability

---

## 🔗 Resources

- [Vercel Git Integration](https://vercel.com/docs/concepts/git)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Ready to ship!** Just `git push` and watch the magic happen ✨
