// Debug timezone implementation
const now = new Date();

console.log('Debugging timezone implementation...\n');

// Current UTC time
console.log('1. UTC time:');
console.log('   toISOString():', now.toISOString());
console.log('   getTimezoneOffset():', now.getTimezoneOffset());

// Current local time in Nairobi
console.log('\n2. Nairobi time (using timeZone option):');
console.log('   toLocaleString():', now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
console.log('   toLocaleDateString (en-CA):', now.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' }));
console.log('   toLocaleTimeString (24-hour):', now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false }));
console.log('   toLocaleTimeString (12-hour):', now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: true }));

// Current system default time
console.log('\n3. System default time:');
console.log('   toString():', now.toString());
console.log('   toLocaleString() [default]:', now.toLocaleString());
console.log('   toLocaleDateString() [default]:', now.toLocaleDateString());
console.log('   toLocaleTimeString() [default]:', now.toLocaleTimeString());

// Test what we're using in our code
console.log('\n4. What we use in our code:');
const currentDate = now.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' });
const currentTime = now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false });
console.log('   Date (en-CA):', currentDate);
console.log('   Time (en-US, 24-hour):', currentTime);

// Compare with UTC
console.log('\n5. Comparison with UTC:');
const utcDate = now.toLocaleDateString('en-CA', { timeZone: 'UTC' });
const utcTime = now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false });
console.log('   UTC Date (en-CA):', utcDate);
console.log('   UTC Time (en-US, 24-hour):', utcTime);