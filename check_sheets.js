const axios = require('axios');

async function checkSheets() {
  try {
    console.log('Checking available sheets...');
    
    const response = await axios.get('http://localhost:3000/api/v1/sheets/metadata');
    
    console.log('Spreadsheet title:', response.data.data.title);
    console.log('Available sheets:');
    response.data.data.sheets.forEach((sheet, index) => {
      console.log(`  ${index + 1}. ${sheet.title}`);
    });
    
    // Check if there's a Purchases sheet
    const purchasesSheet = response.data.data.sheets.find(sheet => 
      sheet.title.toLowerCase().includes('purchase')
    );
    
    if (purchasesSheet) {
      console.log(`\n✅ Found Purchases sheet: ${purchasesSheet.title}`);
      
      // Get the structure of the Purchases sheet
      try {
        const purchasesData = await axios.get(`http://localhost:3000/api/v1/sheets/${purchasesSheet.title}`);
        if (purchasesData.data.data.values && purchasesData.data.data.values.length > 0) {
          console.log(`\n${purchasesSheet.title} sheet structure:`);
          console.log('Header row:', purchasesData.data.data.values[0]);
        }
      } catch (error) {
        console.log(`\nCould not retrieve ${purchasesSheet.title} sheet data:`, error.message);
      }
    } else {
      console.log('\n❌ No Purchases sheet found');
      console.log('Available sheet names suggest you might need to create one');
    }
    
  } catch (error) {
    console.error('Error checking sheets:', error.message);
  }
}

checkSheets();