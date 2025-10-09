import urllib.request
import json

# Append new product to Products sheet
append_data = {
    "values": [
        ["11", "TEST PRODUCT", "TEST", "5000", "4500", "25", "Test Supplier", "Active"]
    ]
}

# Convert to JSON
append_json = json.dumps(append_data).encode('utf-8')

# Append to Products sheet
append_req = urllib.request.Request(
    'https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/Products/append',
    data=append_json,
    headers={'Content-Type': 'application/json'}
)
append_req.get_method = lambda: 'POST'

try:
    # Append product
    append_response = urllib.request.urlopen(append_req)
    print(f"Append Status: {append_response.status}")
    print(f"Append Response: {append_response.read().decode('utf-8')}")
    
except Exception as e:
    print(f"Error: {e}")