import axios from 'axios';

const API_BASE_URL = 'https://google-sheets-rest-api-production.up.railway.app';

async function testAPI() {
  try {
    console.log('Testing detailed API endpoints...\n');
    
    // Test Sales sheet data
    console.log('1. Testing Sales sheet data...');
    const salesResponse = await axios.get(`${API_BASE_URL}/api/v1/sheets/Sales`);
    if (salesResponse.data.data && salesResponse.data.data.values) {
      console.log(`Sales sheet has ${salesResponse.data.data.values.length} rows`);
      if (salesResponse.data.data.values.length > 0) {
        console.log('Sales headers:', salesResponse.data.data.values[0]);
      }
      if (salesResponse.data.data.values.length > 1) {
        console.log('First sales record:', salesResponse.data.data.values[1]);
      }
      if (salesResponse.data.data.values.length > 2) {
        console.log('Second sales record:', salesResponse.data.data.values[2]);
      }
    }
    console.log('');
    
    // Test Inventory sheet data
    console.log('2. Testing Inventory sheet data...');
    const inventoryResponse = await axios.get(`${API_BASE_URL}/api/v1/sheets/Inventory`);
    if (inventoryResponse.data.data && inventoryResponse.data.data.values) {
      console.log(`Inventory sheet has ${inventoryResponse.data.data.values.length} rows`);
      if (inventoryResponse.data.data.values.length > 0) {
        console.log('Inventory headers:', inventoryResponse.data.data.values[0]);
      }
      if (inventoryResponse.data.data.values.length > 1) {
        console.log('First inventory record:', inventoryResponse.data.data.values[1]);
      }
    }
    console.log('');
    
    // Test Products sheet data
    console.log('3. Testing Products sheet data...');
    const productsResponse = await axios.get(`${API_BASE_URL}/api/v1/sheets/Products`);
    if (productsResponse.data.data && productsResponse.data.data.values) {
      console.log(`Products sheet has ${productsResponse.data.data.values.length} rows`);
      if (productsResponse.data.data.values.length > 0) {
        console.log('Products headers:', productsResponse.data.data.values[0]);
      }
      if (productsResponse.data.data.values.length > 1) {
        console.log('First product record:', productsResponse.data.data.values[1]);
      }
    }
    console.log('');
    
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();