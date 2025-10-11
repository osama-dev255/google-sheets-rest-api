const axios = require('axios');

async function checkPurchasesSheet() {
  try {
    console.log('Checking Purchases sheet structure...');
    
    // Get the Purchases sheet data
    const response = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    
    if (response.data.data.values && response.data.data.values.length > 0) {
      console.log('Purchases sheet header row:');
      console.log(response.data.data.values[0]);
      
      if (response.data.data.values.length > 1) {
        console.log('\nFirst few data rows:');
        for (let i = 1; i < Math.min(4, response.data.data.values.length); i++) {
          console.log(`Row ${i}:`, response.data.data.values[i]);
        }
      }
    } else {
      console.log('Purchases sheet is empty or has no data');
    }
    
  } catch (error) {
    console.error('Error checking Purchases sheet:', error.message);
  }
}

checkPurchasesSheet();