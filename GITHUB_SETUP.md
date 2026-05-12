# GitHub Setup & Deployment Guide

## 📋 Prerequisites

- GitHub account
- Node.js 18+ and npm
- Git installed locally
- Vercel account (optional, for production deployment)

## 🚀 Step 1: Initialize Git Repository

```bash
cd tzu-chi-malawi-office

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Tzu Chi Malawi Office System"
```

## 📤 Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `tzu-chi-malawi-office`
3. Description: "Office Digitalization System for Tzu Chi Malawi"
4. Choose Private or Public
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

## 🔗 Step 3: Connect Local Repository to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/tzu-chi-malawi-office.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

## 🌐 Step 4: Deploy to Vercel (Recommended)

### Option A: Automatic Deployment (Recommended)

1. Go to [vercel.com](https://vercel.com/new)
2. Click "Import Git Repository"
3. Connect your GitHub account
4. Select `tzu-chi-malawi-office` repository
5. **Project Settings:**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Node Version: 20.x
6. **Environment Variables** - Add these:
   ```
   DATABASE_URL = file:./prisma/dev.db
   NEXTAUTH_SECRET = (generate with: openssl rand -base64 32)
   NEXTAUTH_URL = (your-vercel-domain.vercel.app)
   JWT_SECRET = (generate random string)
   ```
7. Click "Deploy"

### Option B: Manual Upload

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
```

## 🐳 Alternative: Deploy to Heroku

```bash
# Install Heroku CLI
# Visit: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL database
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set JWT_SECRET="your-secret"
heroku config:set NEXTAUTH_SECRET="your-secret"
heroku config:set NEXTAUTH_URL="your-app-name.herokuapp.com"

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# View logs
heroku logs --tail
```

## 📱 GitHub Settings for CI/CD

### 1. Enable Branch Protection (Recommended)

1. Go to repository Settings → Branches
2. Add rule for `main` branch
3. Require pull request reviews before merging
4. Require status checks to pass before merging

### 2. Setup Secrets for Deployment

1. Go to Settings → Secrets and variables → Actions
2. Create New Repository Secret:
   ```
   VERCEL_TOKEN - Your Vercel API token
   VERCEL_ORG_ID - Your Vercel organization ID
   VERCEL_PROJECT_ID - Your project ID
   DATABASE_URL - Database connection string
   JWT_SECRET - JWT secret key
   NEXTAUTH_SECRET - NextAuth secret
   NEXTAUTH_URL - Production URL
   ```

3. To get Vercel secrets:
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Create new token
   - Copy and paste in GitHub Secrets

### 3. GitHub Actions Workflow

The `.github/workflows/deploy.yml` file is already configured. It will:
- Run ESLint on every push
- Build the project
- Deploy to Vercel on main branch

## 📝 Making Changes & Pushing Updates

```bash
# Make your changes
# Edit files as needed

# Stage changes
git add .

# Commit changes
git commit -m "Describe your changes"

# Push to GitHub
git push origin main

# Vercel will automatically deploy (if connected)
```

## 🔄 Pull Request Workflow

For team collaboration:

```bash
# Create new branch
git checkout -b feature/your-feature-name

# Make changes
# ... edit files ...

# Stage and commit
git add .
git commit -m "feat: Add your feature"

# Push branch
git push origin feature/your-feature-name

# Go to GitHub and create Pull Request
# Wait for checks to pass
# Request review from teammates
# Merge when approved
```

## 🧪 Testing Locally Before Push

```bash
# Run development server
npm run dev

# Open browser
# Test features at http://localhost:3000

# Build for production
npm run build

# Run production build
npm start

# Test at http://localhost:3000
```

## 📊 Monitoring Deployments

### Vercel Dashboard
- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Monitor deployment status
- Check build logs
- View analytics

### GitHub Actions
- Go to Actions tab in GitHub
- Monitor workflow runs
- Check build and deployment status

## 🐛 Troubleshooting

### Build Fails on Vercel
```bash
# Check build logs in Vercel dashboard
# Common issues:
# 1. Missing environment variables
# 2. Database connection issues
# 3. TypeScript errors

# Test locally first:
npm run build
```

### Deployment Stuck
```bash
# Check Vercel deployments
# Redeploy if needed from Vercel dashboard
# Or push new commit to trigger deployment
```

### Database Issues on Production
```bash
# For PostgreSQL on Heroku:
heroku pg:info
heroku pg:credentials DATABASE

# For Vercel + PostgreSQL:
# Add DATABASE_URL to Vercel environment variables
# URL format: postgresql://user:password@host:port/dbname
```

## 🔐 Security Checklist

Before deploying to production:

- [ ] Repository is set to Private (if needed)
- [ ] All secrets are in GitHub Secrets (not in code)
- [ ] `.env` and `.env.local` are in `.gitignore`
- [ ] JWT_SECRET and NEXTAUTH_SECRET are strong random strings
- [ ] Database URL is correct and secure
- [ ] HTTPS is enforced on production domain
- [ ] Password requirements are enforced
- [ ] Database backups are configured
- [ ] Regular security updates are scheduled
- [ ] Team has access to deployment secrets

## 📞 Getting Help

- GitHub Issues: Create an issue in the repository
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Prisma Docs: [prisma.io/docs](https://prisma.io/docs)

## 🎉 Success!

Once deployed, you can access your application at:
- Vercel: `https://your-app-name.vercel.app`
- Heroku: `https://your-app-name.herokuapp.com`
- Custom domain: Configure in hosting provider settings

---

**Last Updated**: April 7, 2026
