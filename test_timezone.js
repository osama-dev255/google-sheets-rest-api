const { googleSheetsService } = require('./dist/services/googleSheetsService');

// Test the timezone implementation
async function testTimezone() {
  try {
    // Use local timezone instead of UTC for timestamps
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' }); // YYYY-MM-DD format
    const currentTime = now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false }); // HH:MM:SS format
    
    console.log('Current Nairobi time:', currentDate, currentTime);
    console.log('UTC time:', now.toISOString());
  } catch (error) {
    console.error('Error testing timezone:', error);
  }
}

testTimezone();