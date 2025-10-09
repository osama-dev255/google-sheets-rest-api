# Change Supplier Example

## Overview
You can change the supplier for a product by using the same purchase endpoint with a quantity of 0. This will update the supplier information without changing the stock levels.

## Endpoint
```
POST http://localhost:3000/api/v1/sheets/purchases/add-stock
```

## Headers
```
Content-Type: application/json
```

## Request Body to Change Supplier Only
```json
{
  "purchases": [
    {
      "productName": "COKE 600MLS 12S/W NP",
      "quantity": 0,
      "cost": 14.99,
      "supplier": "New Supplier Corporation"
    }
  ]
}
```

## Expected Response
```json
{
  "success": true,
  "timestamp": "2025-10-09T16:20:59.646Z",
  "data": {
    "updatedItems": 5,
    "inventoryUpdates": 2,
    "productsUpdates": 3
  },
  "message": "Stock added successfully through purchases"
}
```

## What This Does
1. Keeps the same stock quantity in both Inventory and Products sheets (since quantity is 0)
2. Updates the unit cost to 14.99 in the Products sheet
3. Changes the supplier to "New Supplier Corporation" in both sheets
4. Returns a summary of the updates performed

## Using with PowerShell
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/v1/sheets/purchases/add-stock -Method POST -ContentType "application/json" -Body '{
  "purchases": [
    {
      "productName": "COKE 600MLS 12S/W NP",
      "quantity": 0,
      "cost": 14.99,
      "supplier": "New Supplier Corporation"
    }
  ]
}'
```

## Verification
After changing the supplier, you can verify the change by fetching the product data:

### Check Inventory Sheet
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/v1/sheets/Inventory -Method GET | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object -ExpandProperty values | Where-Object { $_[1] -eq "COKE 600MLS 12S/W NP" } | Format-Table -Property @{Name="Product";Expression={$_[1]}}, @{Name="Stock";Expression={$_[3]}}, @{Name="Supplier";Expression={$_[9]}}
```

### Check Products Sheet
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/v1/sheets/Products -Method GET | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object -ExpandProperty values | Where-Object { $_[1] -eq "COKE 600MLS 12S/W NP" } | Format-Table -Property @{Name="Product";Expression={$_[1]}}, @{Name="Stock";Expression={$_[3]}}, @{Name="Unit Cost";Expression={$_[4]}}, @{Name="Supplier";Expression={$_[6]}}
```

## Notes
- Setting quantity to 0 means no change to stock levels
- The cost field is still required (you can keep the same value if you don't want to change it)
- The supplier field will be updated in both Inventory and Products sheets
- This approach maintains data consistency across both sheets