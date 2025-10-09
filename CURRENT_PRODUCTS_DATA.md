# Current Products Data in Your Google Sheets

## Overview
Your Google Sheets "Products" sheet is already populated with real product data. The application is correctly fetching this data from your backend at `https://google-sheets-rest-api-production.up.railway.app`.

## Current Data Structure
The Products sheet has the following columns:
| Column | Field | Description |
|--------|-------|-------------|
| A | ID | Unique product identifier |
| B | PRODUCT | Product name/description |
| C | CATEGORY | Product category (e.g., PET, RGB) |
| D | UNIT PRICE | Selling price in Tanzanian Shillings (TSh) |
| E | UNIT COST | Purchase cost in Tanzanian Shillings (TSh) |
| F | STOCK | Current inventory quantity |
| G | SUPPLIER | Supplier name |
| H | STATUS | Product status (Active/In-Active) |

## Current Product Data
Your sheet currently contains 10 products:

1. **SPAR PINUT 350ML 24 RB** (ID: 1)
   - Category: RGB
   - Price: TSh12,800
   - Cost: TSh12,000
   - Stock: 42
   - Supplier: Coca-Cola Tanzania
   - Status: Active

2. **COKE 600MLS 12S/W NP** (ID: 2)
   - Category: PET
   - Price: TSh9,700
   - Cost: TSh9,400
   - Stock: 50
   - Supplier: Coca-Cola Tanzania
   - Status: Active

3. **SPRITE 600ML 12 S/W NP** (ID: 3)
   - Category: PET
   - Price: TSh9,700
   - Cost: TSh9,400
   - Stock: 30
   - Supplier: Coca-Cola Tanzania
   - Status: Active

4. **KREST BITTER LEMON 300MLS CR24 RB** (ID: 4)
   - Category: RGB
   - Price: TSh12,800
   - Cost: TSh12,000
   - Stock: 60
   - Supplier: Coca-Cola Tanzania
   - Status: Active

5. **SPRITE 350MLS CR24 RB** (ID: 5)
   - Category: RGB
   - Price: TSh12,800
   - Cost: TSh12,000
   - Stock: 200
   - Supplier: Coca-Cola Tanzania
   - Status: Active

6. **FANTA ORANGE 350ML CR 24 RB** (ID: 6)
   - Category: RGB
   - Price: TSh12,800
   - Cost: TSh12,000
   - Stock: 100
   - Supplier: Coca-Cola Tanzania
   - Status: Active

7. **FANTA PASSION 350 MLS CR24 RB** (ID: 7)
   - Category: RGB
   - Price: TSh12,800
   - Cost: TSh12,000
   - Stock: 39
   - Supplier: Coca-Cola Tanzania
   - Status: Active

8. **FANTA PAINEAPPLE 350MLS CR24 RB** (ID: 8)
   - Category: RGB
   - Price: TSh12,800
   - Cost: TSh12,000
   - Stock: 59
   - Supplier: Coca-Cola Tanzania
   - Status: In-Active

9. **COKE 350ML CR 24 RB** (ID: 9)
   - Category: RGB
   - Price: TSh12,800
   - Cost: TSh12,000
   - Stock: 80
   - Supplier: Coca-Cola Tanzania
   - Status: In-Active

10. **KREST TONIC 300MLS CR24 RB** (ID: 10)
    - Category: RGB
    - Price: TSh12,800
    - Cost: TSh12,000
    - Stock: 50
    - Supplier: Coca-Cola Tanzania
    - Status: In-Active

## Data Analysis
- All products are supplied by Coca-Cola Tanzania
- Most products are in the RGB category (7 products)
- Three products are in the PET category (2 products)
- One product is in an unidentified category (SPAR PINUT)
- Seven products are active, three are inactive
- Pricing is consistent with most products priced at TSh12,800
- The COKE 600MLS and SPRITE 600ML products are priced lower at TSh9,700

## Application Integration
The frontend application is correctly fetching this data from your backend API. When you view the Products page or use the POS Terminal, you're seeing this real data from your Google Sheets.

## Maintenance
To update your product inventory:
1. Go to your Google Spreadsheet
2. Navigate to the "Products" sheet
3. Modify existing data or add new rows
4. The changes will automatically appear in your application

Note that your current sheet structure has 8 columns, while the frontend code was expecting 9 columns (with a MIN STOCK column). The application is still working because it handles missing data gracefully.