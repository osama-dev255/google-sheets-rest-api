# Sheet Renaming Plan

## Overview
This document outlines the plan to rename the Google Sheets from their current Swahili names to English names for better clarity and internationalization.

## Current Sheet Names
1. **Mauzo** - Sales records
2. **Manunuzi** - Purchase records
3. **Form Ya Mauzo** - Sales forms
4. **Form Ya Manunuzi** - Purchase forms

## New Sheet Names
1. **Sales** - Sales records
2. **Purchases** - Purchase records
3. **Sales Forms** - Sales forms
4. **Purchase Forms** - Purchase forms

## Implementation Steps

### Phase 1: Code Updates
1. Update all frontend code references from "Mauzo" to "Sales"
2. Update all frontend code references from "Manunuzi" to "Purchases"
3. Update all frontend code references from "Form Ya Mauzo" to "Sales Forms"
4. Update all frontend code references from "Form Ya Manunuzi" to "Purchase Forms"

### Phase 2: Backend Updates
1. Update documentation files to reflect new sheet names
2. Update any backend references (if any)

### Phase 3: Google Sheets Renaming
1. Rename the actual sheets in Google Sheets
2. Update the spreadsheet structure documentation

## Files to Update

### Frontend Files
1. `src/components/EndOfDayReport.tsx` - Mauzo
2. `src/pages/Cashflow.tsx` - Mauzo, Manunuzi
3. `src/pages/Customers.tsx` - Form Ya Mauzo
4. `src/pages/Purchases.tsx` - Manunuzi

### Documentation Files
1. `CRITICAL_DOCKER_FIX.md`
2. `DEPLOYMENT_SUCCESS.md`
3. `FINAL_DEPLOYMENT_SUMMARY.md`
4. `FIX_INSTRUCTIONS.md`
5. `FRONTEND_BACKEND_INTEGRATION.md`
6. `FRONTEND_RAILWAY_DEPLOYMENT_SUMMARY.md`
7. `SPREADSHEET_STRUCTURE.md`

## Benefits
1. **Better Clarity**: English names are more universally understood
2. **Professional Appearance**: Standard business terminology
3. **Easier Maintenance**: More intuitive for developers
4. **Internationalization**: Better for global teams

## Rollout Plan
1. Update code references first
2. Deploy updated application
3. Rename sheets in Google Sheets
4. Update documentation
5. Verify all functionality works with new names

## Testing
1. Verify Sales page loads data correctly
2. Verify Purchases page loads data correctly
3. Verify Customers page loads data correctly
4. Verify Cashflow page loads data correctly
5. Verify End of Day Report works correctly