import axios from 'axios';

const API_BASE_URL = 'https://google-sheets-rest-api-production.up.railway.app';

async function testAPI() {
  try {
    console.log('Testing Mauzo sheet data...\n');
    
    // Test Mauzo sheet data (seems to have actual sales data)
    const mauzoResponse = await axios.get(`${API_BASE_URL}/api/v1/sheets/Mauzo`);
    if (mauzoResponse.data.data && mauzoResponse.data.data.values) {
      console.log(`Mauzo sheet has ${mauzoResponse.data.data.values.length} rows`);
      if (mauzoResponse.data.data.values.length > 0) {
        console.log('Mauzo headers:', mauzoResponse.data.data.values[0]);
      }
      if (mauzoResponse.data.data.values.length > 1) {
        console.log('First mauzo record:', mauzoResponse.data.data.values[1]);
      }
      if (mauzoResponse.data.data.values.length > 2) {
        console.log('Second mauzo record:', mauzoResponse.data.data.values[2]);
      }
      if (mauzoResponse.data.data.values.length > 3) {
        console.log('Third mauzo record:', mauzoResponse.data.data.values[3]);
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