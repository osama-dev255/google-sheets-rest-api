const axios = require('axios');

// Test the new purchase fields
async function testPurchaseFields() {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', {
      purchases: [{
        productName: 'TEST PRODUCT',
        quantity: 5,
        cost: 100,
        supplier: 'TEST SUPPLIER',
        location: 'TEST LOCATION',
        purchasedBy: 'TEST USER'
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Purchase response:', response.data);
  } catch (error) {
    console.error('Error making purchase:', error.response?.data || error.message);
  }
}

testPurchaseFields();