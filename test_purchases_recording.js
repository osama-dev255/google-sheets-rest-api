const axios = require('axios');

async function testPurchasesRecording() {
  try {
    console.log('Testing purchases recording in Purchases sheet...\n');
    
    // First, let's get the current number of rows in the Purchases sheet
    const initialPurchasesResponse = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    const initialRowCount = initialPurchasesResponse.data.data.values ? initialPurchasesResponse.data.data.values.length : 0;
    console.log(`Initial Purchases sheet row count: ${initialRowCount}`);
    
    // Prepare purchase data
    const purchaseData = {
      purchases: [
        {
          productName: "COKE 600MLS 12S/W NP",
          quantity: 10,
          cost: 15.75,
          supplier: "Coca-Cola Tanzania"
        }
      ]
    };
    
    console.log('\nSending purchase data:');
    console.log(JSON.stringify(purchaseData, null, 2));
    
    // Send the purchase request
    const response = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', purchaseData);
    
    console.log('\nResponse from server:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Wait a moment for the update to propagate
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check the Purchases sheet again
    const finalPurchasesResponse = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    const finalRowCount = finalPurchasesResponse.data.data.values ? finalPurchasesResponse.data.data.values.length : 0;
    console.log(`\nFinal Purchases sheet row count: ${finalRowCount}`);
    
    if (finalRowCount > initialRowCount) {
      console.log(`\n✅ SUCCESS: ${finalRowCount - initialRowCount} new purchase record(s) added to Purchases sheet`);
      
      // Show the new purchase record(s)
      const newRecords = finalPurchasesResponse.data.data.values.slice(initialRowCount);
      console.log('\nNew purchase record(s):');
      newRecords.forEach((record, index) => {
        console.log(`  Record ${index + 1}:`, record);
      });
    } else {
      console.log('\n❌ WARNING: No new records found in Purchases sheet');
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error testing purchases recording:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Message:', error.message);
    }
  }
}

testPurchasesRecording();