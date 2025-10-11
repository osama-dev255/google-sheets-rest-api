// Test the time formatting
const now = new Date();
console.log('Current UTC time:', now.toISOString());
console.log('Current local time (Nairobi):', now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
console.log('Current date (Nairobi):', now.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' }));
console.log('Current time (Nairobi, 24-hour):', now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false }));
console.log('Current time (Nairobi, 12-hour):', now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: true }));

// Test what we're using in the code
const currentDate = now.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' });
const currentTime = now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false });
console.log('\nUsing in our code:');
console.log('Date:', currentDate);
console.log('Time:', currentTime);