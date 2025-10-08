# 🔧 RAILWAY ENVIRONMENT VARIABLE FIX

## 🚨 Issue Identified

Your Google Sheets REST API is encountering authentication issues in Railway due to improper handling of the private key environment variable.

**Error**: `error:1E08010C:DECODER routines::unsupported`

This typically happens when the private key isn't properly formatted in Railway's environment variables.

## 🛠️ Solution: Fix Environment Variables in Railway

### Step 1: Access Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Navigate to your project
3. Click on your service
4. Go to the "Variables" tab

### Step 2: Update GOOGLE_SHEETS_PRIVATE_KEY

**Current (Problematic) Value**:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDUA0rIHeJsemIe\nplJ6fzjLOaNQpOGFVmHyJp1Ffg/6a8QuxTCm7VmzW8lESkwoJvJkVSUqOHfF0cPQ\nnWO3lWxWSIDK2vCR2S2aOLYN0798QMJkmO4+G59VDH+a1m8ZFa89hh7ZqAQHlx1Y\n5Ng4DT47VXif8cyiNlYq7ci3KeBYVEqHSqvutzfBBm7An+0tOILEKgQ75BOvUyXp\nRqVbxki/epJ5klv+YkDnfEmu58/et1Oy3SEMZKbCaTmOpECM0Rn+OS4xENrC8ii4\nJt1qfiKcbzfIYkQ/2lK7XcQK5vr3/OTdo+SAKKsBs5gszyo9+bkjCFXBARbBdgQj\nmBwv4ibdAgMBAAECggEAJrwBPiWDmCkV4x6lA/9ZW3vI1DODhm5dT7XxVuBsv+ZP\nffIF7QGBOW0kDOd8GXvgHieWNiwB6fDkkykmLkTM+cieSzGL8UGZ/MqurEELA4L7\nYRC1ukAmsI2rhJj3zD/zd8yYt1BkiBR6RqLsw/TbcVCwzJwLNHmz7XzrBlfOxqQu\niweYv9+xsiCbFNGKs4xSPgeVWnaokcMKVb7tk0VCvHJX7RIpabrx4umwQ4XS389t\nGGqD81r2U7nOBCH4VP0GEGUOJgB89EHn5NkZpA7zAPic8Kv4cVzLlkxz5aigkaEh\n8ONvEh/lCTEAsyRCLYhthZSv/pBSc+KwAAUFUhdl4QKBgQD1DA04qX7qMGyGJcRg\nUamxgA9RkQFWleQ/88blhfwr53av7oYKQrp/PNDX+gaDBHmb3iu7R4FMIISthERR\neVJCmkvNAE4KYo6UOTMHD255ZnzK07HLuNYin9qPtsBor7+QE45nUSzyyjFu9y2z\nKGeHsE4xaV6utrNIF1Olu/sJLQKBgQDdfT8v03oDvdt9LhIc6vkHoReOtxKGA5nv\nbKhrQpaCtP38k2fyKg6Kf0l2ymXRrSHksMrrBrBIXpAGSP+odQPm74zmJOnKqaRI\n+XEYc0XRC114Hv4fXQfS3WlvyR+Fi2m3OZjMayjZup+zVd+ckZ5meMM83wJfZlzW\nWi1+IvvCcQKBgQC/6FFOZ8eCJqxHHrq9aBcKcK0Ohw5SPg9EWmkRBa5ov9v+ikGl\nNX8S+JDiI+gHoXCPth3vjF9hPDJMJcLPP8FBcc8dXDjB/0+EG4uv4tD0+GORANtE\nHZxt/1zOoiPrmH/gmMA0f6lA90JhkejTXzg9VsDWB5xkHacoNUSIDkDafQKBgQCi\nbxsq+P3vxoo0qNfxy0VtGfBL4uk7zWJUW6y8VO5K12+5j2VZDQzy91yqOM8pUb6c\nmCeI67PWrzsS0PBl28NL1vzPP90Rmw330q/ljYxzPdGDqb8Ww0RcmbKcn7R1XQPf\nsubja+denmZGwECo84ZmgkQ03RxBWLHXJfVdH0zhkQKBgQDsK1jWfQWkgX1rntez\nZ67XXxObTUceBbTLFkn2Ss+CrTPb4+qtTWqSe6RZ3ZfH8hApoWfNSyy7A85Pta4s\nSdO5oncm/8aDFuqOrbf0TILbBEtUnNqdFf16UvWy3kVpfkiIGqtDdlCWP659ORgV\nZ8nOPXj8bNih+t+mBi1GoRDk2g==\n-----END PRIVATE KEY-----\n"
```

**Fixed Value** (Remove the outer quotes):
```
-----BEGIN PRIVATE KEY-----
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
```

### Step 3: Verify Other Environment Variables

Make sure these variables are also set correctly:

```
NODE_ENV=production
PORT=3000
GOOGLE_SHEETS_PROJECT_ID=pos-backend-469501
GOOGLE_SHEETS_CLIENT_EMAIL=railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=16FKtxkh5LJ8zbW-AASqkPaE_blVZWdp4J4l_yEVUBQc
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Redeploy

After updating the environment variables:
1. Railway will automatically redeploy your application
2. Wait for the deployment to complete
3. Test the API again

## 🧪 Testing After Fix

Once redeployed, test these endpoints:

```bash
# Health check
curl https://google-sheets-rest-api-production.up.railway.app/health

# Google Sheets metadata
curl https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/metadata

# Mauzo sheet data
curl https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/Mauzo/range/A1:J5
```

## 🎯 Expected Results

After fixing the environment variables:
✅ Health check should return 200 OK
✅ Google Sheets metadata should return spreadsheet info
✅ Mauzo sheet data should return your sales records
✅ All 6,764+ sales records should be accessible

## 🆘 Troubleshooting

If issues persist:
1. Check Railway logs for detailed error messages
2. Verify the spreadsheet is shared with the service account email
3. Confirm all environment variables are set correctly
4. Check that the private key doesn't have extra quotes or formatting issues

---

## 🎉 Success!

Once fixed, your Google Sheets REST API will provide:
- ✅ Real-time access to 6,764+ sales records
- ✅ Multi-sheet support for all your business data
- ✅ Professional REST API endpoints
- ✅ Global accessibility 24/7