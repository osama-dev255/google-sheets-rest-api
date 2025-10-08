export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

// Updated to match the actual API response structure
export interface SpreadsheetMetadata {
  title: string;
  sheets: SheetInfo[];
}

export interface SheetInfo {
  sheetId: number;
  title: string;
  index: number;
  sheetType: string;
  gridProperties: {
    rowCount: number;
    columnCount: number;
  };
}

export interface SheetData {
  range: string;
  majorDimension: string;
  values: any[][];
}

export interface AllSheetsData {
  [sheetName: string]: SheetData;
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
  uptime: number;
  environment: string;
}