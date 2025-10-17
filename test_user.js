// Simple Node.js script to test a specific user's credentials
// Run with: node test_user.js

const axios = require('axios');

// Replace with your actual API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'https://google-sheets-rest-api-production.up.railway.app';

// User credentials to test
const TEST_EMAIL = 'accountant@businessproject.co.tz';
const TEST_PASSWORD = 'accountant147';

async function testUser() {
  try {
    console.log(`Testing user: ${TEST_EMAIL}\n`);
    
    // Fetch Sheet1 data
    const response = await axios.get(`${API_BASE_URL}/api/v1/sheets/Sheet1`);
    
    if (!response.data || !response.data.data || !response.data.data.values) {
      console.log('❌ No data returned from API');
      return;
    }
    
    const sheetData = response.data.data.values;
    
    if (sheetData.length < 2) {
      console.log('❌ Sheet1 does not contain user data (need at least header + 1 user row)');
      return;
    }
    
    console.log(`✅ Found ${sheetData.length - 1} users in Sheet1\n`);
    
    // Check header row
    const headerRow = sheetData[0];
    console.log('Header row:', headerRow.join(' | '));
    
    // Find email column index
    const emailColumnIndex = headerRow.indexOf('Email');
    const passwordColumnIndex = headerRow.indexOf('Password');
    const nameColumnIndex = headerRow.indexOf('Name');
    const roleColumnIndex = headerRow.indexOf('Role');
    const idColumnIndex = headerRow.indexOf('ID');
    
    if (emailColumnIndex === -1 || passwordColumnIndex === -1 || nameColumnIndex === -1 || roleColumnIndex === -1 || idColumnIndex === -1) {
      console.log('❌ Required columns not found in header row');
      console.log('Expected: ID, Name, Email, Password, Role');
      return;
    }
    
    // Search for the user
    let userFound = false;
    let userRowIndex = -1;
    
    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      const userEmail = row[emailColumnIndex];
      
      if (userEmail === TEST_EMAIL) {
        userFound = true;
        userRowIndex = i;
        const userName = row[nameColumnIndex];
        const userPassword = row[passwordColumnIndex];
        const userRole = row[roleColumnIndex];
        const userId = row[idColumnIndex];
        
        console.log(`\n🔍 User found at row ${i + 1}:`);
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
        if (userPassword === TEST_PASSWORD) {
          console.log(`\n✅ PASSWORD MATCH! User can log in successfully`);
        } else {
          console.log(`\n❌ PASSWORD MISMATCH!`);
          console.log(`   Expected: "${TEST_PASSWORD}"`);
          console.log(`   Found:    "${userPassword}"`);
          
          // Show character codes to help identify hidden characters
          if (userPassword) {
            console.log(`   Length - Expected: ${TEST_PASSWORD.length}, Found: ${userPassword.length}`);
            console.log(`   Character codes comparison:`);
            for (let j = 0; j < Math.max(TEST_PASSWORD.length, userPassword.length); j++) {
              const expectedChar = j < TEST_PASSWORD.length ? TEST_PASSWORD.charCodeAt(j) : 'N/A';
              const foundChar = j < userPassword.length ? userPassword.charCodeAt(j) : 'N/A';
              if (expectedChar !== foundChar) {
                console.log(`     Position ${j}: Expected ${expectedChar}, Found ${foundChar}`);
              }
            }
          }
        }
        
        break;
      }
    }
    
    if (!userFound) {
      console.log(`\n❌ User with email "${TEST_EMAIL}" not found in Sheet1`);
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
    console.error('❌ Error testing user:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the test
testUser();