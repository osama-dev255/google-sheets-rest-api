const axios = require('axios');

async function verifySupplierChange() {
  try {
    console.log('Verifying supplier change...\n');
    
    // Get the product information from Inventory sheet
    const inventoryResponse = await axios.get('http://localhost:3000/api/v1/sheets/Inventory');
    const inventoryData = inventoryResponse.data.data.values;
    
    // Find the product
    const productRow = inventoryData.find(row => row[1] === 'COKE 600MLS 12S/W NP');
    
    if (productRow) {
      console.log('Product Information in Inventory Sheet:');
      console.log('Product Name:', productRow[1]);
      console.log('Current Stock:', productRow[3]);
      console.log('Supplier:', productRow[9]);
      console.log('');
    }
    
    // Get the product information from Products sheet
    const productsResponse = await axios.get('http://localhost:3000/api/v1/sheets/Products');
    const productsData = productsResponse.data.data.values;
    
    // Find the product
    const productRowInProducts = productsData.find(row => row[1] === 'COKE 600MLS 12S/W NP');
    
    if (productRowInProducts) {
      console.log('Product Information in Products Sheet:');
      console.log('Product Name:', productRowInProducts[1]);
      console.log('Stock:', productRowInProducts[3]);
      console.log('Unit Cost:', productRowInProducts[4]);
      console.log('Supplier:', productRowInProducts[6]); // Supplier is at index 6 in Products sheet
      console.log('');
    }
    
    console.log('✅ Supplier verification completed!');
    
  } catch (error) {
    console.error('Error verifying supplier change:', error.message);
  }
}

verifySupplierChange();