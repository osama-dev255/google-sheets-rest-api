import { Router, Request, Response } from 'express';
import { googleSheetsService } from '../services/googleSheetsService';
import { 
  sendSuccessResponse, 
  sendErrorResponse, 
  asyncHandler,
  handleError 
} from '../utils/responseHelpers';
import { GetSheetDataRequest, UpdateSheetDataRequest } from '../types';
import logger from '../config/logger';

const router = Router();

/**
 * GET /api/v1/sheets
 * List all available routes and their descriptions
 */
router.get('/', (req: Request, res: Response) => {
  const routes = {
    'GET /metadata': 'Get spreadsheet metadata',
    'GET /all': 'Get data from all sheets',
    'GET /export/:format': 'Export all sheets data in specified format (csv, json)',
    'POST /inventory/update-quantities': 'Update inventory quantities based on sales/purchases',
    'POST /purchases/add-stock': 'Add stock through purchase transactions',
    'POST /sales/record': 'Record a sale transaction',
    'POST /rename': 'Rename a sheet',
    'DELETE /:sheetName/row/:rowIndex': 'Clear a specific row in a sheet',
    'GET /:sheetName': 'Get data from a specific sheet',
    'GET /:sheetName/range/:range': 'Get data from a specific range',
    'PUT /:sheetName/range/:range': 'Update data in a specific range',
    'POST /:sheetName/append': 'Append data to a sheet',
    'DELETE /:sheetName/clear': 'Clear data from a sheet or range',
  };
  
  sendSuccessResponse(res, routes, 'Available Google Sheets API routes');
});

/**
 * GET /api/v1/sheets/export/:format
 * Export all sheets data in specified format
 */
router.get('/export/:format', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { format } = req.params;
    const validFormats = ['csv', 'json'];
    
    if (!validFormats.includes(format)) {
      return sendErrorResponse(res, `Invalid format. Supported formats: ${validFormats.join(', ')}`, 400);
    }
    
    logger.debug('Exporting all sheets data', { format });
    const allData = await googleSheetsService.getAllSheetsData();
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="sheets-export.json"');
      return res.json(allData);
    } else if (format === 'csv') {
      // Convert to CSV format
      let csvContent = '';
      
      for (const [sheetName, sheetData] of Object.entries(allData)) {
        csvContent += `Sheet: ${sheetName}\n`;
        
        if (sheetData.values && sheetData.values.length > 0) {
          // Add header row
          const headers = sheetData.values[0];
          csvContent += headers.join(',') + '\n';
          
          // Add data rows
          for (let i = 1; i < sheetData.values.length; i++) {
            csvContent += sheetData.values[i].join(',') + '\n';
          }
        }
        
        csvContent += '\n'; // Separator between sheets
      }
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sheets-export.csv"');
      return res.send(csvContent);
    }
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * GET /api/v1/sheets/metadata
 * Get spreadsheet metadata including all sheet names and properties
 */
router.get('/metadata', asyncHandler(async (req: Request, res: Response) => {
  try {
    logger.debug('Fetching spreadsheet metadata');
    const metadata = await googleSheetsService.getSpreadsheetMetadata();
    
    sendSuccessResponse(res, metadata, 'Spreadsheet metadata retrieved successfully');
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * GET /api/v1/sheets/all
 * Get data from all sheets in the spreadsheet
 */
router.get('/all', asyncHandler(async (req: Request, res: Response) => {
  try {
    logger.debug('Fetching data from all sheets');
    const allData = await googleSheetsService.getAllSheetsData();
    
    sendSuccessResponse(res, allData, 'All sheets data retrieved successfully');
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * DELETE /api/v1/sheets/:sheetName/row/:rowIndex
 * Clear a specific row in a sheet
 */
router.delete('/:sheetName/row/:rowIndex', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { sheetName } = req.params;
    const { rowIndex } = req.params;
    
    if (!sheetName) {
      return sendErrorResponse(res, 'Sheet name is required', 400);
    }
    
    const rowIndexNum = parseInt(rowIndex);
    if (isNaN(rowIndexNum) || rowIndexNum < 1) {
      return sendErrorResponse(res, 'Valid row index is required', 400);
    }
    
    logger.debug('Clearing row in sheet', { sheetName, rowIndex: rowIndexNum });
    
    // Get sheet data to determine the number of columns
    const sheetData = await googleSheetsService.getSheetData(sheetName);
    const rows = sheetData.values || [];
    
    if (rows.length === 0) {
      return sendErrorResponse(res, 'Sheet is empty', 400);
    }
    
    // Check if row index is within bounds
    if (rowIndexNum > rows.length) {
      return sendErrorResponse(res, 'Row index out of bounds', 400);
    }
    
    // Get the number of columns from the header row
    const columnCount = rows[0].length;
    
    // Create empty values for the row
    const emptyRow = Array(columnCount).fill('');
    
    // Convert rowIndexNum to 0-based index for Google Sheets
    // rowIndexNum is 1-based (from frontend), so we subtract 1
    const range = `${sheetName}!A${rowIndexNum}:${String.fromCharCode(64 + columnCount)}${rowIndexNum}`;
    
    await googleSheetsService.updateSheetData(
      sheetName,
      range,
      [emptyRow],
      'USER_ENTERED'
    );
    
    sendSuccessResponse(res, null, `Row ${rowIndexNum} cleared successfully in sheet "${sheetName}"`);
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * POST /api/v1/sheets/inventory/update-quantities
 * Update inventory quantities based on sales/purchases
 * Body: {
 *   updates: { productName: string; quantityChange: number }[]
 * }
 */
router.post('/inventory/update-quantities', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { updates } = req.body;
    
    if (!updates || !Array.isArray(updates)) {
      return sendErrorResponse(res, 'Updates array is required', 400);
    }
    
    logger.debug('Updating inventory quantities', { updateCount: updates.length });
    
    // Get current inventory data
    const inventoryData = await googleSheetsService.getSheetData('Inventory');
    const inventoryRows = inventoryData.values || [];
    
    if (inventoryRows.length === 0) {
      return sendErrorResponse(res, 'Inventory sheet is empty', 400);
    }
    
    // Get current products data
    const productsData = await googleSheetsService.getSheetData('Products');
    const productRows = productsData.values || [];
    
    if (productRows.length === 0) {
      return sendErrorResponse(res, 'Products sheet is empty', 400);
    }
    
    // Process inventory sheet updates
    const inventoryHeaderRow = inventoryRows[0];
    const inventoryProductNameIndex = inventoryHeaderRow.indexOf('PRODUCT');
    const inventoryCurrentStockIndex = inventoryHeaderRow.indexOf('CURRENTSTOCK');
    const inventoryIdIndex = inventoryHeaderRow.indexOf('ID');
    
    if (inventoryProductNameIndex === -1 || inventoryCurrentStockIndex === -1) {
      return sendErrorResponse(res, 'Required columns not found in Inventory sheet', 400);
    }
    
    // Process products sheet updates
    const productsHeaderRow = productRows[0];
    const productsProductNameIndex = productsHeaderRow.indexOf('PRODUCT');
    const productsStockIndex = productsHeaderRow.indexOf('STOCK');
    const productsIdIndex = productsHeaderRow.indexOf('ID');
    
    if (productsProductNameIndex === -1 || productsStockIndex === -1) {
      return sendErrorResponse(res, 'Required columns not found in Products sheet', 400);
    }
    
    // Create maps for quick lookup
    const inventoryProductMap = new Map();
    for (let i = 1; i < inventoryRows.length; i++) {
      const productName = inventoryRows[i][inventoryProductNameIndex];
      if (productName) {
        inventoryProductMap.set(productName, { rowIndex: i, rowData: inventoryRows[i] });
      }
    }
    
    const productsProductMap = new Map();
    for (let i = 1; i < productRows.length; i++) {
      const productName = productRows[i][productsProductNameIndex];
      if (productName) {
        productsProductMap.set(productName, { rowIndex: i, rowData: productRows[i] });
      }
    }
    
    // Prepare updates for Google Sheets
    const inventorySheetUpdates = [];
    const productsSheetUpdates = [];
    
    for (const update of updates) {
      // Update Inventory sheet
      const inventoryProductInfo = inventoryProductMap.get(update.productName);
      if (inventoryProductInfo) {
        const currentStock = parseInt(inventoryProductInfo.rowData[inventoryCurrentStockIndex]) || 0;
        const newStock = currentStock + update.quantityChange;
        
        // Ensure stock doesn't go below zero
        const finalStock = Math.max(0, newStock);
        
        inventorySheetUpdates.push({
          range: `Inventory!${String.fromCharCode(65 + inventoryCurrentStockIndex)}${inventoryProductInfo.rowIndex + 1}`,
          values: [[finalStock.toString()]]
        });
      }
      
      // Update Products sheet
      const productsProductInfo = productsProductMap.get(update.productName);
      if (productsProductInfo) {
        const currentStock = parseInt(productsProductInfo.rowData[productsStockIndex]) || 0;
        const newStock = currentStock + update.quantityChange;
        
        // Ensure stock doesn't go below zero
        const finalStock = Math.max(0, newStock);
        
        productsSheetUpdates.push({
          range: `Products!${String.fromCharCode(65 + productsStockIndex)}${productsProductInfo.rowIndex + 1}`,
          values: [[finalStock.toString()]]
        });
      }
    }
    
    // Apply all updates to Google Sheets
    const allUpdates = [...inventorySheetUpdates, ...productsSheetUpdates];
    for (const update of allUpdates) {
      // Determine which sheet to update based on the range
      const sheetName = update.range.split('!')[0];
      const range = update.range.split('!')[1];
      
      await googleSheetsService.updateSheetData(
        sheetName,
        range,
        update.values,
        'USER_ENTERED'
      );
    }
    
    sendSuccessResponse(res, { 
      updatedItems: allUpdates.length,
      inventoryUpdates: inventorySheetUpdates.length,
      productsUpdates: productsSheetUpdates.length
    }, 'Inventory quantities updated successfully');
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

// Add new endpoint for purchase transactions
/**
 * POST /api/v1/sheets/purchases/add-stock
 * Add stock through purchase transactions
 * Body: {
 *   purchases: { productName: string; quantity: number; cost: number; supplier?: string; location?: string; purchasedBy?: string }[]
 * }
 */
router.post('/purchases/add-stock', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { purchases } = req.body;
    
    if (!purchases || !Array.isArray(purchases)) {
      return sendErrorResponse(res, 'Purchases array is required', 400);
    }
    
    logger.debug('Adding stock through purchases', { purchaseCount: purchases.length });
    
    // Get current inventory data
    const inventoryData = await googleSheetsService.getSheetData('Inventory');
    const inventoryRows = inventoryData.values || [];
    
    if (inventoryRows.length === 0) {
      return sendErrorResponse(res, 'Inventory sheet is empty', 400);
    }
    
    // Get current products data
    const productsData = await googleSheetsService.getSheetData('Products');
    const productRows = productsData.values || [];
    
    if (productRows.length === 0) {
      return sendErrorResponse(res, 'Products sheet is empty', 400);
    }
    
    // Get Purchases sheet data to understand its structure
    const purchasesData = await googleSheetsService.getSheetData('Purchases');
    const purchasesRows = purchasesData.values || [];
    
    // Process inventory sheet updates
    const inventoryHeaderRow = inventoryRows[0];
    const inventoryProductNameIndex = inventoryHeaderRow.indexOf('PRODUCT');
    const inventoryCurrentStockIndex = inventoryHeaderRow.indexOf('CURRENTSTOCK');
    const inventorySupplierIndex = inventoryHeaderRow.indexOf('SUPPLIER'); // Add supplier index
    const inventoryCategoryIndex = inventoryHeaderRow.indexOf('CATEGORY');
    const inventoryLocationIndex = inventoryHeaderRow.indexOf('LOCATION');
    
    if (inventoryProductNameIndex === -1 || inventoryCurrentStockIndex === -1) {
      return sendErrorResponse(res, 'Required columns not found in Inventory sheet', 400);
    }
    
    // Process products sheet updates
    const productsHeaderRow = productRows[0];
    const productsProductNameIndex = productsHeaderRow.indexOf('PRODUCT');
    const productsStockIndex = productsHeaderRow.indexOf('STOCK');
    const productsCostIndex = productsHeaderRow.indexOf('UNIT COST');
    const productsSupplierIndex = productsHeaderRow.indexOf('SUPPLIER'); // Add supplier index
    const productsCategoryIndex = productsHeaderRow.indexOf('CATEGORY');
    
    if (productsProductNameIndex === -1 || productsStockIndex === -1 || productsCostIndex === -1) {
      return sendErrorResponse(res, 'Required columns not found in Products sheet', 400);
    }
    
    // Process purchases sheet structure
    const purchasesHeaderRow = purchasesRows[0] || [];
    const purchasesIdIndex = purchasesHeaderRow.indexOf('ID');
    const purchasesReceiptNoIndex = purchasesHeaderRow.indexOf('RECEIPT NO.');
    const purchasesDateIndex = purchasesHeaderRow.indexOf('DATE');
    const purchasesTimeIndex = purchasesHeaderRow.indexOf('TIME');
    const purchasesProductIndex = purchasesHeaderRow.indexOf('PRODUCT');
    const purchasesCategoryIndex = purchasesHeaderRow.indexOf('CATEGORY');
    const purchasesQuantityIndex = purchasesHeaderRow.indexOf('QUANTITY');
    const purchasesCostIndex = purchasesHeaderRow.indexOf('COST');
    const purchasesAmountIndex = purchasesHeaderRow.indexOf('AMOUNT');
    const purchasesLocationIndex = purchasesHeaderRow.indexOf('LOCATION');
    const purchasesSupplierIndex = purchasesHeaderRow.indexOf('SUPPLIER');
    const purchasesStatusIndex = purchasesHeaderRow.indexOf('STATUS');
    const purchasesPurchasedByIndex = purchasesHeaderRow.indexOf('PURCHASED BY');
    
    // Create maps for quick lookup
    const inventoryProductMap = new Map();
    for (let i = 1; i < inventoryRows.length; i++) {
      const productName = inventoryRows[i][inventoryProductNameIndex];
      if (productName) {
        inventoryProductMap.set(productName, { rowIndex: i, rowData: inventoryRows[i] });
      }
    }
    
    const productsProductMap = new Map();
    for (let i = 1; i < productRows.length; i++) {
      const productName = productRows[i][productsProductNameIndex];
      if (productName) {
        productsProductMap.set(productName, { rowIndex: i, rowData: productRows[i] });
      }
    }
    
    // Prepare updates for Google Sheets
    const inventorySheetUpdates = [];
    const productsSheetUpdates = [];
    const purchasesSheetUpdates = [];
    
    // Generate a unique ID for the purchase record
    const purchaseId = `P${Date.now()}`;
    const receiptNo = `R${Math.floor(100000 + Math.random() * 900000)}`;
    // Use local timezone instead of UTC for timestamps
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' }); // YYYY-MM-DD format
    const currentTime = now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false }); // HH:MM:SS format
    const purchasedBy = 'System'; // Could be made dynamic in the future
    const status = 'Completed';
    
    for (const purchase of purchases) {
      // Update Inventory sheet (increase stock and update supplier if provided)
      const inventoryProductInfo = inventoryProductMap.get(purchase.productName);
      if (inventoryProductInfo) {
        const currentStock = parseInt(inventoryProductInfo.rowData[inventoryCurrentStockIndex]) || 0;
        const newStock = currentStock + purchase.quantity;
        const category = inventoryProductInfo.rowData[inventoryCategoryIndex] || 'Unknown';
        // Use provided location or fallback to inventory location
        const location = purchase.location || inventoryProductInfo.rowData[inventoryLocationIndex] || 'Unknown';
        const supplier = purchase.supplier || inventoryProductInfo.rowData[inventorySupplierIndex] || 'Unknown';
        // Use provided purchasedBy or fallback to default
        const finalPurchasedBy = purchase.purchasedBy || purchasedBy;
        
        inventorySheetUpdates.push({
          range: `Inventory!${String.fromCharCode(65 + inventoryCurrentStockIndex)}${inventoryProductInfo.rowIndex + 1}`,
          values: [[newStock.toString()]]
        });
        
        // Update supplier in inventory sheet if provided
        if (purchase.supplier && inventorySupplierIndex !== -1) {
          inventorySheetUpdates.push({
            range: `Inventory!${String.fromCharCode(65 + inventorySupplierIndex)}${inventoryProductInfo.rowIndex + 1}`,
            values: [[purchase.supplier]]
          });
        }
        
        // Update last updated date in inventory sheet
        const inventoryLastUpdatedIndex = inventoryHeaderRow.indexOf('LASTUPDATED');
        if (inventoryLastUpdatedIndex !== -1) {
          inventorySheetUpdates.push({
            range: `Inventory!${String.fromCharCode(65 + inventoryLastUpdatedIndex)}${inventoryProductInfo.rowIndex + 1}`,
            values: [[currentDate]]
          });
        }
        
        // Add purchase record to Purchases sheet
        if (purchasesProductIndex !== -1) {
          const amount = purchase.quantity * purchase.cost;
          const purchaseRowData = [];
          
          // Fill the purchase row with data based on column indices
          if (purchasesIdIndex !== -1) purchaseRowData[purchasesIdIndex] = purchaseId;
          if (purchasesReceiptNoIndex !== -1) purchaseRowData[purchasesReceiptNoIndex] = receiptNo;
          if (purchasesDateIndex !== -1) purchaseRowData[purchasesDateIndex] = currentDate;
          if (purchasesTimeIndex !== -1) purchaseRowData[purchasesTimeIndex] = currentTime;
          if (purchasesProductIndex !== -1) purchaseRowData[purchasesProductIndex] = purchase.productName;
          if (purchasesCategoryIndex !== -1) purchaseRowData[purchasesCategoryIndex] = category;
          if (purchasesQuantityIndex !== -1) purchaseRowData[purchasesQuantityIndex] = purchase.quantity.toString();
          if (purchasesCostIndex !== -1) purchaseRowData[purchasesCostIndex] = purchase.cost.toString();
          if (purchasesAmountIndex !== -1) purchaseRowData[purchasesAmountIndex] = amount.toString();
          if (purchasesLocationIndex !== -1) purchaseRowData[purchasesLocationIndex] = location;
          if (purchasesSupplierIndex !== -1) purchaseRowData[purchasesSupplierIndex] = supplier;
          if (purchasesStatusIndex !== -1) purchaseRowData[purchasesStatusIndex] = status;
          if (purchasesPurchasedByIndex !== -1) purchaseRowData[purchasesPurchasedByIndex] = finalPurchasedBy;
          
          // Fill any undefined values with empty strings
          for (let i = 0; i < purchaseRowData.length; i++) {
            if (purchaseRowData[i] === undefined) {
              purchaseRowData[i] = '';
            }
          }
          
          purchasesSheetUpdates.push({
            range: `Purchases!A${purchasesRows.length + 1}:${String.fromCharCode(65 + purchaseRowData.length - 1)}${purchasesRows.length + 1}`,
            values: [purchaseRowData]
          });
        }
      }
      
      // Update Products sheet (increase stock, update unit cost, and update supplier if provided)
      const productsProductInfo = productsProductMap.get(purchase.productName);
      if (productsProductInfo) {
        const currentStock = parseInt(productsProductInfo.rowData[productsStockIndex]) || 0;
        const newStock = currentStock + purchase.quantity;
        const category = productsProductInfo.rowData[productsCategoryIndex] || 'Unknown';
        const supplier = purchase.supplier || productsProductInfo.rowData[productsSupplierIndex] || 'Unknown';
        // Use provided purchasedBy or fallback to default
        const finalPurchasedBy = purchase.purchasedBy || purchasedBy;
        
        productsSheetUpdates.push({
          range: `Products!${String.fromCharCode(65 + productsStockIndex)}${productsProductInfo.rowIndex + 1}`,
          values: [[newStock.toString()]]
        });
        
        // Update unit cost in products sheet
        productsSheetUpdates.push({
          range: `Products!${String.fromCharCode(65 + productsCostIndex)}${productsProductInfo.rowIndex + 1}`,
          values: [[purchase.cost.toString()]]
        });
        
        // Update supplier in products sheet if provided
        if (purchase.supplier && productsSupplierIndex !== -1) {
          productsSheetUpdates.push({
            range: `Products!${String.fromCharCode(65 + productsSupplierIndex)}${productsProductInfo.rowIndex + 1}`,
            values: [[purchase.supplier]]
          });
        }
        
        // Update last updated date in products sheet (if column exists)
        const productsLastUpdatedIndex = productsHeaderRow.indexOf('LASTUPDATED');
        if (productsLastUpdatedIndex !== -1) {
          productsSheetUpdates.push({
            range: `Products!${String.fromCharCode(65 + productsLastUpdatedIndex)}${productsProductInfo.rowIndex + 1}`,
            values: [[currentDate]]
          });
        }
        
        // Add purchase record to Purchases sheet (if not already added from inventory)
        if (purchasesProductIndex !== -1 && inventoryProductInfo === undefined) {
          const amount = purchase.quantity * purchase.cost;
          const location = purchase.location || 'Unknown'; // Use provided location or default
          const purchaseRowData = [];
          
          // Fill the purchase row with data based on column indices
          if (purchasesIdIndex !== -1) purchaseRowData[purchasesIdIndex] = purchaseId;
          if (purchasesReceiptNoIndex !== -1) purchaseRowData[purchasesReceiptNoIndex] = receiptNo;
          if (purchasesDateIndex !== -1) purchaseRowData[purchasesDateIndex] = currentDate;
          if (purchasesTimeIndex !== -1) purchaseRowData[purchasesTimeIndex] = currentTime;
          if (purchasesProductIndex !== -1) purchaseRowData[purchasesProductIndex] = purchase.productName;
          if (purchasesCategoryIndex !== -1) purchaseRowData[purchasesCategoryIndex] = category;
          if (purchasesQuantityIndex !== -1) purchaseRowData[purchasesQuantityIndex] = purchase.quantity.toString();
          if (purchasesCostIndex !== -1) purchaseRowData[purchasesCostIndex] = purchase.cost.toString();
          if (purchasesAmountIndex !== -1) purchaseRowData[purchasesAmountIndex] = amount.toString();
          if (purchasesLocationIndex !== -1) purchaseRowData[purchasesLocationIndex] = location;
          if (purchasesSupplierIndex !== -1) purchaseRowData[purchasesSupplierIndex] = supplier;
          if (purchasesStatusIndex !== -1) purchaseRowData[purchasesStatusIndex] = status;
          if (purchasesPurchasedByIndex !== -1) purchaseRowData[purchasesPurchasedByIndex] = finalPurchasedBy;
          
          // Fill any undefined values with empty strings
          for (let i = 0; i < purchaseRowData.length; i++) {
            if (purchaseRowData[i] === undefined) {
              purchaseRowData[i] = '';
            }
          }
          
          purchasesSheetUpdates.push({
            range: `Purchases!A${purchasesRows.length + 1}:${String.fromCharCode(65 + purchaseRowData.length - 1)}${purchasesRows.length + 1}`,
            values: [purchaseRowData]
          });
        }
      }
    }
    
    // Apply all updates to Google Sheets
    const allUpdates = [...inventorySheetUpdates, ...productsSheetUpdates, ...purchasesSheetUpdates];
    for (const update of allUpdates) {
      // Determine which sheet to update based on the range
      const sheetName = update.range.split('!')[0];
      const range = update.range.split('!')[1];
      
      await googleSheetsService.updateSheetData(
        sheetName,
        range,
        update.values,
        'USER_ENTERED'
      );
    }
    
    sendSuccessResponse(res, { 
      updatedItems: allUpdates.length,
      inventoryUpdates: inventorySheetUpdates.length,
      productsUpdates: productsSheetUpdates.length,
      purchasesUpdates: purchasesSheetUpdates.length
    }, 'Stock added successfully through purchases and recorded in Purchases sheet');
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * POST /api/v1/sheets/sales/record
 * Record a sale transaction
 * Body: {
 *   sales: { 
 *     id: string;
 *     receiptNo: string;
 *     date: string;
 *     time: string;
 *     category: string;
 *     product: string;
 *     price: number;
 *     discount: number;
 *     quantity: number;
 *     totalAmount: number;
 *     soldBy: string;
 *     status: string;
 *     amountReceived: number;
 *     change: number;
 *   }[]
 * }
 */
router.post('/sales/record', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { sales } = req.body;
    
    if (!sales || !Array.isArray(sales)) {
      return sendErrorResponse(res, 'Sales array is required', 400);
    }
    
    logger.debug('Recording sales transactions', { salesCount: sales.length });
    
    // Get Sales sheet data to understand its structure
    const salesData = await googleSheetsService.getSheetData('Sales');
    const salesRows = salesData.values || [];
    
    // Process sales sheet structure
    const salesHeaderRow = salesRows[0] || [];
    const salesIdIndex = salesHeaderRow.indexOf('ID');
    const salesReceiptNoIndex = salesHeaderRow.indexOf('RECEIPT NO.');
    const salesDateIndex = salesHeaderRow.indexOf('DATE');
    const salesTimeIndex = salesHeaderRow.indexOf('TIME');
    const salesCategoryIndex = salesHeaderRow.indexOf('CARTEGORY'); // Note the spelling in the sheet
    const salesProductIndex = salesHeaderRow.indexOf('PRODUCT');
    const salesPriceIndex = salesHeaderRow.indexOf('PRICE');
    const salesDiscountIndex = salesHeaderRow.indexOf('Discount');
    const salesQuantityIndex = salesHeaderRow.indexOf('QUANTITY');
    const salesTotalAmountIndex = salesHeaderRow.indexOf('TOTAL  AMOUNT'); // Note the double space
    const salesSoldByIndex = salesHeaderRow.indexOf('SOLD BY');
    const salesStatusIndex = salesHeaderRow.indexOf('STATUS');
    const salesAmountReceivedIndex = salesHeaderRow.indexOf('AMOUNT RECEIVED');
    const salesChangeIndex = salesHeaderRow.indexOf('CHANGE');
    
    // Prepare sales sheet updates
    const salesSheetUpdates = [];
    
    for (const sale of sales) {
      const saleRowData = [];
      
      // Fill the sale row with data based on column indices
      if (salesIdIndex !== -1) saleRowData[salesIdIndex] = sale.id;
      if (salesReceiptNoIndex !== -1) saleRowData[salesReceiptNoIndex] = sale.receiptNo;
      if (salesDateIndex !== -1) saleRowData[salesDateIndex] = sale.date;
      if (salesTimeIndex !== -1) saleRowData[salesTimeIndex] = sale.time;
      if (salesCategoryIndex !== -1) saleRowData[salesCategoryIndex] = sale.category;
      if (salesProductIndex !== -1) saleRowData[salesProductIndex] = sale.product;
      if (salesPriceIndex !== -1) saleRowData[salesPriceIndex] = sale.price.toString();
      if (salesDiscountIndex !== -1) saleRowData[salesDiscountIndex] = sale.discount.toString();
      if (salesQuantityIndex !== -1) saleRowData[salesQuantityIndex] = sale.quantity.toString();
      if (salesTotalAmountIndex !== -1) saleRowData[salesTotalAmountIndex] = sale.totalAmount.toString();
      if (salesSoldByIndex !== -1) saleRowData[salesSoldByIndex] = sale.soldBy;
      if (salesStatusIndex !== -1) saleRowData[salesStatusIndex] = sale.status;
      if (salesAmountReceivedIndex !== -1) saleRowData[salesAmountReceivedIndex] = sale.amountReceived.toString();
      if (salesChangeIndex !== -1) saleRowData[salesChangeIndex] = sale.change.toString();
      
      // Fill any undefined values with empty strings
      for (let i = 0; i < saleRowData.length; i++) {
        if (saleRowData[i] === undefined) {
          saleRowData[i] = '';
        }
      }
      
      salesSheetUpdates.push({
        range: `Sales!A${salesRows.length + 1}:${String.fromCharCode(65 + saleRowData.length - 1)}${salesRows.length + 1}`,
        values: [saleRowData]
      });
    }
    
    // Apply all updates to Google Sheets
    for (const update of salesSheetUpdates) {
      // Determine which sheet to update based on the range
      const sheetName = update.range.split('!')[0];
      const range = update.range.split('!')[1];
      
      await googleSheetsService.updateSheetData(
        sheetName,
        range,
        update.values,
        'USER_ENTERED'
      );
    }
    
    sendSuccessResponse(res, { 
      recordedSales: salesSheetUpdates.length
    }, 'Sales recorded successfully');
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * GET /api/v1/sheets/:sheetName
 * Get data from a specific sheet
 * Query parameters:
 * - range: Optional range (e.g., "A1:C10")
 * - majorDimension: "ROWS" or "COLUMNS" (default: "ROWS")
 */
router.get('/:sheetName', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { sheetName } = req.params;
    const { range, majorDimension = 'ROWS' } = req.query as GetSheetDataRequest;
    
    if (!sheetName) {
      return sendErrorResponse(res, 'Sheet name is required', 400);
    }
    
    logger.debug('Fetching sheet data', { sheetName, range, majorDimension });
    
    const data = await googleSheetsService.getSheetData(
      sheetName,
      range,
      majorDimension as 'ROWS' | 'COLUMNS'
    );
    
    sendSuccessResponse(res, data, `Sheet "${sheetName}" data retrieved successfully`);
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * GET /api/v1/sheets/:sheetName/range/:range
 * Get data from a specific range in a sheet
 * Query parameters:
 * - majorDimension: "ROWS" or "COLUMNS" (default: "ROWS")
 */
router.get('/:sheetName/range/:range', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { sheetName, range } = req.params;
    const { majorDimension = 'ROWS' } = req.query;
    
    if (!sheetName || !range) {
      return sendErrorResponse(res, 'Sheet name and range are required', 400);
    }
    
    logger.debug('Fetching sheet range data', { sheetName, range, majorDimension });
    
    const data = await googleSheetsService.getSheetData(
      sheetName,
      range,
      majorDimension as 'ROWS' | 'COLUMNS'
    );
    
    sendSuccessResponse(res, data, `Range "${range}" from sheet "${sheetName}" retrieved successfully`);
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * PUT /api/v1/sheets/:sheetName/range/:range
 * Update data in a specific range of a sheet
 * Body: {
 *   values: string[][],
 *   valueInputOption?: "RAW" | "USER_ENTERED"
 * }
 */
router.put('/:sheetName/range/:range', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { sheetName, range } = req.params;
    const { values, valueInputOption = 'USER_ENTERED' } = req.body as UpdateSheetDataRequest;
    
    if (!sheetName || !range) {
      return sendErrorResponse(res, 'Sheet name and range are required', 400);
    }
    
    if (!values || !Array.isArray(values)) {
      return sendErrorResponse(res, 'Values array is required', 400);
    }
    
    logger.debug('Updating sheet data', { 
      sheetName, 
      range, 
      valueInputOption, 
      rowCount: values.length 
    });
    
    await googleSheetsService.updateSheetData(sheetName, range, values, valueInputOption);
    
    sendSuccessResponse(res, null, `Range "${range}" in sheet "${sheetName}" updated successfully`);
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * POST /api/v1/sheets/:sheetName/append
 * Append data to a sheet
 * Body: {
 *   values: string[][],
 *   valueInputOption?: "RAW" | "USER_ENTERED"
 * }
 */
router.post('/:sheetName/append', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { sheetName } = req.params;
    const { values, valueInputOption = 'USER_ENTERED' } = req.body;
    
    if (!sheetName) {
      return sendErrorResponse(res, 'Sheet name is required', 400);
    }
    
    if (!values || !Array.isArray(values)) {
      return sendErrorResponse(res, 'Values array is required', 400);
    }
    
    logger.debug('Appending data to sheet', { 
      sheetName, 
      valueInputOption, 
      rowCount: values.length 
    });
    
    await googleSheetsService.appendSheetData(sheetName, values, valueInputOption);
    
    sendSuccessResponse(res, null, `Data appended to sheet "${sheetName}" successfully`, 201);
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * DELETE /api/v1/sheets/:sheetName/clear
 * Clear data from a sheet or specific range
 * Query parameters:
 * - range: Optional range to clear (if not provided, clears entire sheet)
 */
router.delete('/:sheetName/clear', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { sheetName } = req.params;
    const { range } = req.query;
    
    if (!sheetName) {
      return sendErrorResponse(res, 'Sheet name is required', 400);
    }
    
    logger.debug('Clearing sheet data', { sheetName, range });
    
    await googleSheetsService.clearSheetData(sheetName, range as string);
    
    const message = range 
      ? `Range "${range}" in sheet "${sheetName}" cleared successfully`
      : `Sheet "${sheetName}" cleared successfully`;
      
    sendSuccessResponse(res, null, message);
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

/**
 * POST /api/v1/sheets/rename
 * Rename a sheet
 * Body: {
 *   oldName: string;
 *   newName: string;
 * }
 */
router.post('/rename', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { oldName, newName } = req.body;
    
    if (!oldName || !newName) {
      return sendErrorResponse(res, 'Both oldName and newName are required', 400);
    }
    
    logger.debug('Renaming sheet', { oldName, newName });
    
    await googleSheetsService.renameSheet(oldName, newName);
    
    sendSuccessResponse(res, { oldName, newName }, 'Sheet renamed successfully');
  } catch (error) {
    const { message, statusCode } = handleError(error, req);
    sendErrorResponse(res, message, statusCode);
  }
}));

export default router;