import { getSheetData } from '@/services/apiService';

/**
 * Diagnostic function to check Sheet1 data and identify potential login issues
 * @returns Diagnostic information about Sheet1 structure and user data
 */
export async function diagnoseSheet1Auth() {
  try {
    console.log('Starting Sheet1 authentication diagnostic...');
    
    // Fetch Sheet1 data
    const response = await getSheetData('Sheet1');
    
    if (!response || !response.data || !response.data.values) {
      return {
        success: false,
        error: 'Failed to fetch Sheet1 data',
        details: 'No data returned from API',
        sheetData: null
      };
    }
    
    const users = response.data.values;
    
    // Check if we have any users data
    if (users.length < 1) {
      return {
        success: false,
        error: 'Sheet1 is empty',
        details: 'No data found in Sheet1',
        sheetData: users
      };
    }
    
    // Analyze header row
    const headerRow = users[0];
    const expectedHeaders = ['ID', 'Name', 'Email', 'Password', 'Role'];
    const missingHeaders = expectedHeaders.filter(header => !headerRow.includes(header));
    
    // Check data structure
    const diagnostics = {
      success: true,
      sheetRowCount: users.length,
      headerRow,
      missingHeaders,
      usersWithIssues: [] as any[],
      validUsers: [] as any[],
      totalUsers: users.length - 1 // Exclude header row
    };
    
    // Analyze each user row
    for (let i = 1; i < users.length; i++) {
      const [id, name, email, password, role] = users[i];
      const userIndex = i;
      
      const issues = [];
      
      // Check required fields
      if (!id) issues.push('Missing ID');
      if (!name) issues.push('Missing Name');
      if (!email) issues.push('Missing Email');
      if (!password) issues.push('Missing Password');
      if (!role) issues.push('Missing Role');
      
      // Validate email format
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        issues.push('Invalid Email Format');
      }
      
      // Validate role
      if (role && !['admin', 'manager', 'cashier'].includes(role)) {
        issues.push(`Invalid Role: ${role}`);
      }
      
      const userData = {
        row: userIndex + 1,
        id,
        name,
        email,
        password: password ? '****' : '',
        role,
        issues
      };
      
      if (issues.length > 0) {
        diagnostics.usersWithIssues.push(userData);
      } else {
        diagnostics.validUsers.push(userData);
      }
    }
    
    return diagnostics;
  } catch (error: any) {
    console.error('Sheet1 diagnostic error:', error);
    return {
      success: false,
      error: 'Diagnostic failed',
      details: error.message || 'Unknown error occurred',
      sheetData: null
    };
  }
}

/**
 * Test specific user credentials against Sheet1
 * @param email User's email
 * @param password User's password
 * @returns Detailed result of credential test
 */
export async function testUserCredentials(email: string, password: string) {
  try {
    console.log(`Testing credentials for: ${email}`);
    
    // Fetch Sheet1 data
    const response = await getSheetData('Sheet1');
    
    if (!response || !response.data || !response.data.values) {
      return {
        success: false,
        error: 'Failed to fetch Sheet1 data',
        userFound: false,
        details: 'No data returned from API'
      };
    }
    
    const users = response.data.values;
    
    // Check if we have any users data
    if (users.length < 2) {
      return {
        success: false,
        error: 'No user accounts found',
        userFound: false,
        details: 'Sheet1 has no user data (need at least header + 1 user row)',
        sheetRowCount: users.length
      };
    }
    
    // Look for the user
    let userFound = false;
    let userRow = -1;
    let userMatch = false;
    
    for (let i = 1; i < users.length; i++) {
      const [id, name, userEmail, userPassword, role] = users[i];
      
      // Check if email matches
      if (userEmail === email) {
        userFound = true;
        userRow = i + 1; // 1-based indexing for spreadsheet rows
        
        // Check if password also matches
        if (userPassword === password) {
          userMatch = true;
          
          return {
            success: true,
            userFound: true,
            credentialsMatch: true,
            userDetails: {
              row: userRow,
              id,
              name,
              email: userEmail,
              role
            },
            details: 'User found and credentials match'
          };
        }
        
        // Email found but password doesn't match
        return {
          success: false,
          userFound: true,
          credentialsMatch: false,
          userDetails: {
            row: userRow,
            id,
            name,
            email: userEmail,
            role,
            passwordInSheet: userPassword
          },
          details: 'User found but password does not match',
          error: 'Invalid password'
        };
      }
    }
    
    // User not found
    return {
      success: false,
      userFound: false,
      credentialsMatch: false,
      details: 'No user found with that email address',
      error: 'User not found'
    };
  } catch (error: any) {
    console.error('User credential test error:', error);
    return {
      success: false,
      userFound: false,
      credentialsMatch: false,
      error: 'Test failed',
      details: error.message || 'Unknown error occurred'
    };
  }
}