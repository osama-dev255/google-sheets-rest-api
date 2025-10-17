# Railway Deployment Checklist

## Pre-deployment Preparation
- [x] Backend code pushed to GitHub
- [x] Frontend code updated with new roles
- [x] Repository connected to GitHub
- [x] Documentation created
- [x] Verification tools ready

## Railway Deployment Steps

### 1. Connect Railway to GitHub
- [ ] Sign in to Railway.app
- [ ] Create new project from GitHub repository
- [ ] Select `osama-dev255/google-sheets-rest-api`
- [ ] Confirm Railway detects Dockerfile

### 2. Configure Environment Variables
- [ ] Add `NODE_ENV=production`
- [ ] Add `PORT=3000`
- [ ] Add `GOOGLE_SHEETS_PROJECT_ID=pos-backend-469501`
- [ ] Add `GOOGLE_SHEETS_CLIENT_EMAIL=railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com`
- [ ] Add `GOOGLE_SHEETS_PRIVATE_KEY` (full key with \n characters)
- [ ] Add `GOOGLE_SHEETS_SPREADSHEET_ID=1jPey3a2tra70WGQmx96jywaq0lFA7WjAhCvQsfnSTv0`
- [ ] Add `CORS_ORIGIN=*`
- [ ] Add `RATE_LIMIT_WINDOW_MS=900000`
- [ ] Add `RATE_LIMIT_MAX_REQUESTS=100`

### 3. Monitor Deployment
- [ ] Watch build logs in Railway dashboard
- [ ] Confirm successful build completion
- [ ] Note assigned Railway app URL

### 4. Verify Deployment
- [ ] Test health endpoint
- [ ] Test Sheet1 endpoint
- [ ] Run verification script

### 5. Update Frontend Configuration
- [ ] Set `VITE_BACKEND_URL` in Netlify environments
- [ ] Trigger frontend redeployments

### 6. Test Authentication
- [ ] Login with Sheet1 users
- [ ] Test all user roles
- [ ] Verify consistent behavior across Netlify deployments

## Post-Deployment
- [ ] Create [RAILWAY_DEPLOYMENT_COMPLETE.md](file:///c%3A/Users/osama/Railway-Netlify%20Apps/Cloudhost/Railway%20Cloud%20hostV4/RAILWAY_DEPLOYMENT_COMPLETE.md) file
- [ ] Document any issues encountered
- [ ] Update team with deployment details

## Troubleshooting Quick Reference
If deployment fails:
1. Check build logs for specific error messages
2. Verify all environment variables are correctly set
3. Confirm Dockerfile is correct
4. Ensure all required files are in GitHub repository

If authentication fails:
1. Verify Google Sheet is shared with service account
2. Check spreadsheet ID is correct
3. Confirm private key formatting
4. Ensure Google Sheets API is enabled