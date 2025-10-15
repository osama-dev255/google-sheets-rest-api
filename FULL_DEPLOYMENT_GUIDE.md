# Full Deployment Guide: Frontend and Backend

## Overview

This guide provides complete instructions for deploying both the frontend and backend components of the Google Sheets Dashboard application. The backend will be deployed to Railway, and the frontend can be deployed to either Netlify or Railway.

## Architecture

```
┌─────────────────┐    API Calls    ┌──────────────────┐
│   Frontend      ├─────────────────┤    Backend       │
│   (Netlify or   │                 │   (Railway)      │
│    Railway)     │◀────────────────┤                  │
└─────────────────┘   WebSocket     └──────────────────┘
       │                                    │
       │                                    │
       ▼                                    ▼
  ┌──────────┐                      ┌───────────────┐
  │   User   │                      │ Google Sheets │
  │ Browser  │                      │   API         │
  └──────────┘                      └───────────────┘
```

## Prerequisites

Before deployment, ensure you have:

1. **Accounts**:
   - GitHub account
   - Railway account
   - Netlify account (optional, if deploying frontend to Netlify)

2. **Google Cloud Setup**:
   - Google Cloud Project with Google Sheets API enabled
   - Service Account with Editor permissions
   - Private key JSON file
   - Google Sheet shared with the service account

3. **Repository**:
   - This repository pushed to GitHub

## Step 1: Backend Deployment (Railway)

### 1.1 Prepare Google Cloud Credentials

Follow the instructions in [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md) to set up:
- Google Cloud Project
- Google Sheets API
- Service Account
- Private Key
- Shared Google Sheet

### 1.2 Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect the Dockerfile and build the backend

### 1.3 Configure Backend Environment Variables

In the Railway dashboard, add these environment variables:

```
NODE_ENV=production
PORT=3000
GOOGLE_SHEETS_PROJECT_ID=your-google-cloud-project-id
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account-email
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 1.4 Verify Backend Deployment

After deployment, test these endpoints:

```bash
# Replace YOUR_BACKEND_URL with your actual Railway app URL

# Health check
curl https://YOUR_BACKEND_URL.railway.app/health

# API information
curl https://YOUR_BACKEND_URL.railway.app/

# Spreadsheet metadata
curl https://YOUR_BACKEND_URL.railway.app/api/v1/sheets/metadata
```

Note the backend URL as you'll need it for frontend configuration.

## Step 2: Frontend Deployment

You can deploy the frontend to either Netlify (recommended) or Railway.

### Option A: Deploy Frontend to Netlify (Recommended)

#### 2.1 Connect to Netlify
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider and select this repository

#### 2.2 Configure Build Settings
- Build command: `npm run build`
- Publish directory: `dist`
- Base directory: `frontend`

#### 2.3 Set Environment Variables
In Netlify site settings, add this environment variable:
- Key: `VITE_BACKEND_URL`
- Value: `https://YOUR_BACKEND_URL.railway.app` (use your actual backend URL)

#### 2.4 Deploy
Netlify will automatically build and deploy your site.

### Option B: Deploy Frontend to Railway

#### 2.1 Connect to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

#### 2.2 Configure Build Settings
Configure these settings in Railway:
- Build command: `npm run build`
- Start command: `npm start`
- Root directory: `/frontend`

#### 2.3 Deploy
Railway will automatically build and deploy your frontend application.

## Step 3: Verify Full Deployment

### 3.1 Test Frontend
1. Visit your deployed frontend URL
2. Ensure the site loads correctly
3. Test navigation between pages
4. Verify that the dashboard displays data

### 3.2 Test API Integration
1. Try viewing sheet data in the dashboard
2. Attempt to add a purchase order
3. Verify that data is correctly written to Google Sheets

### 3.3 Test All Functionality
1. Authentication (if implemented)
2. Purchase order creation
3. Inventory updates
4. Reporting features

## Monitoring and Maintenance

### Backend Monitoring
- Monitor Railway logs for errors
- Set up uptime monitoring
- Regular security updates

### Frontend Monitoring
- Monitor deployment platform logs
- Set up error tracking (e.g., Sentry)
- Performance monitoring

### Google Sheets
- Regular backups of your spreadsheet
- Monitor API usage limits
- Verify sharing permissions

## Troubleshooting

### Common Issues

1. **Frontend Not Loading**
   - Check that `VITE_BACKEND_URL` is correctly set
   - Verify the backend is running and accessible
   - Check browser console for errors

2. **API Connection Failures**
   - Ensure CORS is properly configured on the backend
   - Verify the backend URL is correct
   - Check that the backend environment variables are set correctly

3. **Data Not Appearing**
   - Verify Google Sheets sharing permissions
   - Check that the spreadsheet ID is correct
   - Confirm service account has Editor access

4. **Authentication Issues**
   - Verify authentication configuration
   - Check user credentials
   - Review authentication provider settings

### Getting Help

If you encounter issues:
1. Check deployment platform logs for detailed error messages
2. Verify all configuration steps have been completed
3. Test locally with the same environment variables
4. Refer to specific deployment guides:
   - [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md)
   - [frontend/FRONTEND_DEPLOYMENT.md](frontend/FRONTEND_DEPLOYMENT.md)

## Next Steps

Once deployed successfully:
1. Share URLs with team members
2. Set up monitoring and alerting
3. Configure custom domains (optional)
4. Review security settings
5. Plan for scaling as needed

## Support

For deployment issues, contact the development team or refer to:
- [Railway Documentation](https://docs.railway.app/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Google Cloud Documentation](https://cloud.google.com/docs)