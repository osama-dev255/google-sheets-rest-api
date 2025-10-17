# Railway Deployment Instructions

## Step-by-Step Guide to Deploy Your Backend to Railway

### 1. Connect Railway to Your GitHub Repository

1. Go to [railway.app](https://railway.app) and sign in or create an account
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Grant Railway access to your GitHub repositories if prompted
5. Select the repository: `osama-dev255/google-sheets-rest-api`
6. Railway will automatically detect the [Dockerfile](file:///c%3A/Users/osama/Railway-Netlify%20Apps/Cloudhost/Railway%20Cloud%20hostV4/Dockerfile) and start building

### 2. Configure Environment Variables

After Railway creates your project:

1. In the Railway dashboard, click on your project
2. Click on your service (it will be named after your repository)
3. Go to the "Variables" tab
4. Add all the environment variables from [DEPLOY_BACKEND_TO_RAILWAY.md](file:///c%3A/Users/osama/Railway-Netlify%20Apps/Cloudhost/Railway%20Cloud%20hostV4/DEPLOY_BACKEND_TO_RAILWAY.md) (lines 65-95):
   - `NODE_ENV=production`
   - `PORT=3000`
   - `GOOGLE_SHEETS_PROJECT_ID=pos-backend-469501`
   - `GOOGLE_SHEETS_CLIENT_EMAIL=railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com`
   - `GOOGLE_SHEETS_PRIVATE_KEY` (the full private key)
   - `GOOGLE_SHEETS_SPREADSHEET_ID=1jPey3a2tra70WGQmx96jywaq0lFA7WjAhCvQsfnSTv0`
   - `CORS_ORIGIN=*`
   - `RATE_LIMIT_WINDOW_MS=900000`
   - `RATE_LIMIT_MAX_REQUESTS=100`

### 3. Monitor the Deployment

1. Watch the deployment logs in the Railway dashboard
2. Wait for the build to complete successfully
3. Note the URL assigned to your Railway app (it will be in the format `your-app-name.railway.app`)

### 4. Verify the Deployment

1. Once deployed, test the health endpoint:
   ```bash
   curl https://YOUR_RAILWAY_APP_URL.railway.app/health
   ```

2. Test the Sheet1 endpoint:
   ```bash
   curl https://YOUR_RAILWAY_APP_URL.railway.app/api/v1/sheets/Sheet1
   ```

### 5. Update Your Netlify Frontend

1. Go to your Netlify dashboard
2. Select each of your frontend sites
3. Go to "Site settings" > "Environment variables"
4. Update or add the `VITE_BACKEND_URL` variable:
   ```
   VITE_BACKEND_URL=https://YOUR_RAILWAY_APP_URL.railway.app
   ```
5. Trigger a new deployment for each site

### 6. Test Authentication

1. Visit your Netlify sites
2. Try logging in with users from your Sheet1
3. Test all user roles (admin, accountant, sales, finance)

## Troubleshooting Common Issues

### Deployment Failures

- Check that all required files are in your GitHub repository
- Verify the [Dockerfile](file:///c%3A/Users/osama/Railway-Netlify%20Apps/Cloudhost/Railway%20Cloud%20hostV4/Dockerfile) is correct
- Check Railway build logs for specific error messages

### Authentication Issues

- Verify the Google Sheet is shared with the service account email
- Confirm the spreadsheet ID is correct
- Check that the private key is properly formatted with `\n` characters

### Network/Connectivity Issues

- Ensure Google Sheets API is enabled in your Google Cloud project
- Check that billing is enabled for your Google Cloud project
- Verify the service account has Editor permissions on the spreadsheet

## Verification Script

After deployment, you can use the verification script to check if everything is working:

```bash
# Set your Railway app URL
export RAILWAY_APP_URL=your-railway-app-url.railway.app

# Run the verification script
node verify_railway_deployment.js
```

## Support

If you encounter issues:

1. Check Railway deployment logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test locally with real credentials first
4. Check Google Cloud billing (API calls require billing to be enabled)

Once you've completed these steps, create the [RAILWAY_DEPLOYMENT_COMPLETE.md](file:///c%3A/Users/osama/Railway-Netlify%20Apps/Cloudhost/Railway%20Cloud%20hostV4/RAILWAY_DEPLOYMENT_COMPLETE.md) file to indicate the deployment is finished.