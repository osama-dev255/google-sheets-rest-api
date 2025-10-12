// Test the settlement functionality
console.log('Testing settlement cart functionality...');

// Simulate adding settlement items
const settlementItems = [
  {
    id: '1',
    description: 'COKE 600MLS 12S/W NP - Invoice #INV-001',
    amount: 97000,
    status: 'paid',
    reference: 'TXN-001',
    date: new Date().toLocaleDateString()
  },
  {
    id: '2',
    description: 'SPRITE 600ML 12 S/W NP - Invoice #INV-002',
    amount: 48500,
    status: 'credited',
    reference: 'TXN-002',
    date: new Date().toLocaleDateString()
  }
];

// Calculate totals
const totalPaid = settlementItems
  .filter(item => item.status === 'paid')
  .reduce((sum, item) => sum + item.amount, 0);
  
const totalCredited = settlementItems
  .filter(item => item.status === 'credited')
  .reduce((sum, item) => sum + item.amount, 0);
  
const netSettlement = totalPaid - totalCredited;

console.log('Settlement Items:', settlementItems);
console.log('Total Paid:', totalPaid);
console.log('Total Credited:', totalCredited);
console.log('Net Settlement:', netSettlement);