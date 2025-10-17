// Comprehensive authentication test
// Run with: node comprehensive_auth_test.js

const axios = require('axios');

// Configuration
const BACKEND_URL = 'https://google-sheets-rest-api-production.up.railway.app';
const TEST_CREDENTIALS = {
  email: 'finance@businessproject.co.tz',
  password: 'finance369'
};

async function runComprehensiveTest() {
  console.log('=== COMPREHENSIVE AUTHENTICATION DIAGNOSTIC ===\n');
  
  // Test 1: Backend Health Check
  console.log('1. Testing Backend Health...');
  try {
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log(`   ✅ Backend is healthy`);
    console.log(`   🕒 Uptime: ${healthResponse.data.uptime}`);
    console.log(`   📅 Timestamp: ${healthResponse.data.timestamp}\n`);
  } catch (error) {
    console.log(`   ❌ Backend health check failed: ${error.message}\n`);
    return;
  }
  
  // Test 2: Spreadsheet Metadata
  console.log('2. Fetching Spreadsheet Metadata...');
  try {
    const metadataResponse = await axios.get(`${BACKEND_URL}/api/v1/sheets/metadata`);
    console.log(`   ✅ Metadata fetched successfully`);
    console.log(`   📄 Spreadsheet title: ${metadataResponse.data.data.title}`);
    console.log(`   📑 Sheet count: ${metadataResponse.data.data.sheets.length}`);
    
    // List all sheets
    console.log(`   📋 Sheets:`);
    metadataResponse.data.data.sheets.forEach((sheet, index) => {
      console.log(`      ${index + 1}. ${sheet.title}`);
    });
    console.log('');
  } catch (error) {
    console.log(`   ❌ Metadata fetch failed: ${error.message}\n`);
    return;
  }
  
  // Test 3: Sheet1 Data Access
  console.log('3. Accessing Sheet1 Data...');
  let sheetData = null;
  try {
    const sheetResponse = await axios.get(`${BACKEND_URL}/api/v1/sheets/Sheet1`);
    sheetData = sheetResponse.data.data.values;
    
    if (sheetData && sheetData.length > 0) {
      console.log(`   ✅ Sheet1 data accessed successfully`);
      console.log(`   📊 Rows found: ${sheetData.length}`);
      console.log(`   📊 Columns in header: ${sheetData[0].length}\n`);
      
      // Display header
      console.log(`   🔤 Header row:`);
      sheetData[0].forEach((header, index) => {
        console.log(`      ${index}: ${header}`);
      });
      console.log('');
    } else {
      console.log(`   ❌ Sheet1 is empty\n`);
      return;
    }
  } catch (error) {
    console.log(`   ❌ Sheet1 access failed: ${error.message}\n`);
    return;
  }
  
  // Test 4: User Search
  console.log('4. Searching for Test User...');
  if (sheetData) {
    const headerRow = sheetData[0];
    const emailColumnIndex = headerRow.indexOf('Email');
    const passwordColumnIndex = headerRow.indexOf('Password');
    const nameColumnIndex = headerRow.indexOf('Name');
    const roleColumnIndex = headerRow.indexOf('Role');
    const idColumnIndex = headerRow.indexOf('ID');
    
    if (emailColumnIndex === -1) {
      console.log(`   ❌ Email column not found in header\n`);
      return;
    }
    
    let userFound = false;
    let userRowData = null;
    
    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      const userEmail = row[emailColumnIndex];
      
      if (userEmail === TEST_CREDENTIALS.email) {
        userFound = true;
        userRowData = {
          row: i + 1,
          id: row[idColumnIndex],
          name: row[nameColumnIndex],
          email: userEmail,
          password: row[passwordColumnIndex],
          role: row[roleColumnIndex]
        };
        
        console.log(`   ✅ User found!`);
        console.log(`      📍 Row: ${userRowData.row}`);
        console.log(`      🆔 ID: ${userRowData.id}`);
        console.log(`      👤 Name: ${userRowData.name}`);
        console.log(`      📧 Email: ${userRowData.email}`);
        console.log(`      🔐 Password: ${userRowData.password ? '[HIDDEN]' : 'MISSING'}`);
        console.log(`      🎯 Role: ${userRowData.role}`);
        
        // Validate role
        const validRoles = ['admin', 'manager', 'cashier', 'accountant', 'sales', 'finance'];
        if (!validRoles.includes(userRowData.role)) {
          console.log(`      ⚠️  INVALID ROLE: Must be one of ${validRoles.join(', ')}\n`);
        } else {
          console.log(`      ✅ Role is valid\n`);
        }
        
        break;
      }
    }
    
    if (!userFound) {
      console.log(`   ❌ User with email "${TEST_CREDENTIALS.email}" not found in Sheet1\n`);
      
      // Show first few users for reference
      console.log(`   📋 First 5 users in Sheet1:`);
      for (let i = 1; i < Math.min(sheetData.length, 6); i++) {
        const row = sheetData[i];
        const userEmail = row[emailColumnIndex];
        const userName = row[nameColumnIndex];
        console.log(`      ${i}. ${userName || 'N/A'} <${userEmail || 'N/A'}>`);
      }
      console.log('');
    } else {
      // Test 5: Credential Validation
      console.log('5. Validating Credentials...');
      if (userRowData.password === TEST_CREDENTIALS.password) {
        console.log(`   ✅ PASSWORD MATCH! Authentication should work.`);
        console.log(`   🎉 The user should be able to log in successfully.\n`);
      } else {
        console.log(`   ❌ PASSWORD MISMATCH!`);
        console.log(`      Expected: "${TEST_CREDENTIALS.password}"`);
        console.log(`      Found:    "${userRowData.password}"`);
        console.log(`      Length - Expected: ${TEST_CREDENTIALS.password.length}, Found: ${userRowData.password ? userRowData.password.length : 0}\n`);
      }
    }
  }
  
  // Test 6: Check All Sheets
  console.log('6. Checking All Sheets Data...');
  try {
    const allSheetsResponse = await axios.get(`${BACKEND_URL}/api/v1/sheets/all`);
    console.log(`   ✅ All sheets data fetched successfully`);
    
    const sheets = Object.keys(allSheetsResponse.data.data);
    console.log(`   📊 Sheets with data: ${sheets.length}`);
    
    sheets.forEach(sheetName => {
      const sheet = allSheetsResponse.data.data[sheetName];
      if (sheet.values && sheet.values.length > 0) {
        console.log(`      ${sheetName}: ${sheet.values.length} rows`);
      } else {
        console.log(`      ${sheetName}: Empty`);
      }
    });
    console.log('');
  } catch (error) {
    console.log(`   ❌ All sheets data fetch failed: ${error.message}\n`);
  }
  
  console.log('=== DIAGNOSTIC COMPLETE ===');
}

// Run the test
runComprehensiveTest().catch(error => {
  console.error('Unexpected error during diagnostic:', error);
});