import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';
import config from '../config/environment';
import logger from '../config/logger';
import { SheetData, SheetMetadata, GoogleSheetsCredentials } from '../types';

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private auth: JWT;
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = config.GOOGLE_SHEETS_SPREADSHEET_ID;
    this.auth = this.createAuthClient();
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    
    logger.info('Google Sheets service initialized', {
      spreadsheetId: this.spreadsheetId,
      projectId: config.GOOGLE_SHEETS_PROJECT_ID,
    });
  }

  /**
   * Create Google Auth JWT client
   */
  private createAuthClient(): JWT {
    // Log credential info for debugging (without exposing the key)
    logger.info('Creating Google Auth client', {
      clientEmail: config.GOOGLE_SHEETS_CLIENT_EMAIL,
      projectId: config.GOOGLE_SHEETS_PROJECT_ID,
      keyLength: config.GOOGLE_SHEETS_PRIVATE_KEY.length,
    });

    const credentials: Partial<GoogleSheetsCredentials> = {
      type: 'service_account',
      project_id: config.GOOGLE_SHEETS_PROJECT_ID,
      private_key: config.GOOGLE_SHEETS_PRIVATE_KEY,
      client_email: config.GOOGLE_SHEETS_CLIENT_EMAIL,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    };

    // Validate credentials before creating JWT
    if (!credentials.private_key || credentials.private_key.length < 100) {
      logger.error('Invalid private key', { 
        keyLength: credentials.private_key?.length || 0,
        hasBegin: credentials.private_key?.includes('-----BEGIN') || false,
        hasEnd: credentials.private_key?.includes('-----END') || false
      });
      throw new Error('Invalid Google Sheets private key');
    }

    if (!credentials.client_email || !credentials.client_email.includes('@')) {
      logger.error('Invalid client email', { email: credentials.client_email });
      throw new Error('Invalid Google Sheets client email');
    }

    try {
      const auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.readonly',
        ],
      });

      logger.info('Google Auth client created successfully');
      return auth;
    } catch (error: any) {
      logger.error('Failed to create Google Auth client', {
        error: error.message,
        stack: error.stack,
        email: credentials.client_email,
      });
      throw new Error(`Failed to create Google Auth client: ${error.message}`);
    }
  }

  /**
   * Get spreadsheet metadata
   */
  async getSpreadsheetMetadata(): Promise<{ title: string; sheets: SheetMetadata[] }> {
    try {
      logger.debug('Fetching spreadsheet metadata', { spreadsheetId: this.spreadsheetId });

      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const spreadsheet = response.data;
      const title = spreadsheet.properties?.title || 'Unknown';
      const sheets: SheetMetadata[] = spreadsheet.sheets?.map(sheet => ({
        sheetId: sheet.properties?.sheetId || 0,
        title: sheet.properties?.title || 'Unknown',
        index: sheet.properties?.index || 0,
        sheetType: sheet.properties?.sheetType || 'GRID',
        gridProperties: {
          rowCount: sheet.properties?.gridProperties?.rowCount || 0,
          columnCount: sheet.properties?.gridProperties?.columnCount || 0,
        },
      })) || [];

      logger.info('Spreadsheet metadata retrieved successfully', {
        title,
        sheetCount: sheets.length,
        sheets: sheets.map(s => s.title),
      });

      return { title, sheets };
    } catch (error: any) {
      logger.error('Failed to fetch spreadsheet metadata', { error: error?.message || 'Unknown error' });
      throw new Error(`Failed to fetch spreadsheet metadata: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Get data from a specific sheet range
   */
  async getSheetData(
    sheetName: string,
    range?: string,
    majorDimension: 'ROWS' | 'COLUMNS' = 'ROWS'
  ): Promise<SheetData> {
    try {
      const fullRange = range ? `${sheetName}!${range}` : sheetName;
      
      logger.debug('Fetching sheet data', {
        spreadsheetId: this.spreadsheetId,
        range: fullRange,
        majorDimension,
      });

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: fullRange,
        majorDimension,
      });

      const data: SheetData = {
        range: response.data.range || fullRange,
        majorDimension: response.data.majorDimension || majorDimension,
        values: response.data.values || [],
      };

      logger.info('Sheet data retrieved successfully', {
        range: data.range,
        rowCount: data.values.length,
        columnCount: data.values[0]?.length || 0,
      });

      return data;
    } catch (error: any) {
      logger.error('Failed to fetch sheet data', { 
        sheetName, 
        range, 
        error: error?.message || 'Unknown error'
      });
      throw new Error(`Failed to fetch sheet data: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Get all sheets data
   */
  async getAllSheetsData(): Promise<{ [sheetName: string]: SheetData }> {
    try {
      const metadata = await this.getSpreadsheetMetadata();
      const allData: { [sheetName: string]: SheetData } = {};

      logger.debug('Fetching data from all sheets', { 
        sheetCount: metadata.sheets.length 
      });

      for (const sheet of metadata.sheets) {
        try {
          const data = await this.getSheetData(sheet.title);
          allData[sheet.title] = data;
        } catch (error: any) {
          logger.warn(`Failed to fetch data from sheet: ${sheet.title}`, { 
            error: error?.message || 'Unknown error'
          });
          // Continue with other sheets even if one fails
        }
      }

      logger.info('All sheets data retrieved', { 
        successfulSheets: Object.keys(allData).length,
        totalSheets: metadata.sheets.length,
      });

      return allData;
    } catch (error: any) {
      logger.error('Failed to fetch all sheets data', { error: error?.message || 'Unknown error' });
      throw new Error(`Failed to fetch all sheets data: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Update sheet data
   */
  async updateSheetData(
    sheetName: string,
    range: string,
    values: string[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED'
  ): Promise<void> {
    try {
      // Check if range already includes sheet name to avoid duplication
      const fullRange = range.includes('!')
        ? range // Range already includes sheet name
        : `${sheetName}!${range}`; // Add sheet name to range
      
      logger.debug('Updating sheet data', {
        spreadsheetId: this.spreadsheetId,
        range: fullRange,
        valueInputOption,
        rowCount: values.length,
        columnCount: values[0]?.length || 0,
      });

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: fullRange,
        valueInputOption,
        requestBody: {
          values,
        },
      });

      logger.info('Sheet data updated successfully', {
        range: fullRange,
        updatedCells: values.length * (values[0]?.length || 0),
      });
    } catch (error: any) {
      logger.error('Failed to update sheet data', { 
        sheetName, 
        range, 
        error: error?.message || 'Unknown error'
      });
      throw new Error(`Failed to update sheet data: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Append data to sheet
   */
  async appendSheetData(
    sheetName: string,
    values: string[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED'
  ): Promise<void> {
    try {
      logger.debug('Appending data to sheet', {
        spreadsheetId: this.spreadsheetId,
        sheetName,
        valueInputOption,
        rowCount: values.length,
      });

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: sheetName,
        valueInputOption,
        requestBody: {
          values,
        },
      });

      logger.info('Data appended to sheet successfully', {
        sheetName,
        appendedRows: values.length,
      });
    } catch (error: any) {
      logger.error('Failed to append data to sheet', { 
        sheetName, 
        error: error?.message || 'Unknown error'
      });
      throw new Error(`Failed to append data to sheet: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Clear sheet data
   */
  async clearSheetData(sheetName: string, range?: string): Promise<void> {
    try {
      // Check if range already includes sheet name to avoid duplication
      const fullRange = range 
        ? (range.includes('!') ? range : `${sheetName}!${range}`) // Add sheet name if not already included
        : sheetName; // If no range provided, use sheet name only
      
      logger.debug('Clearing sheet data', {
        spreadsheetId: this.spreadsheetId,
        range: fullRange,
      });

      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: fullRange,
      });

      logger.info('Sheet data cleared successfully', { range: fullRange });
    } catch (error: any) {
      logger.error('Failed to clear sheet data', { 
        sheetName, 
        range, 
        error: error?.message || 'Unknown error'
      });
      throw new Error(`Failed to clear sheet data: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Rename a sheet
   */
  async renameSheet(oldName: string, newName: string): Promise<void> {
    try {
      logger.debug('Renaming sheet', {
        spreadsheetId: this.spreadsheetId,
        oldName,
        newName,
      });

      // First, get the spreadsheet metadata to find the sheet ID
      const metadata = await this.getSpreadsheetMetadata();
      const sheet = metadata.sheets.find(s => s.title === oldName);
      
      if (!sheet) {
        throw new Error(`Sheet with name "${oldName}" not found`);
      }

      // Use batchUpdate to rename the sheet
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [{
            updateSheetProperties: {
              properties: {
                sheetId: sheet.sheetId,
                title: newName,
              },
              fields: 'title',
            },
          }],
        },
      });

      logger.info('Sheet renamed successfully', { 
        oldName, 
        newName,
        sheetId: sheet.sheetId,
      });
    } catch (error: any) {
      logger.error('Failed to rename sheet', { 
        oldName,
        newName,
        error: error?.message || 'Unknown error'
      });
      throw new Error(`Failed to rename sheet: ${error?.message || 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();