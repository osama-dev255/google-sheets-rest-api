const axios = require('axios');

async function simplePurchaseTest() {
  try {
    console.log('🧪 Simple Purchase Test\n');
    
    // Get initial Purchases sheet row count
    const initialResponse = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    const initialCount = initialResponse.data.data.values ? initialResponse.data.data.values.length : 0;
    console.log(`Initial Purchases records: ${initialCount}`);
    
    // Submit a simple purchase
    const purchaseData = {
      purchases: [
        {
          productName: "COKE 600MLS 12S/W NP",
          quantity: 3,
          cost: 10.00,
          supplier: "Simple Test Supplier"
        }
      ]
    };
    
    console.log('\nSubmitting purchase...');
    const response = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', purchaseData);
    console.log('✅ Purchase submitted successfully');
    console.log(`Response: ${JSON.stringify(response.data.message)}`);
    
    // Wait a moment for Google Sheets to update
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check final count
    const finalResponse = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    const finalCount = finalResponse.data.data.values ? finalResponse.data.data.values.length : 0;
    console.log(`\nFinal Purchases records: ${finalCount}`);
    
    if (finalCount > initialCount) {
      console.log(`\n🎉 SUCCESS: ${finalCount - initialCount} new record(s) added!`);
      
      // Show the new record
      const newRecord = finalResponse.data.data.values[finalCount - 1];
      console.log('\nNew Purchase Record:');
      console.log('ID:', newRecord[0]);
      console.log('Product:', newRecord[4]);
      console.log('Quantity:', newRecord[6]);
      console.log('Cost:', newRecord[7]);
      console.log('Supplier:', newRecord[10]);
    } else {
      console.log('\n❌ No new records found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simplePurchaseTest();