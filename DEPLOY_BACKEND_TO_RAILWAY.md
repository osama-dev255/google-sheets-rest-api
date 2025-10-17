# Deploy Backend to Railway - Step-by-Step Guide

## Overview

This guide will help you deploy the Google Sheets REST API backend to Railway. Based on the documentation, your backend is already configured and ready for deployment.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: For repository integration
3. **Google Cloud Project**: With Google Sheets API enabled
4. **Service Account**: With access to your Google Sheet

## Step 1: Verify Your Configuration

Based on the documentation, your backend is already configured with:

- **Project ID**: `pos-backend-469501`
- **Service Account Email**: `railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com`
- **Spreadsheet ID**: `1jPey3a2tra70WGQmx96jywaq0lFA7WjAhCvQsfnSTv0`
- **Private Key**: Already formatted correctly

## Step 2: Deploy to Railway Using GitHub Integration

### 2.1 Push Code to GitHub (if not already done)

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Production ready: Complete Google Sheets API"

# Add remote and push (replace with your repository URL)
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### 2.2 Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect the Dockerfile and start building

## Step 3: Configure Environment Variables

After the project is created in Railway, configure these environment variables:

### 3.1 Access Environment Variables Section

1. In Railway dashboard, click on your project
2. Click on your service
3. Go to the "Variables" tab

### 3.2 Set Required Environment Variables

Add these exact values to Railway's Variables section:

```
NODE_ENV=production
PORT=3000
GOOGLE_SHEETS_PROJECT_ID=pos-backend-469501
GOOGLE_SHEETS_CLIENT_EMAIL=railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDUA0rIHeJsemIe
plJ6fzjLOaNQpOGFVmHyJp1Ffg/6a8QuxTCm7VmzW8lESkwoJvJkVSUqOHfF0cPQ
nWO3lWxWSIDK2vCR2S2aOLYN0798QMJkmO4+G59VDH+a1m8ZFa89hh7ZqAQHlx1Y
5Ng4DT47VXif8cyiNlYq7ci3KeBYVEqHSqvutzfBBm7An+0tOILEKgQ75BOvUyXp
RqVbxki/epJ5klv+YkDnfEmu58/et1Oy3SEMZKbCaTmOpECM0Rn+OS4xENrC8ii4
Jt1qfiKcbzfIYkQ/2lK7XcQK5vr3/OTdo+SAKKsBs5gszyo9+bkjCFXBARbBdgQj
mBwv4ibdAgMBAAECggEAJrwBPiWDmCkV4x6lA/9ZW3vI1DODhm5dT7XxVuBsv+ZP
ffIF7QGBOW0kDOd8GXvgHieWNiwB6fDkkykmLkTM+cieSzGL8UGZ/MqurEELA4L7
YRC1ukAmsI2rhJj3zD/zd8yYt1BkiBR6RqLsw/TbcVCwzJwLNHmz7XzrBlfOxqQu
iweYv9+xsiCbFNGKs4xSPgeVWnaokcMKVb7tk0VCvHJX7RIpabrx4umwQ4XS389t
GGqD81r2U7nOBCH4VP0GEGUOJgB89EHn5NkZpA7zAPic8Kv4cVzLlkxz5aigkaEh
8ONvEh/lCTEAsyRCLYhthZSv/pBSc+KwAAUFUhdl4QKBgQD1DA04qX7qMGyGJcRg
UamxgA9RkQFWleQ/88blhfwr53av7oYKQrp/PNDX+gaDBHmb3iu7R4FMIISthERR
eVJCmkvNAE4KYo6UOTMHD255ZnzK07HLuNYin9qPtsBor7+QE45nUSzyyjFu9y2z
KGeHsE4xaV6utrNIF1Olu/sJLQKBgQDdfT8v03oDvdt9LhIc6vkHoReOtxKGA5nv
bKhrQpaCtP38k2fyKg6Kf0l2ymXRrSHksMrrBrBIXpAGSP+odQPm74zmJOnKqaRI
+XEYc0XRC114Hv4fXQfS3WlvyR+Fi2m3OZjMayjZup+zVd+ckZ5meMM83wJfZlzW
Wi1+IvvCcQKBgQC/6FFOZ8eCJqxHHrq9aBcKcK0Ohw5SPg9EWmkRBa5ov9v+ikGl
NX8S+JDiI+gHoXCPth3vjF9hPDJMJcLPP8FBcc8dXDjB/0+EG4uv4tD0+GORANtE
HZxt/1zOoiPrmH/gmMA0f6lA90JhkejTXzg9VsDWB5xkHacoNUSIDkDafQKBgQCi
bxsq+P3vxoo0qNfxy0VtGfBL4uk7zWJUW6y8VO5K12+5j2VZDQzy91yqOM8pUb6c
mCeI67PWrzsS0PBl28NL1vzPP90Rmw330q/ljYxzPdGDqb8Ww0RcmbKcn7R1XQPf
subja+denmZGwECo84ZmgkQ03RxBWLHXJfVdH0zhkQKBgQDsK1jWfQWkgX1rntez
Z67XXxObTUceBbTLFkn2Ss+CrTPb4+qtTWqSe6RZ3ZfH8hApoWfNSyy7A85Pta4s
SdO5oncm/8aDFuqOrbf0TILbBEtUnNqdFf16UvWy3kVpfkiIGqtDdlCWP659ORgV
Z8nOPXj8bNih+t+mBi1GoRDk2g==
-----END PRIVATE KEY-----

GOOGLE_SHEETS_SPREADSHEET_ID=1jPey3a2tra70WGQmx96jywaq0lFA7WjAhCvQsfnSTv0
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important Notes:**
- The private key must be properly formatted with `\n` characters
- Make sure the spreadsheet is shared with the service account email
- CORS_ORIGIN set to `*` for development (restrict in production)

## Step 4: Verify Deployment

After Railway completes the deployment:

### 4.1 Check Deployment Status

1. In Railway dashboard, check the deployment logs
2. Ensure the build completes successfully
3. Verify the service is running

### 4.2 Test API Endpoints

Test these endpoints using curl or Postman:

```bash
# Health check
curl https://YOUR_RAILWAY_APP_URL.railway.app/health

# Root information
curl https://YOUR_RAILWAY_APP_URL.railway.app/

# Spreadsheet metadata
curl https://YOUR_RAILWAY_APP_URL.railway.app/api/v1/sheets/metadata

# Sheet1 data
curl https://YOUR_RAILWAY_APP_URL.railway.app/api/v1/sheets/Sheet1
```

Replace `YOUR_RAILWAY_APP_URL` with your actual Railway app URL.

## Step 5: Troubleshooting Common Issues

### 5.1 "Failed to fetch spreadsheet metadata" Error

**Solution:**
1. Verify the spreadsheet is shared with the service account email
2. Check that the spreadsheet ID is correct
3. Confirm Google Sheets API is enabled in your Google Cloud project

### 5.2 "Invalid private key" Error

**Solution:**
1. Ensure the private key is properly formatted with `\n` characters
2. Check that you're using the correct service account email
3. Verify the private key hasn't been modified or truncated

### 5.3 "Permission denied" Error

**Solution:**
1. Make sure the service account has "Editor" permissions on the spreadsheet
2. Check that the sharing settings are correct

### 5.4 Build Failures

**Solution:**
1. Check that all required files are committed to GitHub
2. Verify the Dockerfile is correct
3. Check Railway build logs for detailed error messages

## Step 6: Connect Frontend to Backend

Once the backend is deployed successfully:

### 6.1 Update Frontend Environment Variables

In your Netlify deployments, ensure the environment variable is set:

```
VITE_BACKEND_URL=https://YOUR_RAILWAY_APP_URL.railway.app
```

### 6.2 Redeploy Frontend

Trigger a new deployment for your frontend to use the updated environment variables.

## Expected Results

After successful deployment:

1. **Backend**: Accessible at `https://YOUR_RAILWAY_APP_URL.railway.app`
2. **Health Check**: Returns server status and uptime information
3. **API Endpoints**: Return actual Google Sheets data
4. **Frontend**: Can authenticate users from Sheet1

## Support

If you encounter issues during deployment:

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