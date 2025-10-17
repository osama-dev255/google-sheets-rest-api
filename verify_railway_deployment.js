#!/usr/bin/env node

/**
 * Script to verify Railway deployment
 * This script will check if the Railway backend is properly deployed and accessible
 */

const https = require('https');

// Replace with your actual Railway app URL once deployed
const RAILWAY_APP_URL = process.env.RAILWAY_APP_URL || 'your-railway-app-url.railway.app';

console.log('🔍 Verifying Railway deployment...');
console.log(`🔗 Checking: https://${RAILWAY_APP_URL}`);

// Test endpoints
const endpoints = [
  '/',
  '/health',
  '/api/v1/sheets/metadata',
  '/api/v1/sheets/Sheet1'
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `https://${RAILWAY_APP_URL}${endpoint}`;
    console.log(`\n🧪 Testing: ${url}`);
    
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        console.log(`📝 Content-Type: ${res.headers['content-type']}`);
        if (data.length < 200) {
          console.log(`📄 Response: ${data}`);
        } else {
          console.log(`📄 Response: ${data.substring(0, 200)}... (truncated)`);
        }
        resolve({ endpoint, status: res.statusCode, success: res.statusCode >= 200 && res.statusCode < 400 });
      });
    });
    
    req.on('error', (e) => {
      console.log(`❌ Error: ${e.message}`);
      resolve({ endpoint, status: 'ERROR', success: false, error: e.message });
    });
    
    req.setTimeout(10000, () => {
      console.log('⏰ Request timeout');
      req.destroy();
      resolve({ endpoint, status: 'TIMEOUT', success: false });
    });
  });
}

async function verifyDeployment() {
  console.log('🚀 Starting Railway deployment verification...\n');
  
  const results = [];
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 SUMMARY:');
  console.log('============');
  
  let successCount = 0;
  results.forEach(result => {
    const statusIcon = result.success ? '✅' : '❌';
    console.log(`${statusIcon} ${result.endpoint}: ${result.status}`);
    if (result.success) successCount++;
  });
  
  console.log(`\n📈 ${successCount}/${results.length} endpoints responded successfully`);
  
  if (successCount === results.length) {
    console.log('🎉 All endpoints are working! Railway deployment is successful.');
  } else {
    console.log('⚠️  Some endpoints failed. Check the Railway deployment logs for errors.');
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check Railway deployment logs');
    console.log('   2. Verify environment variables are set correctly');
    console.log('   3. Ensure the Google Sheet is shared with the service account');
    console.log('   4. Check that Google Sheets API is enabled in your Google Cloud project');
  }
}

// Run verification
verifyDeployment();