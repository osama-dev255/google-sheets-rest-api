const https = require('http');

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
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/sheets/purchases/add-stock',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  let responseData = '';
  res.on('data', chunk => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();