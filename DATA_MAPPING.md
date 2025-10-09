# Data Mapping Between Google Sheets and Frontend Display

## Overview
This document explains how data from your Google Sheets is mapped to the frontend display in your application.

## Products Sheet Structure in Google Sheets
Your Google Sheets "Products" sheet contains the following columns:

| Column Index | Column Name | Description |
|--------------|-------------|-------------|
| A | ID | Unique product identifier |
| B | PRODUCT | Product name/description |
| C | CATEGORY | Product category |
| D | UNIT PRICE | Selling price in TSh |
| E | UNIT COST | Purchase cost in TSh |
| F | STOCK | Current inventory quantity |
| G | SUPPLIER | Supplier name |
| H | STATUS | Product status (Active/In-Active) |

## Products Page Display Mapping
The Products page table displays data with the following mapping:

| Display Column | Google Sheets Source | Data Processing |
|----------------|----------------------|-----------------|
| Product | Column B (PRODUCT) | Direct mapping |
| Category | Column C (CATEGORY) | Direct mapping |
| Price | Column D (UNIT PRICE) | Converted to number |
| Cost | Column E (UNIT COST) | Converted to number |
| Stock | Column F (STOCK) | Converted to integer |
| Status | Column H (STATUS) | Direct mapping |

## POS Terminal Display Mapping
The POS Terminal displays product cards with the following mapping:

| Display Element | Google Sheets Source | Data Processing |
|-----------------|----------------------|-----------------|
| Product Name | Column B (PRODUCT) | Direct mapping |
| Price | Column D (UNIT PRICE) | Converted to number |
| Stock Badge | Column F (STOCK) | Converted to integer |

## Data Flow
1. Frontend makes API call to `https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/Products`
2. Backend retrieves data from Google Sheets
3. Frontend processes the data:
   - Skips the first row (headers)
   - Maps each row's columns to the appropriate fields
   - Converts data types (string to number/integer where needed)
4. Data is displayed in the UI components

## Current Data Example
Based on your actual data, here's how one product appears in different parts of the application:

### In Google Sheets:
```
ID: 2
PRODUCT: COKE 600MLS 12S/W NP
CATEGORY: PET
UNIT PRICE: 9700
UNIT COST: 9400
STOCK: 50
SUPPLIER: Coca-Cola Tanzania
STATUS: Active
```

### In Products Page Table:
| Product | Category | Price | Cost | Stock | Status |
|---------|----------|-------|------|-------|--------|
| COKE 600MLS 12S/W NP | PET | TSh9,700 | TSh9,400 | 50 | Active |

### In POS Terminal Card:
- Product Name: COKE 600MLS 12S/W NP
- Price: TSh9,700
- Stock Badge: 50 in stock

## Notes
1. The SUPPLIER column (Column G) is retrieved but not currently displayed in either view
2. The MIN STOCK column that was in some frontend code examples doesn't exist in your actual sheet
3. The frontend correctly handles the data mapping even though the column names in the UI are slightly different from the Google Sheets column names
4. All numeric values are properly converted from strings to numbers for calculations and display