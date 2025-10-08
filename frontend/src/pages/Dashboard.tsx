import React, { useState, useEffect } from 'react';
import HealthStatus from '../components/HealthStatus';
import { getSpreadsheetMetadata } from '../services/apiService';
import type { SpreadsheetMetadata } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [metadata, setMetadata] = useState<SpreadsheetMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const response = await getSpreadsheetMetadata();
        // Add a check to ensure we have valid data
        if (response && response.data) {
          setMetadata(response.data);
        } else {
          setError('No metadata received from API');
        }
        setError(null);
      } catch (err: any) {
        setError('Failed to fetch spreadsheet metadata: ' + (err.message || 'Unknown error'));
        console.error('Metadata fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <HealthStatus />
      
      <div className="dashboard-section">
        <h3>Spreadsheet Information</h3>
        
        {loading && <div className="loading">Loading spreadsheet information...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {metadata && !loading && (
          <div className="spreadsheet-info">
            <div className="info-card">
              <h4>Spreadsheet Details</h4>
              <p><strong>Title:</strong> {metadata.title || 'N/A'}</p>
            </div>
            
            <div className="info-card">
              <h4>Sheets ({metadata.sheets?.length || 0})</h4>
              {metadata.sheets && metadata.sheets.length > 0 ? (
                <ul className="sheets-list">
                  {metadata.sheets.map((sheet) => (
                    <li key={sheet.sheetId || Math.random()} className="sheet-item">
                      <span className="sheet-name">{sheet.title || 'Untitled Sheet'}</span>
                      <span className="sheet-details">
                        {sheet.gridProperties?.rowCount || 0} rows × {sheet.gridProperties?.columnCount || 0} columns
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No sheets found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;