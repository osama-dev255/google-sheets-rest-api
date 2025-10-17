// Simple script to test if the backend is accessible
const axios = require('axios');

async function testBackend() {
  const BACKEND_URL = 'https://google-sheets-rest-api-production.up.railway.app';
  
  console.log('Testing backend accessibility...\n');
  
  try {
    console.log(`1. Testing root endpoint: ${BACKEND_URL}/`);
    const rootResponse = await axios.get(`${BACKEND_URL}/`, { timeout: 10000 });
    console.log(`   ✅ Status: ${rootResponse.status}`);
    console.log(`   ✅ Data:`, JSON.stringify(rootResponse.data, null, 2));
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   ❌ Status: ${error.response.status}`);
      console.log(`   ❌ Data:`, JSON.stringify(error.response.data, null, 2));
    }
  }
  
  console.log('');
  
  try {
    console.log(`2. Testing health endpoint: ${BACKEND_URL}/health`);
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log(`   ✅ Status: ${healthResponse.status}`);
    console.log(`   ✅ Data:`, JSON.stringify(healthResponse.data, null, 2));
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   ❌ Status: ${error.response.status}`);
      console.log(`   ❌ Data:`, JSON.stringify(error.response.data, null, 2));
    }
  }
  
  console.log('');
  
  try {
    console.log(`3. Testing metadata endpoint: ${BACKEND_URL}/api/v1/sheets/metadata`);
    const metadataResponse = await axios.get(`${BACKEND_URL}/api/v1/sheets/metadata`, { timeout: 10000 });
    console.log(`   ✅ Status: ${metadataResponse.status}`);
    console.log(`   ✅ Data:`, JSON.stringify(metadataResponse.data, null, 2));
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   ❌ Status: ${error.response.status}`);
      console.log(`   ❌ Data:`, JSON.stringify(error.response.data, null, 2));
    }
  }
}

testBackend();