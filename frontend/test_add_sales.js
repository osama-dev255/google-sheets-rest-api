import axios from 'axios';

const API_BASE_URL = 'https://google-sheets-rest-api-production.up.railway.app';

async function addTestSales() {
  try {
    console.log('Adding test sales data...\n');
    
    // Test sales data
    const testSales = [
      {
        id: `TXN-${Date.now()}-1`,
        receiptNo: `R${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        category: "Beverages",
        product: "COKE 600ML",
        price: 9700,
        discount: 0,
        quantity: 2,
        totalAmount: 19400,
        soldBy: "Cashier 1",
        status: "completed",
        amountReceived: 20000,
        change: 600
      },
      {
        id: `TXN-${Date.now()}-2`,
        receiptNo: `R${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        category: "Snacks",
        product: "LAYS CHIPS",
        price: 5000,
        discount: 0,
        quantity: 1,
        totalAmount: 5000,
        soldBy: "Cashier 1",
        status: "completed",
        amountReceived: 5000,
        change: 0
      }
    ];

    // Record the sales
    const response = await axios.post(`${API_BASE_URL}/api/v1/sheets/sales/record`, { sales: testSales });
    console.log('Test sales recorded:', response.data);
    
    // Verify the data was added
    console.log('\nVerifying Sales sheet data...');
    const salesResponse = await axios.get(`${API_BASE_URL}/api/v1/sheets/Sales`);
    if (salesResponse.data.data && salesResponse.data.data.values) {
      console.log(`Sales sheet now has ${salesResponse.data.data.values.length} rows`);
      if (salesResponse.data.data.values.length > 0) {
        console.log('Sales headers:', salesResponse.data.data.values[0]);
      }
      if (salesResponse.data.data.values.length > 1) {
        console.log('First sales record:', salesResponse.data.data.values[1]);
      }
    }
    
  } catch (error) {
    console.error('Error adding test sales:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

addTestSales();