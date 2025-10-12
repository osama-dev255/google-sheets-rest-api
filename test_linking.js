// Test the linking functionality between Purchase Records and Payment Settlement
console.log('Testing linking functionality...');

// Simulate a purchase record
const purchaseRecord = {
  id: 'P1760167532018',
  receiptNo: 'R349483',
  date: '2025-10-11',
  time: '10:25:32',
  product: 'COKE 600MLS 12S/W NP',
  category: 'PET',
  quantity: 5,
  price: 10000,
  amount: 50000,
  location: 'NEW TEST LOCATION',
  supplier: 'NEW TEST SUPPLIER',
  status: 'completed',
  purchasedBy: 'NEW TEST USER'
};

// Function to convert purchase to settlement item
function addPurchaseToSettlement(purchase) {
  const settlementItem = {
    id: `settlement-${Date.now()}`,
    description: `${purchase.product} - Receipt #${purchase.receiptNo}`,
    amount: purchase.amount,
    status: 'paid', // Default to paid
    reference: purchase.receiptNo,
    date: new Date().toLocaleDateString()
  };
  
  return settlementItem;
}

// Test the conversion
const settlementItem = addPurchaseToSettlement(purchaseRecord);
console.log('Purchase Record:', purchaseRecord);
console.log('Converted Settlement Item:', settlementItem);