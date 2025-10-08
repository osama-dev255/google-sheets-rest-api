# 🚀 Quick Fix: Service Configuration Issues

## 🎯 Most Common Issues & Solutions

### 1. 🔐 Private Key Authentication Error
**Error**: "error:1E08010C:DECODER routines::unsupported"

**Quick Fix**:
1. Go to Railway → Your Backend Project → Variables
2. Find `GOOGLE_SHEETS_PRIVATE_KEY`
3. **Remove the outer quotes** - the value should NOT start and end with `"`
4. Ensure newlines are `\n` (not actual line breaks)
5. Click "Redeploy"

### 2. 📊 Spreadsheet Access Error
**Error**: "Failed to fetch spreadsheet metadata" or "Permission denied"

**Quick Fix**:
1. Open your spreadsheet: https://docs.google.com/spreadsheets/d/1jPey3a2tra70WGQmx96jywaq0lFA7WjAhCvQsfnSTv0/edit
2. Click "Share" (top right)
3. Add: `railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com`
4. Set permissions to "Editor"
5. Click "Send"
6. In Railway, redeploy your backend

### 3. 🌐 CORS Error (Frontend can't connect)
**Error**: Browser console shows CORS errors

**Quick Fix**:
1. Go to Railway → Your Backend Project → Variables
2. Set `CORS_ORIGIN` to `*`
3. Redeploy backend

### 4. 📁 Root Directory Issue (Frontend not building)
**Error**: "Can't find package.json" or build errors

**Quick Fix**:
1. Go to Railway → Your Frontend Project → Settings
2. Set "Root Directory" to `/frontend`
3. Redeploy

## 🛠️ One-Click Verification Commands

### Test Backend Health:
```bash
curl https://your-backend-project.up.railway.app/health
```
✅ Should return: `{"success":true,"message":"Server is healthy",...}`

### Test Backend API:
```bash
curl https://your-backend-project.up.railway.app/api/v1/sheets/metadata
```
✅ Should return your spreadsheet metadata

### Test Frontend Health:
```bash
curl https://your-frontend-project.up.railway.app/health
```
✅ Should return: `{"success":true,"message":"Frontend server is healthy",...}`

## 📋 5-Minute Configuration Checklist

### Backend (5 minutes):
- [ ] `GOOGLE_SHEETS_PRIVATE_KEY` has NO outer quotes ✅
- [ ] Spreadsheet shared with `railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com` ✅
- [ ] `CORS_ORIGIN` set to `*` ✅
- [ ] All 8 environment variables present ✅
- [ ] Redeployed after changes ✅

### Frontend (2 minutes):
- [ ] "Root Directory" set to `/frontend` in Settings ✅
- [ ] Redeployed after changes ✅

## 🚨 Emergency Reset Procedure

If nothing works, try this reset:

1. **Backend Reset**:
   - Delete all environment variables in Railway
   - Add them back one by one using the exact values from the previous document
   - Pay special attention to the private key (NO quotes!)
   - Redeploy

2. **Frontend Reset**:
   - In Railway Settings, confirm "Root Directory" is `/frontend`
   - Redeploy

## 📞 Still Stuck?

Share these specific details and I can help faster:
1. Exact error message
2. Which service is failing (frontend/backend)
3. What you've tried so far

Most issues are resolved in under 5 minutes once you know what to look for!

**Remember**: The #1 cause of deployment failures is private key formatting with extra quotes. Check that first! 🔑