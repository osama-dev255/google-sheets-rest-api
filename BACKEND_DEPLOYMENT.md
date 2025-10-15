# Backend Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Google Sheets REST API backend to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. A GitHub account
3. Google Cloud Project with Google Sheets API enabled
4. Service Account credentials with access to your Google Sheet

## Step 1: Prepare Your Google Cloud Credentials

### 1.1 Create Google Cloud Project
If you haven't already, create a Google Cloud Project:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note the Project ID

### 1.2 Enable Google Sheets API
1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on "Google Sheets API" and then click "Enable"

### 1.3 Create Service Account
1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name (e.g., "sheets-api-service")
4. Grant it the "Editor" role
5. Click "Done"

### 1.4 Generate Private Key
1. Click on your service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Click "Create" and download the JSON file

## Step 2: Prepare Your Google Sheet

### 2.1 Get Your Spreadsheet ID
From your Google Sheets URL:
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

### 2.2 Share Your Spreadsheet
1. Open your Google Spreadsheet
2. Click "Share"
3. Add your service account email (from the JSON file)
4. Grant "Editor" permissions

## Step 3: Deploy to Railway

### 3.1 Connect GitHub Repository
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 3.2 Configure Environment Variables
In the Railway dashboard, go to your project and add these environment variables:

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

**Important**: The private key must be properly formatted with `\n` characters instead of actual line breaks.

### 3.3 Deploy
Railway will automatically:
1. Detect your Dockerfile
2. Build the container
3. Deploy your app
4. Provide a public URL

## Step 4: Verify Deployment

After deployment, test these endpoints:

```bash
# Replace YOUR_RAILWAY_URL with your actual Railway app URL

# Health check
curl https://YOUR_RAILWAY_URL.railway.app/health

# API information
curl https://YOUR_RAILWAY_URL.railway.app/

# Spreadsheet metadata
curl https://YOUR_RAILWAY_URL.railway.app/api/v1/sheets/metadata

# Sheet data
curl https://YOUR_RAILWAY_URL.railway.app/api/v1/sheets/Sheet1
```

## Troubleshooting

### Common Issues

1. **"Failed to fetch spreadsheet metadata"**
   - Check that your service account has access to the spreadsheet
   - Verify the spreadsheet ID is correct

2. **"Invalid private key"**
   - Ensure the private key is properly formatted with `\n` characters
   - Check that you're using the correct service account email

3. **"Permission denied"**
   - Make sure the service account has "Editor" permissions on the spreadsheet

4. **Build failures**
   - Check that all required files are committed to GitHub
   - Verify the Dockerfile is correct

### Getting Help

If you encounter issues:
1. Check Railway build logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test locally with real credentials first
4. Check Google Cloud billing (API calls require billing to be enabled)

## Next Steps

Once deployed successfully:
1. Share your API URL with team members
2. Start building applications that use your API
3. Set up monitoring for your Railway app
4. Review rate limiting requirements for your use case