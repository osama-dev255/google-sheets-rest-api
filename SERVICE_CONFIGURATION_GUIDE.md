# 🛠️ Service Configuration Guide for Railway Deployment

## 🎯 Common Service Configuration Challenges

Based on your deployment issues, here are the most common service configuration challenges and how to fix them:

## 1. 🔐 Google Sheets Authentication Issues

### Problem: "Invalid private key" or authentication errors

**Root Cause**: Railway environment variables with extra quotes or incorrect newline formatting

### Solution:
1. In Railway Dashboard → Your Project → Variables tab
2. Find `GOOGLE_SHEETS_PRIVATE_KEY`
3. **Remove outer quotes** from the value
4. Ensure newlines are represented as `\n` (not actual line breaks)

**❌ Wrong Format**:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**✅ Correct Format**:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```

## 2. 📊 Spreadsheet Access Issues

### Problem: "Spreadsheet not found" or "Permission denied"

**Root Cause**: Spreadsheet not shared with service account or incorrect spreadsheet ID

### Solution:
1. Open your Google Spreadsheet
2. Click "Share" button
3. Add your service account email: `railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com`
4. Give "Editor" permissions
5. Verify the spreadsheet ID in Railway variables matches your URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

## 3. 🌐 CORS Configuration Issues

### Problem: Frontend can't connect to backend API

**Root Cause**: CORS restrictions preventing frontend-backend communication

### Solution:
1. In Railway Dashboard → Your Backend Project → Variables tab
2. Set `CORS_ORIGIN` to `*` for development or your frontend URL for production:
   ```
   CORS_ORIGIN=https://your-frontend-project.up.railway.app
   ```

## 4. 🏗️ Environment Variables Setup

### Required Variables for Backend:
```
NODE_ENV=production
PORT=3000
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_CLIENT_EMAIL=railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com
GOOGLE_SHEETS_PROJECT_ID=pos-backend-469501
GOOGLE_SHEETS_SPREADSHEET_ID=1jPey3a2tra70WGQmx96jywaq0lFA7WjAhCvQsfnSTv0
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 5. 🔧 Railway Service Configuration

### Backend Service Settings:
1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
3. **Root Directory**: `/` (root of repository)
4. **Port**: 3000

### Frontend Service Settings:
1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
3. **Root Directory**: `/frontend`
4. **Port**: 3000 (or PORT environment variable)

## 6. 🔄 Redeployment Process

After fixing environment variables:

1. **Trigger redeployment**:
   - Make a small change to trigger rebuild, OR
   - In Railway Dashboard → Deployments → Redeploy

2. **Verify deployment**:
   - Check deployment logs for errors
   - Test health endpoint: `https://your-app.railway.app/health`
   - Test API endpoints

## 7. 📋 Configuration Checklist

### ✅ Backend Configuration:
- [ ] All 8 environment variables set correctly
- [ ] Private key formatted without outer quotes
- [ ] Spreadsheet shared with service account
- [ ] CORS configured properly
- [ ] Service account has Editor permissions

### ✅ Frontend Configuration:
- [ ] API endpoint URL correct in `src/config/api.ts`
- [ ] No environment variables needed (hardcoded)
- [ ] Root directory set to `/frontend` in Railway

## 8. 🆘 Troubleshooting Commands

### Test Backend Locally:
```bash
# In project root directory
npm run dev
# Then test:
curl http://localhost:3000/health
curl http://localhost:3000/api/v1/sheets/metadata
```

### Check Railway Logs:
```bash
# In Railway Dashboard
# Your Project → Deployments → View Logs
```

### Verify Environment Variables:
```bash
# In Railway Dashboard
# Your Project → Variables tab
# Ensure all required variables are present and correctly formatted
```

## 9. 🎯 Success Verification

### Backend Health Check:
```bash
curl https://your-backend-project.up.railway.app/health
# Should return: {"success":true,"message":"Server is healthy",...}
```

### Backend Metadata Check:
```bash
curl https://your-backend-project.up.railway.app/api/v1/sheets/metadata
# Should return spreadsheet metadata with your 5 sheets
```

### Frontend Health Check:
```bash
curl https://your-frontend-project.up.railway.app/health
# Should return: {"success":true,"message":"Frontend server is healthy",...}
```

## 10. 📞 Common Error Messages and Solutions

### "error:1E08010C:DECODER routines::unsupported"
**Solution**: Fix private key formatting - remove outer quotes

### "Failed to fetch spreadsheet metadata"
**Solution**: 
1. Verify spreadsheet ID is correct
2. Verify service account has access
3. Check Google Sheets API is enabled

### "Permission denied"
**Solution**: Share spreadsheet with service account with Editor permissions

### "CORS error"
**Solution**: Set `CORS_ORIGIN` variable correctly in backend

### "Environment variables missing"
**Solution**: Add all required environment variables in Railway dashboard

## 🎉 You're Almost There!

These service configuration fixes should resolve your deployment issues. The most common problem is the private key formatting, so start there if you're unsure where to begin.

Remember to redeploy your services after making any configuration changes!

Need help with a specific error message? Share the exact error and I can provide more targeted assistance.