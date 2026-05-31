VERCEL Deployment Steps

1. Create or select your project on Vercel (https://vercel.com)
2. In the project dashboard, open Settings → Environment Variables
3. Add the following variables (use exact names):

- DATABASE_URL: your production database connection string
- NEXTAUTH_SECRET: random long secret (if using NextAuth)
- NEXTAUTH_URL: https://your-site.vercel.app

Optional (only if used by your app):
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- CLERK_FRONTEND_API
- CLERK_API_KEY
- S3_BUCKET_NAME
- S3_REGION
- S3_ACCESS_KEY_ID
- S3_SECRET_ACCESS_KEY

Set the Environment to the appropriate scope: Preview and Production (at minimum set Production).

4. Link your GitHub repository to Vercel (if not already linked). Vercel will build on each push.

5. Build & Output Settings (defaults are fine):
- Framework Preset: Next.js
- Build Command: npm run build
- Install Command: npm install

6. Manual deploy via Vercel CLI (optional):
```bash
npm i -g vercel
vercel login
vercel link    # link project to current folder
vercel --prod  # deploy production
```

7. After deployment, verify runtime logs and environment variables in Vercel dashboard.

Notes
- Ensure `DATABASE_URL` is reachable from Vercel. If using managed DB with IP restrictions, allow Vercel IP ranges or use a private network connector.
- If you use file uploads, ensure storage credentials are set and accessible at runtime.
- If using NextAuth, set `NEXTAUTH_URL` to your Vercel domain.

If you want, I can:
- Create a GitHub Actions or Vercel CLI script to automate deploys.
- Prepare a `secrets.json` template (local-only) to help you populate Vercel's UI.
