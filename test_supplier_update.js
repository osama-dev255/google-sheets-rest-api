const axios = require('axios');

// Test the purchase endpoint with supplier data
async function testSupplierUpdate() {
  try {
    console.log('Testing supplier update functionality...');
    
    // First, let's get the list of products to use a real product name
    const productsResponse = await axios.get('http://localhost:3000/api/v1/sheets/Inventory');
    console.log('Available products:', productsResponse.data.data.values.slice(1, 3)); // Show first few products
    
    // Use the first actual product from the sheet
    const productData = productsResponse.data.data.values;
    if (productData.length < 2) {
      console.log('Not enough products in the sheet to test');
      return;
    }
    
    const productName = productData[1][1]; // Assuming PRODUCT is in column B (index 1)
    console.log('Using product:', productName);
    
    const purchaseData = {
      purchases: [
        {
          productName: productName,
          quantity: 5,
          cost: 10.50,
          supplier: 'Test Supplier Co.'
        }
      ]
    };
    
    console.log('Sending purchase data:', JSON.stringify(purchaseData, null, 2));
    
    // Make sure to use your actual API endpoint
    const response = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', purchaseData);
    
    console.log('Response:', response.data);
    console.log('Supplier update test completed successfully!');
  } catch (error) {
    console.error('Error testing supplier update:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testSupplierUpdate();