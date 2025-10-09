const https = require('https');

const data = JSON.stringify({
  purchases: [
    {
      productName: "COKE 600MLS 12S/W NP",
      quantity: 10,
      cost: 9400
    }
  ]
});

const options = {
  hostname: 'google-sheets-rest-api-production.up.railway.app',
  port: 443,
  path: '/api/v1/sheets/purchases/add-stock',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();