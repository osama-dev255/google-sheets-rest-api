# Add Stock Endpoint Example

## Endpoint
```
POST http://localhost:3000/api/v1/sheets/purchases/add-stock
```

## Headers
```
Content-Type: application/json
```

## Request Body
```json
{
  "purchases": [
    {
      "productName": "COKE 600MLS 12S/W NP",
      "quantity": 5,
      "cost": 12.50,
      "supplier": "Coca-Cola Tanzania"
    }
  ]
}
```

## Expected Response
```json
{
  "success": true,
  "timestamp": "2025-10-09T16:18:54.253Z",
  "data": {
    "updatedItems": 5,
    "inventoryUpdates": 2,
    "productsUpdates": 3
  },
  "message": "Stock added successfully through purchases"
}
```

## What This Does
1. Adds 5 units to the inventory of "COKE 600MLS 12S/W NP"
2. Updates the unit cost to 12.50 in the Products sheet
3. Sets the supplier to "Coca-Cola Tanzania" in both sheets
4. Returns a summary of the updates performed

## Using with cURL (Linux/Mac)
```bash
curl -X POST http://localhost:3000/api/v1/sheets/purchases/add-stock \
  -H "Content-Type: application/json" \
  -d '{
  "purchases": [
    {
      "productName": "COKE 600MLS 12S/W NP",
      "quantity": 5,
      "cost": 12.50,
      "supplier": "Coca-Cola Tanzania"
    }
  ]
}'
```

## Using with PowerShell
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/v1/sheets/purchases/add-stock -Method POST -ContentType "application/json" -Body '{
  "purchases": [
    {
      "productName": "COKE 600MLS 12S/W NP",
      "quantity": 5,
      "cost": 12.50,
      "supplier": "Coca-Cola Tanzania"
    }
  ]
}'
```