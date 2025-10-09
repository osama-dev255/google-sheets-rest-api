// Test the frontend validation logic
function testFrontendValidation() {
  console.log('Testing frontend validation logic...\n');
  
  // Simulate purchase items similar to what would be in the form
  const purchaseItems = [
    {
      id: '1',
      productName: "COKE 600MLS 12S/W NP",
      quantity: 5,
      cost: 12.50,
      supplier: "" // Empty supplier
    },
    {
      id: '2',
      productName: "", // Empty product name
      quantity: 3,
      cost: 10.00,
      supplier: "Test Supplier"
    },
    {
      id: '3',
      productName: "SPRITE 600ML 12 S/W NP",
      quantity: 0, // Invalid quantity
      cost: 15.00,
      supplier: "Another Supplier"
    },
    {
      id: '4',
      productName: "FANTA ORANGE 500ML",
      quantity: 7,
      cost: 8.50,
      supplier: "Valid Supplier" // All fields valid
    }
  ];
  
  console.log('Purchase items to validate:');
  purchaseItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item.productName || 'No Product'} - Qty: ${item.quantity}, Cost: ${item.cost}, Supplier: ${item.supplier || 'None'}`);
  });
  
  // Apply the same validation logic as in the frontend
  const invalidItems = purchaseItems.filter(item => 
    !item.productName || item.quantity <= 0 || item.cost < 0 || !item.supplier
  );
  
  if (invalidItems.length > 0) {
    console.log('\n❌ Validation failed - found invalid items:');
    const missingFields = [];
    invalidItems.forEach(item => {
      const missing = [];
      if (!item.productName) missing.push('product');
      if (item.quantity <= 0) missing.push('quantity');
      if (item.cost < 0) missing.push('cost');
      if (!item.supplier) missing.push('supplier');
      missingFields.push(`Item "${item.productName || 'unnamed'}": missing ${missing.join(', ')}`);
    });
    console.log(`Error: Please fill all required fields: ${missingFields.join('; ')}`);
  } else {
    console.log('\n✅ All items are valid!');
  }
  
  // Test with all valid items
  console.log('\n\nTesting with all valid items...');
  const validItems = [
    {
      id: '1',
      productName: "COKE 600MLS 12S/W NP",
      quantity: 5,
      cost: 12.50,
      supplier: "Test Supplier"
    },
    {
      id: '2',
      productName: "SPRITE 600ML 12 S/W NP",
      quantity: 3,
      cost: 10.00,
      supplier: "Another Supplier"
    }
  ];
  
  console.log('Valid purchase items:');
  validItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item.productName} - Qty: ${item.quantity}, Cost: ${item.cost}, Supplier: ${item.supplier}`);
  });
  
  const invalidValidItems = validItems.filter(item => 
    !item.productName || item.quantity <= 0 || item.cost < 0 || !item.supplier
  );
  
  if (invalidValidItems.length > 0) {
    console.log('\n❌ Validation failed - found invalid items:');
    const missingFields = [];
    invalidValidItems.forEach(item => {
      const missing = [];
      if (!item.productName) missing.push('product');
      if (item.quantity <= 0) missing.push('quantity');
      if (item.cost < 0) missing.push('cost');
      if (!item.supplier) missing.push('supplier');
      missingFields.push(`Item "${item.productName || 'unnamed'}": missing ${missing.join(', ')}`);
    });
    console.log(`Error: Please fill all required fields: ${missingFields.join('; ')}`);
  } else {
    console.log('\n✅ All items are valid!');
  }
}

testFrontendValidation();