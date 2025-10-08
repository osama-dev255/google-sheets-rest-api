# 🧪 Testing Internal Services Configuration

## 🎯 Purpose

This guide helps you test and verify that your Railway internal services configuration is working correctly.

## 🛠️ Testing Steps

### 1. Verify Service Names in Railway

1. Go to your Railway project dashboard
2. Check that your backend service is named `google-sheets-rest-api`
3. The internal URL should be: `google-sheets-rest-api.railway.internal:3000`

### 2. Test Internal Communication

If you have shell access to your Railway services, you can test internal communication:

```bash
# From within your Railway project (e.g., in a shell in your frontend service)
curl http://google-sheets-rest-api.railway.internal:3000/health
```

Expected response:
```json
{"success":true,"message":"Server is healthy",...}
```

### 3. Test API Endpoints

```bash
# Test metadata endpoint
curl http://google-sheets-rest-api.railway.internal:3000/api/v1/sheets/metadata
```

Expected response should include your spreadsheet information with 5 sheets including "Mauzo".

### 4. Frontend Auto-Detection Test

The frontend now automatically detects when it's running in Railway and uses internal services. You can verify this by checking the network tab in your browser's developer tools:

1. Deploy both frontend and backend to the same Railway project
2. Visit your frontend URL
3. Open browser developer tools (F12)
4. Go to the Network tab
5. Refresh the page
6. Look for API requests to:
   - Internal: `http://google-sheets-rest-api.railway.internal:3000/...`
   - External: `https://google-sheets-rest-api-production.up.railway.app/...`

When running in Railway, you should see requests to the internal URL.

## 📋 Verification Checklist

### Backend Configuration ✅
- [ ] Service named `google-sheets-rest-api`
- [ ] Listening on port 3000
- [ ] All environment variables set correctly
- [ ] Private key formatted without outer quotes
- [ ] Spreadsheet shared with service account
- [ ] CORS configured properly

### Frontend Configuration ✅
- [ ] Root directory set to `/frontend`
- [ ] TypeScript configured with node types
- [ ] API configuration detects Railway environment
- [ ] Uses internal service URL when in Railway

### Internal Communication ✅
- [ ] Services in same Railway project
- [ ] Backend accessible via `google-sheets-rest-api.railway.internal:3000`
- [ ] Frontend connects to backend via internal URL
- [ ] No CORS errors in browser console

## 🚨 Common Issues and Solutions

### 1. Service Name Mismatch
**Problem**: Backend service has different name
**Solution**: Rename service to `google-sheets-rest-api`

### 2. Port Issues
**Problem**: Backend not listening on port 3000
**Solution**: Set `PORT=3000` in environment variables

### 3. CORS Errors
**Problem**: Browser blocking requests
**Solution**: Ensure `CORS_ORIGIN=*` is set in backend variables

### 4. Network Connectivity
**Problem**: Services in different projects
**Solution**: Move both services to same Railway project

## 🎉 Success Indicators

When everything is configured correctly:

1. **Backend Health**: ✅ Returns healthy status via internal URL
2. **API Access**: ✅ Returns your spreadsheet metadata
3. **Frontend Dashboard**: ✅ Loads and displays data
4. **Internal Communication**: ✅ No external API calls needed
5. **Performance**: ✅ Faster loading times due to internal networking

## 📞 Need Help?

If you're still experiencing issues:

1. Share the specific error message
2. Confirm both services are in the same Railway project
3. Verify service names match the expected format
4. Check that port 3000 is configured correctly

The internal services configuration provides significant benefits for performance and security when properly implemented!