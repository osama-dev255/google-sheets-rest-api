# User Testing Guide

## Overview

This guide explains how to test specific user credentials against your Sheet1 data to troubleshoot login issues.

## Testing the User: accountant@businessproject.co.tz

I've prepared tools to test the specific user credentials you mentioned:
- Email: accountant@businessproject.co.tz
- Password: accountant147

## Methods to Test User Credentials

### 1. Using the HTML Tester (Recommended)

1. Open the `test_user.html` file in your web browser
2. The email and password fields will be pre-filled with the accountant credentials
3. Click the "Test User Credentials" button
4. View the results which will show:
   - Whether the user exists in Sheet1
   - User details if found
   - Whether the password matches

### 2. Using the Node.js Script

1. Open a terminal/command prompt
2. Navigate to your project directory
3. Run the script with: `node test_user.js`
4. View the results in the terminal

### 3. Using the Enhanced Sheet1 Inspector

The `inspect_sheet1.js` script has been updated to automatically test the accountant user:
1. Run with: `node inspect_sheet1.js`
2. View the results which include:
   - General Sheet1 data inspection
   - Specific test for the accountant user

## What the Tests Will Show

### If User Exists and Credentials Match:
- ✅ PASSWORD MATCH! User can log in successfully

### If User Exists but Password Doesn't Match:
- ❌ PASSWORD MISMATCH!
- Shows both passwords for comparison
- Displays character count differences

### If User Doesn't Exist:
- ❌ User with email "accountant@businessproject.co.tz" not found in Sheet1
- Lists other users found in Sheet1

## Common Issues and Solutions

### 1. Password Mismatch
**Possible causes:**
- Extra spaces in password field
- Case sensitivity issues
- Hidden characters

**Solutions:**
- Check for leading/trailing spaces in Google Sheets
- Ensure exact case matching
- Retype the password in Sheet1

### 2. User Not Found
**Possible causes:**
- Email typo in Sheet1
- User not added to Sheet1
- Extra spaces in email field

**Solutions:**
- Verify email spelling in Sheet1
- Add user to Sheet1 if missing
- Remove extra spaces from email field

### 3. Role Issues
**Possible causes:**
- Invalid role value
- Role field empty

**Solutions:**
- Ensure role is exactly "admin", "manager", "cashier", "accountant", "sales", or "finance" (lowercase)
- Fill in role field if empty

## How to Fix Issues

### Fixing Password Issues:
1. Open your Google Sheet
2. Find the row for accountant@businessproject.co.tz
3. Check the password column for the user
4. Remove any extra spaces
5. Ensure the password exactly matches "accountant147"

### Adding User to Sheet1 (if missing):
1. Add a new row to Sheet1
2. Fill in the columns:
   ```
   ID: 4
   Name: Accountant Name
   Email: accountant@businessproject.co.tz
   Password: accountant147
   Role: accountant
   ```

### Verifying Data Format:
1. Ensure the header row contains: ID, Name, Email, Password, Role
2. Ensure all user rows have data in all five columns
3. Ensure role values are lowercase
4. Ensure email format is valid

## New User Roles

The system now supports these user roles:
1. **admin**: Full access to all features
2. **manager**: Access to most features except administrative settings
3. **cashier**: Limited access, primarily for sales operations
4. **accountant**: Access to financial reports and accounting features
5. **sales**: Access to sales data and customer information
6. **finance**: Access to financial data and expense management

## When to Contact Support

Contact technical support if:

1. The user exists with correct credentials but still can't log in
2. You see API errors when fetching Sheet1 data
3. All data appears correct but authentication still fails
4. You suspect service account or API configuration issues

Provide the following information when contacting support:
1. Screenshot of the user's row in Sheet1 (hide passwords)
2. Results from the testing tools
3. Any error messages you see
4. Steps you've already taken to troubleshoot