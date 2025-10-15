import axios from 'axios';

const API_BASE_URL = 'https://google-sheets-rest-api-production.up.railway.app';

async function testCRUDOperations() {
  try {
    console.log('Testing CRUD operations...\n');
    
    // 1. Read - Get current Sales data
    console.log('1. Reading current Sales data...');
    const salesResponse = await axios.get(`${API_BASE_URL}/api/v1/sheets/Sales`);
    console.log(`Sales sheet has ${salesResponse.data.data.values.length} rows`);
    
    if (salesResponse.data.data.values.length > 1) {
      console.log('First data row:', salesResponse.data.data.values[1]);
      
      // 2. Update - Update the first data row
      console.log('\n2. Updating first data row...');
      const firstDataRow = salesResponse.data.data.values[1];
      const updatedProduct = firstDataRow[5] + " - UPDATED"; // Update PRODUCT column
      
      // Update range for the product cell (row 2, column F which is index 5)
      const updateResponse = await axios.put(
        `${API_BASE_URL}/api/v1/sheets/Sales/range/F2`, 
        { 
          values: [[updatedProduct]],
          valueInputOption: "USER_ENTERED"
        }
      );
      console.log('Update response:', updateResponse.data);
      
      // Verify update
      const verifyResponse = await axios.get(`${API_BASE_URL}/api/v1/sheets/Sales`);
      console.log('Updated first data row:', verifyResponse.data.data.values[1]);
    }
    
    // 3. Create - Add new sales data
    console.log('\n3. Adding new sales data...');
    const newSales = [
      {
        id: `TXN-${Date.now()}-3`,
        receiptNo: `R${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        category: "Beverages",
        product: "FANTA ORANGE 600ML",
        price: 9700,
        discount: 0,
        quantity: 1,
        totalAmount: 9700,
        soldBy: "Cashier 2",
        status: "completed",
        amountReceived: 10000,
        change: 300
      }
    ];
    
    const addResponse = await axios.post(`${API_BASE_URL}/api/v1/sheets/sales/record`, { sales: newSales });
    console.log('Add response:', addResponse.data);
    
    // 4. Read again to verify additions
    console.log('\n4. Verifying final Sales data...');
    const finalResponse = await axios.get(`${API_BASE_URL}/api/v1/sheets/Sales`);
    console.log(`Sales sheet now has ${finalResponse.data.data.values.length} rows`);
    
    console.log('\nAll CRUD operations completed successfully!');
    
  } catch (error) {
    console.error('Error in CRUD operations:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testCRUDOperations();