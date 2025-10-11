const axios = require('axios');

async function checkProductsStructure() {
  try {
    console.log('Checking Products sheet structure...');
    
    // Get the Products sheet data
    const response = await axios.get('http://localhost:3000/api/v1/sheets/Products');
    
    if (response.data && response.data.data && response.data.data.values) {
      const rows = response.data.data.values;
      
      if (rows.length > 0) {
        console.log('Products sheet header row:');
        console.log(rows[0]);
        
        if (rows.length > 1) {
          console.log('\nFirst data row:');
          console.log(rows[1]);
          
          console.log('\nColumn mapping:');
          rows[0].forEach((header, index) => {
            console.log(`Column ${index}: ${header} = ${rows[1][index]}`);
          });
        }
      } else {
        console.log('Products sheet is empty');
      }
    } else {
      console.log('No data received from Products sheet');
    }
    
  } catch (error) {
    console.error('Error checking Products sheet:', error.message);
  }
}

checkProductsStructure();