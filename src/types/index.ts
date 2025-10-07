// Environment variables interface
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  GOOGLE_SHEETS_PRIVATE_KEY: string;
  GOOGLE_SHEETS_CLIENT_EMAIL: string;
  GOOGLE_SHEETS_PROJECT_ID: string;
  GOOGLE_SHEETS_SPREADSHEET_ID: string;
  CORS_ORIGIN?: string;
  RATE_LIMIT_WINDOW_MS?: number;
  RATE_LIMIT_MAX_REQUESTS?: number;
}

// Google Sheets related types
export interface GoogleSheetsCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

export interface SheetData {
  range: string;
  majorDimension: string;
  values: string[][];
}

export interface SheetMetadata {
  sheetId: number;
  title: string;
  index: number;
  sheetType: string;
  gridProperties: {
    rowCount: number;
    columnCount: number;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface GetSheetDataRequest {
  sheetName?: string;
  range?: string;
  majorDimension?: 'ROWS' | 'COLUMNS';
}

export interface UpdateSheetDataRequest {
  sheetName: string;
  range: string;
  values: string[][];
  valueInputOption?: 'RAW' | 'USER_ENTERED';
}

// Error types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}