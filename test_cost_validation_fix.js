// Test the fixed cost validation logic
function testCostValidationFix() {
  console.log('Testing fixed cost validation logic...\n');
  
  // Simulate purchase items with various cost scenarios
  const purchaseItems = [
    {
      id: '1',
      productName: "COKE 600MLS 12S/W NP",
      quantity: 5,
      cost: null, // Null cost (empty field)
      supplier: "Test Supplier"
    },
    {
      id: '2',
      productName: "SPRITE 600ML 12 S/W NP",
      quantity: 3,
      cost: undefined, // Undefined cost
      supplier: "Another Supplier"
    },
    {
      id: '3',
      productName: "FANTA ORANGE 500ML",
      quantity: 7,
      cost: NaN, // NaN cost
      supplier: "Third Supplier"
    },
    {
      id: '4',
      productName: "KREST BITTER LEMON 300MLS CR24 RB",
      quantity: 4,
      cost: -5.50, // Negative cost
      supplier: "Fourth Supplier"
    },
    {
      id: '5',
      productName: "VALID PRODUCT",
      quantity: 2,
      cost: 12.50, // Valid cost
      supplier: "Valid Supplier"
    },
    {
      id: '6',
      productName: "ZERO COST PRODUCT",
      quantity: 1,
      cost: 0, // Zero cost (valid)
      supplier: "Supplier"
    }
  ];
  
  console.log('Purchase items to validate:');
  purchaseItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item.productName || 'No Product'} - Qty: ${item.quantity}, Cost: ${item.cost}, Supplier: ${item.supplier || 'None'}`);
  });
  
  // Apply the same validation logic as in the frontend
  const invalidItems = purchaseItems.filter(item => 
    !item.productName || 
    item.quantity <= 0 || 
    !item.supplier || 
    item.cost === null || 
    item.cost === undefined || 
    isNaN(item.cost) || 
    item.cost < 0
  );
  
  if (invalidItems.length > 0) {
    console.log('\n❌ Validation failed - found invalid items:');
    const missingFields = [];
    invalidItems.forEach(item => {
      const missing = [];
      if (!item.productName) missing.push('product');
      if (item.quantity <= 0) missing.push('quantity');
      if (item.cost === null || item.cost === undefined) {
        missing.push('cost (required)');
      } else if (isNaN(item.cost)) {
        missing.push('cost (invalid number)');
      } else if (item.cost < 0) {
        missing.push('cost (must be positive)');
      }
      if (!item.supplier) missing.push('supplier');
      missingFields.push(`Item "${item.productName || 'unnamed'}": missing ${missing.join(', ')}`);
    });
    console.log(`Error: Please fill all required fields: ${missingFields.join('; ')}`);
  } else {
    console.log('\n✅ All items are valid!');
    console.log('Valid items:');
    purchaseItems.forEach((item, index) => {
      if (!invalidItems.includes(item)) {
        console.log(`  ${index + 1}. ${item.productName} - Qty: ${item.quantity}, Cost: ${item.cost}, Supplier: ${item.supplier}`);
      }
    });
  }
  
  // Test with all valid items including zero cost
  console.log('\n\nTesting with all valid items (including zero cost)...');
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
      cost: 0, // Zero cost is valid
      supplier: "Another Supplier"
    }
  ];
  
  console.log('Valid purchase items:');
  validItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item.productName} - Qty: ${item.quantity}, Cost: ${item.cost}, Supplier: ${item.supplier}`);
  });
  
  const invalidValidItems = validItems.filter(item => 
    !item.productName || 
    item.quantity <= 0 || 
    !item.supplier || 
    item.cost === null || 
    item.cost === undefined || 
    isNaN(item.cost) || 
    item.cost < 0
  );
  
  if (invalidValidItems.length > 0) {
    console.log('\n❌ Validation failed - found invalid items:');
    const missingFields = [];
    invalidValidItems.forEach(item => {
      const missing = [];
      if (!item.productName) missing.push('product');
      if (item.quantity <= 0) missing.push('quantity');
      if (item.cost === null || item.cost === undefined) {
        missing.push('cost (required)');
      } else if (isNaN(item.cost)) {
        missing.push('cost (invalid number)');
      } else if (item.cost < 0) {
        missing.push('cost (must be positive)');
      }
      if (!item.supplier) missing.push('supplier');
      missingFields.push(`Item "${item.productName || 'unnamed'}": missing ${missing.join(', ')}`);
    });
    console.log(`Error: Please fill all required fields: ${missingFields.join('; ')}`);
  } else {
    console.log('\n✅ All items are valid!');
  }
}

testCostValidationFix();