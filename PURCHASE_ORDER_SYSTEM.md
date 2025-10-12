# Purchase Order System Documentation

## Overview

The Purchase Order system allows users to create and manage purchase orders for inventory items. The system integrates with Google Sheets to store purchase order data in a structured format.

## Components

### 1. Frontend Components

#### PurchaseOrderForm.tsx
- Main form component for creating new purchase orders
- Allows users to specify order details (order number, supplier, dates, etc.)
- Supports multiple line items with product details, quantities, and pricing
- Calculates totals with tax (18% VAT)
- Validates form data before submission
- Submits data to the backend API

#### PurchaseOrderList.tsx
- Displays a list of existing purchase orders
- Provides search and filtering capabilities
- Shows order status with color-coded badges
- Allows viewing, editing, and deleting orders

#### PurchaseOrderTracking.tsx
- Advanced tracking view for purchase orders
- Shows order status progression
- Includes charts and analytics
- Displays order timeline with events

### 2. Backend API Endpoints

#### POST /api/v1/sheets/purchases/add-stock
- Adds stock through purchase transactions
- Updates both Inventory and Products sheets
- Records purchase in the Purchases sheet
- Handles timezone correctly (Africa/Nairobi)

#### POST /api/v1/sheets/:sheetName/append
- Generic endpoint for appending data to any sheet
- Used by the purchase order form to add orders to the "Purchase Orders" sheet

### 3. Google Sheets Structure

#### Purchase Orders Sheet
| Column | Description |
|--------|-------------|
| Order Number | Unique identifier for the purchase order |
| Supplier | Name of the supplier |
| Order Date | Date the order was created |
| Expected Delivery | Expected delivery date |
| Status | Current status (pending, approved, ordered, received, cancelled) |
| Product | Product name |
| Description | Product description |
| Quantity | Quantity ordered |
| Unit Price | Price per unit |
| Total | Total cost for this line item |
| Notes | Additional notes |

#### Purchases Sheet
Tracks individual purchase transactions:
| Column | Description |
|--------|-------------|
| ID | Unique purchase ID |
| RECEIPT NO. | Receipt number |
| DATE | Purchase date |
| TIME | Purchase time |
| PRODUCT | Product name |
| CATEGORY | Product category |
| QUANTITY | Quantity purchased |
| COST | Unit cost |
| AMOUNT | Total amount |
| LOCATION | Storage location |
| SUPPLIER | Supplier name |
| STATUS | Purchase status |
| PURCHASED BY | User who made the purchase |

## Data Flow

1. User fills out the PurchaseOrderForm with order details
2. Form validates all required fields
3. On submission, form sends data to `/api/v1/sheets/Purchase Orders/append`
4. Backend appends the data to the Google Sheets "Purchase Orders" sheet
5. Each line item in the order creates a separate row in the sheet
6. Purchase orders can be viewed in the PurchaseOrderList or PurchaseOrderTracking components

## Key Features

### Form Validation
- Required fields are marked with asterisks
- Numeric fields (quantity, unit price) are validated
- Real-time calculation of line item totals
- Automatic calculation of order subtotal, tax, and total

### Auto-generated Order Numbers
- Order numbers are automatically generated in the format: PO-YYMMDD-XXXX
- Users can override the auto-generated number if needed

### Responsive Design
- Works on desktop and mobile devices
- Adapts layout based on screen size
- Touch-friendly controls for mobile users

### Error Handling
- Clear error messages for validation failures
- Graceful handling of API errors
- Loading states during form submission

## Integration with Inventory System

When items are received against a purchase order:
1. Use the "Add Stock" functionality to update inventory
2. This updates both the Inventory and Products sheets
3. Records the transaction in the Purchases sheet
4. Maintains accurate stock levels and cost information

## Testing

To test the purchase order system:

1. Run the frontend application
2. Navigate to the purchase order form
3. Fill out a test order with multiple items
4. Submit the form
5. Verify the data appears in the Google Sheets "Purchase Orders" sheet
6. Check that the order appears in the purchase order list

Test scripts are available in the project root:
- `test_purchase_order_form.js` - Tests direct API submission
- `test_purchases_recording.js` - Tests the add-stock functionality

## Troubleshooting

### Common Issues

1. **Form submission fails**
   - Check that all required fields are filled
   - Verify that quantity and unit price are greater than zero
   - Ensure the backend API is running and accessible

2. **Data not appearing in Google Sheets**
   - Verify Google Sheets credentials are configured correctly
   - Check that the spreadsheet ID is correct
   - Ensure the service account has edit access to the spreadsheet

3. **Incorrect timestamps**
   - System uses Africa/Nairobi timezone for all timestamps
   - Verify server timezone settings if timestamps appear incorrect

### Error Messages

- "Failed to create purchase order" - Generic error, check console for details
- "Order number is required" - Order number field is empty
- "Supplier is required" - Supplier field is empty
- "Expected delivery date is required" - Delivery date is not set
- "Product is required" - Product name is missing for a line item
- "Quantity must be greater than 0" - Invalid quantity value
- "Unit price must be greater than 0" - Invalid unit price value

## Future Enhancements

1. **Purchase Order Approval Workflow**
   - Multi-level approval process
   - Email notifications for approvals
   - Audit trail of approval actions

2. **Supplier Management**
   - Supplier database with contact information
   - Supplier performance tracking
   - Preferred supplier recommendations

3. **Advanced Reporting**
   - Purchase order analytics
   - Spending by category/supplier
   - Budget vs actual comparison

4. **Integration with Accounting Systems**
   - Export to accounting software
   - Generate invoices
   - Track payments

5. **Mobile App**
   - Dedicated mobile application
   - Offline capability
   - Barcode scanning for product entry