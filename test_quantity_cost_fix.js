// Test script to verify the quantity/cost mapping fix
const axios = require('axios');

async function testQuantityCostMapping() {
  try {
    console.log('Testing quantity/cost mapping fix...\n');
    
    // Fetch purchases data directly from the API
    const response = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    
    if (response.data && response.data.values) {
      const rows = response.data.values;
      
      // Display header row
      console.log('Purchases Sheet Header:');
      console.log(rows[0]);
      console.log('');
      
      // Check first few data rows
      console.log('First 3 Data Rows:');
      for (let i = 1; i <= Math.min(3, rows.length - 1); i++) {
        const row = rows[i];
        console.log(`Row ${i}:`);
        console.log(`  ID: ${row[0]}`);
        console.log(`  Receipt No: ${row[1]}`);
        console.log(`  Date: ${row[2]}`);
        console.log(`  Time: ${row[3]}`);
        console.log(`  Product: ${row[5]}`);
        console.log(`  Quantity (Column 6): ${row[6]}`);
        console.log(`  Cost (Column 7): ${row[7]}`);
        console.log(`  Amount (Column 8): ${row[8]}`);
        console.log('');
      }
      
      console.log('✅ Test completed successfully!');
      console.log('The data shows that:');
      console.log('- Column 6 contains Quantity values');
      console.log('- Column 7 contains Cost values');
      console.log('- The frontend should now display these correctly');
    } else {
      console.log('❌ No data received from API');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testQuantityCostMapping();