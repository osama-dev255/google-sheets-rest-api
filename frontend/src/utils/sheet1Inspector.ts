import { getSheetData } from '@/services/apiService';

/**
 * Fetches and formats Sheet1 data for inspection
 * @returns Formatted Sheet1 data or error information
 */
export async function inspectSheet1Data() {
  try {
    console.log('Fetching Sheet1 data for inspection...');
    
    // Fetch Sheet1 data
    const response = await getSheetData('Sheet1');
    
    if (!response || !response.data || !response.data.values) {
      return {
        success: false,
        error: 'Failed to fetch Sheet1 data',
        details: 'No data returned from API',
        rawData: response
      };
    }
    
    const sheetData = response.data.values;
    
    // Check if we have any data
    if (sheetData.length === 0) {
      return {
        success: false,
        error: 'Sheet1 is empty',
        details: 'No data found in Sheet1',
        rawData: sheetData
      };
    }
    
    // Extract header row
    const headerRow = sheetData[0];
    
    // Process all rows
    const processedData = sheetData.map((row: any[], rowIndex: number) => {
      const rowData: any = {
        rowNumber: rowIndex + 1,
        isHeader: rowIndex === 0,
        data: {} as any
      };
      
      // Map each cell to its corresponding header
      row.forEach((cellValue: string, cellIndex: number) => {
        const headerName = headerRow[cellIndex] || `Column ${cellIndex + 1}`;
        rowData.data[headerName] = cellValue || '';
      });
      
      return rowData;
    });
    
    // Analyze the data
    const analysis = {
      totalRows: sheetData.length,
      totalColumns: headerRow.length,
      headerRow: headerRow,
      headers: headerRow.map((header: string, index: number) => ({
        name: header,
        columnIndex: index
      })),
      dataRows: processedData.slice(1), // Exclude header row
      hasRequiredHeaders: checkRequiredHeaders(headerRow),
      userCount: sheetData.length - 1 // Exclude header row
    };
    
    return {
      success: true,
      data: processedData,
      analysis: analysis,
      rawData: sheetData
    };
  } catch (error: any) {
    console.error('Error inspecting Sheet1 data:', error);
    return {
      success: false,
      error: 'Failed to inspect Sheet1 data',
      details: error.message || 'Unknown error occurred',
      rawData: null
    };
  }
}

/**
 * Checks if Sheet1 has the required headers for authentication
 * @param headerRow The header row from Sheet1
 * @returns Object with validation results
 */
function checkRequiredHeaders(headerRow: string[]) {
  const requiredHeaders = ['ID', 'Name', 'Email', 'Password', 'Role'];
  const missingHeaders = requiredHeaders.filter(header => !headerRow.includes(header));
  const extraHeaders = headerRow.filter(header => !requiredHeaders.includes(header));
  
  return {
    hasAllRequired: missingHeaders.length === 0,
    missingHeaders,
    extraHeaders,
    requiredHeaders
  };
}

/**
 * Formats Sheet1 data for display in a table-like structure
 * @param sheetData The raw Sheet1 data
 * @returns Formatted string representation of the data
 */
export function formatSheet1Data(sheetData: any[]) {
  if (!sheetData || sheetData.length === 0) {
    return 'No data to display';
  }
  
  // Calculate column widths
  const headerRow = sheetData[0];
  const columnWidths: number[] = headerRow.map((header: string) => {
    let maxWidth = header ? header.length : 10;
    
    // Check data rows for this column
    for (let i = 1; i < Math.min(sheetData.length, 10); i++) { // Limit to first 10 rows for performance
      const cellValue = sheetData[i][headerRow.indexOf(header)] || '';
      maxWidth = Math.max(maxWidth, cellValue.length);
    }
    
    // Limit max width for readability
    return Math.min(maxWidth, 30);
  });
  
  // Create formatted output
  let output = '';
  
  // Add header row
  headerRow.forEach((header: string, index: number) => {
    const width = columnWidths[index];
    output += padString(header || '', width) + ' | ';
  });
  output += '\n';
  
  // Add separator
  headerRow.forEach((_: string, index: number) => {
    const width = columnWidths[index];
    output += '-'.repeat(width) + ' | ';
  });
  output += '\n';
  
  // Add data rows (limit to first 20 for readability)
  const rowsToDisplay = Math.min(sheetData.length, 20);
  for (let i = 1; i < rowsToDisplay; i++) {
    const row = sheetData[i];
    row.forEach((cell: string, index: number) => {
      const width = columnWidths[index];
      const cellValue = cell || '';
      // Truncate long values
      const displayValue = cellValue.length > width ? cellValue.substring(0, width - 3) + '...' : cellValue;
      output += padString(displayValue, width) + ' | ';
    });
    output += '\n';
  }
  
  if (sheetData.length > rowsToDisplay) {
    output += `... and ${sheetData.length - rowsToDisplay} more rows\n`;
  }
  
  return output;
}

/**
 * Pads a string to a specified width
 * @param str The string to pad
 * @param width The desired width
 * @returns Padded string
 */
function padString(str: string, width: number): string {
  if (str.length >= width) return str;
  return str + ' '.repeat(width - str.length);
}