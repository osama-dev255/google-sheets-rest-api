const axios = require('axios');

async function checkInventoryStructure() {
  try {
    console.log('Checking Inventory sheet structure...');
    
    // Get the Inventory sheet data
    const response = await axios.get('http://localhost:3000/api/v1/sheets/Inventory');
    
    if (response.data && response.data.data && response.data.data.values) {
      const rows = response.data.data.values;
      
      if (rows.length > 0) {
        console.log('Inventory sheet header row:');
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
        console.log('Inventory sheet is empty');
      }
    } else {
      console.log('No data received from Inventory sheet');
    }
    
  } catch (error) {
    console.error('Error checking Inventory sheet:', error.message);
  }
}

checkInventoryStructure();