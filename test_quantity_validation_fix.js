// Test the fixed quantity validation logic
function testQuantityValidationFix() {
  console.log('Testing fixed quantity validation logic...\n');
  
  // Simulate purchase items with various quantity scenarios
  const purchaseItems = [
    {
      id: '1',
      productName: "COKE 600MLS 12S/W NP",
      quantity: null, // Null quantity (empty field)
      cost: 12.50,
      supplier: "Test Supplier"
    },
    {
      id: '2',
      productName: "SPRITE 600ML 12 S/W NP",
      quantity: undefined, // Undefined quantity
      cost: 10.00,
      supplier: "Another Supplier"
    },
    {
      id: '3',
      productName: "FANTA ORANGE 500ML",
      quantity: NaN, // NaN quantity
      cost: 8.50,
      supplier: "Third Supplier"
    },
    {
      id: '4',
      productName: "KREST BITTER LEMON 300MLS CR24 RB",
      quantity: -5, // Negative quantity
      cost: 15.00,
      supplier: "Fourth Supplier"
    },
    {
      id: '5',
      productName: "VALID PRODUCT",
      quantity: 2, // Valid quantity
      cost: 12.50,
      supplier: "Valid Supplier"
    },
    {
      id: '6',
      productName: "ZERO QUANTITY PRODUCT",
      quantity: 0, // Zero quantity (invalid)
      cost: 5.00,
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
    item.quantity === null || 
    item.quantity === undefined || 
    isNaN(item.quantity) || 
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
      if (item.quantity === null || item.quantity === undefined) {
        missing.push('quantity (required)');
      } else if (isNaN(item.quantity)) {
        missing.push('quantity (invalid number)');
      } else if (item.quantity <= 0) {
        missing.push('quantity (must be positive)');
      }
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
      quantity: 1,
      cost: 10.00,
      supplier: "Another Supplier"
    }
  ];
  
  console.log('Valid purchase items:');
  validItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item.productName} - Qty: ${item.quantity}, Cost: ${item.cost}, Supplier: ${item.supplier}`);
  });
  
  const invalidValidItems = validItems.filter(item => 
    !item.productName || 
    item.quantity === null || 
    item.quantity === undefined || 
    isNaN(item.quantity) || 
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
      if (item.quantity === null || item.quantity === undefined) {
        missing.push('quantity (required)');
      } else if (isNaN(item.quantity)) {
        missing.push('quantity (invalid number)');
      } else if (item.quantity <= 0) {
        missing.push('quantity (must be positive)');
      }
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

testQuantityValidationFix();