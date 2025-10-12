const axios = require('axios');

async function testPurchaseOrderForm() {
  try {
    console.log('Testing purchase order form submission...\n');
    
    // First, let's check the current Purchase Orders sheet
    console.log('Checking current Purchase Orders sheet...');
    const initialResponse = await axios.get('http://localhost:3000/api/v1/sheets/Purchase Orders');
    const initialRowCount = initialResponse.data.data.values ? initialResponse.data.data.values.length : 0;
    console.log(`Initial Purchase Orders sheet row count: ${initialRowCount}`);
    
    // Prepare test purchase order data (matching the format used in the form)
    const headerRow = [
      'Order Number', 'Supplier', 'Order Date', 'Expected Delivery', 'Status', 
      'Product', 'Description', 'Quantity', 'Unit Price', 'Total', 'Notes'
    ];
    
    const dataRows = [
      [
        'PO-TEST-001',           // Order Number
        'Test Supplier Inc.',    // Supplier
        '2023-06-15',            // Order Date
        '2023-06-20',            // Expected Delivery
        'pending',               // Status
        'Test Product A',        // Product
        'Test product description', // Description
        '5',                     // Quantity
        '100.00',                // Unit Price
        '500.00',                // Total
        'Test order notes'       // Notes
      ],
      [
        'PO-TEST-001',           // Order Number (same order, different item)
        'Test Supplier Inc.',    // Supplier
        '2023-06-15',            // Order Date
        '2023-06-20',            // Expected Delivery
        'pending',               // Status
        'Test Product B',        // Product
        'Another test product',  // Description
        '3',                     // Quantity
        '75.00',                 // Unit Price
        '225.00',                // Total
        'Test order notes'       // Notes
      ]
    ];
    
    console.log('\nSending purchase order data:');
    console.log('Header row:', headerRow);
    console.log('Data rows:', dataRows);
    
    // Send the purchase order request
    const response = await axios.post('http://localhost:3000/api/v1/sheets/Purchase Orders/append', {
      values: [headerRow, ...dataRows]
    });
    
    console.log('\nResponse from server:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Wait a moment for the update to propagate
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check the Purchase Orders sheet again
    const finalResponse = await axios.get('http://localhost:3000/api/v1/sheets/Purchase Orders');
    const finalRowCount = finalResponse.data.data.values ? finalResponse.data.data.values.length : 0;
    console.log(`\nFinal Purchase Orders sheet row count: ${finalRowCount}`);
    
    if (finalRowCount > initialRowCount) {
      console.log(`\n✅ SUCCESS: ${finalRowCount - initialRowCount} new rows added to Purchase Orders sheet`);
      
      // Show the new purchase order record(s)
      const newRecords = finalResponse.data.data.values.slice(initialRowCount);
      console.log('\nNew purchase order record(s):');
      newRecords.forEach((record, index) => {
        console.log(`  Record ${index + 1}:`, record);
      });
    } else {
      console.log('\n❌ WARNING: No new records found in Purchase Orders sheet');
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error testing purchase order form:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Message:', error.message);
    }
  }
}

testPurchaseOrderForm();