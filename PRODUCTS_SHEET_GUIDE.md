# Products Sheet Guide

## Overview
This guide explains how to set up and use the Products sheet in your Google Sheets integration. The Products sheet is used by both the Products page and the POS Terminal in the application.

## Sheet Structure
The Products sheet must have the following column structure:

| Column | Field Name | Description |
|--------|------------|-------------|
| A | ID | Unique product identifier |
| B | PRODUCT | Product name/description |
| C | CATEGORY | Product category (e.g., PET, CAN, SNACKS) |
| D | UNIT PRICE | Selling price in Tanzanian Shillings (TSh) |
| E | UNIT COST | Purchase cost in Tanzanian Shillings (TSh) |
| F | STOCK | Current inventory quantity |
| G | MIN STOCK | Minimum stock level (triggers reorder alert) |
| H | SUPPLIER | Supplier name |
| I | STATUS | Product status (active/inactive) |

## Sample Data
We've provided realistic sample data that represents a small retail business in Tanzania:

1. **Beverages**: Soft drinks in various packaging (PET bottles, cans)
2. **Snacks**: Popular chip and confectionery brands
3. **Basic Goods**: Bread, milk, eggs
4. **Fresh Produce**: Vegetables
5. **Staples**: Rice and other basics

## How to Import Data

### Method 1: CSV Import
1. Open your Google Spreadsheet
2. Create a new sheet named "Products"
3. Go to File → Import → Upload
4. Select the `products_sheet_data.csv` file
5. Choose "Replace spreadsheet" or "Insert new sheet"

### Method 2: Manual Entry
1. Create a new sheet named "Products"
2. Enter the headers in the first row:
   ```
   ID,PRODUCT,CATEGORY,UNIT PRICE,UNIT COST,STOCK,MIN STOCK,SUPPLIER,STATUS
   ```
3. Enter the product data row by row

## Data Validation Rules
To maintain data integrity, consider setting up these validation rules:

1. **ID Column (A)**: Unique numbers or text identifiers
2. **UNIT PRICE (D) & UNIT COST (E)**: Numbers only, no currency symbols
3. **STOCK (F) & MIN STOCK (G)**: Whole numbers only
4. **STATUS (I)**: Dropdown with "active" and "inactive" options

## Application Integration
The application automatically reads from the "Products" sheet:
- The Products page displays all product information
- The POS Terminal uses PRODUCT, UNIT PRICE, and STOCK columns
- Stock levels are checked during sales transactions

## Maintenance Tips
1. Regularly update STOCK levels after transactions
2. Adjust UNIT PRICE based on market conditions
3. Set appropriate MIN STOCK levels based on sales velocity
4. Mark discontinued products as "inactive" in STATUS column
5. Add new products at the bottom of the sheet

## Troubleshooting
If products don't appear in the application:
1. Verify the sheet is named exactly "Products"
2. Check that headers match the expected column names
3. Ensure STATUS is set to "active" for visible products
4. Confirm STOCK levels are greater than zero