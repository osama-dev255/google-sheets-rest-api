// Check the latest purchases to see if timestamp is correct
const axios = require('axios');

async function checkLatestPurchases() {
  try {
    console.log('Checking latest purchases for timestamp verification...\n');
    
    // Get current time
    const now = new Date();
    console.log('Current local time (Nairobi):', now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
    console.log('Current UTC time:', now.toISOString());
    
    // Check Purchases sheet
    const response = await axios.get('http://localhost:3000/api/v1/sheets/Purchases');
    
    if (response.data && response.data.data && response.data.data.values) {
      const rows = response.data.data.values;
      
      // Get the last 3 rows to see the most recent purchases
      const lastRows = rows.slice(-3);
      console.log('\nLatest purchase records:');
      
      lastRows.forEach((row, index) => {
        const rowIndex = rows.length - 3 + index;
        console.log(`\nRow ${rowIndex + 1}:`);
        console.log('  ID:', row[0]);
        console.log('  Receipt No.:', row[1]);
        console.log('  Date:', row[2]);
        console.log('  Time:', row[3]);
        console.log('  Product:', row[4]);
        console.log('  Category:', row[5]);
        console.log('  Quantity:', row[6]);
        console.log('  Cost:', row[7]);
        console.log('  Amount:', row[8]);
        console.log('  Supplier:', row[10]);
        console.log('  Status:', row[11]);
      });
      
      // Check the most recent purchase
      if (lastRows.length > 0) {
        const latestPurchase = lastRows[lastRows.length - 1];
        const purchaseTime = latestPurchase[3]; // TIME column
        const purchaseDate = latestPurchase[2]; // DATE column
        
        console.log('\n=== TIMESTAMP ANALYSIS ===');
        console.log('Latest purchase timestamp:');
        console.log('  Date:', purchaseDate);
        console.log('  Time:', purchaseTime);
        
        // Check if the time appears to be in UTC or local time
        // Nairobi is UTC+3, so if it matches UTC time, it's wrong
        console.log('\nComparison:');
        console.log('  Current Nairobi time:', now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false }));
        console.log('  Current UTC time:', now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false }));
        console.log('  Purchase time:', purchaseTime);
        
        // Determine if timestamp is correct
        if (purchaseTime === now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })) {
          console.log('\n❌ ISSUE: Timestamp is still in UTC time');
        } else if (purchaseTime === now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false })) {
          console.log('\n✅ SUCCESS: Timestamp is in correct local time');
        } else {
          console.log('\n⚠️  UNCLEAR: Timestamp format needs verification');
        }
      }
    } else {
      console.log('No data received from Purchases sheet');
    }
  } catch (error) {
    console.error('Error checking latest purchases:', error.message);
  }
}

checkLatestPurchases();