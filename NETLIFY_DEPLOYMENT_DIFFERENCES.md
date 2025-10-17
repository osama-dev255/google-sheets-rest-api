# Netlify Deployment Differences Analysis

## Overview

This document explains why `https://leafy-praline-e1c31f.netlify.app/` accepts `finance@businessproject.co.tz` with password `finance369`, but `https://railway-pos-system.netlify.app/login` doesn't.

## Likely Causes

### 1. Different Environment Variable Configurations

The two Netlify deployments may have different environment variable configurations:

1. **VITE_BACKEND_URL** - Points to different backend instances
2. **API Keys** - Different Google Sheets API credentials
3. **Spreadsheet IDs** - Different Google Sheets being accessed

### 2. Different Build Configurations

The deployments may have been built with different configurations:

1. **Different branches** in the GitHub repository
2. **Different environment files** (.env.production vs .env.development)
3. **Different build commands** with specific environment variables

### 3. Different Google Sheets Being Accessed

The two deployments may be connecting to different Google Sheets:

1. **Different Spreadsheet IDs** in environment variables
2. **Different Sheet1 structures** between spreadsheets
3. **Different user data** in each spreadsheet

## How to Diagnose the Issue

### 1. Check Environment Variables

Each Netlify site should have environment variables configured in the Netlify dashboard:

```
VITE_BACKEND_URL=https://google-sheets-rest-api-production.up.railway.app
```

### 2. Verify Backend Connection

Both deployments should connect to the same backend API:
- `https://google-sheets-rest-api-production.up.railway.app`

### 3. Check Sheet1 Data

Verify that both deployments are accessing the same Google Sheet by:
1. Checking the spreadsheet ID in the backend configuration
2. Ensuring the finance user exists in Sheet1
3. Verifying the user data is correct

## Common Issues and Solutions

### Issue 1: Different Backend URLs
**Symptoms**: One deployment works, the other doesn't
**Solution**: Ensure both deployments use the same VITE_BACKEND_URL

### Issue 2: User Not in Sheet1
**Symptoms**: Authentication fails for specific users
**Solution**: Verify the user exists in the correct Sheet1 with correct credentials

### Issue 3: Role Validation Issues
**Symptoms**: User exists but authentication fails
**Solution**: Ensure the role value is one of the valid roles: admin, manager, cashier, accountant, sales, finance

### Issue 4: Network/Access Issues
**Symptoms**: Intermittent authentication failures
**Solution**: Check backend health and Google Sheets API access

## How to Fix the Issue

### Step 1: Verify User Data in Sheet1
1. Open the Google Sheet connected to the backend
2. Check that the finance user exists:
   ```
   ID | Name | Email | Password | Role
   6 | Fiona Finance | finance@businessproject.co.tz | finance369 | finance
   ```

### Step 2: Check Netlify Environment Variables
1. Log into the Netlify dashboard
2. Go to the railway-pos-system site settings
3. Check the environment variables:
   - VITE_BACKEND_URL should be set to `https://google-sheets-rest-api-production.up.railway.app`

### Step 3: Redeploy the Site
1. Trigger a new deployment in Netlify
2. Ensure the build uses the correct environment variables

### Step 4: Test Authentication
1. Try logging in with the finance credentials
2. Check the browser console for any errors
3. Verify network requests to the backend API

## Testing Tools

Use the provided testing tools to diagnose the issue:

1. **test_api_connection.html** - Test API connections from the browser
2. **test_api_connection.js** - Test API connections from Node.js
3. Browser developer tools - Check network requests and console errors

## When to Contact Support

Contact technical support if:

1. The user exists in Sheet1 with correct credentials but authentication still fails
2. Both deployments show the same error messages
3. Backend API is returning errors
4. Google Sheets API access is failing

Provide the following information:
1. Screenshots of the user's row in Sheet1
2. Browser console errors
3. Network request/response details
4. Steps taken to troubleshoot