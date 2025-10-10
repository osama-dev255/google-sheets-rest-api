const axios = require('axios');
const fs = require('fs');

// Check if the Netlify site is deployed and accessible
async function checkNetlifyDeployment() {
  try {
    console.log('Checking Netlify deployment status...\n');
    
    // First, let's check if we can find the Netlify site URL
    // This would typically be in your Netlify dashboard
    // For now, we'll use a placeholder - you'll need to replace this with your actual Netlify URL
    const netlifyUrl = 'https://your-netlify-site.netlify.app'; // Replace with your actual URL
    
    console.log(`Checking site: ${netlifyUrl}`);
    
    // Try to access the main page
    const response = await axios.get(netlifyUrl, { timeout: 10000 });
    
    if (response.status === 200) {
      console.log('✅ Netlify site is accessible');
      console.log(`Status: ${response.status}`);
      console.log(`Content-Type: ${response.headers['content-type']}`);
      
      // Check if it's an HTML page
      if (response.headers['content-type'] && response.headers['content-type'].includes('text/html')) {
        console.log('✅ Serving HTML content (expected for a React app)');
      } else {
        console.log('⚠️  Unexpected content type');
      }
      
      // Check for common React app indicators
      if (response.data.includes('root') || response.data.includes('div')) {
        console.log('✅ HTML structure looks correct');
      }
      
    } else {
      console.log(`⚠️  Unexpected status code: ${response.status}`);
    }
    
  } catch (error) {
    if (error.response) {
      console.log(`❌ HTTP Error: ${error.response.status}`);
      console.log(`Status: ${error.response.status}`);
      console.log(`Status Text: ${error.response.statusText}`);
    } else if (error.request) {
      console.log('❌ Network Error: Unable to reach the site');
      console.log('This could mean:');
      console.log('  1. The site URL is incorrect');
      console.log('  2. The deployment is still in progress');
      console.log('  3. There was a deployment failure');
      console.log('  4. The site is temporarily unavailable');
    } else {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n--- Deployment Verification Steps ---');
  console.log('1. Go to https://app.netlify.com/');
  console.log('2. Sign in to your Netlify account');
  console.log('3. Find your site in the dashboard');
  console.log('4. Check the "Deploys" tab for the latest deployment');
  console.log('5. Look for a green "Published" status');
  console.log('6. Check the deployment logs for any errors');
  
  console.log('\n--- If Deployment Failed ---');
  console.log('Common issues and solutions:');
  console.log('1. Check the build logs for errors');
  console.log('2. Verify the netlify.toml configuration');
  console.log('3. Ensure all environment variables are set');
  console.log('4. Check that the build command succeeds locally');
  console.log('5. Verify the publish directory is correct');
  
  // Create a simple test HTML file to verify the build output
  console.log('\n--- Local Build Verification ---');
  try {
    if (fs.existsSync('./frontend/dist/index.html')) {
      console.log('✅ Build output found in frontend/dist/');
      const stats = fs.statSync('./frontend/dist');
      console.log(`✅ Dist directory exists, last modified: ${stats.mtime}`);
      
      // Check if there are files in the dist directory
      const files = fs.readdirSync('./frontend/dist');
      console.log(`✅ Dist directory contains ${files.length} items`);
      
      if (files.includes('index.html')) {
        console.log('✅ index.html found in dist/');
      }
    } else {
      console.log('❌ Build output not found in frontend/dist/');
    }
  } catch (err) {
    console.log(`❌ Error checking build output: ${err.message}`);
  }
}

checkNetlifyDeployment();