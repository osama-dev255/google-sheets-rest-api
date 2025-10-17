import { getSheetData } from '@/services/apiService';

/**
 * Validates user credentials against Sheet1 data
 * @param email User's email
 * @param password User's password
 * @returns User object if valid, null if invalid
 */
export async function validateUserCredentials(email: string, password: string) {
  try {
    // Fetch user data from Google Sheets (Sheet1)
    const response = await getSheetData('Sheet1');
    
    if (response && response.data && response.data.values) {
      const users = response.data.values;
      
      // Check if we have any users data
      if (users.length < 2) {
        throw new Error('No user accounts found in authentication database. Please contact your system administrator.');
      }
      
      // Check header row
      const headerRow = users[0];
      const requiredHeaders = ['ID', 'Name', 'Email', 'Password', 'Role'];
      const missingHeaders = requiredHeaders.filter(header => !headerRow.includes(header));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers in Sheet1: ${missingHeaders.join(', ')}`);
      }
      
      // Find email column index
      const emailColumnIndex = headerRow.indexOf('Email');
      const passwordColumnIndex = headerRow.indexOf('Password');
      const idColumnIndex = headerRow.indexOf('ID');
      const nameColumnIndex = headerRow.indexOf('Name');
      const roleColumnIndex = headerRow.indexOf('Role');
      
      // Skip the header row (index 0) and check each user
      for (let i = 1; i < users.length; i++) {
        const userRow = users[i];
        const id = userRow[idColumnIndex];
        const name = userRow[nameColumnIndex];
        const userEmail = userRow[emailColumnIndex];
        const userPassword = userRow[passwordColumnIndex];
        const role = userRow[roleColumnIndex];
        
        // Validate that all required fields exist
        if (!id || !name || !userEmail || !userPassword || !role) {
          console.warn(`Skipping incomplete user record at row ${i + 1}`);
          continue; // Skip incomplete user records
        }
        
        // Check credentials (case sensitive comparison)
        if (userEmail === email && userPassword === password) {
          // Validate role
          const validRoles = ['admin', 'manager', 'cashier', 'accountant', 'sales', 'finance'];
          if (!validRoles.includes(role)) {
            throw new Error(`Invalid user role '${role}' for user ${userEmail}. Valid roles are: ${validRoles.join(', ')}.`);
          }
          
          return {
            id,
            name,
            email: userEmail,
            role: role as 'admin' | 'manager' | 'cashier' | 'accountant' | 'sales' | 'finance'
          };
        }
      }
    } else {
      throw new Error('Failed to fetch user data from authentication database. Please check your internet connection and try again.');
    }
    
    return null; // No matching user found
  } catch (error) {
    console.error('Error validating user credentials:', error);
    throw error;
  }
}

/**
 * Refreshes user data from Sheet1
 * @param currentUserEmail Email of the current user
 * @returns Updated user object or null if user no longer exists
 */
export async function refreshUserData(currentUserEmail: string) {
  try {
    // Fetch user data from Google Sheets (Sheet1)
    const response = await getSheetData('Sheet1');
    
    if (response && response.data && response.data.values) {
      const users = response.data.values;
      
      // Check if we have any users data
      if (users.length < 2) {
        throw new Error('No user accounts found in authentication database.');
      }
      
      // Check header row
      const headerRow = users[0];
      const emailColumnIndex = headerRow.indexOf('Email');
      const passwordColumnIndex = headerRow.indexOf('Password');
      const idColumnIndex = headerRow.indexOf('ID');
      const nameColumnIndex = headerRow.indexOf('Name');
      const roleColumnIndex = headerRow.indexOf('Role');
      
      // Skip the header row (index 0) and check each user
      for (let i = 1; i < users.length; i++) {
        const userRow = users[i];
        const id = userRow[idColumnIndex];
        const name = userRow[nameColumnIndex];
        const userEmail = userRow[emailColumnIndex];
        const userPassword = userRow[passwordColumnIndex];
        const role = userRow[roleColumnIndex];
        
        // Validate that all required fields exist
        if (!id || !name || !userEmail || !userPassword || !role) {
          console.warn(`Skipping incomplete user record at row ${i + 1}`);
          continue; // Skip incomplete user records
        }
        
        // Check if this is the current user
        if (userEmail === currentUserEmail) {
          // Validate role
          const validRoles = ['admin', 'manager', 'cashier', 'accountant', 'sales', 'finance'];
          if (!validRoles.includes(role)) {
            throw new Error(`Invalid user role '${role}' for user ${userEmail}. Valid roles are: ${validRoles.join(', ')}.`);
          }
          
          return {
            id,
            name,
            email: userEmail,
            role: role as 'admin' | 'manager' | 'cashier' | 'accountant' | 'sales' | 'finance'
          };
        }
      }
    }
    
    return null; // User not found
  } catch (error) {
    console.error('Error refreshing user data:', error);
    throw error;
  }
}