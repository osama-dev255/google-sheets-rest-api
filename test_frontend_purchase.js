const axios = require('axios');

async function testFrontendPurchase() {
  try {
    console.log('🧪 Testing frontend purchase flow...\n');
    
    // Step 1: Get initial Purchases sheet data
    console.log('1. Checking initial Purchases sheet data...');
    const initialPurchasesResponse = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    const initialRowCount = initialPurchasesResponse.data.data.values ? initialPurchasesResponse.data.data.values.length : 0;
    console.log(`   Initial Purchases sheet row count: ${initialRowCount}`);
    
    // Step 2: Get available products to use for testing
    console.log('\n2. Fetching available products...');
    const inventoryResponse = await axios.get('http://localhost:3000/api/v1/sheets/Inventory');
    const inventoryData = inventoryResponse.data.data.values;
    
    if (inventoryData.length < 2) {
      console.log('   ❌ Not enough products in Inventory sheet for testing');
      return;
    }
    
    // Use the first product for testing
    const testProduct = inventoryData[1][1]; // PRODUCT column (index 1)
    const testCategory = inventoryData[1][2] || 'Unknown'; // CATEGORY column (index 2)
    const testLocation = inventoryData[1][8] || 'Unknown'; // LOCATION column (index 8)
    console.log(`   Using product: ${testProduct}`);
    
    // Step 3: Prepare purchase data (simulating frontend form submission)
    console.log('\n3. Preparing purchase data...');
    const purchaseData = {
      purchases: [
        {
          productName: testProduct,
          quantity: 5,
          cost: 12.50,
          supplier: "Test Supplier Co."
        }
      ]
    };
    
    console.log('   Purchase data to send:');
    console.log('   ' + JSON.stringify(purchaseData, null, 2).replace(/\n/g, '\n   '));
    
    // Step 4: Submit purchase (simulating frontend API call)
    console.log('\n4. Submitting purchase through API...');
    const startTime = new Date();
    const response = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', purchaseData);
    const endTime = new Date();
    
    console.log(`   Request completed in ${endTime - startTime}ms`);
    console.log('   Response status:', response.status);
    console.log('   Response data:');
    console.log('   ' + JSON.stringify(response.data, null, 2).replace(/\n/g, '\n   '));
    
    // Step 5: Wait for Google Sheets to update
    console.log('\n5. Waiting for Google Sheets to update...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 6: Verify Purchases sheet was updated
    console.log('\n6. Verifying Purchases sheet update...');
    const finalPurchasesResponse = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    const finalRowCount = finalPurchasesResponse.data.data.values ? finalPurchasesResponse.data.data.values.length : 0;
    console.log(`   Final Purchases sheet row count: ${finalRowCount}`);
    
    if (finalRowCount > initialRowCount) {
      console.log(`   ✅ SUCCESS: ${finalRowCount - initialRowCount} new purchase record(s) added`);
      
      // Show the new purchase record(s)
      const newRecords = finalPurchasesResponse.data.data.values.slice(initialRowCount);
      console.log('\n   New purchase record(s):');
      newRecords.forEach((record, index) => {
        console.log(`   Record ${index + 1}:`);
        // Show key fields from the purchase record
        const headerRow = finalPurchasesResponse.data.data.values[0];
        const productIdIndex = headerRow.indexOf('ID');
        const productIndex = headerRow.indexOf('PRODUCT');
        const quantityIndex = headerRow.indexOf('QUANTITY');
        const costIndex = headerRow.indexOf('COST');
        const amountIndex = headerRow.indexOf('AMOUNT');
        const supplierIndex = headerRow.indexOf('SUPPLIER');
        const dateIndex = headerRow.indexOf('DATE');
        
        console.log(`     ID: ${record[productIdIndex] || 'N/A'}`);
        console.log(`     Product: ${record[productIndex] || 'N/A'}`);
        console.log(`     Quantity: ${record[quantityIndex] || 'N/A'}`);
        console.log(`     Unit Cost: ${record[costIndex] || 'N/A'}`);
        console.log(`     Total Amount: ${record[amountIndex] || 'N/A'}`);
        console.log(`     Supplier: ${record[supplierIndex] || 'N/A'}`);
        console.log(`     Date: ${record[dateIndex] || 'N/A'}`);
      });
    } else {
      console.log('   ⚠️  WARNING: No new records found in Purchases sheet');
    }
    
    // Step 7: Verify Inventory sheet was updated
    console.log('\n7. Verifying Inventory sheet update...');
    const updatedInventoryResponse = await axios.get('http://localhost:3000/api/v1/sheets/Inventory');
    const updatedInventoryData = updatedInventoryResponse.data.data.values;
    const updatedProductRow = updatedInventoryData.find(row => row[1] === testProduct);
    
    if (updatedProductRow) {
      const currentStockIndex = updatedInventoryData[0].indexOf('CURRENTSTOCK');
      const supplierIndex = updatedInventoryData[0].indexOf('SUPPLIER');
      console.log(`   ✅ Product "${testProduct}" found in Inventory sheet`);
      console.log(`     Current Stock: ${updatedProductRow[currentStockIndex]}`);
      console.log(`     Supplier: ${updatedProductRow[supplierIndex]}`);
    } else {
      console.log(`   ❌ Product "${testProduct}" not found in updated Inventory sheet`);
    }
    
    // Step 8: Verify Products sheet was updated
    console.log('\n8. Verifying Products sheet update...');
    const updatedProductsResponse = await axios.get('http://localhost:3000/api/v1/sheets/Products');
    const updatedProductsData = updatedProductsResponse.data.data.values;
    const updatedProductInProducts = updatedProductsData.find(row => row[1] === testProduct);
    
    if (updatedProductInProducts) {
      const stockIndex = updatedProductsData[0].indexOf('STOCK');
      const costIndex = updatedProductsData[0].indexOf('UNIT COST');
      const supplierIndex = updatedProductsData[0].indexOf('SUPPLIER');
      console.log(`   ✅ Product "${testProduct}" found in Products sheet`);
      console.log(`     Stock: ${updatedProductInProducts[stockIndex]}`);
      console.log(`     Unit Cost: ${updatedProductInProducts[costIndex]}`);
      console.log(`     Supplier: ${updatedProductInProducts[supplierIndex]}`);
    } else {
      console.log(`   ❌ Product "${testProduct}" not found in updated Products sheet`);
    }
    
    console.log('\n🎉 Frontend purchase test completed successfully!');
    console.log('📋 Summary:');
    console.log(`   - ${response.data.data.purchasesUpdates || 0} purchase records added to Purchases sheet`);
    console.log(`   - ${response.data.data.inventoryUpdates || 0} updates made to Inventory sheet`);
    console.log(`   - ${response.data.data.productsUpdates || 0} updates made to Products sheet`);
    
  } catch (error) {
    console.error('\n❌ Error during frontend purchase test:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Message:', error.message);
    }
  }
}

testFrontendPurchase();