// Simple Node.js script to test API connection
// Run with: node test_api_connection.js

const axios = require('axios');

// Test both URLs
const URLS = [
  'https://leafy-praline-e1c31f.netlify.app',
  'https://railway-pos-system.netlify.app'
];

// Backend API URL
const BACKEND_API_URL = 'https://google-sheets-rest-api-production.up.railway.app';

async function testApiConnection() {
  console.log('Testing API connections...\n');
  
  // Test direct backend connection
  try {
    console.log(`Testing direct connection to backend: ${BACKEND_API_URL}`);
    const healthResponse = await axios.get(`${BACKEND_API_URL}/health`);
    console.log(`✅ Backend health check successful:`, healthResponse.data);
  } catch (error) {
    console.log(`❌ Backend health check failed:`, error.message);
  }
  
  console.log('\n--- Testing Netlify deployments ---\n');
  
  // Test each Netlify deployment
  for (const url of URLS) {
    console.log(`Testing: ${url}`);
    
    try {
      // Test if the site is accessible
      const response = await axios.get(url);
      console.log(`✅ Site is accessible`);
      
      // Try to get the API configuration from the frontend
      // This is a bit tricky since we can't directly access frontend JS variables
      // But we can check if the site loads properly
      
    } catch (error) {
      console.log(`❌ Site access failed:`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Test Sheet1 access through backend
  console.log('--- Testing Sheet1 access through backend ---\n');
  
  try {
    console.log(`Fetching Sheet1 data from backend...`);
    const sheetResponse = await axios.get(`${BACKEND_API_URL}/api/v1/sheets/Sheet1`);
    
    if (sheetResponse.data && sheetResponse.data.data && sheetResponse.data.data.values) {
      const sheetData = sheetResponse.data.data.values;
      console.log(`✅ Sheet1 data fetched successfully`);
      console.log(`   Rows found: ${sheetData.length}`);
      
      // Look for the finance user
      const headerRow = sheetData[0];
      const emailColumnIndex = headerRow.indexOf('Email');
      
      if (emailColumnIndex !== -1) {
        console.log(`   Searching for finance@businessproject.co.tz...`);
        
        let userFound = false;
        for (let i = 1; i < sheetData.length; i++) {
          const row = sheetData[i];
          const email = row[emailColumnIndex];
          
          if (email === 'finance@businessproject.co.tz') {
            userFound = true;
            console.log(`   ✅ User found at row ${i + 1}`);
            console.log(`      Name: ${row[headerRow.indexOf('Name')]}`);
            console.log(`      Role: ${row[headerRow.indexOf('Role')]}`);
            break;
          }
        }
        
        if (!userFound) {
          console.log(`   ❌ User not found in Sheet1`);
        }
      } else {
        console.log(`   ❌ Email column not found in header`);
      }
    } else {
      console.log(`❌ No data returned from Sheet1`);
    }
  } catch (error) {
    console.log(`❌ Sheet1 access failed:`, error.message);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, error.response.data);
    }
  }
}

// Run the test
testApiConnection();