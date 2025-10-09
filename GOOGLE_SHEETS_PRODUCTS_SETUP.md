# Google Sheets Products Sheet Setup Guide

## Overview
This guide explains how to properly set up your Products sheet in Google Sheets so that your frontend application can fetch the data through your backend Google Sheets API.

## Prerequisites
Before setting up your Products sheet, ensure you have:
1. A Google Cloud Project with the Google Sheets API enabled
2. A Service Account with Editor permissions to your spreadsheet
3. Your Google Sheets spreadsheet ID
4. Environment variables properly configured in your backend

## Setting Up the Products Sheet

### Step 1: Create the Products Sheet
1. Open your Google Spreadsheet
2. Create a new sheet and name it exactly "Products" (case-sensitive)
3. In the first row, enter the following headers:

```
ID,PRODUCT,CATEGORY,UNIT PRICE,UNIT COST,STOCK,MIN STOCK,SUPPLIER,STATUS
```

### Step 2: Add Your Product Data
Enter your product data starting from row 2 (row 1 is for headers). Here's an example format:

| ID | PRODUCT | CATEGORY | UNIT PRICE | UNIT COST | STOCK | MIN STOCK | SUPPLIER | STATUS |
|----|---------|----------|------------|-----------|-------|-----------|----------|--------|
| 1 | COKE 600MLS 12S/W NP | PET | 9700 | 8200 | 100 | 20 | Coca-Cola Tanzania | active |
| 2 | PEPSI 500ML BTL | PET | 5500 | 4200 | 75 | 15 | Pepsi Tanzania Ltd | active |

### Step 3: Data Format Guidelines
- **ID**: Unique identifier for each product (number or text)
- **PRODUCT**: Product name/description
- **CATEGORY**: Product category (e.g., PET, CAN, SNACKS, DAIRY)
- **UNIT PRICE**: Selling price in Tanzanian Shillings (numbers only, no "TSh" prefix)
- **UNIT COST**: Purchase cost in Tanzanian Shillings (numbers only)
- **STOCK**: Current inventory quantity (whole numbers)
- **MIN STOCK**: Minimum stock level that triggers reorder alerts (whole numbers)
- **SUPPLIER**: Name of the product supplier
- **STATUS**: Product status ("active" or "inactive")

### Step 4: Share Your Spreadsheet
1. Click the "Share" button in your Google Spreadsheet
2. Add your Service Account email address (from your Google Cloud credentials)
3. Grant "Editor" permissions
4. Click "Send"

## Backend Configuration
Ensure your backend environment variables are properly configured:

```
GOOGLE_SHEETS_PROJECT_ID=your-google-cloud-project-id
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-from-url
```

## Testing the Connection
To verify that your Products sheet is properly configured:

1. Start your backend server
2. Visit your application's Products page
3. The data should automatically load from your Google Sheets "Products" sheet
4. If the sheet is empty, you'll see the default sample product

## Adding More Products
To add more products to your inventory:

1. Go to your Google Spreadsheet
2. Navigate to the "Products" sheet
3. Add new rows below your existing data
4. Fill in all the required fields
5. Save the spreadsheet
6. Refresh your application - the new products should appear automatically

## Troubleshooting
If your products aren't showing up in the application:

1. **Check the sheet name**: Ensure it's exactly "Products" (case-sensitive)
2. **Verify headers**: Make sure the first row contains the exact headers
3. **Check sharing permissions**: Confirm your Service Account has Editor access
4. **Validate data format**: Ensure numbers don't contain currency symbols or commas
5. **Review backend logs**: Check for any API errors in your backend server logs

## Sample Product Data
Here's a sample of realistic product data for a Tanzanian retail business:

```
ID,PRODUCT,CATEGORY,UNIT PRICE,UNIT COST,STOCK,MIN STOCK,SUPPLIER,STATUS
1,COKE 600MLS 12S/W NP,PET,9700,8200,100,20,Coca-Cola Tanzania,active
2,PEPSI 500ML BTL,PET,5500,4200,75,15,Pepsi Tanzania Ltd,active
3,FANTA ORANGE 300ML CAN,CAN,3500,2500,50,10,Coca-Cola Tanzania,active
4,SPRITE 2L BTL,PET,4200,3200,40,8,Coca-Cola Tanzania,active
5,WATER 1.5L BOTTLE,PET,2500,1500,200,30,Aqua Distributors,active
6,LAYS CHIPS 70G,SNACKS,3500,2200,60,12,Unilever Tanzania,active
```

## Best Practices
1. **Regular Updates**: Update stock levels regularly to maintain accuracy
2. **Data Validation**: Use consistent formatting for all entries
3. **Backup**: Keep backups of important inventory data
4. **Status Management**: Use the STATUS field to hide discontinued products
5. **Supplier Information**: Keep supplier details accurate for reordering