// Test the LASTUPDATED field update
console.log('Testing LASTUPDATED field update...');

// Simulate the inventory header row
const inventoryHeaderRow = ["ID","PRODUCT","CATEGORY","CURRENTSTOCK","RE-ORDER LEVEL","MAXSTOCK","UNIT","PRICE","LOCATION","SUPPLIER","LASTUPDATED","STATUS"];

// Find the LASTUPDATED column index
const lastUpdatedIndex = inventoryHeaderRow.indexOf('LASTUPDATED');
console.log('LASTUPDATED column index:', lastUpdatedIndex);

// Simulate current date
const now = new Date();
const currentDate = now.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' });
console.log('Current date:', currentDate);

// Simulate inventory update
const inventoryProductInfo = {
  rowIndex: 1,
  rowData: ["1","COKE 600MLS 12S/W NP","PET","299","30","200","Ctn","9700","BLOCK A","TEST SUPPLIER","2025-10-09","Active"]
};

const updateRange = `Inventory!${String.fromCharCode(65 + lastUpdatedIndex)}${inventoryProductInfo.rowIndex + 1}`;
const updateValues = [[currentDate]];

console.log('Update range:', updateRange);
console.log('Update values:', updateValues);