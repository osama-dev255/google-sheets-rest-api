// Simple backend test using built-in http module
const https = require('https');

function testUrl(url, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n${description}: ${url}`);
    
    const req = https.get(url, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Headers: ${JSON.stringify(res.headers['content-type'])}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`   Response: ${JSON.stringify(jsonData, null, 2)}`);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          console.log(`   Response (text): ${data.substring(0, 200)}...`);
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (e) => {
      console.log(`   Error: ${e.message}`);
      reject(e);
    });
    
    req.setTimeout(10000, () => {
      console.log(`   Error: Request timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

async function testBackend() {
  console.log('🚀 TESTING BACKEND DEPLOYMENT STATUS');
  console.log('=====================================');
  
  const BACKEND_URL = 'https://google-sheets-rest-api-production.up.railway.app';
  
  try {
    // Test root endpoint
    await testUrl(`${BACKEND_URL}/`, '1. Root Endpoint');
    
    // Test health endpoint
    await testUrl(`${BACKEND_URL}/health`, '2. Health Endpoint');
    
    // Test metadata endpoint
    await testUrl(`${BACKEND_URL}/api/v1/sheets/metadata`, '3. Metadata Endpoint');
    
    console.log('\n✅ BACKEND TESTS COMPLETED');
    console.log('If you see responses above, your backend is accessible!');
    
  } catch (error) {
    console.log(`\n❌ ERROR: ${error.message}`);
    console.log('Please check your network connection and backend deployment status.');
  }
}

testBackend();