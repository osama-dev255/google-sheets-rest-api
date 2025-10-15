# Frontend Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Google Sheets Dashboard frontend to Netlify or Railway.

## Prerequisites

1. A Netlify or Railway account
2. This repository pushed to a Git provider (GitHub, GitLab, or Bitbucket)
3. The backend API deployed (see BACKEND_DEPLOYMENT.md)

## Deployment Options

You can deploy the frontend to either Netlify or Railway. Both options are described below.

## Option 1: Deploy to Netlify (Recommended)

### 1.1 Connect to Netlify
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider and select this repository

### 1.2 Configure Build Settings
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
  - Key: `VITE_BACKEND_URL`
  - Value: `https://your-backend-url.railway.app` (your deployed backend URL)

### 1.3 Deploy
Netlify will automatically build and deploy your site. The deployment will be available at a Netlify URL.

## Option 2: Deploy to Railway

### 2.1 Connect to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2.2 Configure Build Settings
Railway should automatically detect that this is a Vite project. Verify the following settings:
- Build command: `npm run build`
- Start command: `npm start`
- Root directory: `/frontend`

### 2.3 Environment Variables
No specific environment variables are required for the frontend, but make sure the backend URL is correctly configured in the source code.

### 2.4 Deploy
Railway will automatically build and deploy your application.

## Environment Configuration

The application uses the following environment variable:

- `VITE_BACKEND_URL`: The base URL for the backend API
  - Default: `https://google-sheets-rest-api-production.up.railway.app`

## Manual Deployment

If you prefer to deploy manually:

### 1. Build the Project
```bash
npm run build
```

### 2. Deploy
Upload the contents of the `dist` directory to your hosting provider. Ensure your hosting provider is configured to serve `index.html` for all routes (SPA routing).

## Troubleshooting

### Common Issues

1. **Blank Page After Deployment**
   - Ensure the `homepage` field in `package.json` is set correctly
   - Check that the publish directory is set to `dist`
   - Verify that redirects are configured correctly in `netlify.toml`

2. **API Connection Issues**
   - Confirm that `VITE_BACKEND_URL` is set correctly
   - Check that the backend API is accessible
   - Verify CORS settings on the backend

3. **Build Failures**
   - Ensure Node.js version 16 or higher is used
   - Check that all dependencies are installed correctly
   - Review the build logs for specific error messages

### Testing Deployment

After deployment, verify that:
1. The site loads correctly
2. All navigation works (including direct URLs to pages)
3. API calls are successful
4. Authentication works as expected
5. All UI components render properly

## Post-Deployment

### Monitoring
- Set up monitoring for your deployed site
- Monitor backend API health using the health check endpoint
- Set up error tracking if needed

### Updates
- Push to the main branch to automatically trigger a new deployment
- Rollback to previous deployments is available in the deployment platform dashboard

## Support

For deployment issues, contact the development team or refer to:
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Railway Documentation](https://docs.railway.app/)