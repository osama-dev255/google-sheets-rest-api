import React, { useState, useEffect } from 'react';
import { getSpreadsheetMetadata } from '../services/apiService';
import type { SpreadsheetMetadata } from '../types';
import './Metadata.css';

const Metadata: React.FC = () => {
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

  if (loading) {
    return <div className="metadata-page loading">Loading metadata...</div>;
  }

  if (error) {
    return <div className="metadata-page error">{error}</div>;
  }

  if (!metadata) {
    return <div className="metadata-page no-data">No metadata available</div>;
  }

  return (
    <div className="metadata-page">
      <h2>Spreadsheet Metadata</h2>
      
      <div className="metadata-section">
        <h3>Spreadsheet Properties</h3>
        <div className="properties-grid">
          <div className="property-item">
            <label>Title</label>
            <span>{metadata.title || 'N/A'}</span>
          </div>
        </div>
      </div>
      
      <div className="metadata-section">
        <h3>Sheets Information</h3>
        {metadata.sheets && metadata.sheets.length > 0 ? (
          <div className="sheets-table-container">
            <table className="sheets-table">
              <thead>
                <tr>
                  <th>Sheet Name</th>
                  <th>ID</th>
                  <th>Index</th>
                  <th>Type</th>
                  <th>Rows</th>
                  <th>Columns</th>
                </tr>
              </thead>
              <tbody>
                {metadata.sheets.map((sheet) => (
                  <tr key={sheet.sheetId || Math.random()}>
                    <td>{sheet.title || 'Untitled Sheet'}</td>
                    <td>{sheet.sheetId || 'N/A'}</td>
                    <td>{sheet.index || 'N/A'}</td>
                    <td>{sheet.sheetType || 'N/A'}</td>
                    <td>{sheet.gridProperties?.rowCount || 0}</td>
                    <td>{sheet.gridProperties?.columnCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No sheets information available</p>
        )}
      </div>
    </div>
  );
};

export default Metadata;