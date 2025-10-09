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
    'POST /inventory/update-quantities': 'Update inventory quantities based on sales/purchases',
    'POST /purchases/add-stock': 'Add stock through purchase transactions',
    'POST /rename': 'Rename a sheet',
    'GET /:sheetName': 'Get data from a specific sheet',
    'GET /:sheetName/range/:range': 'Get data from a specific range',
    'PUT /:sheetName/range/:range': 'Update data in a specific range',
    'POST /:sheetName/append': 'Append data to a sheet',
    'DELETE /:sheetName/clear': 'Clear data from a sheet or range',
  };
  
  sendSuccessResponse(res, routes, 'Available Google Sheets API routes');
});

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
 *   purchases: { productName: string; quantity: number; cost: number }[]
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
    
    // Process inventory sheet updates
    const inventoryHeaderRow = inventoryRows[0];
    const inventoryProductNameIndex = inventoryHeaderRow.indexOf('PRODUCT');
    const inventoryCurrentStockIndex = inventoryHeaderRow.indexOf('CURRENTSTOCK');
    const inventoryPriceIndex = inventoryHeaderRow.indexOf('PRICE'); // Add price index
    
    if (inventoryProductNameIndex === -1 || inventoryCurrentStockIndex === -1 || inventoryPriceIndex === -1) {
      return sendErrorResponse(res, 'Required columns not found in Inventory sheet', 400);
    }
    
    // Process products sheet updates
    const productsHeaderRow = productRows[0];
    const productsProductNameIndex = productsHeaderRow.indexOf('PRODUCT');
    const productsStockIndex = productsHeaderRow.indexOf('STOCK');
    const productsCostIndex = productsHeaderRow.indexOf('UNIT COST'); // Add cost index
    
    if (productsProductNameIndex === -1 || productsStockIndex === -1 || productsCostIndex === -1) {
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
    
    for (const purchase of purchases) {
      // Update Inventory sheet (increase stock and update price)
      const inventoryProductInfo = inventoryProductMap.get(purchase.productName);
      if (inventoryProductInfo) {
        const currentStock = parseInt(inventoryProductInfo.rowData[inventoryCurrentStockIndex]) || 0;
        const newStock = currentStock + purchase.quantity;
        
        inventorySheetUpdates.push({
          range: `Inventory!${String.fromCharCode(65 + inventoryCurrentStockIndex)}${inventoryProductInfo.rowIndex + 1}`,
          values: [[newStock.toString()]]
        });
        
        // Update price in inventory sheet
        inventorySheetUpdates.push({
          range: `Inventory!${String.fromCharCode(65 + inventoryPriceIndex)}${inventoryProductInfo.rowIndex + 1}`,
          values: [[purchase.cost.toString()]]
        });
      }
      
      // Update Products sheet (increase stock and update unit cost)
      const productsProductInfo = productsProductMap.get(purchase.productName);
      if (productsProductInfo) {
        const currentStock = parseInt(productsProductInfo.rowData[productsStockIndex]) || 0;
        const newStock = currentStock + purchase.quantity;
        
        productsSheetUpdates.push({
          range: `Products!${String.fromCharCode(65 + productsStockIndex)}${productsProductInfo.rowIndex + 1}`,
          values: [[newStock.toString()]]
        });
        
        // Update unit cost in products sheet
        productsSheetUpdates.push({
          range: `Products!${String.fromCharCode(65 + productsCostIndex)}${productsProductInfo.rowIndex + 1}`,
          values: [[purchase.cost.toString()]]
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
    }, 'Stock added successfully through purchases');
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