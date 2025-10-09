import requests
import json

url = "https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/purchases/add-stock"

payload = {
    "purchases": [
        {
            "productName": "COKE 600MLS 12S/W NP",
            "quantity": 10,
            "cost": 9400
        }
    ]
}

headers = {
    'Content-Type': 'application/json'
}

response = requests.post(url, data=json.dumps(payload), headers=headers)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")