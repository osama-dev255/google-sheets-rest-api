// Test the timezone implementation
const now = new Date();
console.log('Current UTC time:', now.toISOString());
console.log('Current Nairobi time (formatted):', 
  now.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' }), 
  now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false }));
  
// Test with a specific timestamp
const testTime = new Date('2025-10-11T05:44:34.071Z');
console.log('\nTesting with specific timestamp:');
console.log('UTC time:', testTime.toISOString());
console.log('Nairobi time (formatted):', 
  testTime.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' }), 
  testTime.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false }));
  
console.log('\nExpected Nairobi time for 05:44:34 UTC: 08:44:34');