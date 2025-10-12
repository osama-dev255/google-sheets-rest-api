const axios = require('axios');

// Test the inventory update functionality
async function testInventoryUpdate() {
  try {
    console.log('Making a test purchase...');
    
    // Make a purchase
    const purchaseResponse = await axios.post('http://localhost:3000/api/v1/sheets/purchases/add-stock', {
      purchases: [{
        productName: 'COKE 600MLS 12S/W NP',
        quantity: 10,
        cost: 9700,
        supplier: 'TEST SUPPLIER',
        location: 'TEST LOCATION',
        purchasedBy: 'TEST USER'
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Purchase response:', purchaseResponse.data);
    
    // Check if the inventory was updated with the new last updated date
    console.log('Checking inventory update...');
    const inventoryResponse = await axios.get('http://localhost:3000/api/v1/sheets/Inventory');
    
    if (inventoryResponse.data && inventoryResponse.data.data && inventoryResponse.data.data.values) {
      const rows = inventoryResponse.data.data.values;
      // Find the COKE 600MLS 12S/W NP product
      const cokeProduct = rows.find(row => row[1] === 'COKE 600MLS 12S/W NP');
      
      if (cokeProduct) {
        console.log('COKE product found in inventory:');
        console.log('Product:', cokeProduct[1]);
        console.log('Current Stock:', cokeProduct[3]);
        console.log('Last Updated:', cokeProduct[10]);
        console.log('Supplier:', cokeProduct[9]);
        console.log('Location:', cokeProduct[8]);
      } else {
        console.log('COKE product not found in inventory');
        console.log('Inventory rows:', rows.slice(0, 3)); // Show first 3 rows
      }
    }
  } catch (error) {
    console.error('Error testing inventory update:', error.response?.data || error.message);
  }
}

testInventoryUpdate();