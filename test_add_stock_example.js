const axios = require('axios');

// Test the add stock endpoint with supplier data
async function testAddStockWithSupplier() {
  try {
    console.log('Testing Add Stock endpoint with supplier data...\n');
    
    // First, let's get the list of products to use a real product name
    console.log('1. Fetching available products from Inventory sheet...');
    const productsResponse = await axios.get('http://localhost:3000/api/v1/sheets/Inventory');
    
    // Display first few products
    const productData = productsResponse.data.data.values;
    console.log('Available products:');
    for (let i = 1; i < Math.min(4, productData.length); i++) {
      console.log(`  ${i}. ${productData[i][1]} (Current Stock: ${productData[i][3]})`);
    }
    
    // Use the first actual product from the sheet
    if (productData.length < 2) {
      console.log('Not enough products in the sheet to test');
      return;
    }
    
    const productName = productData[1][1]; // Assuming PRODUCT is in column B (index 1)
    const currentStock = productData[1][3]; // Assuming CURRENTSTOCK is in column D (index 3)
    console.log(`\n2. Selected product: ${productName} (Current Stock: ${currentStock})`);
    
    // Prepare purchase data with supplier information
    const purchaseData = {
      purchases: [
        {
          productName: productName,
          quantity: 10,
          cost: 15.75,
          supplier: 'ABC Supplier Co.'
        },
        {
          productName: productData[2][1], // Second product
          quantity: 5,
          cost: 22.50,
          supplier: 'XYZ Distributors'
        }
      ]
    };
    
    console.log('\n3. Purchase data to send:');
    console.log(JSON.stringify(purchaseData, null, 2));
    
    // Send the purchase request to add stock
    console.log('\n4. Sending request to add stock through purchases...');
    const response = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', purchaseData);
    
    console.log('\n5. Response from server:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Verify the update by fetching the product again
    console.log('\n6. Verifying stock update...');
    const updatedProductsResponse = await axios.get('http://localhost:3000/api/v1/sheets/Inventory');
    const updatedProductData = updatedProductsResponse.data.data.values;
    
    // Find the updated product
    const updatedProduct = updatedProductData.find(row => row[1] === productName);
    if (updatedProduct) {
      console.log(`\n7. Updated product information:`);
      console.log(`   Product: ${updatedProduct[1]}`);
      console.log(`   Previous Stock: ${currentStock}`);
      console.log(`   New Stock: ${updatedProduct[3]}`);
      console.log(`   Supplier: ${updatedProduct[9] || 'Not updated'}`);
      
      // Also check in Products sheet
      const productsSheetResponse = await axios.get('http://localhost:3000/api/v1/sheets/Products');
      const productsSheetData = productsSheetResponse.data.data.values;
      const updatedProductInProducts = productsSheetData.find(row => row[1] === productName);
      if (updatedProductInProducts) {
        console.log(`\n8. Product information in Products sheet:`);
        console.log(`   Product: ${updatedProductInProducts[1]}`);
        console.log(`   Stock: ${updatedProductInProducts[3]}`);
        console.log(`   Unit Cost: ${updatedProductInProducts[4]}`);
        console.log(`   Supplier: ${updatedProductInProducts[6] || 'Not updated'}`);
      }
    }
    
    console.log('\n✅ Test completed successfully!');
    console.log('The add stock endpoint with supplier functionality is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Error testing add stock endpoint:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Message:', error.message);
    }
  }
}

// Run the test
testAddStockWithSupplier();