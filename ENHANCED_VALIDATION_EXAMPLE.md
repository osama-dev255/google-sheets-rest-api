# Enhanced Validation Example

## Overview
The Add Stock form has been enhanced with improved validation that requires all fields to be filled, including strict validation for the cost field.

## Enhanced Validation Rules
1. Product name must be selected
2. Quantity must be greater than 0
3. Cost must be provided and be a valid number (including zero)
4. Supplier must be provided

## Cost Validation Details
The cost field validation now checks for:
- Null values
- Undefined values
- NaN (Not a Number) values
- Negative values (must be zero or positive)

## Example Error Messages

### Missing Cost Value
```
Error: Please fill all required fields: Item "Product Name": missing cost (required)
```

### Invalid Cost Value (NaN)
```
Error: Please fill all required fields: Item "Product Name": missing cost (required)
```

### Negative Cost Value
```
Error: Please fill all required fields: Item "Product Name": missing cost (must be positive)
```

### Multiple Issues Including Cost
```
Error: Please fill all required fields: Item "Product Name": missing cost (required), supplier; Item "Another Product": missing cost (must be positive)
```

## Validation Logic
The enhanced validation logic checks each item in the form and identifies missing or invalid fields:

```typescript
// Check for any items with missing fields and provide specific error
const invalidItems = purchaseItems.filter(item => 
  !item.productName || item.quantity <= 0 || !item.supplier || 
  item.cost === null || item.cost === undefined || isNaN(item.cost) || item.cost < 0
);

if (invalidItems.length > 0) {
  const missingFields: string[] = [];
  invalidItems.forEach(item => {
    const missing: string[] = [];
    if (!item.productName) missing.push('product');
    if (item.quantity <= 0) missing.push('quantity');
    if (item.cost === null || item.cost === undefined || isNaN(item.cost)) {
      missing.push('cost (required)');
    } else if (item.cost < 0) {
      missing.push('cost (must be positive)');
    }
    if (!item.supplier) missing.push('supplier');
    missingFields.push(`Item "${item.productName || 'unnamed'}": missing ${missing.join(', ')}`);
  });
  throw new Error(`Please fill all required fields: ${missingFields.join('; ')}`);
}
```

## User Experience
1. When the user clicks "Add Stock" with incomplete or invalid data, they will see a red error message
2. The error message clearly identifies which fields are missing or invalid for each item
3. Specific messaging for cost field issues (required vs. must be positive)
4. The form will not submit to the backend until all validation requirements are met
5. Valid items will be processed successfully once all validation requirements are met

## Testing Scenarios
You can test the validation by:
1. Leaving the cost field empty
2. Entering invalid values like "abc" in the cost field
3. Setting cost to a negative number
4. Setting cost to zero (this is valid)
5. Leaving any other field empty

The form will prevent submission and display appropriate error messages to guide the user.