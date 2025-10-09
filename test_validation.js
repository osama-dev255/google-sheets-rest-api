const axios = require('axios');

// Test the validation by sending incomplete data
async function testValidation() {
  try {
    console.log('Testing validation with incomplete data...\n');
    
    // Prepare incomplete purchase data
    const incompletePurchaseData = {
      purchases: [
        {
          productName: "COKE 600MLS 12S/W NP",
          quantity: 5,
          cost: 12.50,
          supplier: "" // Empty supplier
        },
        {
          productName: "", // Empty product name
          quantity: 3,
          cost: 10.00,
          supplier: "Test Supplier"
        },
        {
          productName: "SPRITE 600ML 12 S/W NP",
          quantity: 0, // Invalid quantity
          cost: 15.00,
          supplier: "Another Supplier"
        }
      ]
    };
    
    console.log('Sending incomplete purchase data:');
    console.log(JSON.stringify(incompletePurchaseData, null, 2));
    
    // Try to send the incomplete data
    const response = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', incompletePurchaseData);
    
    console.log('\nUnexpected success:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('\n✅ Validation working correctly - caught error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Message:', error.message);
    }
  }
  
  // Now test with valid data
  try {
    console.log('\n\nTesting with valid data...\n');
    
    // Prepare valid purchase data
    const validPurchaseData = {
      purchases: [
        {
          productName: "COKE 600MLS 12S/W NP",
          quantity: 5,
          cost: 12.50,
          supplier: "Test Supplier"
        }
      ]
    };
    
    console.log('Sending valid purchase data:');
    console.log(JSON.stringify(validPurchaseData, null, 2));
    
    // Send the valid data
    const response = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', validPurchaseData);
    
    console.log('\n✅ Valid data processed successfully:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('\n❌ Unexpected error with valid data:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Message:', error.message);
    }
  }
}

testValidation();