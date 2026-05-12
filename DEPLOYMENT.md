# Production Deployment Guide

## 🎯 Overview

This guide covers deploying the Tzu Chi Malawi Office System to production using Vercel (recommended), Heroku, or Docker.

## ✅ Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backup created
- [ ] Tests passed locally
- [ ] Build successful (`npm run build`)
- [ ] No console errors or warnings
- [ ] Security review completed
- [ ] SSL certificate configured
- [ ] Domain name purchased/configured
- [ ] Backup and disaster recovery plan in place

## 🚀 Option 1: Vercel (Recommended - Easiest)

### Advantages
- Zero-configuration deployment
- Automatic HTTPS
- Global CDN
- Unlimited deployments
- Easy rollbacks
- Free tier available

### Steps

1. **Connect GitHub Repository**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository
   - Vercel will auto-detect Next.js framework

2. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from `.env.example`:
   
   ```
   DATABASE_URL=postgresql://user:password@host/db
   NEXTAUTH_SECRET=(generate: openssl rand -base64 32)
   NEXTAUTH_URL=https://yourdomain.com
   JWT_SECRET=(generate random string)
   NODE_ENV=production
   ```

3. **Configure Database**
   - Use a managed PostgreSQL service:
     - **Supabase** (recommended for Next.js)
     - **Railway**
     - **Vercel Postgres** (in beta)
     - **AWS RDS**
   - Get connection string and set DATABASE_URL

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys
   - Get your production URL

5. **Run Database Migrations**
   ```bash
   # After first deployment
   vercel env pull
   npx prisma migrate deploy
   ```

### Custom Domain Setup
1. In Vercel dashboard: Settings → Domains
2. Add your custom domain
3. Update DNS records (follow Vercel's instructions)
4. Wait for SSL certificate (usually ~10 minutes)

### Monitoring
- Vercel Analytics: built-in monitoring
- Edge function logs: available in dashboard
- Database logs: check through Supabase/database provider

## 🐘 Option 2: Heroku

### Advantages
- Simple deployment from Git
- PostgreSQL add-on available
- Good for smaller applications
- Affordable pricing

### Limitations
- Apps sleep after 30 minutes of inactivity (free tier)
- Limited compute compared to Vercel
- Slower cold starts

### Steps

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL Database**
   ```bash
   heroku addons:create heroku-postgresql:standard-0
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NEXTAUTH_SECRET="your-secret"
   heroku config:set JWT_SECRET="your-secret"
   heroku config:set NODE_ENV="production"
   heroku config:set NEXTAUTH_URL="https://your-app-name.herokuapp.com"
   
   # Database URL will be set automatically
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Run Migrations**
   ```bash
   heroku run npx prisma migrate deploy
   ```

7. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Scaling on Heroku
```bash
# Upgrade dyno type
heroku dyno:type standard-1x

# Multiple dynos
heroku ps:scale web=2
```

## 🐳 Option 3: Docker Deployment

### Advantages
- Full control over infrastructure
- Can run anywhere (AWS, GCP, Azure)
- Reproducible deployments
- Better for microservices

### Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
```

### Build and Run
```bash
# Build image
docker build -t tzu-chi-malawi .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e JWT_SECRET="your-secret" \
  tzu-chi-malawi

# For production, use Docker Compose
docker-compose up -d
```

### Deploy to AWS ECS
```bash
# Push to ECR
docker tag tzu-chi-malawi:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/tzu-chi:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/tzu-chi:latest

# Create ECS service
# (Use AWS Console or CLI)
```

## 🗄 Database Setup

### Using Supabase (Recommended for Vercel)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Project Settings
4. Set DATABASE_URL in Vercel

```bash
# Connection string format:
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

### Using AWS RDS

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Get endpoint and credentials
4. Create connection string:

```
postgresql://user:password@endpoint:5432/dbname
```

### Local PostgreSQL (Development)

```bash
# Install PostgreSQL
# Create database
createdb tzu_chi_malawi

# Connection string
postgresql://username:password@localhost:5432/tzu_chi_malawi
```

## 🔒 Production Security

### Essential Steps

1. **Use HTTPS Only**
   ```bash
   # Vercel/Heroku handles automatically
   ```

2. **Set Strong Secrets**
   ```bash
   # Generate 32-character random strings
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict access by IP
   - Regular backups

4. **Application Security**
   - Keep dependencies updated: `npm audit`
   - Enable rate limiting (future feature)
   - Implement CORS properly
   - Validate all inputs

5. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor performance (New Relic)
   - Track uptime (UptimeRobot)
   - Log aggregation (CloudWatch, Stackdriver)

### Setting Up Monitoring with Sentry

```bash
npm install @sentry/nextjs

# Update next.config.js
# Configure .env.local with SENTRY_AUTH_TOKEN
```

## 📦 Backup Strategy

### Daily Automated Backups

**Supabase**
```bash
# Automated backups included
# Download from dashboard
```

**AWS RDS**
```bash
# Enable automated backups
# Retention period: 30 days
```

**Manual Backup Script**
```bash
#!/bin/bash
BACKUP_DIR="/backups"
DB_URL="postgresql://..."
pg_dump "$DB_URL" > "$BACKUP_DIR/backup-$(date +%Y%m%d).sql"

# Store in S3
aws s3 cp "$BACKUP_DIR/" s3://your-bucket/backups/
```

## 🔄 CI/CD Pipeline

The included GitHub Actions workflow:
- Runs ESLint on every push
- Builds application
- Auto-deploys to Vercel on `main` branch push

### Custom Deployment Triggers

```yaml
# In .github/workflows/deploy.yml
on:
  push:
    branches: [main, production]
  pull_request:
    branches: [main]
```

## 📊 Performance Optimization

### Database Optimization
```prisma
// Add indexes for frequent queries
model DailyReport {
  // ...
  @@index([userId, date])
  @@index([status])
}
```

### CDN and Caching
```javascript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600'
        }
      ]
    }
  ]
}
```

### Image Optimization
- Use Next.js Image component
- Optimize images before upload
- Enable WebP format

## 🆘 Troubleshooting

### 502 Bad Gateway
- Check application logs
- Verify database connection
- Restart application

### Slow Performance
- Check database queries
- Enable query caching
- Scale application

### Out of Memory
- Increase dyno size (Heroku)
- Limit request size
- Optimize database queries

## 🧪 Post-Deployment Testing

```bash
# Test login page
curl https://yourdomain.com/login

# Test API
curl -X POST https://yourdomain.com/api/auth/login

# Monitor uptime
# Configure UptimeRobot or similar service
```

## 📞 Support Resources

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Heroku**: [devcenter.heroku.com](https://devcenter.heroku.com)
- **Prisma**: [prisma.io/docs](https://prisma.io/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

## ✨ Great! You're Live

Once deployed:
- Monitor application regularly
- Keep dependencies updated
- Review security monthly
- Backup data daily
- Plan for scaling

---

**Last Updated**: April 7, 2026  
**Version**: 1.0.0
