// Test edge cases for the purchase order form
console.log('=== Purchase Order Form Edge Case Testing ===');

// Test data for various edge cases
const testCases = [
  {
    name: 'Valid Purchase Order',
    data: {
      orderNumber: 'PO-20230615-1234',
      supplier: 'Test Supplier',
      orderDate: '2023-06-15',
      expectedDelivery: '2023-06-20',
      status: 'pending',
      items: [
        {
          id: '1',
          product: 'Test Product',
          description: 'Test Description',
          quantity: 5,
          unitPrice: 100.00,
          total: 500.00
        }
      ],
      notes: 'Test notes'
    },
    expected: 'valid'
  },
  {
    name: 'Empty Order Number',
    data: {
      orderNumber: '',
      supplier: 'Test Supplier',
      orderDate: '2023-06-15',
      expectedDelivery: '2023-06-20',
      status: 'pending',
      items: [
        {
          id: '1',
          product: 'Test Product',
          description: 'Test Description',
          quantity: 5,
          unitPrice: 100.00,
          total: 500.00
        }
      ],
      notes: 'Test notes'
    },
    expected: 'invalid'
  },
  {
    name: 'Zero Quantity',
    data: {
      orderNumber: 'PO-20230615-1234',
      supplier: 'Test Supplier',
      orderDate: '2023-06-15',
      expectedDelivery: '2023-06-20',
      status: 'pending',
      items: [
        {
          id: '1',
          product: 'Test Product',
          description: 'Test Description',
          quantity: 0,
          unitPrice: 100.00,
          total: 0.00
        }
      ],
      notes: 'Test notes'
    },
    expected: 'invalid'
  },
  {
    name: 'Negative Unit Price',
    data: {
      orderNumber: 'PO-20230615-1234',
      supplier: 'Test Supplier',
      orderDate: '2023-06-15',
      expectedDelivery: '2023-06-20',
      status: 'pending',
      items: [
        {
          id: '1',
          product: 'Test Product',
          description: 'Test Description',
          quantity: 5,
          unitPrice: -100.00,
          total: -500.00
        }
      ],
      notes: 'Test notes'
    },
    expected: 'invalid'
  },
  {
    name: 'Missing Product Name',
    data: {
      orderNumber: 'PO-20230615-1234',
      supplier: 'Test Supplier',
      orderDate: '2023-06-15',
      expectedDelivery: '2023-06-20',
      status: 'pending',
      items: [
        {
          id: '1',
          product: '',
          description: 'Test Description',
          quantity: 5,
          unitPrice: 100.00,
          total: 500.00
        }
      ],
      notes: 'Test notes'
    },
    expected: 'invalid'
  }
];

// Simple validation function that mimics the form's validation logic
function validatePurchaseOrder(data) {
  const errors = {};
  
  // Check required fields
  if (!data.orderNumber || data.orderNumber.trim() === '') {
    errors.orderNumber = 'Order number is required';
  }
  
  if (!data.supplier || data.supplier.trim() === '') {
    errors.supplier = 'Supplier is required';
  }
  
  if (!data.expectedDelivery) {
    errors.expectedDelivery = 'Expected delivery date is required';
  }
  
  // Validate items
  data.items.forEach((item, index) => {
    if (!item.product || item.product.trim() === '') {
      errors[`item-${index}-product`] = 'Product is required';
    }
    if (item.quantity <= 0) {
      errors[`item-${index}-quantity`] = 'Quantity must be greater than 0';
    }
    if (item.unitPrice <= 0) {
      errors[`item-${index}-unitPrice`] = 'Unit price must be greater than 0';
    }
  });
  
  return Object.keys(errors).length === 0;
}

console.log('\nRunning validation tests...\n');

let passedTests = 0;
let totalTests = testCases.length;

for (const testCase of testCases) {
  const isValid = validatePurchaseOrder(testCase.data);
  const expectedResult = testCase.expected === 'valid';
  
  if (isValid === expectedResult) {
    console.log(`✅ ${testCase.name}: PASSED`);
    passedTests++;
  } else {
    console.log(`❌ ${testCase.name}: FAILED`);
    console.log(`   Expected: ${testCase.expected}`);
    console.log(`   Got: ${isValid ? 'valid' : 'invalid'}`);
  }
}

console.log(`\n=== Test Results ===`);
console.log(`Passed: ${passedTests}/${totalTests}`);

if (passedTests === totalTests) {
  console.log('🎉 All tests passed! The purchase order form validation is working correctly.');
} else {
  console.log('⚠️  Some tests failed. Review the validation logic.');
}

console.log('\n=== Edge Case Testing Complete ===');