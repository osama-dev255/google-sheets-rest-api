import axios from 'axios';

const API_BASE_URL = 'https://google-sheets-rest-api-production.up.railway.app';

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('Health:', healthResponse.data);
    console.log('');
    
    // Test metadata endpoint
    console.log('2. Testing metadata endpoint...');
    const metadataResponse = await axios.get(`${API_BASE_URL}/api/v1/sheets/metadata`);
    console.log('Metadata:', JSON.stringify(metadataResponse.data, null, 2));
    console.log('');
    
    // Test all sheets endpoint
    console.log('3. Testing all sheets endpoint...');
    const allSheetsResponse = await axios.get(`${API_BASE_URL}/api/v1/sheets/all`);
    console.log('All Sheets:', Object.keys(allSheetsResponse.data.data));
    console.log('');
    
    // Test specific sheets if they exist
    const sheetNames = Object.keys(allSheetsResponse.data.data);
    for (const sheetName of sheetNames) {
      if (allSheetsResponse.data.data[sheetName].values && 
          allSheetsResponse.data.data[sheetName].values.length > 0) {
        console.log(`4. Testing ${sheetName} sheet data...`);
        console.log(`${sheetName} has ${allSheetsResponse.data.data[sheetName].values.length} rows`);
        console.log(`First row (headers):`, allSheetsResponse.data.data[sheetName].values[0]);
        if (allSheetsResponse.data.data[sheetName].values.length > 1) {
          console.log(`Second row (first data):`, allSheetsResponse.data.data[sheetName].values[1]);
        }
        console.log('');
        break; // Just show one sheet for brevity
      }
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();