// Test script to verify purchase timestamp
const axios = require('axios');

async function testPurchaseTimestamp() {
  try {
    console.log('Testing purchase timestamp...\n');
    
    // Get current time before making purchase
    const beforeTime = new Date();
    console.log('Current time before purchase:', beforeTime.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
    
    // Prepare purchase data
    const purchaseData = {
      purchases: [
        {
          productName: "COKE 600MLS 12S/W NP",
          quantity: 5,
          cost: 12.50,
          supplier: "Test Supplier Co."
        }
      ]
    };
    
    console.log('\nSending purchase data...');
    console.log(JSON.stringify(purchaseData, null, 2));
    
    // Submit purchase
    const response = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', purchaseData);
    console.log('\nPurchase response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Wait a moment for the update to propagate
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check the Purchases sheet to see the new record
    console.log('\nChecking Purchases sheet for new record...');
    const purchasesResponse = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    
    if (purchasesResponse.data && purchasesResponse.data.data && purchasesResponse.data.data.values) {
      const rows = purchasesResponse.data.data.values;
      // Get the last few rows to see the new purchase
      const lastRows = rows.slice(-3);
      console.log('\nLast few purchase records:');
      lastRows.forEach((row, index) => {
        console.log(`Row ${rows.length - 3 + index + 1}:`, row);
      });
    }
    
    // Get current time after making purchase
    const afterTime = new Date();
    console.log('\nCurrent time after purchase:', afterTime.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
    
  } catch (error) {
    console.error('\nError testing purchase timestamp:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Message:', error.message);
    }
  }
}

testPurchaseTimestamp();