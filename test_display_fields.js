const axios = require('axios');

// Test the new purchase fields display
async function testPurchaseFieldsDisplay() {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', {
      purchases: [{
        productName: 'DISPLAY TEST PRODUCT',
        quantity: 10,
        cost: 150,
        supplier: 'DISPLAY TEST SUPPLIER',
        location: 'DISPLAY TEST LOCATION',
        purchasedBy: 'DISPLAY TEST USER'
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Purchase response:', response.data);
    
    // Now check if the purchase is in the purchases sheet with all fields
    const purchasesResponse = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    const purchasesData = purchasesResponse.data;
    
    if (purchasesData && purchasesData.data && purchasesData.data.values) {
      const rows = purchasesData.data.values;
      // Find our test purchase (should be the last row)
      const testPurchase = rows.find(row => row[4] === 'DISPLAY TEST PRODUCT');
      if (testPurchase) {
        console.log('Test purchase found in sheet:');
        console.log('Product:', testPurchase[4]);
        console.log('Location:', testPurchase[9]);
        console.log('Supplier:', testPurchase[10]);
        console.log('Purchased By:', testPurchase[12]);
      } else {
        console.log('Test purchase not found in sheet');
        // Show last few rows for debugging
        console.log('Last 3 rows:', rows.slice(-3));
      }
    }
  } catch (error) {
    console.error('Error testing purchase fields display:', error.response?.data || error.message);
  }
}

testPurchaseFieldsDisplay();