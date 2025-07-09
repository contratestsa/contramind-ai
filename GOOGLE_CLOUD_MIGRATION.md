# Google Cloud Migration Guide for ContramindAI

This guide will help you migrate your ContramindAI platform from Replit to Google Cloud.

## Overview

Your migration involves three main components:
1. **GitHub Integration** - Already set up as your central code repository
2. **Google Cloud Run** - For hosting your Express.js application
3. **Cloud SQL** - For your PostgreSQL database

## Prerequisites

Before starting, you'll need:
- A Google Cloud account
- Google Cloud CLI installed on your local machine
- Your GitHub repository connected to Replit

## Step 1: Export Your Current Database

First, export your existing database from Replit:

```bash
# In your Replit console, run:
pg_dump $DATABASE_URL > contramind_backup.sql
```

Download this file to your local machine - you'll need it later.

## Step 2: Set Up Google Cloud Project

1. **Create a new Google Cloud project:**
   ```bash
   gcloud projects create contramind-ai
   gcloud config set project contramind-ai
   ```

2. **Enable required services:**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable sqladmin.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

## Step 3: Create Cloud SQL PostgreSQL Instance

1. **Create the database instance:**
   ```bash
   gcloud sql instances create contramind-db \
     --database-version=POSTGRES_15 \
     --tier=db-g1-small \
     --region=us-central1
   ```

2. **Create your database:**
   ```bash
   gcloud sql databases create contramind \
     --instance=contramind-db
   ```

3. **Set the database password:**
   ```bash
   gcloud sql users set-password postgres \
     --instance=contramind-db \
     --password=YOUR_SECURE_PASSWORD
   ```

## Step 4: Import Your Database

1. **Upload your backup to Cloud Storage:**
   ```bash
   # Create a bucket
   gsutil mb gs://contramind-backups
   
   # Upload your backup
   gsutil cp contramind_backup.sql gs://contramind-backups/
   ```

2. **Import to Cloud SQL:**
   ```bash
   gcloud sql import sql contramind-db \
     gs://contramind-backups/contramind_backup.sql \
     --database=contramind
   ```

## Step 5: Update Your Application Configuration

Create a new file `.env.gcp` for Google Cloud environment variables:

```env
# Database Configuration
DB_HOST=/cloudsql/contramind-ai:us-central1:contramind-db
DB_USER=postgres
DB_PASSWORD=YOUR_SECURE_PASSWORD
DB_NAME=contramind

# Application Settings
NODE_ENV=production
PORT=8080

# Your existing secrets (copy from Replit)
RESEND_API_KEY=your-resend-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=ebe21e1e-5db3-460d-9b22-417687ce8a87
MICROSOFT_CLIENT_SECRET=your-microsoft-secret
SESSION_SECRET=your-session-secret
```

## Step 6: Build and Deploy Your Application

1. **Build your Docker image:**
   ```bash
   # From your project root
   gcloud builds submit --tag gcr.io/contramind-ai/contramind-app
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy contramind \
     --image gcr.io/contramind-ai/contramind-app \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --add-cloudsql-instances contramind-ai:us-central1:contramind-db \
     --env-vars-file .env.gcp \
     --max-instances 10 \
     --min-instances 1
   ```

## Step 7: Update OAuth Redirect URLs

After deployment, update your OAuth providers with the new Cloud Run URL:

1. **Google OAuth Console:**
   - Add: `https://contramind-xxxxx-uc.a.run.app/api/auth/google/callback`

2. **Microsoft Azure Portal:**
   - Add: `https://contramind-xxxxx-uc.a.run.app/api/auth/microsoft/callback`

(Replace `xxxxx` with your actual Cloud Run service URL)

## Step 8: Set Up Custom Domain (Optional)

To use your own domain:

```bash
gcloud run domain-mappings create \
  --service contramind \
  --domain contramind.ai \
  --region us-central1
```

## Step 9: Configure Automatic Deployments from GitHub

1. **Set up Cloud Build trigger:**
   ```bash
   gcloud beta builds triggers create github \
     --repo-name=contramindPoC \
     --repo-owner=contramindai \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

2. **Create `cloudbuild.yaml` in your repository:**
   ```yaml
   steps:
   - name: 'gcr.io/cloud-builders/docker'
     args: ['build', '-t', 'gcr.io/$PROJECT_ID/contramind-app', '.']
   - name: 'gcr.io/cloud-builders/docker'
     args: ['push', 'gcr.io/$PROJECT_ID/contramind-app']
   - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
     entrypoint: gcloud
     args:
     - 'run'
     - 'deploy'
     - 'contramind'
     - '--image'
     - 'gcr.io/$PROJECT_ID/contramind-app'
     - '--region'
     - 'us-central1'
   ```

## Cost Estimation

Monthly costs (approximate):
- **Cloud Run**: $0-50 (depends on traffic, generous free tier)
- **Cloud SQL (db-g1-small)**: ~$25/month
- **Cloud Storage**: < $1 for backups
- **Total**: ~$30-80/month

## Monitoring Your Application

View logs and metrics:
```bash
# Application logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Database logs
gcloud logging read "resource.type=cloudsql_database" --limit 50

# View metrics in Cloud Console
gcloud app browse
```

## Rollback Plan

If you need to rollback:
1. Your code remains in GitHub
2. Database backups are in Cloud Storage
3. Replit workspace remains available
4. Cloud Run keeps previous versions for quick rollback

## Support

For issues:
1. Check Cloud Run logs for application errors
2. Verify Cloud SQL connectivity
3. Ensure all environment variables are set correctly
4. Check that OAuth redirect URLs are updated

Remember: Your GitHub repository remains the source of truth throughout this migration!