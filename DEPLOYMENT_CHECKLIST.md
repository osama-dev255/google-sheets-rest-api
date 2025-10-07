# 🚀 Real Project Deployment Checklist

## Required Information for Production Deployment

### 1. 🔐 Google Cloud Service Account (REQUIRED)

You need to create and provide these **exact credentials**:

#### A. Google Cloud Project Information
```
GOOGLE_SHEETS_PROJECT_ID=your-actual-project-id
```
**How to get**: Google Cloud Console → Select your project → Project ID shown in dashboard

#### B. Service Account Email
```
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
```
**How to get**: 
1. Google Cloud Console → IAM & Admin → Service Accounts
2. Create service account → Copy the generated email

#### C. Private Key (Most Important!)
```
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```
**How to get**:
1. Service Accounts → Click your service account → Keys tab
2. Add Key → Create new key → JSON
3. Download the JSON file
4. Extract the `private_key` field (include the \n characters!)

### 2. 📊 Google Spreadsheet Information (REQUIRED)

#### Spreadsheet ID
```
GOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```
**How to get**: From your Google Sheets URL
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
                                      ^^^^^^^^^^^^^^^^^^^
```

#### Share Permissions
- Open your Google Spreadsheet
- Click "Share" button
- Add your service account email: `your-service-account@project.iam.gserviceaccount.com`
- Give "Editor" permissions
- Click "Send"

### 3. 🛠️ Step-by-Step Google Cloud Setup

#### Step 1: Create Google Cloud Project
```bash
# Visit: https://console.cloud.google.com/
# Click: "New Project"
# Enter: Project name
# Note: Copy the Project ID (not the name!)
```

#### Step 2: Enable Google Sheets API
```bash
# In Google Cloud Console:
# Navigation Menu → APIs & Services → Library
# Search: "Google Sheets API"
# Click: "Google Sheets API"
# Click: "Enable"
```

#### Step 3: Create Service Account
```bash
# Navigation Menu → IAM & Admin → Service Accounts
# Click: "Create Service Account"
# Enter: Service account name (e.g., "sheets-api-service")
# Enter: Description (e.g., "Service account for Sheets API access")
# Click: "Create and Continue"
# Skip roles (click "Continue")
# Click: "Done"
```

#### Step 4: Generate Private Key
```bash
# Click on your newly created service account
# Go to "Keys" tab
# Click: "Add Key" → "Create new key"
# Select: "JSON"
# Click: "Create"
# Download the JSON file (keep it secure!)
```

### 4. 📝 Environment Variables for Railway

Copy these **exact values** to Railway environment variables:

```env
# Application Settings
NODE_ENV=production
PORT=3000

# Google Cloud Credentials (REPLACE WITH YOUR ACTUAL VALUES)
GOOGLE_SHEETS_PROJECT_ID=your-actual-project-id-here
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-actual-spreadsheet-id-here

# Security Settings (Optional - can use defaults)
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. 🔧 Private Key Formatting (CRITICAL!)

The private key **must be properly formatted** with escape characters:

#### ❌ Wrong Format:
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----
```

#### ✅ Correct Format for Railway:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Key Points**:
- Wrap entire key in double quotes
- Replace all line breaks with `\n`
- Keep the BEGIN/END lines
- Don't add extra spaces

### 6. 🧪 Testing Your Credentials Locally

Before deploying, test with real credentials:

1. **Update `.env` file** with your real credentials
2. **Test locally**:
   ```bash
   npm run dev
   ```
3. **Test endpoints**:
   ```bash
   # Should return actual spreadsheet info
   curl http://localhost:3000/api/v1/sheets/metadata
   
   # Should return actual sheet data
   curl http://localhost:3000/api/v1/sheets/Sheet1
   ```

### 7. 🚀 Railway Deployment Process

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Production ready: Google Sheets API"
git push origin main
```

#### Step 2: Connect to Railway
```bash
# Visit: https://railway.app
# Login with GitHub
# Click: "New Project"
# Select: "Deploy from GitHub repo"
# Choose your repository
```

#### Step 3: Set Environment Variables
```bash
# In Railway dashboard:
# Click your project → "Variables" tab
# Add each environment variable one by one
# Make sure to use the exact format for GOOGLE_SHEETS_PRIVATE_KEY
```

#### Step 4: Deploy
```bash
# Railway will automatically:
# - Detect Dockerfile
# - Build the container
# - Deploy your app
# - Provide a public URL
```

### 8. 🔍 Verification Checklist

After deployment, verify these endpoints work:

```bash
# Replace YOUR_RAILWAY_URL with your actual Railway app URL

# ✅ Health check
curl https://YOUR_RAILWAY_URL.railway.app/health

# ✅ API info
curl https://YOUR_RAILWAY_URL.railway.app/

# ✅ Spreadsheet metadata (tests Google Sheets connection)
curl https://YOUR_RAILWAY_URL.railway.app/api/v1/sheets/metadata

# ✅ Actual sheet data
curl https://YOUR_RAILWAY_URL.railway.app/api/v1/sheets/Sheet1
```

### 9. 🚨 Common Issues & Solutions

#### Issue 1: "Failed to fetch spreadsheet metadata"
**Solution**: Check service account has access to your spreadsheet

#### Issue 2: "Invalid private key"
**Solution**: Ensure private key is properly escaped with `\n` characters

#### Issue 3: "Spreadsheet not found"
**Solution**: Verify spreadsheet ID is correct and public or shared with service account

#### Issue 4: "Permission denied"
**Solution**: Make sure service account email has Editor access to the spreadsheet

### 10. 📋 Final Deployment Checklist

- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created
- [ ] JSON key file downloaded
- [ ] Spreadsheet shared with service account email
- [ ] All environment variables set in Railway
- [ ] Private key properly formatted with `\n` escapes
- [ ] Local testing completed successfully
- [ ] Code pushed to GitHub
- [ ] Railway project connected
- [ ] Deployment successful
- [ ] Production endpoints tested

### 🎯 What You Need Right Now

To deploy immediately, you need:

1. **A Google Cloud account** (free)
2. **A Google Spreadsheet** (can be empty initially)
3. **A GitHub repository** (to connect to Railway)
4. **A Railway account** (free tier available)

The entire setup process takes **15-20 minutes** for first-time users.

### 📞 Need Help?

If you encounter issues during deployment:

1. **Check Railway build logs** for detailed error messages
2. **Verify environment variables** are set correctly
3. **Test locally first** with real credentials
4. **Check Google Cloud billing** (API calls require billing enabled)
5. **Verify spreadsheet permissions** for the service account

---

**🚀 Ready to deploy?** Follow this checklist step-by-step, and your Google Sheets REST API will be live on Railway in minutes!