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
 * GET /api/v1/sheets
 * List all available routes and their descriptions
 */
router.get('/', (req: Request, res: Response) => {
  const routes = {
    'GET /metadata': 'Get spreadsheet metadata',
    'GET /all': 'Get data from all sheets',
    'GET /:sheetName': 'Get data from a specific sheet',
    'GET /:sheetName/range/:range': 'Get data from a specific range',
    'PUT /:sheetName/range/:range': 'Update data in a specific range',
    'POST /:sheetName/append': 'Append data to a sheet',
    'DELETE /:sheetName/clear': 'Clear data from a sheet or range',
  };
  
  sendSuccessResponse(res, routes, 'Available Google Sheets API routes');
});

export default router;