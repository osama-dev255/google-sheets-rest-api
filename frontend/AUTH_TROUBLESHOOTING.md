# Authentication Troubleshooting Guide

## Overview

This guide helps you troubleshoot authentication issues where users registered in Sheet1 are unable to log in to the system.

## Common Issues and Solutions

### 1. Users Not Found During Login

**Symptoms**: 
- User enters correct credentials but receives "Invalid email or password" error
- User is registered in Sheet1 but authentication fails

**Possible Causes**:
- Extra spaces in email or password fields
- Case sensitivity issues
- Malformed email addresses
- Incomplete user records

**Solutions**:
1. Check Sheet1 for extra spaces in email/password fields
2. Verify exact case matching for email and password
3. Ensure email addresses follow valid format (user@domain.com)
4. Confirm all required fields are filled for each user

### 2. Role Validation Errors

**Symptoms**: 
- "Invalid user role" error during login
- User exists in Sheet1 but cannot authenticate

**Possible Causes**:
- Role field contains invalid values
- Role field is empty or misspelled

**Solutions**:
1. Ensure role values are exactly one of: 'admin', 'manager', 'cashier'
2. Check for extra spaces or typos in role field
3. Verify role field is not empty

### 3. Data Structure Issues

**Symptoms**: 
- Authentication fails for all users
- "No user accounts found" error

**Possible Causes**:
- Missing or incorrect header row
- Sheet1 is empty or inaccessible
- API connectivity issues

**Solutions**:
1. Verify Sheet1 has correct header row: ID, Name, Email, Password, Role
2. Check that Sheet1 contains at least one user record (in addition to header)
3. Ensure Google Sheets API is properly configured
4. Verify service account has access to the spreadsheet

## Using the Authentication Diagnostics Tool

### Accessing the Tool
1. Log in as an admin user
2. Navigate to Settings
3. Click "Run Authentication Diagnostics" in the Authentication Diagnostics section

### Diagnostic Features

#### Sheet1 Diagnostic
- Analyzes Sheet1 structure and data
- Identifies users with incomplete or invalid data
- Reports missing headers or formatting issues
- Shows total user count and validation status

#### Credential Testing
- Test specific user credentials against Sheet1 data
- Identifies if user exists but password is incorrect
- Shows detailed user information including row number
- Provides specific error messages for troubleshooting

## Sheet1 Data Requirements

### Required Structure
Sheet1 must have the following structure:

| ID | Name | Email | Password | Role |
|----|------|-------|----------|------|
| 1 | John Smith | admin@businessproject.co.tz | securePassword123 | admin |
| 2 | Sarah Johnson | manager@businessproject.co.tz | managerPass456 | manager |
| 3 | Mike Wilson | cashier@businessproject.co.tz | cashierPass789 | cashier |

### Field Requirements
1. **ID**: Unique identifier (can be any string or number)
2. **Name**: User's full name
3. **Email**: Valid email format, must be unique
4. **Password**: User's password (stored in plain text)
5. **Role**: Must be exactly 'admin', 'manager', or 'cashier'

### Best Practices
1. No extra spaces in any fields
2. Email addresses must be unique
3. All fields must be filled for each user
4. Role values must be lowercase
5. Passwords should be secure and regularly updated

## Troubleshooting Steps

### Step 1: Run Sheet1 Diagnostic
1. Access the Authentication Diagnostics tool
2. Click "Run Sheet1 Diagnostic"
3. Review the results for any issues

### Step 2: Test Specific Credentials
1. Enter the email and password of the problematic user
2. Click "Test Credentials"
3. Review the detailed results

### Step 3: Check Sheet1 in Google Sheets
1. Open your Google Spreadsheet
2. Navigate to Sheet1
3. Verify the data structure matches requirements
4. Check for extra spaces, formatting issues, or missing data

### Step 4: Verify API Configuration
1. Confirm Google Sheets API is enabled
2. Verify service account has Editor access to the spreadsheet
3. Check that environment variables are correctly set

## Common Fixes

### Fixing Extra Spaces
1. In Google Sheets, select the problematic cells
2. Use TRIM function to remove extra spaces
3. Re-save the data

### Fixing Case Sensitivity
1. Ensure email and password match exactly (case-sensitive)
2. Consider using lowercase for all emails for consistency

### Fixing Role Issues
1. Ensure role values are exactly: 'admin', 'manager', or 'cashier'
2. Check for typos or extra characters

## Advanced Troubleshooting

### Checking API Logs
If issues persist, check the backend API logs for:
- Authentication errors
- Spreadsheet access errors
- Network connectivity issues

### Network Issues
- Verify internet connectivity
- Check firewall settings
- Ensure API endpoints are accessible

### Service Account Issues
- Confirm service account email has access to the spreadsheet
- Verify private key is properly formatted
- Check that Google Sheets API is enabled in Google Cloud project

## Contact Support

If you continue to experience authentication issues after following this guide:

1. Document the specific error messages
2. Take screenshots of Sheet1 data (excluding passwords)
3. Note which users are affected
4. Contact technical support with this information

## Security Considerations

### Current Implementation
- Passwords are stored in plain text in Google Sheets
- Authentication is performed by comparing plain text values
- User sessions are maintained in browser localStorage

### Recommended Improvements
1. Implement password hashing before storing in Google Sheets
2. Use HTTPS for all communications
3. Implement proper session management with expiration
4. Add rate limiting to prevent brute force attacks
5. Consider implementing two-factor authentication