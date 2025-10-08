# 🌐 Railway Internal Services Configuration

## 🎯 Understanding Railway Internal Service URLs

The URL `google-sheets-rest-api.railway.internal` is Railway's internal service discovery mechanism. This allows services within the same Railway project to communicate with each other securely and efficiently.

## 🔧 Internal Service Configuration

### When to Use Internal URLs
Use internal URLs when:
1. Your frontend and backend are in the **same Railway project**
2. You want to avoid public internet traffic between services
3. You need better performance and security for service-to-service communication

### Frontend Configuration for Internal Services

To configure your frontend to use the internal backend service, we've updated the API configuration to automatically detect when it's running in Railway and use the internal service URL.

### Backend Service Configuration

For your backend to be accessible via internal service discovery:

1. **Ensure your service name matches**:
   - The service name in Railway should be `google-sheets-rest-api`
   - This creates the internal URL: `google-sheets-rest-api.railway.internal`

2. **Verify Port Configuration**:
   ```env
   PORT=3000
   ```

3. **CORS Configuration for Internal Services**:
   Even with internal services, you may still need CORS if accessing from a browser:
   ```env
   CORS_ORIGIN=*
   ```

## 🏗️ Railway Project Structure for Internal Services

### Single Project with Multiple Services
```
Railway Project
├── google-sheets-rest-api (backend)
│   ├── Service Name: google-sheets-rest-api
│   ├── Port: 3000
│   └── Internal URL: google-sheets-rest-api.railway.internal:3000
│
└── frontend (dashboard)
    ├── Root Directory: /frontend
    ├── Build Command: npm run build
    └── Start Command: npm run preview
```

### Environment Variables for Internal Communication
In your Railway project variables:
```
# Backend variables
NODE_ENV=production
PORT=3000
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_CLIENT_EMAIL=railwayprojectv1@pos-backend-469501.iam.gserviceaccount.com
GOOGLE_SHEETS_PROJECT_ID=pos-backend-469501
GOOGLE_SHEETS_SPREADSHEET_ID=1jPey3a2tra70WGQmx96jywaq0lFA7WjAhCvQsfnSTv0
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔧 Frontend Update for Internal Services

We've updated your frontend API configuration to automatically detect when it's running in Railway and use the internal service URL:

```typescript
// In frontend/src/config/api.ts
const getApiBaseUrl = () => {
  // For Railway internal services
  if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
    // Use internal service URL
    return 'http://google-sheets-rest-api.railway.internal:3000';
  }
  
  // Default to production URL
  return 'https://google-sheets-rest-api-production.up.railway.app';
};
```

## 🚀 Deployment Steps for Internal Services

### 1. Backend Service Setup
1. In Railway, create or select your project
2. Add your backend service
3. Ensure the service name is `google-sheets-rest-api`
4. Set environment variables as shown above
5. Deploy the backend

### 2. Frontend Service Setup
1. In the same Railway project, add your frontend service
2. Set "Root Directory" to `/frontend`
3. Railway will automatically detect and build the Vite project
4. Deploy the frontend

### 3. Verify Internal Communication
After both services are deployed:
1. Visit your frontend URL
2. The dashboard should automatically connect to the backend via internal service discovery
3. You should see your spreadsheet data including the 6,764+ sales records

## 🧪 Testing Internal Services

### Test Backend Health (Internal):
```bash
# From within Railway (e.g., in a shell in your frontend service)
curl http://google-sheets-rest-api.railway.internal:3000/health
```

### Test Backend API (Internal):
```bash
# From within Railway
curl http://google-sheets-rest-api.railway.internal:3000/api/v1/sheets/metadata
```

### Test Frontend (External):
```bash
# From your browser or external curl
curl https://your-frontend-project.up.railway.app/
```

## 🔒 Security Benefits

Using internal services provides:
- **No public exposure** of backend APIs
- **Reduced latency** between services
- **Automatic load balancing** within Railway
- **Enhanced security** through private network communication

## 🆘 Troubleshooting Internal Services

### Common Issues:

1. **Service Name Mismatch**:
   - Ensure your backend service is named `google-sheets-rest-api`
   - Internal URL must match: `google-sheets-rest-api.railway.internal`

2. **Port Issues**:
   - Backend must listen on port 3000
   - Internal URL includes port: `:3000`

3. **CORS Problems**:
   - Even with internal services, browsers enforce CORS
   - Ensure `CORS_ORIGIN=*` is set in backend variables

4. **Network Connectivity**:
   - Both services must be in the same Railway project
   - Services can only communicate via internal URLs, not external ones

### Debugging Steps:

1. **Check Service Names**:
   - In Railway dashboard, verify service names
   - Internal URL format: `{service-name}.railway.internal`

2. **Verify Port Configuration**:
   - Backend `PORT` variable set to 3000
   - Frontend connecting to `:3000`

3. **Test Internal Connectivity**:
   - Use Railway shell to test internal URLs
   - `curl http://google-sheets-rest-api.railway.internal:3000/health`

## 🎉 Benefits of Internal Services

With this configuration, you'll get:
- ✅ Faster communication between frontend and backend
- ✅ Enhanced security through private networking
- ✅ Automatic service discovery
- ✅ No need to expose backend APIs publicly
- ✅ Better performance for your dashboard
- ✅ Access to your 6,764+ sales records with improved reliability

This setup represents a production-grade architecture that follows best practices for cloud deployments on Railway!