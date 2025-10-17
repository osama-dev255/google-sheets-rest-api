import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { diagnoseSheet1Auth, testUserCredentials } from '@/utils/authDiagnostics';
import { inspectSheet1Data } from '@/utils/sheet1Inspector';
import { AlertNotification, TabNotification } from '@/components/TabNotification';
import { 
  Terminal, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Table,
  Database
} from 'lucide-react';

export function AuthDiagnostics() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [sheet1Data, setSheet1Data] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'inspection' | 'testing'>('diagnostics');
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [inspectLoading, setInspectLoading] = useState(false);
  const navigate = useNavigate();

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const result = await diagnoseSheet1Auth();
      setDiagnosticResult(result);
    } catch (error) {
      console.error('Diagnostic error:', error);
      setDiagnosticResult({
        success: false,
        error: 'Failed to run diagnostics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testCredentials = async () => {
    if (!email || !password) {
      setTestResult({
        success: false,
        error: 'Please enter both email and password'
      });
      return;
    }

    setTestLoading(true);
    try {
      const result = await testUserCredentials(email, password);
      setTestResult(result);
    } catch (error) {
      console.error('Credential test error:', error);
      setTestResult({
        success: false,
        error: 'Failed to test credentials',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTestLoading(false);
    }
  };

  const inspectSheet1 = async () => {
    setInspectLoading(true);
    try {
      const result = await inspectSheet1Data();
      setSheet1Data(result);
    } catch (error) {
      console.error('Sheet1 inspection error:', error);
      setSheet1Data({
        success: false,
        error: 'Failed to inspect Sheet1 data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setInspectLoading(false);
    }
  };

  const goBack = () => {
    navigate('/settings');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Authentication Diagnostics</h1>
        <Button onClick={goBack}>Back to Settings</Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={activeTab === 'diagnostics' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('diagnostics')}
        >
          <Terminal className="mr-2 h-4 w-4" />
          Diagnostics
        </Button>
        <Button 
          variant={activeTab === 'inspection' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('inspection')}
        >
          <Eye className="mr-2 h-4 w-4" />
          Sheet1 Inspection
        </Button>
        <Button 
          variant={activeTab === 'testing' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('testing')}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Credential Testing
        </Button>
      </div>

      {/* Diagnostics Tab */}
      {activeTab === 'diagnostics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sheet1 Diagnostic Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Terminal className="mr-2 h-5 w-5" />
                Sheet1 Diagnostic
              </CardTitle>
              <CardDescription>
                Analyze Sheet1 structure and user data for authentication issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runDiagnostics} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Running Diagnostics...' : 'Run Sheet1 Diagnostic'}
              </Button>

              {diagnosticResult && (
                <div className="mt-4">
                  {diagnosticResult.success ? (
                    <div className="space-y-4">
                      <AlertNotification 
                        type="success"
                        title="Diagnostic Successful"
                        message={`Found ${diagnosticResult.totalUsers} users in Sheet1 (${diagnosticResult.validUsers.length} valid, ${diagnosticResult.usersWithIssues.length} with issues)`}
                      />
                      
                      {diagnosticResult.missingHeaders.length > 0 && (
                        <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                          <h4 className="font-medium text-yellow-800 mb-2">Missing Headers:</h4>
                          <p>{diagnosticResult.missingHeaders.join(', ')}</p>
                        </div>
                      )}
                      
                      {diagnosticResult.usersWithIssues.length > 0 && (
                        <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                          <h4 className="font-medium text-yellow-800 mb-2">Users with Issues:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {diagnosticResult.usersWithIssues.map((user: any, index: number) => (
                              <li key={index} className="text-sm">
                                Row {user.row}: {user.email || 'No email'} - {user.issues.join(', ')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <AlertNotification 
                      type="error"
                      title="Diagnostic Failed"
                      message={`${diagnosticResult.error}: ${diagnosticResult.details}`}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Troubleshooting Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Common Issues:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Extra spaces in email or password fields</li>
                    <li>Case sensitivity issues (emails and passwords are case-sensitive)</li>
                    <li>Missing or incorrect role values (must be 'admin', 'manager', or 'cashier')</li>
                    <li>Malformed email addresses</li>
                    <li>Incomplete user records (missing required fields)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Sheet1 Requirements:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>First row must contain headers: ID, Name, Email, Password, Role</li>
                    <li>All fields must be filled for each user</li>
                    <li>Emails must be valid email format</li>
                    <li>Roles must be exactly: 'admin', 'manager', or 'cashier'</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Troubleshooting Steps:</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Run Sheet1 Diagnostic to check data structure</li>
                    <li>Test specific user credentials to identify mismatches</li>
                    <li>Check Sheet1 in Google Sheets for formatting issues</li>
                    <li>Ensure the Google Sheets API is properly configured</li>
                    <li>Verify the service account has access to your spreadsheet</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sheet1 Inspection Tab */}
      {activeTab === 'inspection' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Sheet1 Data Inspection
            </CardTitle>
            <CardDescription>
              View and analyze the raw data in your Sheet1 authentication database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={inspectSheet1} 
              disabled={inspectLoading}
              className="w-full"
            >
              {inspectLoading ? 'Inspecting Sheet1...' : 'Inspect Sheet1 Data'}
            </Button>

            {sheet1Data && (
              <div className="mt-4">
                {sheet1Data.success ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <TabNotification 
                        type="info" 
                        message={`Total rows: ${sheet1Data.analysis.totalRows}`} 
                      />
                      <TabNotification 
                        type="info" 
                        message={`Total columns: ${sheet1Data.analysis.totalColumns}`} 
                      />
                      <TabNotification 
                        type="info" 
                        message={`User accounts: ${sheet1Data.analysis.userCount}`} 
                      />
                      <TabNotification 
                        type={sheet1Data.analysis.hasRequiredHeaders.hasAllRequired ? 'success' : 'error'} 
                        message={`Required headers: ${sheet1Data.analysis.hasRequiredHeaders.hasAllRequired ? 'Present' : 'Missing'}`} 
                      />
                    </div>

                    {sheet1Data.analysis.hasRequiredHeaders.missingHeaders.length > 0 && (
                      <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                        <h4 className="font-medium text-yellow-800 mb-2">Missing Headers:</h4>
                        <p>{sheet1Data.analysis.hasRequiredHeaders.missingHeaders.join(', ')}</p>
                      </div>
                    )}

                    <div className="border rounded-lg p-4 max-h-96 overflow-auto">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Table className="mr-2 h-4 w-4" />
                        Sheet1 Data Preview:
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              {sheet1Data.analysis.headers.map((header: any) => (
                                <th key={header.columnIndex} className="text-left p-2 font-medium bg-gray-50">
                                  {header.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sheet1Data.analysis.dataRows.slice(0, 10).map((row: any, rowIndex: number) => (
                              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : ''}>
                                {sheet1Data.analysis.headers.map((header: any) => (
                                  <td key={header.columnIndex} className="p-2 border-b">
                                    {row.data[header.name] || ''}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {sheet1Data.analysis.dataRows.length > 10 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Showing first 10 rows of {sheet1Data.analysis.dataRows.length} total user records
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <AlertNotification 
                    type="error"
                    title="Inspection Failed"
                    message={`${sheet1Data.error}: ${sheet1Data.details}`}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Credential Testing Tab */}
      {activeTab === 'testing' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Test User Credentials
            </CardTitle>
            <CardDescription>
              Test specific user credentials against Sheet1 data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Email</Label>
              <Input
                id="test-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-password">Password</Label>
              <Input
                id="test-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            
            <Button 
              onClick={testCredentials} 
              disabled={testLoading}
              className="w-full"
            >
              {testLoading ? 'Testing Credentials...' : 'Test Credentials'}
            </Button>

            {testResult && (
              <div className="mt-4">
                {testResult.success ? (
                  <AlertNotification 
                    type="success"
                    title="Credentials Valid"
                    message="User found and credentials match!"
                  />
                ) : (
                  <AlertNotification 
                    type={testResult.userFound ? 'warning' : 'error'}
                    title={testResult.userFound ? 'Password Mismatch' : 'Authentication Failed'}
                    message={`${testResult.error}: ${testResult.details}`}
                  />
                )}
                
                {testResult.userDetails && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Database className="mr-2 h-5 w-5" />
                        User Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Name:</span> {testResult.userDetails.name}</div>
                        <div><span className="font-medium">Email:</span> {testResult.userDetails.email}</div>
                        <div><span className="font-medium">Role:</span> {testResult.userDetails.role}</div>
                        <div><span className="font-medium">Row:</span> {testResult.userDetails.row}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}