const axios = require('axios');

// Test updating a specific cell in the Inventory sheet
async function testSheetUpdate() {
  try {
    console.log('Testing direct sheet update...');
    
    // Get current inventory data first
    const inventoryResponse = await axios.get('http://localhost:3000/api/v1/sheets/Inventory');
    console.log('Current inventory data retrieved');
    
    if (inventoryResponse.data && inventoryResponse.data.data && inventoryResponse.data.data.values) {
      const rows = inventoryResponse.data.data.values;
      console.log('Header row:', rows[0]);
      
      // Find the LASTUPDATED column index
      const headerRow = rows[0];
      const lastUpdatedIndex = headerRow.indexOf('LASTUPDATED');
      console.log('LASTUPDATED column index:', lastUpdatedIndex);
      
      // Find the COKE product row
      const cokeRow = rows.find((row, index) => index > 0 && row[1] === 'COKE 600MLS 12S/W NP');
      if (cokeRow) {
        const cokeRowIndex = rows.indexOf(cokeRow);
        console.log('COKE product found at row index:', cokeRowIndex);
        console.log('Current LASTUPDATED value:', cokeRow[lastUpdatedIndex]);
        
        // Try to update the LASTUPDATED field directly
        const updateRange = `Inventory!${String.fromCharCode(65 + lastUpdatedIndex)}${cokeRowIndex + 1}`;
        const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' });
        
        console.log('Update range:', updateRange);
        console.log('New date value:', currentDate);
        
        // Try to update the cell
        const updateResponse = await axios.put(
          `http://localhost:3000/api/v1/sheets/Inventory/range/${updateRange}`,
          {
            values: [[currentDate]]
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Update response:', updateResponse.data);
        
        // Verify the update
        const verifyResponse = await axios.get('http://localhost:3000/api/v1/sheets/Inventory');
        const verifyRows = verifyResponse.data.data.values;
        const updatedCokeRow = verifyRows[cokeRowIndex];
        console.log('Updated LASTUPDATED value:', updatedCokeRow[lastUpdatedIndex]);
      } else {
        console.log('COKE product not found');
      }
    }
  } catch (error) {
    console.error('Error testing sheet update:', error.response?.data || error.message);
  }
}

testSheetUpdate();