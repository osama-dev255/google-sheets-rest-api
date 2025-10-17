# Sheet1 Inspection Guide

## Overview

This guide explains how to inspect your Sheet1 data to troubleshoot authentication issues where users registered in Sheet1 are unable to log in.

## Methods to Inspect Sheet1

### 1. Using the HTML Inspector (Recommended for Quick Check)

1. Open the `inspect_sheet1.html` file in your web browser
2. Click the "Inspect Sheet1 Data" button
3. View the results which will show:
   - Total rows in Sheet1
   - Header row structure
   - First 10 data rows
   - Analysis of data issues

### 2. Using the Node.js Script

1. Open a terminal/command prompt
2. Navigate to your project directory
3. Run the script with: `node inspect_sheet1.js`
4. View the results in the terminal

### 3. Using the Built-in Diagnostics (When Application is Running)

1. Start your application
2. Log in as an admin user
3. Navigate to Settings
4. Click "Run Authentication Diagnostics"
5. Use the "Sheet1 Inspection" tab to view data

## What to Look for in Sheet1 Data

### Required Structure

Sheet1 must have the following structure in the first row (header):

| ID | Name | Email | Password | Role |
|----|------|-------|----------|------|

### Data Requirements

1. **ID**: Unique identifier for each user (any string or number)
2. **Name**: User's full name
3. **Email**: Valid email format (user@domain.com)
4. **Password**: User's password (stored in plain text)
5. **Role**: Must be exactly one of:
   - `admin`
   - `manager`
   - `cashier`

### Common Issues

1. **Missing Headers**: Ensure all five required headers are present in the first row
2. **Incomplete Rows**: Each user row must have data in all five columns
3. **Invalid Email Format**: Emails must follow standard format (user@domain.com)
4. **Invalid Roles**: Role must be exactly "admin", "manager", or "cashier" (lowercase)
5. **Extra Spaces**: Check for leading/trailing spaces in any field
6. **Case Sensitivity**: Emails and passwords are case-sensitive

## Troubleshooting Steps

### Step 1: Check Header Row

Verify that your first row contains exactly these headers:
```
ID | Name | Email | Password | Role
```

### Step 2: Check User Data

For each user row, ensure:
1. All five columns have data
2. Email follows valid format
3. Role is one of the allowed values
4. No extra spaces in fields

### Step 3: Test Specific Users

If some users can't log in:
1. Find their row in the displayed data
2. Verify email and password match exactly (case-sensitive)
3. Check for any formatting issues

### Step 4: Common Fixes

1. **Remove Extra Spaces**:
   - In Google Sheets, use `=TRIM()` function on problematic cells
   - Manually remove spaces at beginning/end of fields

2. **Fix Email Format**:
   - Ensure emails contain @ symbol
   - Ensure emails contain domain (e.g., .com, .org)

3. **Fix Role Values**:
   - Ensure roles are lowercase
   - Ensure roles are exactly "admin", "manager", or "cashier"

4. **Complete Incomplete Rows**:
   - Fill in any empty cells
   - Remove rows that are meant to be empty

## Example of Correct Sheet1 Data

| ID | Name | Email | Password | Role |
|----|------|-------|----------|------|
| 1 | John Smith | admin@businessproject.co.tz | securePassword123 | admin |
| 2 | Sarah Johnson | manager@businessproject.co.tz | managerPass456 | manager |
| 3 | Mike Wilson | cashier@businessproject.co.tz | cashierPass789 | cashier |

## When to Contact Support

Contact technical support if:

1. The inspection tools show "Failed to fetch Sheet1 data"
2. You see authentication errors in the application logs
3. All data appears correct but users still can't log in
4. You suspect API or service account issues

Provide the following information when contacting support:
1. Screenshot of your Sheet1 data (hide passwords)
2. Error messages from the inspection tools
3. Steps you've already taken to troubleshoot