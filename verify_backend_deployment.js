// Script to verify backend deployment status
const axios = require('axios');

async function verifyBackendDeployment() {
  const BACKEND_URL = 'https://google-sheets-rest-api-production.up.railway.app';
  
  console.log('🔍 VERIFYING BACKEND DEPLOYMENT STATUS\n');
  console.log(`Target URL: ${BACKEND_URL}\n`);
  
  // Test 1: Root endpoint
  console.log('1. Testing Root Endpoint...');
  try {
    const rootResponse = await axios.get(`${BACKEND_URL}/`, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'Deployment-Verification-Script'
      }
    });
    
    if (rootResponse.status === 200) {
      console.log(`   ✅ SUCCESS: Root endpoint accessible`);
      console.log(`   📄 Response: ${JSON.stringify(rootResponse.data.message || rootResponse.data, null, 2)}`);
    } else {
      console.log(`   ⚠️  WARNING: Unexpected status ${rootResponse.status}`);
    }
  } catch (error) {
    console.log(`   ❌ FAILED: ${error.message}`);
    if (error.response) {
      console.log(`      Status: ${error.response.status}`);
      console.log(`      Data: ${JSON.stringify(error.response.data)}`);
    }
  }
  
  console.log('');
  
  // Test 2: Health endpoint
  console.log('2. Testing Health Endpoint...');
  try {
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'Deployment-Verification-Script'
      }
    });
    
    if (healthResponse.status === 200) {
      console.log(`   ✅ SUCCESS: Health endpoint accessible`);
      console.log(`   🩺 Status: ${healthResponse.data.message || 'Healthy'}`);
      console.log(`   🕒 Uptime: ${healthResponse.data.uptime || 'N/A'}`);
    } else {
      console.log(`   ⚠️  WARNING: Unexpected status ${healthResponse.status}`);
    }
  } catch (error) {
    console.log(`   ❌ FAILED: ${error.message}`);
    if (error.response) {
      console.log(`      Status: ${error.response.status}`);
      console.log(`      Data: ${JSON.stringify(error.response.data)}`);
    }
  }
  
  console.log('');
  
  // Test 3: Metadata endpoint
  console.log('3. Testing Metadata Endpoint...');
  try {
    const metadataResponse = await axios.get(`${BACKEND_URL}/api/v1/sheets/metadata`, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'Deployment-Verification-Script'
      }
    });
    
    if (metadataResponse.status === 200) {
      console.log(`   ✅ SUCCESS: Metadata endpoint accessible`);
      if (metadataResponse.data && metadataResponse.data.data) {
        console.log(`   📄 Spreadsheet: ${metadataResponse.data.data.title || 'N/A'}`);
        console.log(`   📑 Sheets: ${metadataResponse.data.data.sheets ? metadataResponse.data.data.sheets.length : 0} found`);
      }
    } else {
      console.log(`   ⚠️  WARNING: Unexpected status ${metadataResponse.status}`);
    }
  } catch (error) {
    console.log(`   ❌ FAILED: ${error.message}`);
    if (error.response) {
      console.log(`      Status: ${error.response.status}`);
      console.log(`      Data: ${JSON.stringify(error.response.data)}`);
    }
  }
  
  console.log('');
  
  // Test 4: Sheet1 endpoint
  console.log('4. Testing Sheet1 Endpoint...');
  try {
    const sheet1Response = await axios.get(`${BACKEND_URL}/api/v1/sheets/Sheet1`, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'Deployment-Verification-Script'
      }
    });
    
    if (sheet1Response.status === 200) {
      console.log(`   ✅ SUCCESS: Sheet1 endpoint accessible`);
      if (sheet1Response.data && sheet1Response.data.data && sheet1Response.data.data.values) {
        console.log(`   📊 Rows: ${sheet1Response.data.data.values.length}`);
        if (sheet1Response.data.data.values.length > 0) {
          console.log(`   🔤 Header: ${sheet1Response.data.data.values[0].join(' | ')}`);
        }
      }
    } else {
      console.log(`   ⚠️  WARNING: Unexpected status ${sheet1Response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ FAILED: ${error.message}`);
    if (error.response) {
      console.log(`      Status: ${error.response.status}`);
      console.log(`      Data: ${JSON.stringify(error.response.data)}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 DEPLOYMENT VERIFICATION COMPLETE');
  console.log('='.repeat(50));
  console.log('\nIf all tests show ✅ SUCCESS, your backend is properly deployed!');
  console.log('If any tests show ❌ FAILED, check the deployment steps in BACKEND_DEPLOYMENT.md');
}

// Run verification
verifyBackendDeployment().catch(error => {
  console.error('🚨 UNEXPECTED ERROR:', error.message);
  console.log('\nPlease check your network connection and try again.');
});