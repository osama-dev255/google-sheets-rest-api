// Test our timezone implementation directly
console.log('Testing timezone implementation...\n');

// This is the same logic we're using in sheets.ts
const now = new Date();
const currentDate = now.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' });
const currentTime = now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false });

console.log('Current time implementation:');
console.log('Date:', currentDate);
console.log('Time:', currentTime);

// Compare with UTC
const utcDate = now.toLocaleDateString('en-CA', { timeZone: 'UTC' });
const utcTime = now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false });

console.log('\nUTC time for comparison:');
console.log('Date:', utcDate);
console.log('Time:', utcTime);

console.log('\nIf the dates/times are different, our implementation is working correctly.');