// Simple Node.js script to inspect Sheet1 data
// Run with: node inspect_sheet1.js

const axios = require('axios');

// Replace with your actual API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'https://google-sheets-rest-api-production.up.railway.app';

// User credentials to test (if you want to test specific user)
const TEST_EMAIL = 'accountant@businessproject.co.tz';
const TEST_PASSWORD = 'accountant147';

async function inspectSheet1() {
  try {
    console.log('Fetching Sheet1 data...\n');
    
    // Fetch Sheet1 data
    const response = await axios.get(`${API_BASE_URL}/api/v1/sheets/Sheet1`);
    
    if (!response.data || !response.data.data || !response.data.data.values) {
      console.log('❌ No data returned from API');
      return;
    }
    
    const sheetData = response.data.data.values;
    
    if (sheetData.length === 0) {
      console.log('❌ Sheet1 is empty');
      return;
    }
    
    console.log(`✅ Found ${sheetData.length} rows in Sheet1\n`);
    
    // Display header row
    console.log('Header Row:');
    console.log(sheetData[0].map((header, index) => `${index}: ${header}`).join(' | '));
    console.log('');
    
    // Display first few data rows
    const rowsToDisplay = Math.min(sheetData.length, 6); // Header + 5 data rows
    console.log('First 5 Data Rows:');
    
    for (let i = 0; i < rowsToDisplay; i++) {
      const row = sheetData[i];
      const rowLabel = i === 0 ? 'Header' : `Row ${i}`;
      console.log(`${rowLabel}: ${row.map(cell => `"${cell}"`).join(' | ')}`);
    }
    
    if (sheetData.length > rowsToDisplay) {
      console.log(`... and ${sheetData.length - rowsToDisplay} more rows`);
    }
    
    // Test specific user if credentials are provided
    if (TEST_EMAIL && TEST_PASSWORD) {
      console.log(`\n--- TESTING USER: ${TEST_EMAIL} ---`);
      await testSpecificUser(sheetData, TEST_EMAIL, TEST_PASSWORD);
    }
    
    // Analyze data
    console.log('\n--- ANALYSIS ---');
    
    // Check for required headers
    const headerRow = sheetData[0];
    const requiredHeaders = ['ID', 'Name', 'Email', 'Password', 'Role'];
    const missingHeaders = requiredHeaders.filter(header => !headerRow.includes(header));
    
    if (missingHeaders.length > 0) {
      console.log(`❌ Missing required headers: ${missingHeaders.join(', ')}`);
    } else {
      console.log('✅ All required headers present');
    }
    
    // Check user data (skip header)
    if (sheetData.length > 1) {
      console.log(`\nUser Accounts: ${sheetData.length - 1}`);
      
      let validUsers = 0;
      let invalidUsers = 0;
      
      // Valid roles
      const validRoles = ['admin', 'manager', 'cashier', 'accountant', 'sales', 'finance'];
      
      for (let i = 1; i < sheetData.length; i++) {
        const [id, name, email, password, role] = sheetData[i];
        
        // Check if all fields are present
        if (!id || !name || !email || !password || !role) {
          console.log(`⚠️  Incomplete user data at row ${i + 1}`);
          invalidUsers++;
        } else {
          // Check email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            console.log(`⚠️  Invalid email format at row ${i + 1}: ${email}`);
            invalidUsers++;
          } else {
            // Check role
            if (!validRoles.includes(role)) {
              console.log(`⚠️  Invalid role at row ${i + 1}: ${role}`);
              invalidUsers++;
            } else {
              validUsers++;
            }
          }
        }
      }
      
      console.log(`\nValid Users: ${validUsers}`);
      console.log(`Invalid Users: ${invalidUsers}`);
      console.log(`\nValid Roles: ${validRoles.join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Error inspecting Sheet1:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function testSpecificUser(sheetData, testEmail, testPassword) {
  try {
    // Check header row
    const headerRow = sheetData[0];
    const emailColumnIndex = headerRow.indexOf('Email');
    const passwordColumnIndex = headerRow.indexOf('Password');
    const nameColumnIndex = headerRow.indexOf('Name');
    const roleColumnIndex = headerRow.indexOf('Role');
    const idColumnIndex = headerRow.indexOf('ID');
    
    if (emailColumnIndex === -1 || passwordColumnIndex === -1 || nameColumnIndex === -1 || roleColumnIndex === -1 || idColumnIndex === -1) {
      console.log('❌ Required columns not found in header row');
      return;
    }
    
    // Search for the user
    let userFound = false;
    
    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      const userEmail = row[emailColumnIndex];
      
      if (userEmail === testEmail) {
        userFound = true;
        const userName = row[nameColumnIndex];
        const userPassword = row[passwordColumnIndex];
        const userRole = row[roleColumnIndex];
        const userId = row[idColumnIndex];
        
        console.log(`🔍 User found at row ${i + 1}:`);
        console.log(`   ID: ${userId}`);
        console.log(`   Name: ${userName}`);
        console.log(`   Email: ${userEmail}`);
        console.log(`   Role: ${userRole}`);
        
        // Check if role is valid
        const validRoles = ['admin', 'manager', 'cashier', 'accountant', 'sales', 'finance'];
        if (!validRoles.includes(userRole)) {
          console.log(`\n⚠️  INVALID ROLE!`);
          console.log(`   Valid roles are: ${validRoles.join(', ')}`);
        }
        
        // Check password
        if (userPassword === testPassword) {
          console.log(`\n✅ PASSWORD MATCH! User can log in successfully`);
        } else {
          console.log(`\n❌ PASSWORD MISMATCH!`);
          console.log(`   Expected: "${testPassword}"`);
          console.log(`   Found:    "${userPassword}"`);
          
          // Show character codes to help identify hidden characters
          if (userPassword) {
            console.log(`   Length - Expected: ${testPassword.length}, Found: ${userPassword.length}`);
          }
        }
        
        break;
      }
    }
    
    if (!userFound) {
      console.log(`\n❌ User with email "${testEmail}" not found in Sheet1`);
      console.log(`\nUsers found in Sheet1:`);
      for (let i = 1; i < Math.min(sheetData.length, 10); i++) {
        const row = sheetData[i];
        const userEmail = row[emailColumnIndex];
        if (userEmail) {
          console.log(`   ${userEmail}`);
        }
      }
      if (sheetData.length > 10) {
        console.log(`   ... and ${sheetData.length - 10} more users`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing specific user:', error.message);
  }
}

// Run the inspection
inspectSheet1();