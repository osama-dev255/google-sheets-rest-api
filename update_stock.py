import urllib.request
import urllib.parse
import json

# Update Inventory sheet
inventory_data = {
    "values": [
        ["2", "COKE 600MLS 12S/W NP", "PET", "60", "30", "200", "Ctn", "9700", "BLOCK A", "Coca-Cola Tanzania", "2025-10-09", "Active"]
    ]
}

# Update Products sheet
products_data = {
    "values": [
        ["2", "COKE 600MLS 12S/W NP", "PET", "9700", "9400", "60", "Coca-Cola Tanzania", "Active"]
    ]
}

# Convert to JSON
inventory_json = json.dumps(inventory_data).encode('utf-8')
products_json = json.dumps(products_data).encode('utf-8')

# Update Inventory sheet (row 2)
inventory_req = urllib.request.Request(
    'https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/Inventory/range/A2:L2',
    data=inventory_json,
    headers={'Content-Type': 'application/json'}
)
inventory_req.get_method = lambda: 'PUT'

# Update Products sheet (row 2)
products_req = urllib.request.Request(
    'https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/Products/range/A2:H2',
    data=products_json,
    headers={'Content-Type': 'application/json'}
)
products_req.get_method = lambda: 'PUT'

try:
    # Update Inventory
    inventory_response = urllib.request.urlopen(inventory_req)
    print(f"Inventory Update Status: {inventory_response.status}")
    print(f"Inventory Update Response: {inventory_response.read().decode('utf-8')}")
    
    # Update Products
    products_response = urllib.request.urlopen(products_req)
    print(f"Products Update Status: {products_response.status}")
    print(f"Products Update Response: {products_response.read().decode('utf-8')}")
    
except Exception as e:
    print(f"Error: {e}")