# Railway Deployment Action Plan

## Executive Summary

This document provides a clear, actionable plan to deploy your Google Sheets REST API backend to Railway. All preparation work has been completed, and you now have everything needed to execute the deployment.

## Prerequisites Checklist

Before starting the deployment, ensure you have:

- [x] Access to Railway.app account
- [x] Access to GitHub account with repository permissions
- [x] All code pushed to GitHub (https://github.com/osama-dev255/google-sheets-rest-api)
- [x] Google Cloud project with Sheets API enabled
- [x] Service account with access to your spreadsheet
- [x] All required documentation and credentials ready

## Action Steps

### Step 1: Deploy to Railway (10-15 minutes)

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `osama-dev255/google-sheets-rest-api`
5. Wait for Railway to automatically detect the Dockerfile and start building

### Step 2: Configure Environment Variables (5 minutes)

Once Railway creates your project:

1. Click on your project in the Railway dashboard
2. Click on your service
3. Go to the "Variables" tab
4. Add all environment variables from the list below:

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

### Step 3: Monitor Deployment (5 minutes)

1. Watch the deployment logs in Railway dashboard
2. Wait for the build to complete successfully (look for "Deployed successfully" message)
3. Note the URL assigned to your Railway app (will be in format `your-app-name.railway.app`)

### Step 4: Verify Backend Deployment (5 minutes)

Test these endpoints using your browser or curl:

1. Health check: `https://YOUR_RAILWAY_APP.railway.app/health`
2. Sheet1 data: `https://YOUR_RAILWAY_APP.railway.app/api/v1/sheets/Sheet1`

### Step 5: Update Frontend Configuration (5 minutes)

1. Go to Netlify dashboard
2. For each frontend site:
   - Go to "Site settings" > "Environment variables"
   - Add/update `VITE_BACKEND_URL` to `https://YOUR_RAILWAY_APP.railway.app`
   - Trigger a new deployment

### Step 6: Test Authentication (5 minutes)

1. Visit your Netlify sites
2. Try logging in with users from your Sheet1
3. Test all user roles (admin, accountant, sales, finance)

## Expected Results

After completing all steps:

✅ Backend deployed at `https://YOUR_RAILWAY_APP.railway.app`
✅ Health endpoint returns server status
✅ Sheet1 endpoint returns user data
✅ Both Netlify sites work with same credentials
✅ All user roles function correctly

## Troubleshooting

If you encounter issues:

1. **Deployment fails**: Check Railway build logs for specific error messages
2. **Authentication fails**: Verify Google Sheet sharing and credentials
3. **Frontend can't connect**: Confirm `VITE_BACKEND_URL` is set correctly in Netlify

## Completion

Once all steps are completed successfully, create the [RAILWAY_DEPLOYMENT_COMPLETE.md](file:///c%3A/Users/osama/Railway-Netlify%20Apps/Cloudhost/Railway%20Cloud%20hostV4/RAILWAY_DEPLOYMENT_COMPLETE.md) file to mark this phase as complete.

## Support Resources

- [RAILWAY_DEPLOYMENT_INSTRUCTIONS.md](file:///c%3A/Users/osama/Railway-Netlify%20Apps/Cloudhost/Railway%20Cloud%20hostV4/RAILWAY_DEPLOYMENT_INSTRUCTIONS.md) - Detailed deployment guide
- [verify_railway_deployment.js](file:///c%3A/Users/osama/Railway-Netlify%20Apps/Cloudhost/Railway%20Cloud%20hostV4/verify_railway_deployment.js) - Automated verification script
- [AUTHENTICATION_TROUBLESHOOTING_GUIDE.md](file:///c%3A/Users/osama/Railway-Netlify%20Apps/Cloudhost/Railway%20Cloud%20hostV4/AUTHENTICATION_TROUBLESHOOTING_GUIDE.md) - Authentication issue solutions