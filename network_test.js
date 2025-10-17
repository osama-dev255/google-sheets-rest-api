// Simple network connectivity test
const dns = require('dns');
const https = require('https');

console.log('🔍 NETWORK CONNECTIVITY TEST\n');

// Test DNS resolution
console.log('1. Testing DNS resolution for railway.app...');
dns.resolve4('google-sheets-rest-api-production.up.railway.app', (err, addresses) => {
  if (err) {
    console.log(`   ❌ DNS resolution failed: ${err.message}`);
  } else {
    console.log(`   ✅ DNS resolved successfully`);
    console.log(`   📍 IP addresses: ${addresses.join(', ')}`);
  }
  
  // Test HTTPS connection
  console.log('\n2. Testing HTTPS connection...');
  const req = https.get('https://google-sheets-rest-api-production.up.railway.app/health', (res) => {
    console.log(`   ✅ HTTPS connection successful`);
    console.log(`   📡 Status code: ${res.statusCode}`);
    
    res.on('data', (chunk) => {
      try {
        const data = JSON.parse(chunk);
        console.log(`   📄 Response: ${JSON.stringify(data, null, 2)}`);
      } catch (e) {
        console.log(`   📄 Response: ${chunk.toString()}`);
      }
    });
  });
  
  req.on('error', (e) => {
    console.log(`   ❌ HTTPS connection failed: ${e.message}`);
  });
  
  req.setTimeout(10000, () => {
    console.log(`   ⏱️  HTTPS connection timeout`);
    req.destroy();
  });
  
  req.end();
});