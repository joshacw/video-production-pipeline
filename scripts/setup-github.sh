#!/bin/bash

# Video Production Pipeline - GitHub Setup Script
# This script helps you create a new GitHub repository and push your code

set -e

echo "🚀 Video Production Pipeline - GitHub Setup"
echo "==========================================="
echo ""

# Check if we're in a git repo already
if [ -d .git ]; then
    echo "⚠️  Git repository already exists."
    echo "   Do you want to reinitialize? (y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        echo "Aborting."
        exit 1
    fi
    rm -rf .git
fi

# Get repository name
echo "📝 Repository name (default: video-production-pipeline):"
read -r REPO_NAME
REPO_NAME=${REPO_NAME:-video-production-pipeline}

# Get GitHub username
echo ""
echo "👤 GitHub username:"
read -r GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo ""
    echo "⚠️  GitHub CLI (gh) is not installed."
    echo "   Install it from: https://cli.github.com/"
    echo ""
    echo "   Or manually create repo at: https://github.com/new"
    echo "   Then run:"
    echo ""
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit: Video Production Pipeline'"
    echo "   git branch -M main"
    echo "   git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git"
    echo "   git push -u origin main"
    exit 1
fi

# Initialize git
echo ""
echo "📦 Initializing Git repository..."
git init

# Add all files
echo "➕ Adding files..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Video Production Pipeline

- Complete automation pipeline
- AI-powered content generation
- Multi-platform support
- Remotion rendering engine
- REST API endpoints
- Comprehensive documentation"

# Set main branch
git branch -M main

# Create GitHub repository
echo ""
echo "🌐 Creating GitHub repository..."
echo "   Public or private? (public/private, default: public)"
read -r VISIBILITY
VISIBILITY=${VISIBILITY:-public}

if [[ "$VISIBILITY" == "private" ]]; then
    gh repo create "$REPO_NAME" --private --source=. --remote=origin
else
    gh repo create "$REPO_NAME" --public --source=. --remote=origin
fi

# Push to GitHub
echo ""
echo "⬆️  Pushing to GitHub..."
git push -u origin main

# Success message
echo ""
echo "✅ Success! Repository created and pushed to GitHub"
echo ""
echo "🔗 Repository URL:"
echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "📚 Next steps:"
echo "   1. Go to https://vercel.com/new"
echo "   2. Import your GitHub repository"
echo "   3. Add environment variables (see DEPLOYMENT.md)"
echo "   4. Deploy!"
echo ""
echo "Or use Vercel CLI:"
echo "   npm i -g vercel"
echo "   vercel login"
echo "   vercel"
echo ""
