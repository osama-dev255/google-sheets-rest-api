# Authentication Troubleshooting Guide

## Problem Statement

You're experiencing an issue where:
- `https://leafy-praline-e1c31f.netlify.app/` accepts `finance@businessproject.co.tz` with password `finance369`
- `https://railway-pos-system.netlify.app/login` does not accept the same credentials

## Root Cause Analysis

This is typically caused by one of the following issues:

### 1. Different Backend Connections
The two deployments might be connecting to different backend instances or spreadsheets.

### 2. Environment Variable Differences
Different environment variables between the two Netlify deployments.

### 3. User Data Inconsistencies
The user might exist in one spreadsheet but not the other.

### 4. Network or CORS Issues
One deployment might have network connectivity issues.

## Diagnostic Steps

### Step 1: Run the Browser Diagnostic Tool
1. Open `browser_auth_diagnostic.html` in your web browser
2. Click "Run Comprehensive Diagnostic"
3. Observe the results for both deployments

### Step 2: Check User Data in Google Sheets
1. Open your Google Sheet
2. Verify the finance user exists:
   ```
   ID | Name | Email | Password | Role
   6 | Fiona Finance | finance@businessproject.co.tz | finance369 | finance
   ```

### Step 3: Verify Netlify Environment Variables
1. Log into Netlify dashboard
2. Go to both sites' settings
3. Check that both have the same environment variables:
   ```
   VITE_BACKEND_URL=https://google-sheets-rest-api-production.up.railway.app
   ```

## Common Solutions

### Solution 1: Ensure Consistent Environment Variables
1. In Netlify dashboard for `railway-pos-system`:
   - Go to Site settings > Build & deploy > Environment
   - Add/verify: `VITE_BACKEND_URL=https://google-sheets-rest-api-production.up.railway.app`
2. Trigger a new deployment

### Solution 2: Verify User Data
1. Check that the finance user exists in Sheet1:
   - Email: `finance@businessproject.co.tz`
   - Password: `finance369`
   - Role: `finance`
2. Ensure no extra spaces in any fields

### Solution 3: Check for Case Sensitivity Issues
1. Passwords and emails are case-sensitive
2. Ensure exact match including capitalization

### Solution 4: Redeploy the Site
1. Make a small change to trigger a new build
2. Or redeploy from the latest GitHub commit

## Advanced Troubleshooting

### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Try to log in
4. Look for error messages

### Check Network Requests
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to log in
4. Look for failed requests to the backend API

### Test Direct Backend Access
Run the `comprehensive_auth_test.js` script:
```bash
node comprehensive_auth_test.js
```

## When to Contact Support

Contact support if:

1. The diagnostic tools show the user exists with correct credentials but login still fails
2. Backend API is returning errors
3. Both deployments show the same errors
4. You've tried all troubleshooting steps without success

## Prevention

To prevent this issue in the future:

1. Use the same environment variables for all deployments
2. Regularly verify user data in Google Sheets
3. Test new deployments with all user roles
4. Document deployment configurations

## Additional Notes

- Both deployments should connect to the same backend: `https://google-sheets-rest-api-production.up.railway.app`
- Both should access the same Google Sheet
- User authentication is case-sensitive
- Passwords are stored in plain text in Google Sheets