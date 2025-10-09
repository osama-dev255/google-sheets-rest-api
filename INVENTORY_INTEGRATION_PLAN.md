# Inventory Integration Plan

## Current Issues

1. **Mismatched Column Names**: The backend inventory update function looks for "Product Name" and "Current Stock" columns, but the actual Inventory sheet uses "PRODUCT" and "CURRENTSTOCK".

2. **No Link Between Products and Inventory**: The Products sheet and Inventory sheet are not properly synchronized.

3. **Incomplete Transaction Handling**: Sales and purchases are not properly updating inventory levels.

4. **Data Redundancy**: Product information exists in both Products and Inventory sheets without proper synchronization.

## Proposed Solution

### 1. Unified Product Management
- Use the Products sheet as the single source of truth for product information
- Link Inventory sheet to Products sheet using product ID or name
- Remove redundant product information from Inventory sheet

### 2. Corrected Inventory Update System
- Fix column name mapping in the backend inventory update function
- Implement proper synchronization between Products and Inventory sheets
- Ensure inventory updates affect both sheets consistently

### 3. Transaction Integration
- Sales transactions should decrease inventory in both Products and Inventory sheets
- Purchase transactions should increase inventory in both Products and Inventory sheets
- Implement proper error handling and rollback mechanisms

### 4. Data Structure Alignment
**Products Sheet (Current):**
```
ID | PRODUCT | CATEGORY | UNIT PRICE | UNIT COST | STOCK | SUPPLIER | STATUS
```

**Inventory Sheet (Current):**
```
ID | PRODUCT | CATEGORY | CURRENTSTOCK | RE-ORDER LEVEL | MAXSTOCK | UNIT | PRICE | LOCATION | SUPPLIER | LASTUPDATED | STATUS
```

**Proposed Simplified Inventory Sheet:**
```
ID | PRODUCT | CURRENTSTOCK | RE-ORDER LEVEL | MAXSTOCK | LOCATION | LASTUPDATED | STATUS
```

## Implementation Steps

### Phase 1: Backend Fixes
1. Update the inventory update function to use correct column names
2. Implement proper product lookup using ID or name matching
3. Add support for updating both Products and Inventory sheets

### Phase 2: Frontend Integration
1. Modify POS Terminal to update both sheets on checkout
2. Add purchase functionality to increase inventory
3. Implement real-time inventory synchronization

### Phase 3: Data Structure Optimization
1. Simplify Inventory sheet structure
2. Remove redundant columns
3. Ensure consistent naming conventions

## Benefits
1. **Data Consistency**: Single source of truth for product information
2. **Real-time Updates**: Inventory changes immediately reflected across all sheets
3. **Error Prevention**: Reduced data redundancy and inconsistency
4. **Scalability**: Easier to maintain and extend
5. **Accuracy**: Proper tracking of stock levels through all transactions

## Technical Implementation

### Backend Changes
1. Fix `updateInventoryQuantities` function in `sheets.ts`:
   - Correct column name mapping
   - Add support for updating Products sheet
   - Implement proper error handling

2. Add purchase transaction support:
   - New endpoint for purchase transactions
   - Increase inventory on purchases
   - Update both sheets consistently

### Frontend Changes
1. Update POS Terminal:
   - Modify `handleCheckout` to update both sheets
   - Add loading states and error handling

2. Add Purchase Management:
   - New component for recording purchases
   - Form for adding new stock
   - Real-time inventory updates

## Data Mapping
**Products Sheet → Inventory Sheet:**
- PRODUCT (Products) ↔ PRODUCT (Inventory)
- STOCK (Products) ↔ CURRENTSTOCK (Inventory)
- ID (Products) ↔ ID (Inventory)

## Validation
1. Test sales transactions reduce inventory correctly
2. Test purchase transactions increase inventory correctly
3. Verify both sheets are updated consistently
4. Check error handling for invalid product names
5. Ensure proper stock level validation