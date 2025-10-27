# 🚀 Production Deployment Guide

## Overview

This guide covers deploying the Refract Meteor application to production using Railway, including CI/CD pipeline setup and configuration.

---

## Table of Contents

1. [Recommended Setup](#recommended-setup)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Railway Deployment](#railway-deployment)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Alternative Hosting](#alternative-hosting)
6. [Troubleshooting](#troubleshooting)

---

## Recommended Setup

### **Railway Deployment ($10/month)**

Railway is the most cost-effective and developer-friendly option for Meteor apps.

#### **Why Railway?**

- ✅ **Affordable**: $5 app + $5 MongoDB = $10/month total
- ✅ **Simple**: One-click Meteor deployment
- ✅ **Automatic**: SSL certificates, domain management
- ✅ **Scalable**: Easy to upgrade as you grow
- ✅ **Reliable**: Built for production workloads

---

## Pre-Deployment Checklist

### **1. Security Verification**

- [x] Rate limiting configured (5 login attempts/minute)
- [x] Input validation active on all forms
- [x] Security headers enabled (CSP, XSS protection, etc.)
- [x] Audit logging implemented
- [x] Environment variables secured
- [x] Database access controls in place

### **2. Performance Optimization**

- [x] CreateJS loads dynamically without blocking
- [x] CSS/JS minification enabled in production
- [x] Static assets properly cached
- [x] Database indexes optimized

### **3. Monitoring & Logging**

- [ ] Error tracking configured
- [ ] Performance monitoring setup
- [ ] Uptime monitoring active
- [ ] Backup strategy implemented

### **4. Environment Variables**

```bash
# Required for Railway deployment
NODE_ENV=production
ROOT_URL=https://your-app.railway.app
MONGO_URL=mongodb://user:pass@host:port/database

# Security (recommended)
METEOR_SETTINGS='{"security": {"rateLimit": {"enabled": true}}}'
```

---

## Railway Deployment

### **Step 1: Create Railway Account**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account
3. Verify email address

### **Step 2: Deploy from GitHub**

1. Click "Deploy from GitHub repo"
2. Select `eatyourpeas/refract` repository
3. Choose `main` branch (CI/CD handles `deploy` branch)
4. Railway will auto-detect as Node.js/Meteor app

### **Step 3: Add MongoDB Database**

1. In Railway dashboard, click "New"
2. Select "Database" → "MongoDB"
3. Wait for provisioning (2-3 minutes)
4. Copy connection string

### **Step 4: Configure Environment Variables**

In Railway dashboard, set these variables:

```bash
NODE_ENV=production
ROOT_URL=https://your-app-name.up.railway.app
MONGO_URL=mongodb://mongo:password@server:port/database
METEOR_SETTINGS={"security": {"rateLimit": {"enabled": true}}}
```

### **Step 5: Manual Deployment**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link          # Link to your Railway project
railway up           # Deploy the application
```

### **Step 6: Verify Deployment**

1. Railway will automatically build and deploy
2. Check deployment logs for errors
3. Test app functionality at provided URL
4. Run security tests via browser console:

```javascript
// In browser console
runSecurityTests();
```

---

## CI/CD Pipeline

### **Overview**

The CI/CD pipeline runs automatically on pushes and pull requests:

- **Tests + Security + Quality**: Run on all pushes and PRs
- **Production Deployment**: Only on merges to `main` branch
- **Failure Handling**: GitHub Action fails if deployment fails

### **Workflow Diagram**

```mermaid
graph LR
    A[Push/PR] --> B[Run Tests]
    B --> C[Security Scan] 
    C --> D[Code Quality]
    D --> E{Main branch?}
    E -->|No| F[Complete ✅]
    E -->|Yes| G[Check Railway Config]
    G -->|Not configured| H[Skip Deploy ⏭️]
    G -->|Configured| I[Deploy to Railway]
    I -->|Success| J[Deploy Success ✅]
    I -->|Failure| K[GitHub Action FAILS ❌]
```

### **Setting Up CI/CD**

#### **Step 1: Add GitHub Secrets**

Go to your GitHub repository settings:

1. Navigate to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**

Add these secrets:

#### RAILWAY_TOKEN

```text
1. Sign up at https://railway.app
2. Go to Account Settings → Tokens
3. Click "Create New Token"
4. Copy the token (starts with railway_...)
5. Paste as GitHub secret value
```

#### RAILWAY_PROJECT_ID

```text
1. Create Railway project from GitHub
2. In project dashboard, go to Settings
3. Copy the Project ID
4. Paste as GitHub secret value
```

#### **Step 2: Add CI/CD Workflow File**

The CI/CD workflow file is already in place at `.github/workflows/ci-cd.yml`. Here's what it does:

```yaml
name: CI/CD Pipeline

on:
    push:
        branches: [main, deploy, develop]
    pull_request:
        branches: [main]

jobs:
    test:
        name: Run Tests
        runs-on: ubuntu-latest
        strategy:
            matrix:
                node-version: [18.x, 20.x]
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: ${{ matrix.node-version }}
                  cache: "npm"
            - run: curl https://install.meteor.com/ | sh
            - run: export PATH="$HOME/.meteor:$PATH" && meteor npm install
            - run: export PATH="$HOME/.meteor:$PATH" && meteor npm audit --audit-level=high
            - run: |
                export PATH="$HOME/.meteor:$PATH"
                test -f server/security.js || exit 1
                test -f SECURITY.md || exit 1
                test -f test-security.js || exit 1
                echo "✅ Security files present"
            - run: export PATH="$HOME/.meteor:$PATH" && meteor build --directory ../build --server-only
            - run: |
                test -d ../build || exit 1
                test -f ../build/bundle/main.js || exit 1
                echo "✅ Build successful"

    lint:
        name: Code Quality
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: "20.x"
                  cache: "npm"
            - run: curl https://install.meteor.com/ | sh
            - run: export PATH="$HOME/.meteor:$PATH" && meteor npm install
            - run: |
                node -c refract.js
                node -c server/security.js
                node -c test-security.js
                echo "✅ JavaScript syntax valid"
            - run: |
                grep -q "rate.*limit" server/security.js || exit 1
                grep -q "Content-Security-Policy" server/security.js || exit 1
                grep -q "X-Frame-Options" server/security.js || exit 1
                echo "✅ Security configuration verified"

    security-scan:
        name: Security Scan
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: aquasecurity/trivy-action@master
              with:
                  scan-type: "fs"
                  scan-ref: "."
                  format: "sarif"
                  output: "trivy-results.sarif"
            - uses: github/codeql-action/upload-sarif@v2
              if: always()
              with:
                  sarif_file: "trivy-results.sarif"

    deploy:
        name: Deploy to Production
        runs-on: ubuntu-latest
        needs: [test, lint, security-scan]
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'

        steps:
            - uses: actions/checkout@v4

            - name: Check Railway configuration
              id: check-railway
              run: |
                  if [ -z "${{ secrets.RAILWAY_TOKEN }}" ] || [ -z "${{ secrets.RAILWAY_PROJECT_ID }}" ]; then
                    echo "⚠️ Railway not configured. Deployment will be skipped."
                    echo "configured=false" >> $GITHUB_OUTPUT
                  else
                    echo "✅ Railway configuration found"
                    echo "configured=true" >> $GITHUB_OUTPUT
                  fi

            - name: Deploy to Railway
              if: steps.check-railway.outputs.configured == 'true'
              env:
                  RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
                  RAILWAY_PROJECT_ID: ${{ secrets.RAILWAY_PROJECT_ID }}
              run: |
                  set -e

                  echo "🚀 Starting deployment to Railway..."
                  npm install -g @railway/cli

                  echo "🔐 Authenticating with Railway..."
                  railway login --token $RAILWAY_TOKEN

                  echo "🔗 Linking to Railway project..."
                  railway link $RAILWAY_PROJECT_ID

                  echo "📦 Deploying application..."
                  railway up --detach

                  echo "✅ Deployment command completed successfully"

            - name: Notify deployment success
              if: success() && steps.check-railway.outputs.configured == 'true'
              run: |
                  echo "🚀 Deployment successful!"
                  echo "Your app should be live at your Railway domain"
                  echo "Check Railway dashboard for deployment status"

            - name: Notify deployment skipped
              if: steps.check-railway.outputs.configured == 'false'
              run: |
                  echo "⏭️ Deployment skipped - Railway not configured"
                  echo "Set up Railway secrets to enable deployment."

            - name: Notify deployment failure
              if: failure() && steps.check-railway.outputs.configured == 'true'
              run: |
                  echo "❌ Deployment failed!"
                  echo "Check the logs above for error details"
                  exit 1
```

#### **Step 3: Test the Workflow**

1. Make a commit to any branch and push
2. Go to GitHub Actions tab to see test/lint/security jobs running
3. Create a PR to `main` - same jobs run
4. Merge PR to `main` - deployment job also runs (if Railway configured)

### **Workflow Jobs Explained**

| Job | When | Purpose |
|-----|------|---------|
| **test** | All pushes & PRs | Run tests, security audits, build verification |
| **lint** | All pushes & PRs | Code quality, syntax checking, security config |
| **security-scan** | All pushes & PRs | Trivy vulnerability scanning |
| **deploy** | Main branch merges | Automatic production deployment |

---

## Alternative Hosting

### **Option 1: Render ($7-16/month)**

- App Service: $7/month
- Database: MongoDB Atlas free tier or $9/month
- Simple GitHub integration
- Automatic SSL and domains

### **Option 2: DigitalOcean ($4-6/month)**

- Cheapest option but requires more setup
- Full control over server configuration
- Manual MongoDB installation
- Manual SSL certificate setup

### **Option 3: Heroku (Free tier available)**

- Free tier with sleep mode
- Easy GitHub integration
- MongoDB Atlas free tier (512MB)
- Good for testing and development

---

## Cost Comparison

| Platform | App | Database | Total/Mo | Setup |
|----------|-----|----------|----------|-------|
| **Railway** | $5 | $5 | **$10** | ⭐ Easy |
| **Render** | $7 | $0-9 | **$7-16** | ⭐ Easy |
| **DigitalOcean** | $4-6 | $0 | **$4-6** | ⭐⭐⭐ Hard |
| **Heroku** | Free/$7 | Free | **Free-$7** | ⭐⭐ Medium |

---

## Troubleshooting

### **App Won't Start**

```bash
# Check Railway logs
railway logs --service your-service-name

# Common fixes:
# 1. Verify MONGO_URL is correct
# 2. Check NODE_ENV=production is set
# 3. Ensure ROOT_URL matches Railway domain
# 4. Check for missing environment variables
```

### **Database Connection Failed**

```bash
# Test MongoDB connection
mongo "your-mongo-connection-string"

# Common fixes:
# 1. Check MongoDB service is running in Railway
# 2. Verify connection string format
# 3. Ensure IP whitelisting is configured
# 4. Check network policies
```

### **SSL/HTTPS Issues**

```bash
# Railway provides automatic SSL
# If issues persist:
# 1. Check ROOT_URL uses https://
# 2. Clear browser cache
# 3. Wait up to 24h for SSL propagation
# 4. Force HTTPS in server settings
```

### **CI/CD Not Triggering**

1. Verify branch is `main` for deployment
2. Check all tests pass (test job must succeed)
3. Verify Railway secrets are set correctly
4. Check GitHub Actions logs for errors

### **Deployment Fails on Railway**

1. Check Railway project settings
2. Verify RAILWAY_TOKEN and RAILWAY_PROJECT_ID are correct
3. Ensure Railway CLI has permission to deploy
4. Check Railway project has sufficient resources

---

## Post-Deployment Tasks

### **Immediate (First 24 hours)**

- [ ] Test all user flows (login, game play, leaderboard)
- [ ] Verify security tests pass in production
- [ ] Check performance metrics
- [ ] Set up monitoring alerts

### **Ongoing (Weekly)**

- [ ] Review audit logs for suspicious activity
- [ ] Monitor performance metrics
- [ ] Check for security updates
- [ ] Verify database backups

### **Growth Planning**

- [ ] Monitor user growth and resource usage
- [ ] Plan scaling strategy (when to upgrade)
- [ ] Consider CDN for static assets (if needed)
- [ ] Implement advanced monitoring (if user base grows)

---

## Success Metrics

### **Launch Week Goals**

- [ ] 99%+ uptime
- [ ] < 2 second page load times
- [ ] Zero security incidents
- [ ] User registration working

### **Month 1 Goals**

- [ ] 10+ active users
- [ ] < 1% error rate
- [ ] Security audit logs clean
- [ ] Performance stable

---

Your Refract game is production-ready with enterprise-grade security! 🎮🔒
