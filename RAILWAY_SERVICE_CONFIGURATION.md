# 🛠️ Railway Service Configuration - Step by Step

## 🎯 Your Specific Configuration Requirements

Based on your project, here are the exact settings you need for successful Railway deployment:

## 1. 🔧 Backend Service Configuration

### Environment Variables (Set in Railway Dashboard)
```
NODE_ENV=production
PORT=3000
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

GOOGLE_SHEETS_CLIENT_EMAIL=railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com
GOOGLE_SHEETS_PROJECT_ID=pos-backend-469501
GOOGLE_SHEETS_SPREADSHEET_ID=1jPey3a2tra70WGQmx96jywaq0lFA7WjAhCvQsfnSTv0
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Service Settings in Railway
1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
3. **Root Directory**: `/` (root of repository)
4. **Port**: 3000

## 2. 🖥️ Frontend Service Configuration

### Environment Variables
No environment variables needed for the frontend - the API endpoint is hardcoded.

### Service Settings in Railway
1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
3. **Root Directory**: `/frontend`
4. **Port**: 3000

## 3. 🔍 Step-by-Step Configuration Process

### Backend Configuration:
1. Go to [railway.app](https://railway.app)
2. Open your backend project
3. Click "Variables" tab
4. Add/update the following variables:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `GOOGLE_SHEETS_PRIVATE_KEY` = (the key above WITHOUT outer quotes)
   - `GOOGLE_SHEETS_CLIENT_EMAIL` = `railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com`
   - `GOOGLE_SHEETS_PROJECT_ID` = `pos-backend-469501`
   - `GOOGLE_SHEETS_SPREADSHEET_ID` = `1jPey3a2tra70WGQmx96jywaq0lFA7WjAhCvQsfnSTv0`
   - `CORS_ORIGIN` = `*`
   - `RATE_LIMIT_WINDOW_MS` = `900000`
   - `RATE_LIMIT_MAX_REQUESTS` = `100`

5. Click "Deployments" tab
6. Click "Redeploy" to apply changes

### Frontend Configuration:
1. Go to [railway.app](https://railway.app)
2. Open your frontend project
3. Click "Settings" tab
4. Set "Root Directory" to `/frontend`
5. Click "Deployments" tab
6. Click "Redeploy" to apply changes

## 4. ✅ Verification Steps

### After Backend Deployment:
1. Visit: `https://your-backend-project.up.railway.app/health`
2. Should see: `{"success":true,"message":"Server is healthy",...}`

3. Visit: `https://your-backend-project.up.railway.app/api/v1/sheets/metadata`
4. Should see your spreadsheet metadata with 5 sheets including "Mauzo" with 6,764 records

### After Frontend Deployment:
1. Visit: `https://your-frontend-project.up.railway.app/health`
2. Should see: `{"success":true,"message":"Frontend server is healthy",...}`

3. Visit: `https://your-frontend-project.up.railway.app/`
4. Should see the dashboard with your spreadsheet data

## 5. 🚨 Critical Configuration Points

### Private Key Formatting (MOST IMPORTANT):
❌ **WRONG** (with outer quotes):
```
"-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDUA0rIHeJsemIe\n...\n-----END PRIVATE KEY-----\n"
```

✅ **CORRECT** (without outer quotes):
```
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDUA0rIHeJsemIe
...
-----END PRIVATE KEY-----

```

### Spreadsheet Sharing:
1. Open your Google Spreadsheet at: https://docs.google.com/spreadsheets/d/1jPey3a2tra70WGQmx96jywaq0lFA7WjAhCvQsfnSTv0/edit
2. Click "Share" button (top right)
3. Add: `railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com`
4. Set permissions to "Editor"
5. Click "Send"

## 6. 🆘 If You're Still Having Issues

1. **Check Railway Logs**:
   - Go to your project in Railway
   - Click "Deployments" tab
   - Click on the latest deployment
   - Check the build and runtime logs for specific error messages

2. **Verify Environment Variables**:
   - In Railway, go to your project
   - Click "Variables" tab
   - Make sure all variables are set exactly as shown above
   - Pay special attention to the private key format

3. **Test Locally First**:
   ```bash
   # In your project root directory
   # Make sure your .env file has the correct values
   npm run dev
   
   # In another terminal:
   curl http://localhost:3000/health
   curl http://localhost:3000/api/v1/sheets/metadata
   ```

## 🎉 Success Indicators

When everything is configured correctly, you should see:

1. **Backend Health**: ✅ Green status in Railway dashboard
2. **API Endpoints**: ✅ Returning your actual spreadsheet data
3. **Frontend Dashboard**: ✅ Loading and displaying your 6,764+ sales records
4. **No Authentication Errors**: ✅ No "invalid private key" messages

## 📞 Need More Help?

If you're still experiencing issues after following these steps:

1. Share the specific error message you're seeing
2. Let me know which service (frontend or backend) is having problems
3. I can provide more targeted assistance based on the exact error

You're very close to having a fully functional Google Sheets dashboard! The configuration issues are typically related to the private key formatting or spreadsheet sharing, both of which are easy to fix once identified.